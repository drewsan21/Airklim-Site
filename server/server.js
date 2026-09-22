/**
 * AIRKLIM Backend Server
 * Node.js/Express con sicurezza enterprise-grade
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const winston = require('winston');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');
const analyticsRoutes = require('./routes/analytics');
const backupRoutes = require('./routes/backups');
const settingsRoutes = require('./routes/settings');
const auditRoutes = require('./routes/audit');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { auditLogger } = require('./middleware/auditLogger');
const { securityMonitor } = require('./middleware/securityMonitor');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ===== SECURITY MIDDLEWARE =====

// 1. Helmet - Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  dnsPrefetchControl: true,
  frameguard: { action: 'deny' },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  ieNoOpen: true,
  noSniff: true,
  permittedCrossDomainPolicies: { permittedPolicies: "none" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true
}));

// 2. CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  credentials: true,
  maxAge: 86400
}));

// 3. Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Troppi richieste, riprova più tardi' },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Troppi tentativi di login, riprova tra 15 minuti' },
  standardHeaders: true,
  legacyHeaders: false
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60,
  message: { error: 'Limite API superato' },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// 4. Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 5. Compression
app.use(compression());

// 6. Logging
app.use(morgan('combined'));

// 7. Data sanitization
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// 8. Security monitoring
app.use(securityMonitor);

// 9. Audit logging
app.use(auditLogger);

// ===== ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/backups', backupRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/audit', auditRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint non trovato'
  });
});

// Error handler
app.use(errorHandler);

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 AIRKLIM Backend Server                               ║
║                                                           ║
║   📡 Server running on port ${PORT}                        ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}                          ║
║   🔒 Security: Enabled                                    ║
║   📊 Monitoring: Active                                   ║
║                                                           ║
║   📚 API Documentation: /api/docs                         ║
║   💚 Health Check: /health                                ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
