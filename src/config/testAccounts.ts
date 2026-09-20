/**
 * Test Accounts Configuration
 * Account di test pre-configurati per AIRKLIM
 */

export interface TestAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  role: 'admin' | 'professionista' | 'privato';
  phone?: string;
  company?: string;
  vatNumber?: string;
  verified: boolean;
  createdAt: string;
  permissions: string[];
}

export const testAccounts: TestAccount[] = [
  {
    id: 'admin-001',
    email: 'admin@example.com',
    password: 'Admin@123!',
    name: 'Mario',
    surname: 'Rossi',
    role: 'admin',
    phone: '+39 333 1234567',
    verified: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    permissions: ['all']
  },
  {
    id: 'pro-001',
    email: 'professionist@example.com',
    password: 'Pro@123!',
    name: 'Luigi',
    surname: 'Bianchi',
    role: 'professionista',
    phone: '+39 333 2345678',
    company: 'ClimaTech Solutions',
    vatNumber: 'IT12345678901',
    verified: true,
    createdAt: '2026-01-02T00:00:00.000Z',
    permissions: ['b2b_pricing', 'full_catalog', 'priority_support']
  },
  {
    id: 'user-001',
    email: 'user@example.com',
    password: 'User@123!',
    name: 'Giuseppe',
    surname: 'Verdi',
    role: 'privato',
    phone: '+39 333 3456789',
    verified: true,
    createdAt: '2026-01-03T00:00:00.000Z',
    permissions: ['public_catalog', 'standard_pricing', 'basic_support']
  }
];

/**
 * Inizializza gli account di test in localStorage
 */
export function initializeTestAccounts(): void {
  const existingUsers = JSON.parse(localStorage.getItem('airklim-users') || '[]');
  
  // Verifica se account test esistono già
  const testEmails = testAccounts.map(acc => acc.email);
  const hasTestAccounts = existingUsers.some((user: any) => testEmails.includes(user.email));
  
  if (!hasTestAccounts) {
    const usersWithTestAccounts = [...existingUsers, ...testAccounts];
    localStorage.setItem('airklim-users', JSON.stringify(usersWithTestAccounts));
    console.log('✅ Test accounts initialized successfully');
    console.log('📧 Admin: admin@example.com / Admin@123!');
    console.log('📧 Professionista: professionist@example.com / Pro@123!');
    console.log('📧 User: user@example.com / User@123!');
  } else {
    console.log('ℹ️ Test accounts already initialized');
  }
}

/**
 * Verifica se un utente è un account di test
 */
export function isTestAccount(email: string): boolean {
  return testAccounts.some(acc => acc.email === email);
}

/**
 * Ottieni i permessi per un ruolo specifico
 */
export function getPermissionsForRole(role: string): string[] {
  const account = testAccounts.find(acc => acc.role === role);
  return account?.permissions || [];
}

/**
 * Reset test accounts (utile per testing)
 */
export function resetTestAccounts(): void {
  localStorage.removeItem('airklim-users');
  initializeTestAccounts();
  console.log('🔄 Test accounts reset successfully');
}

export default testAccounts;
