/**
 * Authentication Routes
 * Login, register, logout, password reset
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
require('../middleware/auditLogger'); // audit middleware applicato globalmente in server.js
const { trackFailedLogin } = require('../middleware/securityMonitor');
const db = require('../config/database');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../services/emailService');

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Dati di input non validi', 400, errors.array());
  }

  const { email, password } = req.body;
  const ip = req.ip;

  // Find user
  const result = await db.query(
    'SELECT * FROM users WHERE email = $1 AND status != $2',
    [email, 'deleted']
  );

  if (result.rows.length === 0) {
    trackFailedLogin(ip, email);
    throw new AppError('Credenziali non valide', 401);
  }

  const user = result.rows[0];

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    trackFailedLogin(ip, email);
    throw new AppError('Credenziali non valide', 401);
  }

  // Check if user is suspended
  if (user.status === 'suspended') {
    throw new AppError('Account sospeso. Contatta il supporto.', 403);
  }

  // Check if user is verified
  if (!user.verified) {
    throw new AppError('Account non verificato. Controlla la tua email.', 403);
  }

  // Generate JWT token
  const token = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      permissions: user.permissions 
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Update last login
  await db.query(
    'UPDATE users SET last_login = NOW() WHERE id = $1',
    [user.id]
  );

  // Create session
  await db.query(
    'INSERT INTO sessions (user_id, token, expires_at, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)',
    [user.id, token, new Date(Date.now() + 24 * 60 * 60 * 1000), ip, req.get('User-Agent')]
  );

  // Audit log
  req.auditLog = {
    action: 'login',
    resource: 'authentication',
    userId: user.id
  };

  // Remove password from response
  const { password: _, ...userData } = user;

  res.json({
    success: true,
    data: {
      user: userData,
      token
    }
  });
}));

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/),
  body('name').trim().isLength({ min: 2, max: 50 }),
  body('surname').trim().isLength({ min: 2, max: 50 }),
  body('role').isIn(['privato', 'professionista']).optional()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Dati di input non validi', 400, errors.array());
  }

  const { email, password, name, surname, role = 'privato', phone, company, vatNumber } = req.body;

  // Check if email exists
  const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    throw new AppError('Email già registrata', 409);
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Set permissions based on role
  const permissions = role === 'admin' ? ['all'] :
                     role === 'professionista' ? ['b2b_pricing', 'full_catalog', 'priority_support'] :
                     ['public_catalog', 'standard_pricing', 'basic_support'];

  // Insert user
  const result = await db.query(
    `INSERT INTO users (email, password, name, surname, role, phone, company, vat_number, permissions, status, verified)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING id, email, name, surname, role, phone, company, vat_number, permissions, status, verified, created_at`,
    [email, hashedPassword, name, surname, role, phone, company, vatNumber, permissions, 
     role === 'professionista' ? 'pending' : 'active', role === 'privato']
  );

  const user = result.rows[0];

  // Send welcome email
  await sendWelcomeEmail(user);

  // Audit log
  req.auditLog = {
    action: 'register',
    resource: 'authentication',
    userId: user.id
  };

  res.status(201).json({
    success: true,
    data: user
  });
}));

// Logout
router.post('/logout', asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token) {
    // Delete session
    await db.query('DELETE FROM sessions WHERE token = $1', [token]);
  }

  // Audit log
  req.auditLog = {
    action: 'logout',
    resource: 'authentication',
    userId: req.user?.id
  };

  res.json({
    success: true,
    message: 'Logout effettuato con successo'
  });
}));

// Forgot password
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find user
  const result = await db.query('SELECT id, email, name FROM users WHERE email = $1', [email]);
  
  if (result.rows.length === 0) {
    // Don't reveal if email exists
    return res.json({
      success: true,
      message: 'Se l\'email è registrata, riceverai un link per il reset della password'
    });
  }

  const user = result.rows[0];

  // Generate reset token
  const resetToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Store reset token
  await db.query(
    'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
    [resetToken, new Date(Date.now() + 60 * 60 * 1000), user.id]
  );

  // Send reset email
  await sendPasswordResetEmail(user, resetToken);

  // Audit log
  req.auditLog = {
    action: 'forgot_password',
    resource: 'authentication',
    userId: user.id
  };

  res.json({
    success: true,
    message: 'Se l\'email è registrata, riceverai un link per il reset della password'
  });
}));

// Reset password
router.post('/reset-password', [
  body('token').notEmpty(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
], asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  // Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new AppError('Token non valido o scaduto', 400);
  }

  // Find user
  const result = await db.query(
    'SELECT id, reset_token, reset_token_expires FROM users WHERE id = $1',
    [decoded.id]
  );

  if (result.rows.length === 0) {
    throw new AppError('Utente non trovato', 404);
  }

  const user = result.rows[0];

  // Check if token matches and is not expired
  if (user.reset_token !== token || new Date(user.reset_token_expires) < new Date()) {
    throw new AppError('Token non valido o scaduto', 400);
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Update password and clear reset token
  await db.query(
    'UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
    [hashedPassword, user.id]
  );

  // Delete all sessions
  await db.query('DELETE FROM sessions WHERE user_id = $1', [user.id]);

  // Audit log
  req.auditLog = {
    action: 'reset_password',
    resource: 'authentication',
    userId: user.id
  };

  res.json({
    success: true,
    message: 'Password aggiornata con successo'
  });
}));

// Verify email
router.get('/verify-email/:token', asyncHandler(async (req, res) => {
  const { token } = req.params;

  // Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new AppError('Token non valido o scaduto', 400);
  }

  // Update user
  await db.query(
    'UPDATE users SET verified = TRUE, verification_token = NULL WHERE id = $1',
    [decoded.id]
  );

  // Audit log
  req.auditLog = {
    action: 'verify_email',
    resource: 'authentication',
    userId: decoded.id
  };

  res.json({
    success: true,
    message: 'Email verificata con successo'
  });
}));

module.exports = router;
