/**
 * Route-level unit tests (no database required).
 *
 * Uses supertest against minimal express apps with mocked pg pool,
 * email service and security monitor. Covers auth + CRUD routers that
 * were previously only exercised by the DB-dependent integration suite.
 */

// --- Mocks must be declared before requiring modules under test ---
const mockQuery = jest.fn();

jest.mock('pg', () => {
  class MockPool {
    constructor() {}
    on() {}
    query(...args) { return mockQuery(...args); }
    connect() { return Promise.resolve({ release: () => {} }); }
    end() { return Promise.resolve(); }
  }
  return { Pool: MockPool };
});

jest.mock('../services/emailService', () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../middleware/securityMonitor', () => ({
  trackFailedLogin: jest.fn(),
  securityMonitor: {},
}));

// auditLogger apre un proprio pg.Pool e avvia initAuditTable() al require
// (retry asincroni → handle aperto che impedisce a jest di terminare).
// Non serve nei test di route: lo mockiamo completamente.
jest.mock('../middleware/auditLogger', () => ({
  auditLog: () => (req, res, next) => next(),
  getAuditLogs: jest.fn().mockResolvedValue([]),
  auditLogger: { info: jest.fn(), error: jest.fn() },
}));

const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-only';

const authRoutes = require('../routes/auth');
const { usersRouter, productsRouter } = require('../routes/crud');
const { errorHandler } = require('../middleware/errorHandler');

// Le route impostano req.auditLog come oggetto (pattern del server reale);
// lo neutralizziamo per evitare INSERT asincroni sul pool mock dopo i test.
function makeApp(router, mountPath) {
  const app = express();
  app.use(express.json());
  app.use((req, res, next) => {
    let audit = null;
    Object.defineProperty(req, 'auditLog', {
      get: () => audit,
      set: (v) => { audit = v; },
      configurable: true,
      enumerable: true,
    });
    next();
  });
  app.use(mountPath, router);
  app.use(errorHandler);
  return app;
}

const authApp = makeApp(authRoutes, '/api/auth');
const usersApp = makeApp(usersRouter, '/api/users');
const productsApp = makeApp(productsRouter, '/api/products');

const hash = (p) => bcrypt.hashSync(p, 10);
const tokenFor = (user) => jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });

beforeEach(() => {
  mockQuery.mockReset();
});

// ===================== AUTH =====================
describe('POST /api/auth/login', () => {
  const baseUser = {
    id: 7, email: 'mario@example.com', name: 'Mario', surname: 'Rossi',
    role: 'privato', permissions: ['public_catalog'], status: 'active', verified: true,
  };

  it('rejects invalid input with 400', async () => {
    const res = await request(authApp).post('/api/auth/login').send({ email: 'not-an-email', password: '' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 401 when user not found', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 });
    const res = await request(authApp).post('/api/auth/login').send({ email: 'x@example.com', password: 'Passw0rd!' });
    expect(res.status).toBe(401);
  });

  it('returns 401 on wrong password and tracks failed login', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ ...baseUser, password: hash('Secret123!') }] });
    const { trackFailedLogin } = require('../middleware/securityMonitor');
    const res = await request(authApp).post('/api/auth/login').send({ email: baseUser.email, password: 'WrongPass1!' });
    expect(res.status).toBe(401);
    expect(trackFailedLogin).toHaveBeenCalled();
  });

  it('returns 403 for suspended account', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ ...baseUser, status: 'suspended', password: hash('Passw0rd!') }] });
    const res = await request(authApp).post('/api/auth/login').send({ email: baseUser.email, password: 'Passw0rd!' });
    expect(res.status).toBe(403);
  });

  it('returns 403 for unverified account', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ ...baseUser, verified: false, password: hash('Passw0rd!') }] });
    const res = await request(authApp).post('/api/auth/login').send({ email: baseUser.email, password: 'Passw0rd!' });
    expect(res.status).toBe(403);
  });

  it('succeeds and returns a JWT without leaking the password', async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [{ ...baseUser, password: hash('Passw0rd!') }] }) // SELECT user
      .mockResolvedValueOnce({ rows: [] }) // UPDATE last_login
      .mockResolvedValueOnce({ rows: [] }); // INSERT session
    const res = await request(authApp).post('/api/auth/login').send({ email: baseUser.email, password: 'Passw0rd!' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.password).toBeUndefined();
    const decoded = jwt.verify(res.body.data.token, process.env.JWT_SECRET);
    expect(decoded.id).toBe(baseUser.id);
    expect(decoded.role).toBe('privato');
  });
});

describe('POST /api/auth/register', () => {
  it('rejects weak password with 400', async () => {
    const res = await request(authApp).post('/api/auth/register').send({
      email: 'a@b.it', password: 'weak', name: 'Anna', surname: 'Bianchi',
    });
    expect(res.status).toBe(400);
  });

  it('returns 409 when email already registered', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    const res = await request(authApp).post('/api/auth/register').send({
      email: 'dup@example.com', password: 'Strong123!', name: 'Anna', surname: 'Bianchi', role: 'privato',
    });
    expect(res.status).toBe(409);
  });

  it('creates a privato account (active+verified) and sends welcome email', async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [] }) // email exists? -> no
      .mockResolvedValueOnce({ rows: [{ id: 42, email: 'anna@example.com', name: 'Anna', surname: 'Bianchi', role: 'privato', status: 'active', verified: true, permissions: ['public_catalog', 'standard_pricing', 'basic_support'] }] }); // INSERT RETURNING
    const { sendWelcomeEmail } = require('../services/emailService');
    const res = await request(authApp).post('/api/auth/register').send({
      email: 'anna@example.com', password: 'Strong123!', name: 'Anna', surname: 'Bianchi', role: 'privato',
    });
    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe(42);
    expect(sendWelcomeEmail).toHaveBeenCalled();
  });

  it('creates a professionista account as pending/unverified', async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: 43, email: 'pro@example.com', role: 'professionista', status: 'pending', verified: false, permissions: ['b2b_pricing', 'full_catalog', 'priority_support'] }] });
    const res = await request(authApp).post('/api/auth/register').send({
      email: 'pro@example.com', password: 'Strong123!', name: 'Luca', surname: 'Verdi', role: 'professionista', company: 'Verdi SRL',
    });
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('pending');
  });
});

describe('POST /api/auth/logout', () => {
  it('deletes the session row for the bearer token', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    const res = await request(authApp)
      .post('/api/auth/logout')
      .set('Authorization', 'Bearer abc123')
      .send();
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const [sql, params] = mockQuery.mock.calls[0];
    expect(sql).toMatch(/DELETE FROM sessions WHERE token/);
    expect(params).toEqual(['abc123']);
  });

  it('succeeds even without a token', async () => {
    const res = await request(authApp).post('/api/auth/logout').send();
    expect(res.status).toBe(200);
    expect(mockQuery).not.toHaveBeenCalled();
  });
});

describe('POST /api/auth/forgot-password', () => {
  it('does not reveal whether the email exists', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    const res = await request(authApp).post('/api/auth/forgot-password').send({ email: 'ghost@example.com' });
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Se l'email è registrata/);
  });

  it('stores a reset token and emails it for known users', async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [{ id: 9, email: 'mario@example.com', name: 'Mario' }] })
      .mockResolvedValueOnce({ rows: [] }); // UPDATE reset_token
    const { sendPasswordResetEmail } = require('../services/emailService');
    const res = await request(authApp).post('/api/auth/forgot-password').send({ email: 'mario@example.com' });
    expect(res.status).toBe(200);
    expect(sendPasswordResetEmail).toHaveBeenCalled();
    const updateCall = mockQuery.mock.calls[1][0];
    expect(updateCall).toMatch(/reset_token/);
  });
});

describe('POST /api/auth/reset-password', () => {
  it('rejects an invalid token with 400', async () => {
    const res = await request(authApp).post('/api/auth/reset-password').send({ token: 'garbage', password: 'Strong123!' });
    expect(res.status).toBe(400);
  });

  it('rejects an expired/mismatched stored token with 400', async () => {
    const token = jwt.sign({ id: 5, email: 'm@e.it' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 5, reset_token: 'other-token', reset_token_expires: new Date(Date.now() + 3600e3) }] });
    const res = await request(authApp).post('/api/auth/reset-password').send({ token, password: 'Strong123!' });
    expect(res.status).toBe(400);
  });

  it('updates the password and kills all sessions on success', async () => {
    const token = jwt.sign({ id: 5, email: 'm@e.it' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    mockQuery
      .mockResolvedValueOnce({ rows: [{ id: 5, reset_token: token, reset_token_expires: new Date(Date.now() + 3600e3) }] })
      .mockResolvedValueOnce({ rows: [] }) // UPDATE password
      .mockResolvedValueOnce({ rows: [] }); // DELETE sessions
    const res = await request(authApp).post('/api/auth/reset-password').send({ token, password: 'Strong123!' });
    expect(res.status).toBe(200);
    expect(mockQuery.mock.calls[2][0]).toMatch(/DELETE FROM sessions WHERE user_id/);
  });
});

describe('GET /api/auth/verify-email/:token', () => {
  it('rejects bad tokens with 400', async () => {
    const res = await request(authApp).get('/api/auth/verify-email/not-a-jwt');
    expect(res.status).toBe(400);
  });

  it('marks the user verified on a valid token', async () => {
    const token = jwt.sign({ id: 11 }, process.env.JWT_SECRET, { expiresIn: '1h' });
    mockQuery.mockResolvedValueOnce({ rows: [] });
    const res = await request(authApp).get(`/api/auth/verify-email/${token}`);
    expect(res.status).toBe(200);
    expect(mockQuery.mock.calls[0][0]).toMatch(/SET verified = TRUE/);
  });
});

// ===================== CRUD: USERS =====================
describe('Users CRUD (auth + admin enforcement)', () => {
  const userToken = tokenFor({ id: 1, role: 'privato' });
  const adminToken = tokenFor({ id: 2, role: 'admin' });

  it('GET / requires authentication (401)', async () => {
    const res = await request(usersApp).get('/api/users');
    expect(res.status).toBe(401);
  });

  it('GET / rejects an invalid token (401)', async () => {
    const res = await request(usersApp).get('/api/users').set('Authorization', 'Bearer nope');
    expect(res.status).toBe(401);
  });

  it('GET / lists users for an authenticated non-admin', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, email: 'a@a.it' }], rowCount: 1 });
    const res = await request(usersApp).get('/api/users').set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.pagination.total).toBe(1);
  });

  it('GET /:id returns 404 when missing', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    const res = await request(usersApp).get('/api/users/999').set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(404);
  });

  it('PUT /:id with empty body is 400', async () => {
    const res = await request(usersApp).put('/api/users/1').set('Authorization', `Bearer ${userToken}`).send({});
    expect(res.status).toBe(400);
  });

  it('PUT /:id updates allowed fields only', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, name: 'Nuovo', email: 'a@a.it' }] });
    await request(usersApp).put('/api/users/1').set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Nuovo', password: 'HACKED', created_at: 'evil' });
    const [sql] = mockQuery.mock.calls[0];
    expect(sql).toMatch(/name = \$1/);
    expect(sql).not.toMatch(/password/);
    expect(sql).not.toMatch(/created_at/);
  });

  it('DELETE /:id is admin-only (403 for normal users)', async () => {
    const res = await request(usersApp).delete('/api/users/5').set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });

  it('DELETE /:id soft-deletes for admins', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 5 }] });
    const res = await request(usersApp).delete('/api/users/5').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(mockQuery.mock.calls[0][0]).toMatch(/SET status = 'deleted'/);
  });
});

// ===================== CRUD: PRODUCTS =====================
describe('Products CRUD', () => {
  const adminToken = tokenFor({ id: 2, role: 'admin' });

  it('GET / is public and passes filters as parameters', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, name: 'Pompa di calore X' }], rowCount: 1 });
    const res = await request(productsApp).get('/api/products?brand=Mitsubishi&search=pompa');
    expect(res.status).toBe(200);
    const [sql, params] = mockQuery.mock.calls[0];
    expect(sql).toMatch(/brand = \$1/);
    expect(sql).toMatch(/ILIKE \$2/);
    expect(params).toEqual(['Mitsubishi', '%pompa%']);
  });

  it('GET /:id 404 for unknown product', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    const res = await request(productsApp).get('/api/products/12345');
    expect(res.status).toBe(404);
  });

  it('POST / requires admin (401 anonymous, 403 non-admin)', async () => {
    const anon = await request(productsApp).post('/api/products').send({ name: 'P' });
    expect(anon.status).toBe(401);
    const userTok = tokenFor({ id: 1, role: 'privato' });
    const forbidden = await request(productsApp).post('/api/products').set('Authorization', `Bearer ${userTok}`).send({ name: 'P' });
    expect(forbidden.status).toBe(403);
  });

  it('DELETE /:id works for admin', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 3 }] });
    const res = await request(productsApp).delete('/api/products/3').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });
});
