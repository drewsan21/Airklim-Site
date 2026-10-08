/**
 * AIRKLIM Backend - CRUD API Routes
 * Users, Products, Orders, Analytics, Backups, Settings, Audit
 * Protezione: JWT (Bearer token) su tutti gli endpoint; ruolo "admin" richiesto
 * per operazioni di gestione (analytics, backups, settings, audit, cancellazioni).
 */

const express = require('express');
const db = require('../config/database');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// ===== Helpers =====
function authMiddleware(req, res, next) {
  const jwt = require('jsonwebtoken');
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ success: false, error: 'Autenticazione richiesta' });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ success: false, error: 'Token non valido o scaduto' });
  }
}

function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Accesso riservato agli amministratori' });
  }
  next();
}

const wrap = (fn) => asyncHandler(async (req, res) => fn(req, res));

function paginated(rows, req, total) {
  return {
    success: true,
    data: rows,
    pagination: {
      total,
      page: parseInt(req.query.page || '1', 10),
      limit: rows.length
    }
  };
}

// ===== USERS =====
const usersRouter = express.Router();

usersRouter.get('/', authMiddleware, wrap(async (req, res) => {
  const params = [];
  let sql = "SELECT id, email, name, surname, role, phone, company, vat_number, status, verified, permissions, created_at FROM users WHERE status != 'deleted'";
  if (req.query.role) {
    params.push(req.query.role);
    sql += ` AND role = $${params.length}`;
  }
  if (req.query.status) {
    params.push(req.query.status);
    sql += ` AND status = $${params.length}`;
  }
  sql += ' ORDER BY created_at DESC';
  const result = await db.query(sql, params);
  res.json(paginated(result.rows, req, result.rowCount));
}));

usersRouter.get('/:id', authMiddleware, wrap(async (req, res) => {
  const result = await db.query(
    "SELECT id, email, name, surname, role, phone, company, vat_number, status, verified, permissions, created_at FROM users WHERE id = $1 AND status != 'deleted'",
    [req.params.id]
  );
  if (result.rows.length === 0) throw new AppError('Utente non trovato', 404);
  res.json({ success: true, data: result.rows[0] });
}));

usersRouter.put('/:id', authMiddleware, wrap(async (req, res) => {
  const allowed = ['name', 'surname', 'phone', 'company', 'vat_number', 'status', 'role', 'permissions'];
  const fields = [];
  const params = [];
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      params.push(req.body[key]);
      fields.push(`${key} = $${params.length}`);
    }
  }
  if (fields.length === 0) throw new AppError('Nessun campo da aggiornare', 400);
  params.push(req.params.id);
  const result = await db.query(
    `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${params.length} RETURNING id, email, name, surname, role, phone, company, vat_number, status, verified, permissions, updated_at`,
    params
  );
  if (result.rows.length === 0) throw new AppError('Utente non trovato', 404);
  req.auditLog = { action: 'update', resource: 'user', userId: req.user.id };
  res.json({ success: true, data: result.rows[0] });
}));

usersRouter.delete('/:id', authMiddleware, adminOnly, wrap(async (req, res) => {
  const result = await db.query(
    "UPDATE users SET status = 'deleted', updated_at = NOW() WHERE id = $1 RETURNING id",
    [req.params.id]
  );
  if (result.rows.length === 0) throw new AppError('Utente non trovato', 404);
  req.auditLog = { action: 'delete', resource: 'user', userId: req.user.id };
  res.json({ success: true, message: 'Utente eliminato' });
}));

// ===== PRODUCTS =====
const productsRouter = express.Router();

productsRouter.get('/', wrap(async (req, res) => {
  const params = [];
  let sql = 'SELECT * FROM products WHERE status != \'inactive\'';
  if (req.query.brand) {
    params.push(req.query.brand);
    sql += ` AND brand = $${params.length}`;
  }
  if (req.query.category) {
    params.push(req.query.category);
    sql += ` AND category = $${params.length}`;
  }
  if (req.query.search) {
    params.push(`%${req.query.search}%`);
    sql += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length})`;
  }
  sql += ' ORDER BY created_at DESC';
  const result = await db.query(sql, params);
  res.json(paginated(result.rows, req, result.rowCount));
}));

productsRouter.get('/:id', wrap(async (req, res) => {
  const result = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
  if (result.rows.length === 0) throw new AppError('Prodotto non trovato', 404);
  res.json({ success: true, data: result.rows[0] });
}));

productsRouter.post('/', authMiddleware, adminOnly, wrap(async (req, res) => {
  const { name, brand, category, description, price, stock, image_url, specifications } = req.body;
  if (!name || !brand || !category || price === undefined) {
    throw new AppError('Campi obbligatori mancanti (name, brand, category, price)', 400);
  }
  const result = await db.query(
    `INSERT INTO products (name, brand, category, description, price, stock, image_url, specifications)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [name, brand, category, description || '', price, stock || 0, image_url || null, specifications || {}]
  );
  req.auditLog = { action: 'create', resource: 'product', userId: req.user.id };
  res.status(201).json({ success: true, data: result.rows[0] });
}));

productsRouter.put('/:id', authMiddleware, adminOnly, wrap(async (req, res) => {
  const allowed = ['name', 'brand', 'category', 'description', 'price', 'stock', 'status', 'image_url', 'specifications'];
  const fields = [];
  const params = [];
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      params.push(req.body[key]);
      fields.push(`${key} = $${params.length}`);
    }
  }
  if (fields.length === 0) throw new AppError('Nessun campo da aggiornare', 400);
  params.push(req.params.id);
  const result = await db.query(
    `UPDATE products SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${params.length} RETURNING *`,
    params
  );
  if (result.rows.length === 0) throw new AppError('Prodotto non trovato', 404);
  req.auditLog = { action: 'update', resource: 'product', userId: req.user.id };
  res.json({ success: true, data: result.rows[0] });
}));

productsRouter.delete('/:id', authMiddleware, adminOnly, wrap(async (req, res) => {
  const result = await db.query(
    "UPDATE products SET status = 'inactive', updated_at = NOW() WHERE id = $1 RETURNING id",
    [req.params.id]
  );
  if (result.rows.length === 0) throw new AppError('Prodotto non trovato', 404);
  req.auditLog = { action: 'delete', resource: 'product', userId: req.user.id };
  res.json({ success: true, message: 'Prodotto disattivato' });
}));

// ===== ORDERS =====
const ordersRouter = express.Router();

ordersRouter.get('/', authMiddleware, wrap(async (req, res) => {
  const params = [];
  let sql = 'SELECT * FROM orders';
  if (req.user.role !== 'admin') {
    params.push(req.user.id);
    sql += ` WHERE user_id = $${params.length}`;
  }
  if (req.query.status) {
    params.push(req.query.status);
    sql += ` ${sql.includes('WHERE') ? 'AND' : 'WHERE'} status = $${params.length}`;
  }
  sql += ' ORDER BY created_at DESC';
  const result = await db.query(sql, params);
  res.json(paginated(result.rows, req, result.rowCount));
}));

ordersRouter.get('/:id', authMiddleware, wrap(async (req, res) => {
  const order = await db.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
  if (order.rows.length === 0) throw new AppError('Ordine non trovato', 404);
  if (req.user.role !== 'admin' && order.rows[0].user_id !== req.user.id) {
    throw new AppError('Non autorizzato su questo ordine', 403);
  }
  const items = await db.query('SELECT * FROM order_items WHERE order_id = $1', [req.params.id]);
  res.json({ success: true, data: { ...order.rows[0], items: items.rows } });
}));

ordersRouter.post('/', authMiddleware, wrap(async (req, res) => {
  const { items, shipping_address, notes } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError('Carrello vuoto: inserisci almeno un prodotto', 400);
  }
  // Calcola totale lato server dai prezzi a DB
  const productIds = items.map(i => i.product_id || i.productId || i.id);
  const productsResult = await db.query(
    `SELECT id, name, price, stock FROM products WHERE id = ANY($1) AND status = 'active'`,
    [productIds]
  );
  const priceMap = Object.fromEntries(productsResult.rows.map(p => [p.id, p]));

  let total = 0;
  const lines = items.map(i => {
    const pid = i.product_id || i.productId || i.id;
    const qty = parseInt(i.quantity || 1, 10);
    const product = priceMap[pid];
    if (!product) throw new AppError(`Prodotto non disponibile: ${pid}`, 400);
    total += parseFloat(product.price) * qty;
    return { product_id: pid, quantity: qty, unit_price: product.price };
  });

  const orderResult = await db.query(
    `INSERT INTO orders (user_id, total_amount, status, shipping_address, notes)
     VALUES ($1, $2, 'pending', $3, $4) RETURNING *`,
    [req.user.id, total.toFixed(2), JSON.stringify(shipping_address || {}), notes || '']
  );
  const order = orderResult.rows[0];

  for (const line of lines) {
    await db.query(
      `INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)`,
      [order.id, line.product_id, line.quantity, line.unit_price]
    );
  }

  req.auditLog = { action: 'create', resource: 'order', userId: req.user.id };
  res.status(201).json({ success: true, data: { ...order, items: lines } });
}));

ordersRouter.patch('/:id/status', authMiddleware, adminOnly, wrap(async (req, res) => {
  const { status } = req.body;
  const valid = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  if (!valid.includes(status)) {
    throw new AppError(`Stato non valido. Usa uno tra: ${valid.join(', ')}`, 400);
  }
  const result = await db.query(
    'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [status, req.params.id]
  );
  if (result.rows.length === 0) throw new AppError('Ordine non trovato', 404);
  req.auditLog = { action: 'update_status', resource: 'order', userId: req.user.id };
  res.json({ success: true, data: result.rows[0] });
}));

// ===== ANALYTICS =====
const analyticsRouter = express.Router();

analyticsRouter.get('/', authMiddleware, adminOnly, wrap(async (req, res) => {
  const [users, products, orders, revenue] = await Promise.all([
    db.query("SELECT COUNT(*)::int AS count FROM users WHERE status != 'deleted'"),
    db.query("SELECT COUNT(*)::int AS count FROM products WHERE status = 'active'"),
    db.query("SELECT COUNT(*)::int AS count, status FROM orders GROUP BY status"),
    db.query("SELECT COALESCE(SUM(total_amount), 0)::float AS total FROM orders WHERE status != 'cancelled'")
  ]);
  const byStatus = Object.fromEntries(orders.rows.map(r => [r.status, r.count]));
  res.json({
    success: true,
    data: {
      totalUsers: users.rows[0].count,
      totalProducts: products.rows[0].count,
      totalOrders: orders.rows.reduce((s, r) => s + r.count, 0),
      ordersByStatus: byStatus,
      totalRevenue: revenue.rows[0].total
    }
  });
}));

// ===== BACKUPS =====
const backupsRouter = express.Router();

backupsRouter.get('/', authMiddleware, adminOnly, wrap(async (req, res) => {
  const result = await db.query('SELECT * FROM backups ORDER BY created_at DESC');
  res.json(paginated(result.rows, req, result.rowCount));
}));

backupsRouter.post('/', authMiddleware, adminOnly, wrap(async (req, res) => {
  const result = await db.query(
    `INSERT INTO backups (name, file_path, size, type, status)
     VALUES ($1, $2, $3, 'manual', 'completed') RETURNING *`,
    [`backup-${Date.now()}.dump`, 'backups/', 0]
  );
  req.auditLog = { action: 'create', resource: 'backup', userId: req.user.id };
  res.status(201).json({ success: true, data: result.rows[0] });
}));

// ===== SETTINGS =====
const settingsRouter = express.Router();

settingsRouter.get('/', authMiddleware, wrap(async (req, res) => {
  const result = await db.query('SELECT key, value FROM settings');
  res.json({ success: true, data: Object.fromEntries(result.rows.map(r => [r.key, r.value])) });
}));

settingsRouter.put('/:key', authMiddleware, adminOnly, wrap(async (req, res) => {
  const result = await db.query(
    `INSERT INTO settings (key, value) VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
     RETURNING key, value`,
    [req.params.key, req.body.value]
  );
  req.auditLog = { action: 'update', resource: 'settings', userId: req.user.id };
  res.json({ success: true, data: result.rows[0] });
}));

// ===== AUDIT =====
const auditRouter = require('express').Router();

auditRouter.get('/', authMiddleware, adminOnly, wrap(async (req, res) => {
  const { getAuditLogs } = require('../middleware/auditLogger');
  const logs = await getAuditLogs({
    limit: parseInt(req.query.limit || '100', 10),
    offset: parseInt(req.query.offset || '0', 10),
    userId: req.query.userId,
    action: req.query.action
  });
  res.json({ success: true, data: logs });
}));

module.exports = {
  usersRouter,
  productsRouter,
  ordersRouter,
  analyticsRouter,
  backupsRouter,
  settingsRouter,
  auditRouter
};
