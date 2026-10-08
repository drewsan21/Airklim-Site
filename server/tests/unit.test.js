/**
 * AIRKLIM Backend - Unit Test Suite (senza database)
 *
 * Test rapidi e isolati per servizi e middleware che non richiedono
 * PostgreSQL. Eseguibili in CI con: npx jest tests/unit.test.js
 */

const fs = require('fs');
const path = require('path');

// ===== SCANNER SERVICE =====
describe('ScannerService', () => {
  // Richiesto freshly per ogni test tramite jest.resetModules
  let scanner;

  beforeEach(() => {
    jest.resetModules();
    scanner = require('../services/scannerService');
  });

  test('è uno singleton con stato iniziale corretto', () => {
    expect(scanner.isRunning).toBe(false);
    expect(scanner.progress).toBe(0);
    expect(scanner.logs).toEqual([]);
    expect(scanner.results).toBeNull();
  });

  test('getStatus restituisce la forma attesa', () => {
    const status = scanner.getStatus();
    expect(status).toMatchObject({
      isRunning: false,
      currentStep: '',
      progress: 0,
      results: null,
    });
    expect(Array.isArray(status.logs)).toBe(true);
  });

  test('addLog mantiene al massimo 100 voci (le più recenti)', () => {
    for (let i = 0; i < 150; i++) scanner.addLog(`msg ${i}`, 'info');
    expect(scanner.logs).toHaveLength(100);
    expect(scanner.logs[0].message).toBe('msg 50');
    expect(scanner.logs[99].message).toBe('msg 149');
    expect(scanner.logs[0]).toHaveProperty('timestamp');
  });

  test('stopScan azzera lo stato di esecuzione', () => {
    scanner.isRunning = true;
    scanner.stopScan();
    expect(scanner.isRunning).toBe(false);
    expect(scanner.currentStep).toBe('Fermato');
  });

  test('startScan rifiuta se una scansione è già in corso', async () => {
    scanner.isRunning = true;
    await expect(scanner.startScan()).rejects.toThrow('Scansione già in corso');
  });

  test('loadResults gestisce file JSON mancanti o corrotti senza throw', () => {
    const results = scanner.loadResults();
    expect(results).toHaveProperty('statistics');
    expect(typeof results.statistics.totalPdfs).toBe('number');

    // File corrotto nella cache data/extracted -> nessun crash, log di errore
    const pdfPath = 'data/extracted/pdf_analysis_complete.json';
    const existed = fs.existsSync(pdfPath);
    let dirCreated = false;
    try {
      if (!existed) {
        fs.mkdirSync(path.dirname(pdfPath), { recursive: true });
        dirCreated = true;
      }
      fs.writeFileSync(pdfPath, '{ invalid json !!');
      const r2 = scanner.loadResults();
      expect(r2.pdfs).toEqual([]);
      expect(scanner.logs.some(l => l.type === 'error')).toBe(true);
    } finally {
      if (!existed && dirCreated) {
        fs.rmSync(path.dirname(pdfPath), { recursive: true, force: true });
      } else if (existed) {
        fs.rmSync(pdfPath, { force: true });
      }
    }
  });
});

// ===== EMAIL SERVICE =====
describe('EmailService', () => {
  const savedEnv = { ...process.env };

  // Mock di nodemailer: intercetta i messaggi senza aprire connessioni SMTP.
  // La variabile deve avere prefisso "mock" per essere usabile nel factory di jest.mock.
  var mockSentMails = []; // eslint-disable-line no-var
  jest.mock('nodemailer', () => ({
    createTransport: () => ({
      sendMail: async (mailOptions) => {
        mockSentMails.push(mailOptions);
        return { messageId: 'mock-1' };
      },
    }),
  }));

  beforeEach(() => {
    mockSentMails = [];
    jest.resetModules();
  });

  afterEach(() => {
    process.env = { ...savedEnv };
  });

  test('senza SMTP usa un transporter simulato (nessun crash in sviluppo)', async () => {
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    jest.resetModules();
    const { getTransporter, sendWelcomeEmail } = require('../services/emailService');

    const result = await sendWelcomeEmail({ email: 't@example.com', name: 'Test' });
    expect(result.simulated).toBe(true);
    expect(getTransporter()).toBeDefined();
  });

  test('con SMTP configurato invia via nodemailer e nota lattesa verifica per i professionisti', async () => {
    process.env.SMTP_HOST = 'smtp.example.com';
    process.env.SMTP_USER = 'u';
    process.env.SMTP_PASS = 'p';
    jest.resetModules();
    const { sendWelcomeEmail } = require('../services/emailService');

    await sendWelcomeEmail({ email: 'p@example.com', name: 'Paolo', surname: 'Rossi', role: 'professionista' });
    expect(mockSentMails).toHaveLength(1);
    const mail = mockSentMails[0];
    expect(mail.to).toBe('p@example.com');
    expect(mail.subject).toBe('Benvenuto su AIRKLIM');
    expect(mail.html).toContain('Paolo Rossi');
    expect(mail.html).toContain('attesa di verifica');
  });

  test('sendPasswordResetEmail genera link valido con FRONTEND_URL e token codificato', async () => {
    process.env.SMTP_HOST = 'smtp.example.com';
    process.env.SMTP_USER = 'u';
    process.env.SMTP_PASS = 'p';
    process.env.FRONTEND_URL = 'https://airklim.it';
    jest.resetModules();
    const { sendPasswordResetEmail } = require('../services/emailService');

    await sendPasswordResetEmail({ email: 't@example.com', name: 'T' }, 'tok&=/special');
    expect(mockSentMails).toHaveLength(1);
    expect(mockSentMails[0].html).toContain(
      'https://airklim.it/reset-password?token=tok%26%3D%2Fspecial'
    );
  });
});

// ===== ERROR HANDLER MIDDLEWARE =====
describe('errorHandler middleware', () => {
  const express = require('express');
  const request = require('supertest');
  const { errorHandler, AppError, asyncHandler } = require('../middleware/errorHandler');

  function makeApp() {
    const app = express();
    app.get('/boom', (_req, _res, next) => {
      const err = new Error('dettaglio interno sensibile');
      err.statusCode = 418;
      next(err);
    });
    app.get('/teapot', (_req, _res, next) => next(new AppError('Teapot', 418)));
    app.get('/expired', (_req, _res, next) => {
      const err = new Error('jwt expired');
      err.name = 'TokenExpiredError';
      next(err);
    });
    app.get('/dup', (_req, _res, next) => {
      const err = new Error('duplicate key');
      err.code = '23505';
      next(err);
    });
    app.get('/async-ok', asyncHandler(async (_req, res) => res.json({ ok: true })));
    app.get('/async-err', asyncHandler(async () => { throw new AppError('async boom', 422); }));
    app.use(errorHandler);
    return app;
  }

  let app;
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    app = makeApp();
  });
  afterAll(() => console.error.mockRestore());

  test('usa statusCode dellerrore e risponde in JSON', async () => {
    const res = await request(app).get('/boom');
    expect(res.status).toBe(418);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('dettaglio interno sensibile');
  });

  test('AppError mantiene messaggio e stato', async () => {
    const res = await request(app).get('/teapot');
    expect(res.status).toBe(418);
    expect(res.body.error).toBe('Teapot');
  });

  test('traduce TokenExpiredError in 401', async () => {
    const res = await request(app).get('/expired');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Token scaduto');
  });

  test('traduce il codice PG 23505 in 409 (duplicato)', async () => {
    const res = await request(app).get('/dup');
    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/Duplicato/);
  });

  test('asyncHandler propaga le eccezioni async al middleware di errore', async () => {
    await expect(request(app).get('/async-ok')).resolves.toMatchObject({ status: 200 });
    const res = await request(app).get('/async-err');
    expect(res.status).toBe(422);
    expect(res.body.error).toBe('async boom');
  });
});

// ===== SECURITY MONITOR =====
describe('securityMonitor', () => {
  test('esporta le API attese', () => {
    const mod = require('../middleware/securityMonitor');
    expect(mod.securityMonitor).toBeDefined();
  });
});
