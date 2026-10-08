import { useState, useEffect, useCallback } from 'react';
import { matchInstallers, addInstallerToNetwork, type InstallerProfile } from './installers';

// ===== TYPES =====
export interface AccountType {
  id: string;
  label: string;
  description: string;
}

/** Two signup audiences: Businesses (HVAC installers buying B2B) and Individuals (retail customers) */
export const ACCOUNT_TYPES: Record<'business' | 'individual', AccountType> = {
  business: {
    id: 'business',
    label: 'Business / Installatore',
    description: 'Imprese di installazione HVAC che acquistano da AIRKLIM come distributori (listino B2B, documenti aziendali)',
  },
  individual: {
    id: 'individual',
    label: 'Individual / Cliente Privato',
    description: 'Clienti privati: all’acquisto vengono collegati automaticamente al miglior installatore certificato della loro zona',
  },
};

export interface BusinessDetails {
  company: string;
  vatNumber: string;
  fiscalCode?: string;      // Codice Fiscale
  pec?: string;             // PEC
  reaNumber?: string;       // Numero REA
  officeAddress?: string;
  city?: string;
  zip?: string;
  province?: string;
  sdccCertified?: boolean;  // Certificazione DM 37/08
  documentsUploaded?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  accountType: 'business' | 'individual';
  /** legacy role kept in sync with accountType for admin tooling */
  role: 'privato' | 'professionista';
  phone?: string;
  address?: string;
  city?: string;
  zip?: string;
  province?: string;
  verified: boolean;
  createdAt: string;
  business?: BusinessDetails;
}

interface StoredUser extends User {
  password: string;
}

export interface CartItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface AssignedInstaller {
  id: string;
  name: string;
  city: string;
  phone: string;
  distanceKm: number;
  certified: boolean;
  assignedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  accountType: 'business' | 'individual';
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  shippingAddress?: string;
  installer?: AssignedInstaller;
}

// ===== HELPERS =====
function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

function normalizeAccount(u: any): User {
  if (u && !u.accountType) {
    u.accountType = u.role === 'professionista' ? 'business' : 'individual';
  }
  if (u && !u.role) {
    u.role = u.accountType === 'business' ? 'professionista' : 'privato';
  }
  return u as User;
}

export function validatePassword(pw: string): { ok: boolean; message: string } {
  if (!pw || pw.length < 8) return { ok: false, message: 'La password deve avere almeno 8 caratteri.' };
  if (!/[A-Z]/.test(pw)) return { ok: false, message: 'La password deve contenere almeno una lettera maiuscola.' };
  if (!/[a-z]/.test(pw)) return { ok: false, message: 'La password deve contenere almeno una lettera minuscola.' };
  if (!/[0-9]/.test(pw)) return { ok: false, message: 'La password deve contenere almeno un numero.' };
  return { ok: true, message: '' };
}

export function validateVAT(vat: string): { ok: boolean; message: string } {
  const v = (vat || '').replace(/\s/g, '').toUpperCase();
  if (/^IT\d{11}$/.test(v)) return { ok: true, message: '' };
  if (/^\d{11}$/.test(v)) return { ok: true, message: '' };
  return { ok: false, message: 'Partita IVA non valida: servono 11 cifre (eventualmente precedute da IT).' };
}

/** Simple synchronous hash (demo-grade). In production the server uses bcrypt. */
function hashPassword(pw: string): string {
  let h = 5381;
  const salted = `airklim::${pw}`;
  for (let i = 0; i < salted.length; i++) h = ((h << 5) + h + salted.charCodeAt(i)) >>> 0;
  return `h${h.toString(36)}${salted.length.toString(36)}`;
}

// ===== AUTH HOOK =====
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = readJSON<User | null>('airklim-user', null);
    if (stored) setUser(normalizeAccount(stored));
    setIsLoading(false);
  }, []);

  const login = useCallback((email: string, password: string, accountType?: 'business' | 'individual'): { success: boolean; message: string } => {
    const users = readJSON<StoredUser[]>('airklim-users', []);
    const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!found) return { success: false, message: 'Utente non trovato. Registrati prima.' };
    const expected = String(found.password).startsWith('h') ? found.password : hashPassword(found.password);
    if (expected !== hashPassword(password)) return { success: false, message: 'Password errata.' };
    const normalized = normalizeAccount({ ...found });
    if (accountType && normalized.accountType !== accountType) {
      return {
        success: false,
        message: normalized.accountType === 'business'
          ? 'Questo indirizzo è un account Business. Usa il login Business.'
          : 'Questo indirizzo è un account Individual. Usa il login Individuale.',
      };
    }

    const { password: _pw, ...userData } = normalized as StoredUser;
    setUser(userData);
    localStorage.setItem('airklim-user', JSON.stringify(userData));
    return { success: true, message: `Bentornato${userData.business?.company ? ', ' + userData.business.company : ''}!` };
  }, []);

  const register = useCallback((data: {
    email: string;
    password: string;
    name: string;
    surname: string;
    phone?: string;
    accountType: 'business' | 'individual';
    address?: string;
    city?: string;
    zip?: string;
    province?: string;
    business?: BusinessDetails;
  }): { success: boolean; message: string } => {
    const users = readJSON<StoredUser[]>('airklim-users', []);
    if (users.find(u => u.email.toLowerCase() === data.email.trim().toLowerCase())) {
      return { success: false, message: 'Email già registrata. Accedi oppure usa un’altra email.' };
    }
    const pwCheck = validatePassword(data.password);
    if (!pwCheck.ok) return { success: false, message: pwCheck.message };

    const isBusiness = data.accountType === 'business';
    if (isBusiness) {
      if (!data.business?.company?.trim()) return { success: false, message: 'Ragione sociale obbligatoria per gli account Business.' };
      const vatCheck = validateVAT(data.business?.vatNumber || '');
      if (!vatCheck.ok) return { success: false, message: vatCheck.message };
    }

    const newUser: StoredUser = {
      id: `${isBusiness ? 'biz' : 'ind'}-${Date.now()}`,
      email: data.email.trim().toLowerCase(),
      password: hashPassword(data.password),
      name: data.name,
      surname: data.surname,
      phone: data.phone,
      accountType: data.accountType,
      role: isBusiness ? 'professionista' : 'privato',
      address: data.address,
      city: data.city,
      zip: data.zip,
      province: data.province,
      business: isBusiness ? data.business : undefined,
      verified: isBusiness ? (data.business?.documentsUploaded ?? 0) >= 2 : true,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('airklim-users', JSON.stringify(users));

    const { password: _pw, ...userData } = newUser;
    setUser(userData);
    localStorage.setItem('airklim-user', JSON.stringify(userData));

    return {
      success: true,
      message: isBusiness
        ? 'Registrazione Business inviata! Verificheremo documenti e P.IVA entro 48 ore. Puoi già esplorare la dashboard.'
        : 'Account Individual creato con successo! Benvenuto in AIRKLIM.',
    };
  }, []);

  const updateProfile = useCallback((patch: Partial<User>): { success: boolean; message: string } => {
    if (!user) return { success: false, message: 'Non autenticato.' };
    const users = readJSON<StoredUser[]>('airklim-users', []);
    const idx = users.findIndex(u => u.id === user.id);
    if (idx === -1) return { success: false, message: 'Utente non trovato.' };
    users[idx] = { ...users[idx], ...patch };
    localStorage.setItem('airklim-users', JSON.stringify(users));
    const { password: _pw, ...userData } = users[idx];
    setUser(userData);
    localStorage.setItem('airklim-user', JSON.stringify(userData));
    return { success: true, message: 'Profilo aggiornato.' };
  }, [user]);

  /** Add the logged-in business to the public installer network */
  const publishAsInstaller = useCallback(() => {
    if (!user || user.accountType !== 'business') return false;
    const profile: InstallerProfile = {
      id: `inst-${user.id}`,
      name: user.business?.company || `${user.name} ${user.surname}`,
      contactName: `${user.name} ${user.surname}`,
      city: user.business?.city || user.city || 'Palermo',
      province: user.business?.province || user.province || 'PA',
      lat: 38.118 + (Math.random() - 0.5) * 0.4,
      lng: 13.359 + (Math.random() - 0.5) * 0.6,
      phone: user.phone || '+39 091 0000000',
      email: user.email,
      certified: !!user.verified,
      rating: 4.5,
      jobs: 0,
      specialties: ['Split residenziali'],
      serviceRadiusKm: 50,
      vatNumber: user.business?.vatNumber,
    };
    addInstallerToNetwork(profile);
    return true;
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('airklim-user');
  }, []);

  return { user, isLoading, login, register, logout, updateProfile, publishAsInstaller };
}

// ===== CART HOOK =====
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readJSON<CartItem[]>('airklim-cart', []));
  }, []);

  const persist = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem('airklim-cart', JSON.stringify(newItems));
  };

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      const newItems = existing
        ? prev.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...item, quantity: 1 }];
      localStorage.setItem('airklim-cart', JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(prev => {
      const newItems = prev.filter(i => i.productId !== productId);
      localStorage.setItem('airklim-cart', JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems(prev => {
      const newItems = quantity <= 0
        ? prev.filter(i => i.productId !== productId)
        : prev.map(i => i.productId === productId ? { ...i, quantity } : i);
      localStorage.setItem('airklim-cart', JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem('airklim-cart');
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { items, addItem, removeItem, updateQuantity, clearCart, total, itemCount, persist };
}

// ===== ORDER HOOK (with automatic installer matching for Individual customers) =====
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(readJSON<Order[]>('airklim-orders', []));
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders(prev => {
      const newOrders = prev.map(o => o.id === orderId ? { ...o, status } : o);
      localStorage.setItem('airklim-orders', JSON.stringify(newOrders));
      return newOrders;
    });
  }, []);

  /**
   * Create an order. For Individual customers the site automatically assigns
   * the BEST MATCHING certified installer based on delivery location/proximity,
   * linking customer <-> installer business. Business accounts buy directly (B2B).
   */
  const createOrder = useCallback((buyer: User, items: CartItem[], total: number, shippingAddress: string): Order => {
    const accountType = buyer.accountType || 'individual';
    let assignedInstaller: AssignedInstaller | undefined;

    if (accountType === 'individual') {
      const matches = matchInstallers(shippingAddress || buyer.city || '', 1);
      if (matches.length > 0) {
        const m = matches[0];
        assignedInstaller = {
          id: m.installer.id,
          name: m.installer.name,
          city: m.installer.city,
          phone: m.installer.phone,
          distanceKm: m.distanceKm,
          certified: m.installer.certified,
          assignedAt: new Date().toISOString(),
        };
        // Persist the customer-installer link so the business dashboard can see it
        const links = readJSON<Array<{ customerId: string; installerId: string; orderId: string; createdAt: string }>>('airklim-customer-installer-links', []);
        links.push({ customerId: buyer.id, installerId: m.installer.id, orderId: `ORD-${Date.now()}`, createdAt: new Date().toISOString() });
        localStorage.setItem('airklim-customer-installer-links', JSON.stringify(links));
      }
    }

    const order: Order = {
      id: `ORD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
      userId: buyer.id,
      accountType,
      items,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      shippingAddress,
      installer: assignedInstaller,
    };

    setOrders(prev => {
      const newOrders = [order, ...prev];
      localStorage.setItem('airklim-orders', JSON.stringify(newOrders));
      return newOrders;
    });

    // Simulate order progression
    setTimeout(() => updateOrderStatus(order.id, 'confirmed'), 3000);
    setTimeout(() => updateOrderStatus(order.id, 'processing'), 8000);
    setTimeout(() => updateOrderStatus(order.id, 'shipped'), 15000);

    return order;
  }, [updateOrderStatus]);

  const getUserOrders = useCallback((userId: string) => orders.filter(o => o.userId === userId), [orders]);

  return { orders, createOrder, updateOrderStatus, getUserOrders };
}

// ===== EMAIL AUTOMATION =====
export function useEmailAutomation() {
  const sendWelcomeEmail = useCallback((user: User) => {
    console.log(`[AIRKLIM] Welcome email queued for ${user.email} (${user.accountType})`);
  }, []);

  const sendOrderConfirmation = useCallback((order: Order, email: string) => {
    console.log(`[AIRKLIM] Order confirmation queued for ${email}: ${order.id}`);
    if (order.installer) {
      console.log(`[AIRKLIM] Installer assignment notice sent to ${order.installer.name} (${order.installer.phone}) for order ${order.id}`);
    }
  }, []);

  const sendAbandonedCart = useCallback((email: string, items: CartItem[]) => {
    console.log(`[AIRKLIM] Abandoned cart reminder queued for ${email} (${items.length} items)`);
  }, []);

  const sendReviewRequest = useCallback((order: Order, email: string) => {
    console.log(`[AIRKLIM] Review request queued for ${email}: ${order.id}`);
  }, []);

  return { sendWelcomeEmail, sendOrderConfirmation, sendAbandonedCart, sendReviewRequest };
}
