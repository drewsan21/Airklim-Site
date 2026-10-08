/**
 * AIRKLIM – Full-page authentication & dashboards (hash-routed)
 * ---------------------------------------------------------------------------
 * Routes:
 *   #/signup-business    → Business (HVAC installer / B2B reseller) signup
 *   #/signup-individual  → Individual (private customer) signup
 *   #/login              → Login with Business / Individual tabs
 *   #/dashboard          → Role-aware dashboard:
 *        • Business    → KPIs, ordini B2B, clienti collegati (lead dagli acquisti
 *                        degli individui), documenti aziendali, listino, pubblicazione
 *                        nella rete installatori
 *        • Individual  → ordini + INSTALLATORE COLLEGATO automaticamente in base
 *                        alla località d'acquisto (proximity matching)
 */
import { useState, useEffect } from 'react';
import {
  useAuth, useOrders, validateVAT, validatePassword,
  type User, type Order,
} from './hooks';
import { matchInstallers, getAllInstallers } from './installers';

// ===== SHARED UI HELPERS =====
const inputCls =
  'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none transition-colors';
const labelCls = 'block text-sm font-medium text-white/70 mb-1.5';

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>
        {label} {required && <span className="text-sky-400">*</span>}
      </label>
      {children}
    </div>
  );
}

function AuthShell({ title, subtitle, badge, children }: {
  title: string; subtitle: string; badge: { text: string; cls: string }; children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white flex items-start justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        <a href="#/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors">
          ← Torna al sito AIRKLIM
        </a>
        <div className="bg-slate-900 rounded-3xl border border-white/10 p-8 md:p-10 shadow-2xl">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.cls}`}>{badge.text}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-white/50 mb-8">{subtitle}</p>
          {children}
        </div>
        <p className="text-center text-white/30 text-xs mt-6">
          AIRKLIM S.r.l. — Distributore autorizzato Panasonic &amp; TCL · P.IVA 07009210821
        </p>
      </div>
    </div>
  );
}

function FormMsg({ msg }: { msg: { type: 'success' | 'error'; text: string } | null }) {
  if (!msg) return null;
  return (
    <div className={`p-3 rounded-lg text-sm mb-4 ${
      msg.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                             : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
      {msg.text}
    </div>
  );
}

// ===== BUSINESS SIGNUP =====
export function BusinessSignupPage() {
  const { register } = useAuth();
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [f, setF] = useState({
    company: '', vatNumber: '', fiscalCode: '', pec: '', reaNumber: '',
    name: '', surname: '', email: '', phone: '',
    officeAddress: '', city: '', zip: '', province: '',
    password: '', confirm: '', sdccCertified: false, docsUploaded: 0,
  });
  const set = (k: string, v: any) => setF(p => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (f.password !== f.confirm) { setMsg({ type: 'error', text: 'Le due password non coincidono.' }); return; }
    if (f.sdccCertified && f.docsUploaded < 2) {
      setMsg({ type: 'error', text: 'Dichiari almeno 2 documenti (es. visura camerale + certificato DM 37/08) per sbloccare lo stato verificato.' });
      return;
    }
    const r = register({
      email: f.email, password: f.password, name: f.name, surname: f.surname, phone: f.phone,
      accountType: 'business', city: f.city, zip: f.zip, province: f.province, address: f.officeAddress,
      business: {
        company: f.company, vatNumber: f.vatNumber, fiscalCode: f.fiscalCode || undefined,
        pec: f.pec || undefined, reaNumber: f.reaNumber || undefined,
        officeAddress: f.officeAddress, city: f.city, zip: f.zip, province: f.province,
        sdccCertified: f.sdccCertified, documentsUploaded: f.docsUploaded,
      },
    });
    if (r.success) {
      setMsg({ type: 'success', text: r.message });
      setTimeout(() => { window.location.hash = 'dashboard'; }, 1400);
    } else {
      setMsg({ type: 'error', text: r.message });
    }
  };

  return (
    <AuthShell
      badge={{ text: 'BUSINESS · PARTNER INSTALLATORI', cls: 'bg-amber-500/15 text-amber-400 border border-amber-500/30' }}
      title="Registrazione Business"
      subtitle="Sei un'impresa di installazione HVAC? Acquista da AIRKLIM come distributore con listino B2B, fatturazione elettronica e visibilità nella nostra rete installatori."
    >
      <form onSubmit={submit} className="space-y-5">
        <FormMsg msg={msg} />
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Ragione sociale" required>
            <input className={inputCls} value={f.company} onChange={e => set('company', e.target.value)} placeholder="ClimaTech Solutions Srl" required />
          </Field>
          <Field label="Partita IVA" required>
            <input className={inputCls} value={f.vatNumber} onChange={e => set('vatNumber', e.target.value)} placeholder="IT12345678901" required />
            <p className="text-xs text-white/30 mt-1">11 cifre, eventualmente precedute da IT.</p>
          </Field>
          <Field label="Codice Fiscale">
            <input className={inputCls} value={f.fiscalCode} onChange={e => set('fiscalCode', e.target.value)} placeholder="Obbligatorio per ditte individuali" />
          </Field>
          <Field label="PEC">
            <input className={inputCls} type="email" value={f.pec} onChange={e => set('pec', e.target.value)} placeholder="azienda@pec.it" />
          </Field>
          <Field label="Numero REA">
            <input className={inputCls} value={f.reaNumber} onChange={e => set('reaNumber', e.target.value)} placeholder="PA-123456" />
          </Field>
          <Field label="Telefono aziendale">
            <input className={inputCls} value={f.phone} onChange={e => set('phone', e.target.value)} placeholder="+39 091 0000000" required />
          </Field>
        </div>

        <div className="border-t border-white/10 pt-5 grid md:grid-cols-2 gap-4">
          <Field label="Referente – Nome" required>
            <input className={inputCls} value={f.name} onChange={e => set('name', e.target.value)} required />
          </Field>
          <Field label="Referente – Cognome" required>
            <input className={inputCls} value={f.surname} onChange={e => set('surname', e.target.value)} required />
          </Field>
          <Field label="Email aziendale" required>
            <input className={inputCls} type="email" value={f.email} onChange={e => set('email', e.target.value)} required />
          </Field>
          <Field label="Sede operativa – Città" required>
            <input className={inputCls} value={f.city} onChange={e => set('city', e.target.value)} placeholder="Palermo" required />
          </Field>
          <Field label="Indirizzo sede">
            <input className={inputCls} value={f.officeAddress} onChange={e => set('officeAddress', e.target.value)} placeholder="Via Roma 1, CAP, Città (PA)" />
          </Field>
          <Field label="Provincia">
            <input className={inputCls} value={f.province} onChange={e => set('province', e.target.value)} placeholder="PA" maxLength={2} />
          </Field>
        </div>

        <div className="border-t border-white/10 pt-5 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Password" required>
              <input className={inputCls} type="password" value={f.password} onChange={e => set('password', e.target.value)} placeholder="Min. 8 caratteri, 1 maiuscola, 1 numero" required />
            </Field>
            <Field label="Conferma password" required>
              <input className={inputCls} type="password" value={f.confirm} onChange={e => set('confirm', e.target.value)} required />
            </Field>
          </div>
          <label className="flex items-start gap-3 text-sm text-white/70 cursor-pointer">
            <input type="checkbox" checked={f.sdccCertified} onChange={e => set('sdccCertified', e.target.checked)}
              className="mt-1 w-4 h-4 accent-amber-500" />
            Dichiaro che l'azienda possiede certificazione abilitazione D.M. 37/08 (lettera a/b/g) per installazione impianti termici.
          </label>
          <Field label="Documenti allegati (visura, certificato DM 37/08…)">
            <select className={inputCls} value={f.docsUploaded} onChange={e => set('docsUploaded', Number(e.target.value))}>
              <option value={0}>Nessun documento ora (verifica entro 48h)</option>
              <option value={1}>1 documento pronto</option>
              <option value={2}>2+ documenti pronti → verifica immediata</option>
            </select>
          </Field>
        </div>

        <button type="submit" className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-lg transition-all">
          Crea account Business →
        </button>
        <p className="text-center text-sm text-white/40">
          Hai già un account?{' '}
          <a href="#/login" className="text-sky-400 hover:underline">Accedi</a> ·{' '}
          Sei un cliente privato?{' '}
          <a href="#/signup-individual" className="text-sky-400 hover:underline">Signup Individual</a>
        </p>
      </form>
    </AuthShell>
  );
}

// ===== INDIVIDUAL SIGNUP =====
export function IndividualSignupPage() {
  const { register } = useAuth();
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [f, setF] = useState({ name: '', surname: '', email: '', phone: '', password: '', confirm: '', city: '', address: '' });
  const set = (k: string, v: string) => setF(p => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (f.password !== f.confirm) { setMsg({ type: 'error', text: 'Le due password non coincidono.' }); return; }
    const r = register({
      email: f.email, password: f.password, name: f.name, surname: f.surname,
      phone: f.phone || undefined, city: f.city || undefined, address: f.address || undefined,
      accountType: 'individual',
    });
    if (r.success) {
      setMsg({ type: 'success', text: r.message });
      setTimeout(() => { window.location.hash = 'dashboard'; }, 1200);
    } else setMsg({ type: 'error', text: r.message });
  };

  return (
    <AuthShell
      badge={{ text: 'INDIVIDUAL · CLIENTE PRIVATO', cls: 'bg-sky-500/15 text-sky-400 border border-sky-500/30' }}
      title="Registrazione Individual"
      subtitle="Crei un account personale: quando acquisti un climatizzatore, ti colleghiamo automaticamente al miglior installatore certificato della tua zona."
    >
      <form onSubmit={submit} className="space-y-5">
        <FormMsg msg={msg} />
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Nome" required><input className={inputCls} value={f.name} onChange={e => set('name', e.target.value)} required /></Field>
          <Field label="Cognome" required><input className={inputCls} value={f.surname} onChange={e => set('surname', e.target.value)} required /></Field>
          <Field label="Email" required><input className={inputCls} type="email" value={f.email} onChange={e => set('email', e.target.value)} required /></Field>
          <Field label="Telefono"><input className={inputCls} value={f.phone} onChange={e => set('phone', e.target.value)} placeholder="+39 333 0000000" /></Field>
          <Field label="Città di installazione" required>
            <input className={inputCls} value={f.city} onChange={e => set('city', e.target.value)} placeholder="Es. Palermo, Catania, Trapani…" required />
            <p className="text-xs text-white/30 mt-1">Usata per il matching automatico con l'installatore più vicino.</p>
          </Field>
          <Field label="Indirizzo (via, civico, CAP)">
            <input className={inputCls} value={f.address} onChange={e => set('address', e.target.value)} placeholder="Via Roma 10, 90100" />
          </Field>
          <Field label="Password" required>
            <input className={inputCls} type="password" value={f.password} onChange={e => set('password', e.target.value)} placeholder="Min. 8 caratteri, 1 maiuscola, 1 numero" required />
          </Field>
          <Field label="Conferma password" required>
            <input className={inputCls} type="password" value={f.confirm} onChange={e => set('confirm', e.target.value)} required />
          </Field>
        </div>
        <button type="submit" className="w-full py-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-lg transition-all">
          Crea account Individual →
        </button>
        <p className="text-center text-sm text-white/40">
          Hai già un account? <a href="#/login" className="text-sky-400 hover:underline">Accedi</a> ·{' '}
          Sei un installatore? <a href="#/signup-business" className="text-amber-400 hover:underline">Signup Business</a>
        </p>
      </form>
    </AuthShell>
  );
}

// ===== LOGIN (Business + Individual tabs) =====
export function LoginPage() {
  const { login } = useAuth();
  const [tab, setTab] = useState<'individual' | 'business'>('individual');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = login(email, password, tab);
    if (r.success) {
      setMsg({ type: 'success', text: r.message });
      setTimeout(() => { window.location.hash = 'dashboard'; }, 900);
    } else setMsg({ type: 'error', text: r.message });
  };

  return (
    <AuthShell
      badge={{ text: 'ACCESSO AREA RISERVATA', cls: 'bg-white/10 text-white/70 border border-white/20' }}
      title="Accedi ad AIRKLIM"
      subtitle="Scegli il tipo di account con cui hai registrato la tua attività o i tuoi dati personali."
    >
      <div className="grid grid-cols-2 gap-2 mb-6 p-1 rounded-xl bg-white/5 border border-white/10">
        <button onClick={() => setTab('individual')}
          className={`py-2.5 rounded-lg text-sm font-bold transition-all ${tab === 'individual' ? 'bg-sky-500 text-white' : 'text-white/50 hover:text-white'}`}>
          👤 Individual
        </button>
        <button onClick={() => setTab('business')}
          className={`py-2.5 rounded-lg text-sm font-bold transition-all ${tab === 'business' ? 'bg-amber-500 text-black' : 'text-white/50 hover:text-white'}`}>
          🏢 Business
        </button>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <FormMsg msg={msg} />
        <Field label="Email" required>
          <input className={inputCls} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </Field>
        <Field label="Password" required>
          <input className={inputCls} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </Field>
        <button type="submit" className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${tab === 'business' ? 'bg-amber-500 hover:bg-amber-400 text-black' : 'bg-sky-500 hover:bg-sky-400 text-white'}`}>
          Accedi come {tab === 'business' ? 'Business' : 'Individual'} →
        </button>
      </form>
      <div className="mt-6 pt-5 border-t border-white/10 grid md:grid-cols-2 gap-3 text-sm">
        <a href="#/signup-individual" className="text-center py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sky-400 border border-white/10 transition-all">
          Nuovo cliente privato? Registrati →
        </a>
        <a href="#/signup-business" className="text-center py-3 rounded-xl bg-white/5 hover:bg-white/10 text-amber-400 border border-white/10 transition-all">
          Sei un installatore? Signup Business →
        </a>
      </div>
    </AuthShell>
  );
}

// ===== DASHBOARD (role aware) =====
interface CustomerLink { customerId: string; installerId: string; orderId: string; createdAt: string }

function readLinks(): CustomerLink[] {
  try { return JSON.parse(localStorage.getItem('airklim-customer-installer-links') || '[]'); } catch { return []; }
}
function readAllUsers(): User[] {
  try { return JSON.parse(localStorage.getItem('airklim-users') || '[]').map((u: any) => ({ ...u })); } catch { return []; }
}

const statusLabel: Record<Order['status'], { t: string; c: string }> = {
  pending:   { t: 'In attesa',     c: 'bg-white/10 text-white/60' },
  confirmed: { t: 'Confermato',    c: 'bg-sky-500/15 text-sky-400' },
  processing:{ t: 'In lavorazione',c: 'bg-amber-500/15 text-amber-400' },
  shipped:   { t: 'Spedito',       c: 'bg-blue-500/15 text-blue-400' },
  delivered: { t: 'Consegnato',    c: 'bg-green-500/15 text-green-400' },
};

function OrderRow({ o, showCustomer }: { o: Order; showCustomer?: boolean }) {
  const st = statusLabel[o.status];
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-wrap items-center gap-3">
      <div className="flex-1 min-w-[180px]">
        <div className="font-bold text-white">{o.id}</div>
        <div className="text-xs text-white/40">{new Date(o.createdAt).toLocaleString('it-IT')}</div>
        {showCustomer && <div className="text-xs text-amber-400 mt-1">Cliente #{o.userId}</div>}
      </div>
      <div className="text-sm text-white/60">{o.items.reduce((s, i) => s + i.quantity, 0)} articoli · {o.items.map(i => i.name).join(', ').slice(0, 60)}</div>
      <div className="font-bold text-sky-400">€{o.total.toLocaleString('it-IT')}</div>
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${st.c}`}>{st.t}</span>
      {o.installer && <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400">🔧 {o.installer.name}</span>}
    </div>
  );
}

export function DashboardPage() {
  const { user, logout, updateProfile, publishAsInstaller } = useAuth();
  const { getUserOrders } = useOrders();
  const [tick, setTick] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 3000); // refresh simulated order statuses
    return () => clearInterval(id);
  }, []);

  if (!user) {
    return (
      <AuthShell badge={{ text: 'AREA RISERVATA', cls: 'bg-white/10 text-white/70 border border-white/20' }}
        title="Accedi richiesto" subtitle="Devi effettuare il login per vedere la tua dashboard.">
        <div className="grid md:grid-cols-2 gap-3">
          <a href="#/login" className="text-center py-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold transition-all">Accedi</a>
          <a href="#/signup-individual" className="text-center py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 transition-all">Registrati</a>
        </div>
      </AuthShell>
    );
  }

  void tick;
  const orders = getUserOrders(user.id);
  const isBiz = user.accountType === 'business';

  // ---- Business view data ----
  const links = readLinks();
  const myInstallerId = `inst-${user.id}`;
  const allUsers = readAllUsers();
  const assignedCustomers = links
    .filter(l => l.installerId === myInstallerId || l.installerId.startsWith('inst-airklim'))
    .map(l => ({ link: l, customer: allUsers.find(u => u.id === l.customerId) }))
    .filter(x => !!x.customer);
  const networkInstallers = getAllInstallers();
  const published = networkInstallers.some(i => i.id === myInstallerId);

  // ---- Individual view data ----
  const myInstaller = [...orders].reverse().find(o => o.installer)?.installer;
  const matches = matchInstallers(user.city || user.address || 'Palermo', 3);

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <header className="bg-slate-900 border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isBiz ? 'bg-amber-500 text-black' : 'bg-sky-500 text-white'}`}>
              {(isBiz ? user.business?.company?.[0] : user.name[0]) || 'A'}
            </span>
            <div>
              <div className="font-bold leading-tight">{isBiz ? user.business?.company : `${user.name} ${user.surname}`}</div>
              <div className={`text-xs font-semibold ${isBiz ? 'text-amber-400' : 'text-sky-400'}`}>
                {isBiz ? '🏢 ACCOUNT BUSINESS · LISTINO B2B' : '👤 ACCOUNT INDIVIDUAL'}
                {user.verified && <span className="ml-2 text-emerald-400">✓ Verificato</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="#/" className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm border border-white/10 transition-all">← Sito</a>
            <button onClick={() => { logout(); window.location.hash = ''; }}
              className="px-4 py-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm border border-red-500/20 transition-all">Esci</button>
          </div>
        </div>
      </header>

      {notice && (
        <div className="max-w-6xl mx-auto px-4 mt-4">
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">{notice}</div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* KPI row */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-white/10">
            <div className="text-3xl font-bold text-sky-400">{orders.length}</div>
            <div className="text-sm text-white/50">{isBiz ? 'Ordini B2B' : 'I miei ordini'}</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-white/10">
            <div className="text-3xl font-bold text-green-400">€{orders.reduce((s, o) => s + o.total, 0).toLocaleString('it-IT')}</div>
            <div className="text-sm text-white/50">Speso totale {isBiz ? '(senza IVA)' : ''}</div>
          </div>
          {isBiz ? (
            <>
              <div className="p-5 rounded-2xl bg-slate-900 border border-white/10">
                <div className="text-3xl font-bold text-amber-400">{assignedCustomers.length}</div>
                <div className="text-sm text-white/50">Clienti collegati</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900 border border-white/10">
                <div className="text-3xl font-bold text-white">{published ? '✓' : '—'}</div>
                <div className="text-sm text-white/50">Rete Installatori</div>
              </div>
            </>
          ) : (
            <>
              <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 col-span-1">
                <div className="text-lg font-bold text-emerald-400 truncate">{myInstaller ? myInstaller.name : 'Da assegnare'}</div>
                <div className="text-sm text-white/50">Il tuo installatore 🔧</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900 border border-white/10">
                <div className="text-3xl font-bold text-sky-400">{matches[0] ? `${matches[0].distanceKm.toFixed(0)} km` : '—'}</div>
                <div className="text-sm text-white/50">Distanza dal tecnico</div>
              </div>
            </>
          )}
        </section>

        {/* ORDERS */}
        <section>
          <h2 className="text-xl font-bold mb-4">{isBiz ? '📦 Ordini Business (spedizione alla sede)' : '📦 I miei ordini'}</h2>
          {orders.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900 border border-white/10 text-center">
              <p className="text-white/50 mb-4">Nessun ordine ancora. Esplora il catalogo completo!</p>
              <a href="#/#catalogo-completo" className="inline-block px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold transition-all">Vai al catalogo →</a>
            </div>
          ) : (
            <div className="space-y-3">{orders.map(o => <OrderRow key={o.id} o={o} />)}</div>
          )}
        </section>

        {/* BUSINESS: assigned customers */}
        {isBiz && (
          <section>
            <h2 className="text-xl font-bold mb-2">👥 Clienti privati collegati a te</h2>
            <p className="text-sm text-white/40 mb-4">
              Quando un cliente Individual acquista nella tua zona, AIRKLIM lo collega automaticamente al suo installatore. Qui vedi i tuoi lead assegnati.
            </p>
            {assignedCustomers.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900 border border-white/10 text-center text-white/50">
                Ancora nessun cliente assegnato. <button onClick={() => { publishAsInstaller(); setNotice('Pubblicato nella rete installatori! Ora puoi ricevere clienti dalla tua zona.'); setTimeout(() => setNotice(null), 4000); }}
                  className="text-amber-400 hover:underline font-semibold">Pubblicati nella rete →</button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {assignedCustomers.map(({ link, customer }) => (
                  <div key={link.orderId + link.customerId} className="p-5 rounded-2xl bg-slate-900 border border-amber-500/20">
                    <div className="font-bold text-white">{customer!.name} {customer!.surname}</div>
                    <div className="text-sm text-white/50">{customer!.city || 'Località non indicata'} · {customer!.email}</div>
                    {customer!.phone && <div className="text-sm text-sky-400">{customer!.phone}</div>}
                    <div className="text-xs text-white/30 mt-2">Collegato il {new Date(link.createdAt).toLocaleDateString('it-IT')} · Ordine {link.orderId}</div>
                    <a href={`tel:${(customer!.phone || '').replace(/\s/g, '')}`} className="inline-block mt-3 px-4 py-2 rounded-lg bg-amber-500/15 text-amber-400 text-sm font-semibold hover:bg-amber-500/25 transition-all">Chiama il cliente</a>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* BUSINESS: documents & profile */}
        {isBiz && (
          <section className="grid md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-slate-900 border border-white/10">
              <h3 className="font-bold mb-3">📄 Documenti aziendali</h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li>P.IVA: <span className="text-white font-mono">{user.business?.vatNumber}</span></li>
                <li>C.F.: <span className="text-white font-mono">{user.business?.fiscalCode || 'non inserito'}</span></li>
                <li>PEC: <span className="text-white font-mono">{user.business?.pec || 'non inserita'}</span></li>
                <li>REA: <span className="text-white font-mono">{user.business?.reaNumber || 'non inserito'}</span></li>
                <li>Certificazione DM 37/08: <span className={user.business?.sdccCertified ? 'text-emerald-400' : 'text-red-400'}>{user.business?.sdccCertified ? '✓ dichiarata' : 'non dichiarata'}</span></li>
                <li>Documenti caricati: <span className="text-white">{user.business?.documentsUploaded ?? 0}</span></li>
              </ul>
              <div className={`mt-4 p-3 rounded-lg text-sm ${user.verified ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                {user.verified ? '✓ Account verificato: accesso completo al listino B2B.' : '⏳ Verifica in corso: completa il caricamento documenti per essere abilitato agli ordini B2B.'}
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-white/10">
              <h3 className="font-bold mb-3">🚀 Visibilità nella rete installatori</h3>
              <p className="text-sm text-white/50 mb-4">
                Pubblicando la tua attività nella rete, i clienti Individual della tua zona verranno collegati automaticamente a te quando acquistano sul sito.
              </p>
              <div className="text-sm text-white/60 mb-4">Stato attuale: <span className={published ? 'text-emerald-400 font-bold' : 'text-white/40'}>{published ? '✓ Pubblicato' : 'Non pubblicato'}</span></div>
              {!published && (
                <button onClick={() => { publishAsInstaller(); setNotice('Sei visibile nella rete installatori AIRKLIM!'); setTimeout(() => setNotice(null), 4000); }}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-all">
                  Pubblicati nella rete installatori
                </button>
              )}
            </div>
          </section>
        )}

        {/* INDIVIDUAL: linked installer */}
        {!isBiz && (
          <section>
            <h2 className="text-xl font-bold mb-2">🔧 Il tuo installatore di zona</h2>
            <p className="text-sm text-white/40 mb-4">Collegato automaticamente in base alla tua località ({user.city || 'Palermo'}). Puoi anche contattare uno dei tecnici consigliati qui sotto.</p>
            {myInstaller ? (
              <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/30 mb-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-2xl">🔧</div>
                  <div className="flex-1 min-w-[200px]">
                    <div className="font-bold text-lg text-white">{myInstaller.name}</div>
                    <div className="text-sm text-white/50">{myInstaller.city} · a ~{myInstaller.distanceKm.toFixed(1)} km da te {myInstaller.certified && <span className="text-emerald-400 font-semibold">✓ Certificato</span>}</div>
                  </div>
                  <a href={`tel:${myInstaller.phone.replace(/\s/g, '')}`} className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-all">{myInstaller.phone}</a>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 mb-4 text-white/50">
                Al primo acquisto verrà assegnato automaticamente il miglior installatore certificato della tua zona.
              </div>
            )}
            <div className="grid md:grid-cols-3 gap-4">
              {matches.map(m => (
                <div key={m.installer.id} className="p-5 rounded-2xl bg-slate-900 border border-white/10">
                  <div className="font-bold text-white">{m.installer.name}</div>
                  <div className="text-sm text-white/50">{m.installer.city} · ★ {m.installer.rating} · {m.distanceKm.toFixed(0)} km</div>
                  <div className="text-xs text-white/30 mt-1">{m.installer.specialties.join(' · ')}</div>
                  <a href={`tel:${m.installer.phone.replace(/\s/g, '')}`} className="inline-block mt-3 text-sky-400 text-sm font-semibold hover:underline">{m.installer.phone}</a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Profile edit (both) */}
        <ProfileEditor user={user} onSave={(patch) => { updateProfile(patch); setNotice('Profilo aggiornato.'); setTimeout(() => setNotice(null), 3000); }} />
      </main>
    </div>
  );
}

function ProfileEditor({ user, onSave }: { user: User; onSave: (p: Partial<User>) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [surname, setSurname] = useState(user.surname);
  const [phone, setPhone] = useState(user.phone || '');
  const [city, setCity] = useState(user.city || '');
  const [address, setAddress] = useState(user.address || '');

  return (
    <section className="rounded-2xl bg-slate-900 border border-white/10 overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full px-6 py-4 flex items-center justify-between font-bold hover:bg-white/5 transition-all">
        ⚙️ Modifica profilo <span className="text-white/40">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-6 pb-6 grid md:grid-cols-2 gap-4">
          <Field label="Nome"><input className={inputCls} value={name} onChange={e => setName(e.target.value)} /></Field>
          <Field label="Cognome"><input className={inputCls} value={surname} onChange={e => setSurname(e.target.value)} /></Field>
          <Field label="Telefono"><input className={inputCls} value={phone} onChange={e => setPhone(e.target.value)} /></Field>
          <Field label="Città"><input className={inputCls} value={city} onChange={e => setCity(e.target.value)} /></Field>
          <div className="md:col-span-2"><Field label="Indirizzo"><input className={inputCls} value={address} onChange={e => setAddress(e.target.value)} /></Field></div>
          <button onClick={() => onSave({ name, surname, phone, city, address })}
            className="md:col-span-2 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold transition-all">Salva modifiche</button>
        </div>
      )}
    </section>
  );
}
