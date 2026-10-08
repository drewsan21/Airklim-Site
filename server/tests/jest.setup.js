/**
 * Jest setup — ambiente di test isolato.
 *
 * Nota: i test di integrazione (tests/api.test.js) richiedono un PostgreSQL
 * raggiungibile tramite DATABASE_URL e dati di seed (admin@example.com,
 * user@example.com, prodotti). Avviare il DB con docker-compose e poi:
 *   node database/seed.js
 * prima di eseguire jest.
 */

process.env.NODE_ENV = 'test';
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-secret-only';
}

// Silenzia il warning ECONNREFUSED del pool di auditLogger quando il DB non è
// disponibile (es. CI senza database): il pool emette un errore 'error' non gestito.
const { Pool } = require('pg');
global.__JEST_NO_DB__ = !process.env.DATABASE_URL;

if (global.__JEST_NO_DB__) {
  // Sostituisce il costruttore di pg.Pool in modo che ogni query fallisca
  // silenziosamente invece di propagare un ECONNREFUSED non gestito.
  class NoopPool extends Pool {
    constructor(cfg) {
      super(cfg);
      this.on('error', () => {});
    }
    async query() {
      throw new Error('No database available in unit test environment');
    }
    async connect() {
      throw new Error('No database available in unit test environment');
    }
  }
  require('pg').Pool = NoopPool;
}
