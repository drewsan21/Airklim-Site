/**
 * Configurazione Jest per AIRKLIM Backend.
 *
 * - tests/unit.test.js      → suite rapida, nessun database richiesto (CI di default)
 * - tests/api.test.js       → integrazione completa, richiede PostgreSQL + seed
 *
 * Uso:
 *   npx jest                    # tutte le suite (api fallisce senza DB)
 *   npx jest --selectProjects unit   # solo unit (equivalente: npm run test:unit)
 *   npm run test:integration         # solo api, con DB raggiungibile via DATABASE_URL
 */
module.exports = {
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/tests/unit.test.js', '<rootDir>/tests/routes.unit.test.js'],
      setupFiles: ['<rootDir>/tests/jest.setup.js'],
      testEnvironment: 'node',
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/tests/api.test.js'],
      setupFiles: ['<rootDir>/tests/jest.setup.js'],
      testEnvironment: 'node',
      testTimeout: 15000,
    },
  ],
  collectCoverageFrom: [
    'routes/**/*.js',
    'middleware/**/*.js',
    'services/**/*.js',
    'config/**/*.js',
    '!**/node_modules/**',
  ],
};
