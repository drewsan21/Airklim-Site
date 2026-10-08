/**
 * AIRKLIM Dual-Audience Authentication Pages
 * - Individual: regular customers (privati). On purchase they are automatically
 *   matched & linked with the best nearby installer from the partner network.
 * - Business: HVAC installers / companies that buy from us as distributor.
 *   Full B2B onboarding: VAT check, SDI code (e-fattura), document upload,
 *   tier discounts, "join as installer" option.
 */
import { useState } from 'react';
import { signup, signin, useStore, currentUser, AccountType, StoredUser } from './store';

const inputCls = 'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none transition-colors';
const labelCls = 'block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5';

function Field(props: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className={labelCls}>{props.label}{props.required && <span className="text-sky-400"> *</span>}</label>
      {props.children}
      {props.hint && <p className="text-[11px] text-white/30 mt-1">{props.hint}</p>}
    </div>
  );
}

function Msg({ m }: { m: { type: 'ok' | 'err'; text: string } | null }) {
  if (!m) return null;
  return (
    <div className={`p-3 rounded-lg text-sm ${m.type === 'ok' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
      {m.text}
    </div>
  );
}

// ===== INDIVIDUAL SIGNUP =====
export function IndividualSignupPage({ onSuccess, onSwitchToLogin, onSwitchToBusiness }: {
  onSuccess: () => void; onSwitchToLogin: () => void; onSwitchToBusiness: () => void;
}) {
  const [f, setF] = useState({ name: '', surname: '', email: '', password: '', phone: '', city: '', address: '' });
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (f.password.length < 6) { setMsg({ type: 'err', text: 'Password: minimo 6 caratteri.' }); return; }
    const r = signup({ ...f, accountType: 'individual' });
    setMsg({ type: r.ok ? 'ok' : 'err', text: r.message });
    if (r.ok) setTimeout(onSuccess, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-sky-950 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <button onClick={onSwitchToBusiness} className="mb-4 text-sm text-amber-400 hover:text-amber-300">🏢 Sei un'azienda / installatore? Registrati come Business →</button>
        <div className="bg-slate-900/80 backdrop-blur rounded-2xl border border-sky-500/20 p-8 shadow-2xl shadow-sky-500/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-sky-500 flex items-center justify-center text-2xl">🏠</div>
            <div>
              <h1 className="text-2xl font-bold text-white">Crea Account Individual</h1>
              <p className="text-white/50 text-sm">Clienti privati • Installatore abbinato automaticamente</p>
            </div>
          </div>
          <Msg m={msg} />
          <form onSubmit={submit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nome" required><input className={inputCls} required value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></Field>
              <Field label="Cognome" required><input className={inputCls} required value={f.surname} onChange={e => setF({ ...f, surname: e.target.value })} /></Field>
            </div>
            <Field label="Email" required><input type="email" className={inputCls} required value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></Field>
            <Field label="Password" required hint="Minimo 6 caratteri"><input type="password" className={inputCls} required minLength={6} value={f.password} onChange={e => setF({ ...f, password: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Telefono"><input type="tel" className={inputCls} value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} /></Field>
              <Field label="Città"><input className={inputCls} placeholder="es. Palermo" value={f.city} onChange={e => setF({ ...f, city: e.target.value })} /></Field>
            </div>
            <Field label="Indirizzo di installazione" hint="Usato per collegarti automaticamente all'installatore più vicino alla tua zona.">
              <input className={inputCls} placeholder="Via, CAP, Città" value={f.address} onChange={e => setF({ ...f, address: e.target.value })} />
            </Field>
            <button type="submit" className="w-full px-6 py-3.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-sky-500/25">
              Crea il mio account 🚀
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-white/50">
            Hai già un account? <button onClick={onSwitchToLogin} className="text-sky-400 hover:underline font-semibold">Accedi</button>
          </p>
        </div>
        <div className="mt-4 text-center text-xs text-white/30">
          🔒 I tuoi dati restano sul dispositivo in questa demo. In produzione: backend JWT + PostgreSQL.
        </div>
      </div>
    </div>
  );
}

// ===== BUSINESS SIGNUP =====
export function BusinessSignupPage({ onSuccess, onSwitchToLogin, onSwitchToIndividual }: {
  onSuccess: () => void; onSwitchToLogin: () => void; onSwitchToIndividual: () => void;
}) {
  const [f, setF] = useState({
    name: '', surname: '', email: '', password: '', phone: '',
    company: '', vatNumber: '', sdiCode: '', pec: '', city: '', address: '',
    isInstaller: false, acceptTerms: false,
  });
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.acceptTerms) { setMsg({ type: 'err', text: 'Devi accettare i Termini B2B e la privacy policy.' }); return; }
    if (f.password.length < 6) { setMsg({ type: 'err', text: 'Password: minimo 6 caratteri.' }); return; }
    const r = signup({ ...f, accountType: 'business' });
    setMsg({ type: r.ok ? 'ok' : 'err', text: r.message });
    if (r.ok) setTimeout(onSuccess, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-amber-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <button onClick={onSwitchToIndividual} className="mb-4 text-sm text-sky-400 hover:text-sky-300">🏠 Sei un cliente privato? Registrati come Individual →</button>
        <div className="bg-slate-900/80 backdrop-blur rounded-2xl border border-amber-500/20 p-8 shadow-2xl shadow-amber-500/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-2xl">🏢</div>
            <div>
              <h1 className="text-2xl font-bold text-white">Registrazione Business</h1>
              <p className="text-white/50 text-sm">Rivenditori &amp; Installatori HVAC • Prezzi listino + sconti a scaglioni</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-6 text-[11px]">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">Sconti fino al 22%</span>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">Fatturazione elettronica SdI</span>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">Quote builder PDF</span>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">Stock in tempo reale</span>
          </div>
          <Msg m={msg} />
          <form onSubmit={submit} className="space-y-4 mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Ragione sociale" required><input className={inputCls} required placeholder="es. Verdi Clima Srl" value={f.company} onChange={e => setF({ ...f, company: e.target.value })} /></Field>
              <Field label="P.IVA (11 cifre)" required hint="Verificata dal nostro back-office insieme ai documenti.">
                <input className={inputCls} required inputMode="numeric" maxLength={11} pattern="\d{11}" placeholder="12345678901" value={f.vatNumber} onChange={e => setF({ ...f, vatNumber: e.target.value.replace(/\D/g, '') })} />
              </Field>
              <Field label="Referente - Nome" required><input className={inputCls} required value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></Field>
              <Field label="Referente - Cognome" required><input className={inputCls} required value={f.surname} onChange={e => setF({ ...f, surname: e.target.value })} /></Field>
              <Field label="Email aziendale" required><input type="email" className={inputCls} required value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></Field>
              <Field label="Password" required hint="Minimo 6 caratteri"><input type="password" className={inputCls} required minLength={6} value={f.password} onChange={e => setF({ ...f, password: e.target.value })} /></Field>
              <Field label="Telefono"><input type="tel" className={inputCls} value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} /></Field>
              <Field label="Città / Sede"><input className={inputCls} placeholder="es. Catania" value={f.city} onChange={e => setF({ ...f, city: e.target.value })} /></Field>
              <Field label="Codice Destinatario SDI" hint="Per la ricezione delle fatture elettroniche (7 caratteri, oppure M5UXCR1 per PEC genericа — usa il tuo).">
                <input className={inputCls} maxLength={7} placeholder="es. K9THZJA" value={f.sdiCode} onChange={e => setF({ ...f, sdiCode: e.target.value.toUpperCase() })} />
              </Field>
              <Field label="PEC"><input type="email" className={inputCls} placeholder="azienda@pec.it" value={f.pec} onChange={e => setF({ ...f, pec: e.target.value })} /></Field>
            </div>
            <Field label="Indirizzo sede operativa"><input className={inputCls} placeholder="Via, CAP, Città" value={f.address} onChange={e => setF({ ...f, address: e.target.value })} /></Field>
            <label className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:border-amber-500/40 transition-colors">
              <input type="checkbox" checked={f.isInstaller} onChange={e => setF({ ...f, isInstaller: e.target.checked })} className="mt-1 accent-amber-500" />
              <span className="text-sm text-white/70">
                <b className="text-white">Voglio entrare nella rete Installatori AIRKLIM</b><br />
                Diventa il tecnico di zona per i clienti privati: riceverai richieste di installazione abbinate per vicinanza (richiesta Certificazione F-Gas).
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm text-white/60">
              <input type="checkbox" required checked={f.acceptTerms} onChange={e => setF({ ...f, acceptTerms: e.target.checked })} className="mt-1 accent-amber-500" />
              <span>Accetto i <b>Termini B2B</b>, la fornitura dati per la <b>fatturazione elettronica</b> e la verifica dei documenti aziendali (Visura, DUVRI, F-Gas).</span>
            </label>
            <button type="submit" className="w-full px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-bold transition-all shadow-lg shadow-amber-500/25">
              Invia registrazione Business 📄
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-white/50">
            Azienda già registrata? <button onClick={onSwitchToLogin} className="text-amber-400 hover:underline font-semibold">Accedi qui</button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ===== LOGIN PAGE (tabbed: Individual / Business) =====
export function LoginPage({ defaultTab, onSwitchTab, onBackHome, onRegistered }: {
  defaultTab: AccountType; onSwitchTab: (t: AccountType) => void; onBackHome: () => void; onRegistered: () => void;
}) {
  const [tab, setTab] = useState<AccountType>(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const usersCount = useStore(s => s.users.length);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = signin(email, password, tab);
    setMsg({ type: r.ok ? 'ok' : 'err', text: r.message });
    if (r.ok) setTimeout(() => { window.location.hash = r.user?.accountType === 'business' ? '#business' : '#account'; }, 800);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-br ${tab === 'business' ? 'from-slate-950 via-black to-amber-950' : 'from-slate-950 via-black to-sky-950'}`}>
      <div className="max-w-md w-full">
        <div className="bg-slate-900/80 backdrop-blur rounded-2xl border border-white/10 p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-1">Accedi ad AIRKLIM</h1>
          <p className="text-white/50 text-sm mb-6">Scegli il tipo di account per continuare</p>
          <div className="grid grid-cols-2 gap-2 mb-6">
            <button type="button" onClick={() => { setTab('individual'); onSwitchTab('individual'); }}
              className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${tab === 'individual' ? 'bg-sky-500 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
              🏠 Individual
            </button>
            <button type="button" onClick={() => { setTab('business'); onSwitchTab('business'); }}
              className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${tab === 'business' ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
              🏢 Business
            </button>
          </div>
          <Msg m={msg} />
          <form onSubmit={submit} className="space-y-4 mt-4">
            <Field label="Email" required><input type="email" className={inputCls} required value={email} onChange={e => setEmail(e.target.value)} /></Field>
            <Field label="Password" required><input type="password" className={inputCls} required value={password} onChange={e => setPassword(e.target.value)} /></Field>
            <button type="submit" className={`w-full px-6 py-3.5 rounded-xl font-bold transition-all ${tab === 'business' ? 'bg-amber-500 hover:bg-amber-400 text-black' : 'bg-sky-500 hover:bg-sky-400 text-white'}`}>
              Accedi come {tab === 'business' ? 'Business' : 'Individual'}
            </button>
          </form>
          <div className="mt-5 flex items-center justify-between text-sm">
            <button onClick={onBackHome} className="text-white/40 hover:text-white">← Torna al sito</button>
            <button onClick={onRegistered} className="text-sky-400 hover:underline font-semibold">Registrati</button>
          </div>
          {usersCount <= 3 && (
            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white/50 space-y-1">
              <p className="font-bold text-white/70">Account demo:</p>
              <p>🏠 Individual: <code className="text-sky-300">demo@airklim.it</code> / <code>demo123</code></p>
              <p>🏢 Business: <code className="text-amber-300">business@airklim.it</code> / <code>business123</code></p>
              <p>🔧 Installatore: <code className="text-amber-300">installer@airklim.it</code> / <code>installer123</code></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== Small shared badge for logged-in user =====
export function AccountBadge({ user }: { user: StoredUser }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${user.accountType === 'business' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'}`}>
      {user.accountType === 'business' ? (user.isInstaller ? 'INSTALLER PRO' : `BUSINESS • ${(user.tier ?? 'bronze').toUpperCase()}`) : 'INDIVIDUAL'}
    </span>
  );
}

export { currentUser };
