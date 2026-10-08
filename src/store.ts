/**
 * AIRKLIM Global Client Store
 * Lightweight pub/sub store persisted to localStorage. Works on Windows / any OS,
 * no native dependencies. Provides reactive access (via useStore) to users,
 * session, orders, installer links, leads, quotes, maintenance tickets,
 * business documents and dynamic pricing rules.
 */
import { useEffect, useState } from 'react';

// ===== TYPES =====
export type AccountType = 'individual' | 'business';

export interface StoredUser {
  id: string;
  email: string;
  password: string;          // demo-mode hash (see hashPassword)
  accountType: AccountType;
  name: string;
  surname: string;
  phone?: string;
  city?: string;
  address?: string;          // shipping/installation address (used for installer matching)
  company?: string;
  vatNumber?: string;
  sdiCode?: string;          // Codice Destinatario SDI per fattura elettronica
  pec?: string;
  installersCode?: string;   // codice univoco partner (per gli installatori)
  isInstaller?: boolean;     // true se il business è un installatore della rete AIRKLIM
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  verified?: boolean;        // documenti approvati (business)
  createdAt: string;
}

export interface Session { userId: string; token: string; }

export interface OrderLine { productId: string; name: string; brand: string; price: number; qty: number; listPrice: number; }

export interface InstallerLink {
  installerId: string;
  installerName: string;
  installerCompany: string;
  installerPhone: string;
  installerEmail: string;
  distanceKm: number;
  status: 'assigned' | 'accepted' | 'completed';
}

export interface Order {
  id: string;
  userId: string;
  lines: OrderLine[];
  subtotal: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  shippingAddress: string;
  customerName: string;
  customerEmail: string;
  accountType: AccountType;
  installer?: InstallerLink;      // collegamento installatore per clienti individuali
  invoiceNumber?: string;         // n. fattura elettronica emessa verso l'installatore
}

export interface QuoteLine { name: string; qty: number; unitPrice: number; }
export interface Quote {
  id: string;
  businessId: string;
  businessName: string;
  clientName: string;
  clientAddress: string;
  lines: QuoteLine[];
  installationFee: number;
  total: number;
  validUntil: string;
  createdAt: string;
  status: 'draft' | 'sent' | 'accepted' | 'converted';
  orderId?: string;
}

export interface MaintenanceTicket {
  id: string;
  businessId: string;
  customerName: string;
  customerAddress: string;
  serviceType: 'filter-replacement' | 'annual-check' | 'sanitization' | 'repair';
  scheduledFor: string;
  autoReorderFilters: boolean;
  notes?: string;
  status: 'scheduled' | 'done' | 'cancelled';
  createdAt: string;
}

export interface BusinessDoc {
  id: string;
  businessId: string;
  type: 'visura' | 'duvri' | 'certificazione-f-gas' | 'assicurazione' | 'altro';
  fileName: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  note?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'won' | 'lost';
}

export interface SeasonalRule {
  id: string;
  label: string;
  monthStart: number;   // 1-12
  monthEnd: number;
  adjustmentPct: number; // e.g. -8 = sconto 8%, +5 = rincaro
  active: boolean;
}

export interface StockInfo { productId: string; qty: number; updatedAt: string; }

export interface StoreState {
  users: StoredUser[];
  session: Session | null;
  orders: Order[];
  quotes: Quote[];
  maintenance: MaintenanceTicket[];
  documents: BusinessDoc[];
  leads: Lead[];
  seasonalRules: SeasonalRule[];
  stock: StockInfo[];
}

const KEY = 'airklim-store-v1';

const defaultSeasonalRules: SeasonalRule[] = [
  { id: 'sr-summer', label: 'Promo Estiva Climatizzazione (Mag–Set)', monthStart: 5, monthEnd: 9, adjustmentPct: -8, active: true },
  { id: 'sr-winter', label: 'Rincaro Invernale Domanda PAC (Nov–Feb)', monthStart: 11, monthEnd: 2, adjustmentPct: 4, active: true },
  { id: 'sr-low', label: 'Low Season Sconto (Ott & Mar–Apr)', monthStart: 10, monthEnd: 4, adjustmentPct: -5, active: false },
];

function initialState(): StoreState {
  return {
    users: [],
    session: null,
    orders: [],
    quotes: [],
    maintenance: [],
    documents: [],
    leads: [],
    seasonalRules: defaultSeasonalRules,
    stock: [],
  };
}

// ===== LOAD / SAVE =====
let state: StoreState = load();
const listeners = new Set<() => void>();

function load(): StoreState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initialState();
    const parsed = JSON.parse(raw);
    return { ...initialState(), ...parsed };
  } catch {
    return initialState();
  }
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch { /* storage full / private mode */ }
  listeners.forEach(l => l());
}

// ===== DEMO PASSWORD HASH (FNV-1a + salt — non crittografico, solo demo locale) =====
export function hashPassword(pw: string): string {
  const salted = `airklim::${pw}::2026`;
  let h = 0x811c9dc5;
  for (let i = 0; i < salted.length; i++) {
    h ^= salted.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return `h${h.toString(16)}-${salted.length}`;
}

// ===== SUBSCRIBE / SELECTOR HOOK =====
export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getState(): StoreState { return state; }

export function useStore<T>(selector: (s: StoreState) => T): T {
  const get = () => selector(state);
  const [val, setVal] = useState<T>(get);
  useEffect(() => subscribe(() => setVal(get())), []); // eslint-disable-line
  return val;
}

// ===== HELPERS =====
export function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export function currentUser(): StoredUser | null {
  if (!state.session) return null;
  return state.users.find(u => u.id === state.session!.userId) || null;
}

// ===== AUTH ACTIONS =====
export function signup(data: {
  email: string; password: string; accountType: AccountType;
  name: string; surname: string; phone?: string; city?: string; address?: string;
  company?: string; vatNumber?: string; sdiCode?: string; pec?: string; isInstaller?: boolean;
}): { ok: boolean; message: string; user?: StoredUser } {
  const email = data.email.trim().toLowerCase();
  if (state.users.some(u => u.email === email)) {
    return { ok: false, message: 'Email già registrata. Prova ad accedere.' };
  }
  if (data.accountType === 'business' && !data.company) {
    return { ok: false, message: 'La ragione sociale è obbligatoria per gli account Business.' };
  }
  if (data.accountType === 'business' && !(data.vatNumber && /^\d{11}$/.test(data.vatNumber))) {
    return { ok: false, message: 'Inserisci una Partita IVA valida (11 cifre).' };
  }
  const user: StoredUser = {
    id: uid('usr'),
    email,
    password: hashPassword(data.password),
    accountType: data.accountType,
    name: data.name, surname: data.surname,
    phone: data.phone, city: data.city, address: data.address,
    company: data.company, vatNumber: data.vatNumber,
    sdiCode: data.sdiCode, pec: data.pec,
    isInstaller: data.isInstaller ?? false,
    installersCode: data.accountType === 'business' ? `AK-${Math.floor(10000 + Math.random() * 89999)}` : undefined,
    tier: 'bronze',
    verified: data.accountType === 'individual', // business richiede verifica documenti
    createdAt: new Date().toISOString(),
  };
  state = { ...state, users: [...state.users, user], session: { userId: user.id, token: uid('tok') } };
  persist();
  return {
    ok: true,
    user,
    message: data.accountType === 'individual'
      ? 'Account Individual creato! Benvenuto in AIRKLIM.'
      : 'Registrazione Business ricevuta! Carica i documenti (Visura, DUVRI, Certificazione F-Gas) dalla dashboard per attivare gli sconti partner.',
  };
}

export function signin(email: string, password: string, expectType?: AccountType): { ok: boolean; message: string; user?: StoredUser } {
  const e = email.trim().toLowerCase();
  const user = state.users.find(u => u.email === e);
  if (!user) return { ok: false, message: 'Utente non trovato. Registrati prima.' };
  if (user.password !== hashPassword(password)) return { ok: false, message: 'Password errata.' };
  if (expectType && user.accountType !== expectType) {
    return { ok: false, message: `Questo account è di tipo "${user.accountType}". Usa il form ${expectType}.` };
  }
  state = { ...state, session: { userId: user.id, token: uid('tok') } };
  persist();
  return { ok: true, message: `Bentornato, ${user.name}!`, user };
}

export function signout() {
  state = { ...state, session: null };
  persist();
}

export function updateUser(userId: string, patch: Partial<StoredUser>) {
  state = { ...state, users: state.users.map(u => u.id === userId ? { ...u, ...patch } : u) };
  persist();
}

// ===== PRICING =====
/** Prezzo dinamico stagionale: applica la regola attiva per il mese corrente */
export function applySeasonalPricing(listPrice: number, date = new Date()): { price: number; ruleLabel?: string; pct: number } {
  const m = date.getMonth() + 1;
  const rules = state.seasonalRules.filter(r => r.active);
  let pct = 0; let ruleLabel: string | undefined;
  for (const r of rules) {
    const inRange = r.monthStart <= r.monthEnd
      ? (m >= r.monthStart && m <= r.monthEnd)
      : (m >= r.monthStart || m <= r.monthEnd); // wrap-around (es. Nov–Feb)
    if (inRange && r.adjustmentPct < pct) { pct = r.adjustmentPct; ruleLabel = r.label; } // favoreggia lo sconto migliore
    else if (inRange && pct === 0 && r.adjustmentPct > 0 && !ruleLabel) { pct = r.adjustmentPct; ruleLabel = r.label; }
  }
  return { price: Math.round(listPrice * (1 + pct / 100) * 100) / 100, ruleLabel, pct };
}

export function toggleSeasonalRule(id: string) {
  state = { ...state, seasonalRules: state.seasonalRules.map(r => r.id === id ? { ...r, active: !r.active } : r) };
  persist();
}

// ===== BUSINESS TIER DISCOUNT =====
export function tierDiscount(tier?: StoredUser['tier']): number {
  switch (tier) {
    case 'platinum': return 22;
    case 'gold': return 15;
    case 'silver': return 8;
    default: return 0;
  }
}

export function recomputeTier(userId: string) {
  const spend = state.orders
    .filter(o => o.userId === userId && o.accountType === 'business')
    .reduce((s, o) => s + o.total, 0);
  const tier: StoredUser['tier'] = spend >= 50000 ? 'platinum' : spend >= 20000 ? 'gold' : spend >= 5000 ? 'silver' : 'bronze';
  updateUser(userId, { tier });
}

// ===== ORDERS =====
export function placeOrder(input: {
  user: StoredUser; lines: OrderLine[]; shippingAddress: string; listSubtotal: number; discountPct: number;
  installer?: InstallerLink | null;
}): Order {
  const subtotal = input.lines.reduce((s, l) => s + l.price * l.qty, 0);
  const discount = Math.round(subtotal * (input.discountPct / 100) * 100) / 100;
  const total = Math.round((subtotal - discount) * 100) / 100;
  const order: Order = {
    id: `ORD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
    userId: input.user.id,
    lines: input.lines,
    subtotal: Math.round(subtotal * 100) / 100,
    discount,
    total,
    status: 'pending',
    createdAt: new Date().toISOString(),
    shippingAddress: input.shippingAddress,
    customerName: `${input.user.name} ${input.user.surname}`,
    customerEmail: input.user.email,
    accountType: input.user.accountType,
    installer: input.installer ?? undefined,
    invoiceNumber: input.user.accountType === 'business' ? `TD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}` : undefined,
  };
  state = { ...state, orders: [order, ...state.orders] };
  persist();
  setTimeout(() => advanceOrder(order.id, 'confirmed'), 3000);
  setTimeout(() => advanceOrder(order.id, 'processing'), 8000);
  setTimeout(() => advanceOrder(order.id, 'shipped'), 15000);
  if (input.user.accountType === 'business') recomputeTier(input.user.id);
  return order;
}

export function advanceOrder(orderId: string, status: Order['status']) {
  state = { ...state, orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o) };
  persist();
}

export function acceptInstallerJob(orderId: string, installerUserId: string) {
  const ord = state.orders.find(o => o.id === orderId);
  if (!ord?.installer) return;
  state = { ...state, orders: state.orders.map(o => o.id === orderId && o.installer ? { ...o, installer: { ...o.installer, status: 'accepted' } } : o) };
  persist();
  void installerUserId;
}

// ===== QUOTES =====
export function saveQuote(q: Omit<Quote, 'id' | 'createdAt' | 'status'> & { status?: Quote['status'] }): Quote {
  const quote: Quote = { ...q, id: uid('QT'), createdAt: new Date().toISOString(), status: q.status ?? 'draft' };
  state = { ...state, quotes: [quote, ...state.quotes] };
  persist();
  return quote;
}

export function updateQuote(id: string, patch: Partial<Quote>) {
  state = { ...state, quotes: state.quotes.map(q => q.id === id ? { ...q, ...patch } : q) };
  persist();
}

// ===== MAINTENANCE =====
export function addMaintenance(t: Omit<MaintenanceTicket, 'id' | 'createdAt' | 'status'>): MaintenanceTicket {
  const ticket: MaintenanceTicket = { ...t, id: uid('MT'), createdAt: new Date().toISOString(), status: 'scheduled' };
  state = { ...state, maintenance: [ticket, ...state.maintenance] };
  persist();
  return ticket;
}

export function updateMaintenance(id: string, patch: Partial<MaintenanceTicket>) {
  state = { ...state, maintenance: state.maintenance.map(m => m.id === id ? { ...m, ...patch } : m) };
  persist();
}

// ===== DOCUMENTS =====
export function uploadDocument(businessId: string, type: BusinessDoc['type'], fileName: string): BusinessDoc {
  const doc: BusinessDoc = { id: uid('doc'), businessId, type, fileName, uploadedAt: new Date().toISOString(), status: 'pending' };
  state = { ...state, documents: [doc, ...state.documents] };
  persist();
  return doc;
}

export function reviewDocument(docId: string, status: 'approved' | 'rejected', note?: string) {
  const doc = state.documents.find(d => d.id === docId);
  if (!doc) return;
  state = { ...state, documents: state.documents.map(d => d.id === docId ? { ...d, status, note } : d) };
  const allApproved = ['visura', 'duvri', 'certificazione-f-gas'].every(t =>
    state.documents.some(d => d.businessId === doc.businessId && d.type === t && d.status === 'approved'));
  if (allApproved) updateUser(doc.businessId, { verified: true });
  persist();
}

// ===== LEADS =====
export function addLead(l: Omit<Lead, 'id' | 'createdAt' | 'status'>): Lead {
  const lead: Lead = { ...l, id: uid('lead'), createdAt: new Date().toISOString(), status: 'new' };
  state = { ...state, leads: [lead, ...state.leads] };
  persist();
  return lead;
}

export function updateLead(id: string, patch: Partial<Lead>) {
  state = { ...state, leads: state.leads.map(l => l.id === id ? { ...l, ...patch } : l) };
  persist();
}

// ===== STOCK =====
export function setStock(productId: string, qty: number) {
  const rest = state.stock.filter(s => s.productId !== productId);
  state = { ...state, stock: [...rest, { productId, qty, updatedAt: new Date().toISOString() }] };
  persist();
}

export function getStock(productId: string): number | null {
  return state.stock.find(s => s.productId === productId)?.qty ?? null;
}

// ===== SEED TEST ACCOUNTS (Windows-friendly, idempotente) =====
export function seedDemoAccounts() {
  if (state.users.some(u => u.email === 'demo@airklim.it')) return;
  const mk = (u: Omit<StoredUser, 'password' | 'createdAt'> & { passwordPlain: string }): StoredUser => {
    const { passwordPlain, ...rest } = u;
    return { ...rest, password: hashPassword(passwordPlain), createdAt: new Date().toISOString() };
  };
  const seeded: StoredUser[] = [
    mk({ id: 'usr-demo-ind', email: 'demo@airklim.it', passwordPlain: 'demo123', accountType: 'individual', name: 'Mario', surname: 'Rossi', city: 'Palermo', address: 'Via Roma 1, 90133 Palermo', verified: true, tier: 'bronze' }),
    mk({ id: 'usr-demo-biz', email: 'business@airklim.it', passwordPlain: 'business123', accountType: 'business', name: 'Luca', surname: 'Verdi', company: 'Verdi Clima Srl', vatNumber: '12345678901', sdiCode: 'K9THZJA', city: 'Catania', address: 'Via Etnea 100, 95121 Catania', verified: true, tier: 'gold', installersCode: 'AK-10234' }),
    mk({ id: 'usr-demo-inst', email: 'installer@airklim.it', passwordPlain: 'installer123', accountType: 'business', isInstaller: true, name: 'Giuseppe', surname: 'Ferrara', company: 'Airklim PRO Partner', vatNumber: '09876543210', sdiCode: '0000000', city: 'Palermo', address: 'Via Libertà 55, 90143 Palermo', verified: true, tier: 'platinum', installersCode: 'AK-00001' }),
  ];
  state = { ...state, users: [...state.users, ...seeded] };
  // documenti approvati per il business demo
  const docs: BusinessDoc[] = [
    { id: uid('doc'), businessId: 'usr-demo-biz', type: 'visura', fileName: 'visura.pdf', uploadedAt: new Date().toISOString(), status: 'approved' },
    { id: uid('doc'), businessId: 'usr-demo-biz', type: 'duvri', fileName: 'duvri.pdf', uploadedAt: new Date().toISOString(), status: 'approved' },
    { id: uid('doc'), businessId: 'usr-demo-biz', type: 'certificazione-f-gas', fileName: 'fgas.pdf', uploadedAt: new Date().toISOString(), status: 'approved' },
  ];
  state = { ...state, documents: [...state.documents, ...docs] };
  persist();
}
