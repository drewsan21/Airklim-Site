/**
 * Suite di copertura aggiuntiva (no database richiesto).
 *
 * Integra routes.unit.test.js coprendo i rami CRUD rimasti scoperti
 * (orders, analytics, backups, settings, audit) e il router analyze
 * (upload/status/start/stop/results) con scannerService mockato.
 */

const path = require('path');
const fs = require('fs');
const os = require('os');

// --- Mocks (dichiarati prima dei moduli sotto test) ---
const mockQuery = jest.fn();

jest.mock('pg', () => {
  class MockPool {
    constructor() {}
    on() {}
    query(...args) { return mockQuery(...args); }
    connect() { return Promise.resolve({ release: () => {}, query: () => Promise.resolve({ rows: [] }) }); }
    end() { return Promise.resolve(); }
  }
  return { Pool: MockPool };
});

jest.mock('../middleware/auditLogger', () => ({
  auditLog: () => (req, res, next) => next(),
  getAuditLogs: jest.fn().mockResolvedValue([{ id: 'log-1', action: 'login' }]),
  auditLogger: { info: jest.fn(), error: jest.fn() },
}));

const mockScanner = {
  getStatus: jest.fn(() => ({ isRunning: false, progress: 0 })),
  startScan: jest.fn(() => Promise.resolve()),
  stopScan: jest.fn(),
  getResults: jest.fn(() => null),
};
jest.mock('../services/scannerService', () => mockScanner);

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-only';

const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');

const {
  ordersRouter,
  analyticsRouter,
  backupsRouter,
  settingsRouter,
  auditRouter,
} = require('../routes/crud');
const analyzeRouter = require('../routes/analyze');
const { errorHandler } = require('../middleware/errorHandler');

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

const tokenFor = (user) => jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
const userTok = tokenFor({ id: 'u-1', role: 'privato' });
const adminTok = tokenFor({ id: 'u-9', role: 'admin' });

beforeEach(() => {
  mockQuery.mockReset();
  mockScanner.getStatus.mockReturnValue({ isRunning: false, progress: 0 });
  mockScanner.getStatus.mockClear();
  mockScanner.startScan.mockResolvedValue(undefined);
  mockScanner.startScan.mockClear();
  mockScanner.stopScan.mockClear();
  mockScanner.getResults.mockReturnValue(null);
  mockScanner.getResults.mockClear();
});

// ===================== ORDERS =====================
describe('Orders CRUD', () => {
  const app = makeApp(ordersRouter, '/api/orders');

  it('GET / lista solo gli ordini dell’utente non-admin (filtro user_id)', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'o-1', user_id: 'u-1' }], rowCount: 1 });
    const res = await request(app).get('/api/orders').set('Authorization', `Bearer ${userTok}`);
    expect(res.status).toBe(200);
    const [sql, params] = mockQuery.mock.calls[0];
    expect(sql).toContain('WHERE user_id = $1');
    expect(params).toEqual(['u-1']);
  });

  it('GET / admin senza filtro: WHERE AND combinato per status', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 });
    const res = await request(app).get('/api/orders?status=pending').set('Authorization', `Bearer ${adminTok}`);
    expect(res.status).toBe(200);
    const [sql, params] = mockQuery.mock.calls[0];
    expect(sql).toContain('WHERE status = $1');
    expect(params).toEqual(['pending']);
  });

  it('GET / admin con filtro status aggiunge AND dopo la clausola utente', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 });
    // utente non-admin + status → WHERE user_id AND status
    const res = await request(app).get('/api/orders?status=shipped').set('Authorization', `Bearer ${userTok}`);
    expect(res.status).toBe(200);
    const [sql] = mockQuery.mock.calls[0];
    expect(sql).toContain('WHERE user_id = $1 AND status = $2');
  });

  it('GET /:id 404 quando l’ordine non esiste', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).get('/api/orders/o-x').set('Authorization', `Bearer ${userTok}`);
    expect(res.status).toBe(404);
  });

  it('GET /:id 403 se l’ordine appartiene a un altro utente', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'o-1', user_id: 'someone-else' }] });
    const res = await request(app).get('/api/orders/o-1').set('Authorization', `Bearer ${userTok}`);
    expect(res.status).toBe(403);
  });

  it('GET /:id restituisce ordine + items per il proprietario', async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [{ id: 'o-1', user_id: 'u-1', total_amount: 50 }] })
      .mockResolvedValueOnce({ rows: [{ product_id: 'p-1', quantity: 2 }] });
    const res = await request(app).get('/api/orders/o-1').set('Authorization', `Bearer ${userTok}`);
    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(1);
  });

  it('POST / 400 con carrello vuoto', async () => {
    const res = await request(app).post('/api/orders').set('Authorization', `Bearer ${userTok}`).send({ items: [] });
    expect(res.status).toBe(400);
  });

  it('POST / 400 se un prodotto non è disponibile/attivo', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] }); // products lookup vuoto
    const res = await request(app).post('/api/orders').set('Authorization', `Bearer ${userTok}`)
      .send({ items: [{ product_id: 'p-missing', quantity: 1 }] });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Prodotto non disponibile');
  });

  it('POST / calcola il totale lato server e inserisce ordine + righe', async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [
        { id: 'p-1', name: 'Split', price: '100.50', stock: 5 },
        { id: 'p-2', name: 'Portable', price: '200.00', stock: 3 },
      ] }) // products
      .mockResolvedValueOnce({ rows: [{ id: 'o-new', user_id: 'u-1', total_amount: 401.5, status: 'pending' }] }) // INSERT order
      .mockResolvedValue({ rows: [], rowCount: 1 }); // INSERT items
    const res = await request(app).post('/api/orders').set('Authorization', `Bearer ${userTok}`)
      .send({ items: [{ product_id: 'p-1', quantity: 1 }, { productId: 'p-2', quantity: 2 }], shipping_address: { city: 'MI' }, notes: 'ciao' });
    expect(res.status).toBe(201);
    // INSERT orders params: user_id, total, address, notes
    const insertCall = mockQuery.mock.calls.find(([sql]) => sql.includes('INSERT INTO orders'));
    expect(insertCall[1][1]).toBe('500.50'); // 100.50*1 + 200.00*2
    expect(JSON.parse(insertCall[1][2])).toEqual({ city: 'MI' });
    expect(res.body.data.items).toHaveLength(2);
  });

  it('PATCH /:id/status 400 su stato non valido', async () => {
    const res = await request(app).patch('/api/orders/o-1/status').set('Authorization', `Bearer ${adminTok}`).send({ status: 'teleported' });
    expect(res.status).toBe(400);
  });

  it('PATCH /:id/status 404 se ordine inesistente', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).patch('/api/orders/o-x/status').set('Authorization', `Bearer ${adminTok}`).send({ status: 'confirmed' });
    expect(res.status).toBe(404);
  });

  it('PATCH /:id/status aggiornato dall’admin', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'o-1', status: 'confirmed' }] });
    const res = await request(app).patch('/api/orders/o-1/status').set('Authorization', `Bearer ${adminTok}`).send({ status: 'confirmed' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('confirmed');
  });

  it('PATCH richiede auth (401 senza token)', async () => {
    const res = await request(app).patch('/api/orders/o-1/status').send({ status: 'confirmed' });
    expect(res.status).toBe(401);
  });
});

// ===================== ANALYTICS =====================
describe('Analytics', () => {
  const app = makeApp(analyticsRouter, '/api/analytics');

  it('403 per utenti non-admin', async () => {
    const res = await request(app).get('/api/analytics').set('Authorization', `Bearer ${userTok}`);
    expect(res.status).toBe(403);
  });

  it('aggrega conteggi e revenue per l’admin', async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [{ count: 12 }] }) // users
      .mockResolvedValueOnce({ rows: [{ count: 40 }] }) // products
      .mockResolvedValueOnce({ rows: [{ count: 3, status: 'pending' }, { count: 7, status: 'delivered' }] }) // orders by status
      .mockResolvedValueOnce({ rows: [{ total: 1234.56 }] }); // revenue
    const res = await request(app).get('/api/analytics').set('Authorization', `Bearer ${adminTok}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({
      totalUsers: 12,
      totalProducts: 40,
      totalOrders: 10,
      ordersByStatus: { pending: 3, delivered: 7 },
      totalRevenue: 1234.56,
    });
  });
});

// ===================== BACKUPS =====================
describe('Backups', () => {
  const app = makeApp(backupsRouter, '/api/backups');

  it('GET restituisce la lista paginata (admin)', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'b-1', name: 'backup-1.dump' }], rowCount: 1 });
    const res = await request(app).get('/api/backups').set('Authorization', `Bearer ${adminTok}`);
    expect(res.status).toBe(200);
    expect(res.body.pagination.total).toBe(1);
  });

  it('POST crea una riga di backup manuale', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'b-2', type: 'manual', status: 'completed' }] });
    const res = await request(app).post('/api/backups').set('Authorization', `Bearer ${adminTok}`);
    expect(res.status).toBe(201);
    expect(res.body.data.type).toBe('manual');
  });

  it('vieta l’accesso non-admin', async () => {
    const res = await request(app).post('/api/backups').set('Authorization', `Bearer ${userTok}`);
    expect(res.status).toBe(403);
  });
});

// ===================== SETTINGS =====================
describe('Settings', () => {
  const app = makeApp(settingsRouter, '/api/settings');

  it('GET riduce le righe key/value a un oggetto', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ key: 'site_name', value: 'AIRKLIM' }, { key: 'vat_rate', value: 22 }] });
    const res = await request(app).get('/api/settings').set('Authorization', `Bearer ${userTok}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({ site_name: 'AIRKLIM', vat_rate: 22 });
  });

  it('PUT/:key fa upsert (admin)', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ key: 'theme', value: 'dark' }] });
    const res = await request(app).put('/api/settings/theme').set('Authorization', `Bearer ${adminTok}`).send({ value: 'dark' });
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({ key: 'theme', value: 'dark' });
    const [sql] = mockQuery.mock.calls[0];
    expect(sql).toContain('ON CONFLICT (key)');
  });

  it('PUT riserato agli admin', async () => {
    const res = await request(app).put('/api/settings/theme').set('Authorization', `Bearer ${userTok}`).send({ value: 'x' });
    expect(res.status).toBe(403);
  });
});

// ===================== AUDIT =====================
describe('Audit log endpoint', () => {
  const app = makeApp(auditRouter, '/api/audit');

  it('restituisce i log tramite getAuditLogs mockato', async () => {
    const res = await request(app).get('/api/audit?limit=10&offset=5&action=login&userId=u-1')
      .set('Authorization', `Bearer ${adminTok}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    const { getAuditLogs } = require('../middleware/auditLogger');
    expect(getAuditLogs).toHaveBeenCalledWith({ limit: 10, offset: 5, userId: 'u-1', action: 'login' });
  });

  it('403 per non-admin', async () => {
    const res = await request(app).get('/api/audit').set('Authorization', `Bearer ${userTok}`);
    expect(res.status).toBe(403);
  });
});

// ===================== USERS extra branches =====================
describe('Users update/delete edge cases', () => {
  const { usersRouter } = require('../routes/crud');
  const app = makeApp(usersRouter, '/api/users');

  it('PUT 400 se nessun campo aggiornabile', async () => {
    const res = await request(app).put('/api/users/u-1').set('Authorization', `Bearer ${adminTok}`).send({ unknown_field: 1 });
    expect(res.status).toBe(400);
  });

  it('PUT costruisce SET dinamico dai campi allowed', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'u-1', name: 'Luca', status: 'active' }] });
    const res = await request(app).put('/api/users/u-1').set('Authorization', `Bearer ${adminTok}`).send({ name: 'Luca', status: 'active' });
    expect(res.status).toBe(200);
    const [sql] = mockQuery.mock.calls[0];
    expect(sql).toContain('name = $1');
    expect(sql).toContain('status = $2');
  });

  it('DELETE soft-delete per admin', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'u-1' }] });
    const res = await request(app).delete('/api/users/u-1').set('Authorization', `Bearer ${adminTok}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('eliminato');
  });

  it('DELETE 404 se utente inesistente', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).delete('/api/users/nope').set('Authorization', `Bearer ${adminTok}`);
    expect(res.status).toBe(404);
  });
});

// ===================== PRODUCTS extra branches =====================
describe('Products create/update/delete edge cases', () => {
  const { productsRouter } = require('../routes/crud');
  const app = makeApp(productsRouter, '/api/products');

  it('POST 400 se mancano campi obbligatori', async () => {
    const res = await request(app).post('/api/products').set('Authorization', `Bearer ${adminTok}`).send({ name: 'X' });
    expect(res.status).toBe(400);
  });

  it('POST crea il prodotto (admin)', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'p-1', name: 'Split System', brand: 'AirKlim', category: 'split', price: 999 }] });
    const res = await request(app).post('/api/products').set('Authorization', `Bearer ${adminTok}`)
      .send({ name: 'Split System', brand: 'AirKlim', category: 'split', price: 999, stock: 4, description: 'd', specifications: { btu: 9000 } });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Split System');
  });

  it('PUT 400 senza campi validi', async () => {
    const res = await request(app).put('/api/products/p-1').set('Authorization', `Bearer ${adminTok}`).send({ foo: 1 });
    expect(res.status).toBe(400);
  });

  it('PUT 404 se prodotto inesistente', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).put('/api/products/p-x').set('Authorization', `Bearer ${adminTok}`).send({ price: 10 });
    expect(res.status).toBe(404);
  });

  it('DELETE disattiva il prodotto', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'p-1' }] });
    const res = await request(app).delete('/api/products/p-1').set('Authorization', `Bearer ${adminTok}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('disattivato');
  });

  it('DELETE 404 se inesistente', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).delete('/api/products/p-x').set('Authorization', `Bearer ${adminTok}`);
    expect(res.status).toBe(404);
  });
});

// ===================== ANALYZE =====================
describe('Analyze router', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'airklim-test-'));
  const cwd = process.cwd();
  beforeAll(() => { process.chdir(tmp); });
  afterAll(() => { process.chdir(cwd); try { fs.rmSync(tmp, { recursive: true, force: true }); } catch {} });

  const app = makeApp(analyzeRouter, '/api/analyze');

  it('POST /upload senza file → 400', async () => {
    const res = await request(app).post('/api/analyze/upload');
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Nessun file');
  });

  it('POST /upload con PDF → avvia scansione in background', async () => {
    const res = await request(app).post('/api/analyze/upload')
      .attach('files', Buffer.from('%PDF-1.4 fake'), 'catalog.pdf');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.files).toHaveLength(1);
    // attende il fire-and-forget di startBackgroundAnalysis
    await new Promise(setImmediate);
    expect(mockScanner.startScan).toHaveBeenCalled();
  });

  it('GET /status espone lo stato dello scanner', async () => {
    mockScanner.getStatus.mockReturnValue({ isRunning: true, progress: 42 });
    const res = await request(app).get('/api/analyze/status');
    expect(res.status).toBe(200);
    expect(res.body.status).toEqual({ isRunning: true, progress: 42 });
  });

  it('POST /start rifiuta se già in corso (400)', async () => {
    mockScanner.getStatus.mockReturnValue({ isRunning: true });
    const res = await request(app).post('/api/analyze/start');
    expect(res.status).toBe(400);
    expect(mockScanner.startScan).not.toHaveBeenCalled();
  });

  it('POST /start avvia quando libero', async () => {
    const res = await request(app).post('/api/analyze/start');
    expect(res.status).toBe(200);
    expect(mockScanner.startScan).toHaveBeenCalled();
  });

  it('POST /stop 400 se nessuna analisi in corso', async () => {
    const res = await request(app).post('/api/analyze/stop');
    expect(res.status).toBe(400);
  });

  it('POST /stop ferma l’analisi in corso', async () => {
    mockScanner.getStatus.mockReturnValue({ isRunning: true });
    const res = await request(app).post('/api/analyze/stop');
    expect(res.status).toBe(200);
    expect(mockScanner.stopScan).toHaveBeenCalled();
  });

  it('GET /results 404 quando non ci sono risultati', async () => {
    mockScanner.getResults.mockReturnValue(null);
    const res = await request(app).get('/api/analyze/results');
    expect(res.status).toBe(404);
  });

  it('GET /results 404 anche con totalProducts = 0', async () => {
    mockScanner.getResults.mockReturnValue({ totalProducts: 0 });
    const res = await request(app).get('/api/analyze/results');
    expect(res.status).toBe(404);
  });

  it('GET /results restituisce i prodotti estratti', async () => {
    mockScanner.getResults.mockReturnValue({ totalProducts: 3, products: [] });
    const res = await request(app).get('/api/analyze/results');
    expect(res.status).toBe(200);
    expect(res.body.results.totalProducts).toBe(3);
  });
});
