/**
 * AIRKLIM Business Dashboard
 * Area riservata per aziende/instllatori HVAC che acquistano dal distributore:
 * - Panoramica con sconti tier & spesa annua
 * - Ordini + fatture elettroniche (SdI)
 * - Quote Builder con esportazione PDF (pdf-lib)
 * - Pianificazione manutenzioni con riordino automatico filtri
 * - Gestione documenti (Visura/DUVRI/F-Gas) per verifica B2B
 * - Ricevitore richieste installazione (per account isInstaller) da clienti Individual
 */
import { useMemo, useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import {
  useStore, signout, StoredUser, Order, Quote, MaintenanceTicket,
  saveQuote, updateQuote, addMaintenance, updateMaintenance, uploadDocument,
  acceptInstallerJob, advanceOrder, tierDiscount,
} from './store';
import { AccountBadge } from './AuthPages';

const card = 'bg-white/[0.03] rounded-2xl border border-white/10 p-6';
const btnAmber = 'px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-semibold text-sm transition-all';
const btnGhost = 'px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold text-sm transition-all';
const inputCls = 'w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500 outline-none text-sm';

type Tab = 'overview' | 'orders' | 'quotes' | 'maintenance' | 'jobs' | 'documents' | 'profile';

export function BusinessDashboard({ user }: { user: StoredUser }) {
  const [tab, setTab] = useState<Tab>('overview');
  const orders = useStore(s => s.orders).filter(o => o.userId === user.id);
  const quotes = useStore(s => s.quotes).filter(q => q.businessId === user.id);
  const maintenance = useStore(s => s.maintenance).filter(m => m.businessId === user.id);
  const docs = useStore(s => s.documents).filter(d => d.businessId === user.id);
  // Installer job feed: ordini di clienti individuali assegnati a questo installatore
  const allOrders = useStore(s => s.orders);
  const jobs = user.isInstaller
    ? allOrders.filter(o => o.installer && (o.installer.installerEmail === user.email || o.installer.installerName === `${user.name} ${user.surname}`))
    : [];

  const tabs: { id: Tab; label: string; icon: string; badge?: number }[] = [
    { id: 'overview', label: 'Panoramica', icon: '📊' },
    { id: 'orders', label: 'Ordini & Fatture', icon: '📦', badge: orders.length },
    { id: 'quotes', label: 'Preventivi', icon: '📝', badge: quotes.length },
    { id: 'maintenance', label: 'Manutenzioni', icon: '🗓️', badge: maintenance.length },
    ...(user.isInstaller ? [{ id: 'jobs' as Tab, label: 'Richieste Installazioni', icon: '🔧', badge: jobs.filter(j => j.installer?.status === 'assigned').length }] : []),
    { id: 'documents', label: 'Documenti', icon: '📄' },
    { id: 'profile', label: 'Profilo', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-black/60 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-xl">🏢</div>
            <div>
              <div className="font-bold">{user.company || `${user.name} ${user.surname}`} <span className="text-white/30 text-sm ml-2">Partner {user.installersCode}</span></div>
              <div className="flex items-center gap-2 text-xs text-white/50"><AccountBadge user={user} /> {!user.verified && <span className="text-red-400">● Verifica documenti in sospeso</span>}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { window.location.hash = ''; }} className={btnGhost}>Vai al catalogo →</button>
            <button onClick={() => { signout(); window.location.hash = ''; }} className={btnGhost}>Esci</button>
          </div>
        </div>
      </header>

      <nav className="max-w-7xl mx-auto px-4 pt-6 flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t.id ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
            {t.icon} {t.label}
            {!!t.badge && <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${tab === t.id ? 'bg-black/20' : 'bg-amber-500/30 text-amber-300'}`}>{t.badge}</span>}
          </button>
        ))}
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {tab === 'overview' && <OverviewTab user={user} orders={orders} quotes={quotes} docs={docs} />}
        {tab === 'orders' && <OrdersTab orders={orders} />}
        {tab === 'quotes' && <QuotesTab user={user} quotes={quotes} />}
        {tab === 'maintenance' && <MaintenanceTab user={user} tickets={maintenance} />}
        {tab === 'jobs' && <InstallerJobsTab jobs={jobs} />}
        {tab === 'documents' && <DocumentsTab user={user} docs={docs} />}
        {tab === 'profile' && <ProfileTab user={user} />}
      </main>
    </div>
  );
}

// ===== OVERVIEW =====
function OverviewTab({ user, orders, quotes, docs }: { user: StoredUser; orders: Order[]; quotes: Quote[]; docs: any[] }) {
  const spend = orders.reduce((s, o) => s + o.total, 0);
  const disc = tierDiscount(user.tier);
  const nextTier = spend < 5000 ? { t: 'SILVER', at: 5000, d: 8 } : spend < 20000 ? { t: 'GOLD', at: 20000, d: 15 } : spend < 50000 ? { t: 'PLATINUM', at: 50000, d: 22 } : null;
  const pendingDocs = docs.filter(d => d.status === 'pending').length;
  return (
    <div className="grid md:grid-cols-4 gap-4">
      <Stat label="Spesa Annuaria" value={`€ ${spend.toLocaleString('it-IT', { maximumFractionDigits: 0 })}`} sub={`${orders.length} ordini`} color="text-amber-400" />
      <Stat label="Sconto Attivo" value={`${disc}%`} sub={`Tier ${(user.tier ?? 'bronze').toUpperCase()}`} color="text-green-400" />
      <Stat label="Preventivi" value={String(quotes.length)} sub={`${quotes.filter(q => q.status === 'sent').length} inviati`} color="text-sky-400" />
      <Stat label="Documenti" value={user.verified ? 'Verificati ✓' : `${pendingDocs} da verificare`} sub={user.verified ? 'Account B2B attivo' : 'Carica Visura, DUVRI, F-Gas'} color={user.verified ? 'text-green-400' : 'text-red-400'} />
      {nextTier && (
        <div className="md:col-span-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 text-sm text-white/70">
          🚀 Ti mancano <b className="text-amber-300">€ {(nextTier.at - spend).toLocaleString('it-IT', { maximumFractionDigits: 0 })}</b> per salire al tier <b className="text-amber-300">{nextTier.t}</b> e ottenere uno sconto del <b>{nextTier.d}%</b> su tutto il listino.
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className={card}>
      <div className="text-xs uppercase tracking-wider text-white/40 mb-2">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-white/40 mt-1">{sub}</div>
    </div>
  );
}

// ===== ORDERS + E-INVOICING =====
function OrdersTab({ orders }: { orders: Order[] }) {
  const statusCls = (s: Order['status']) => ({
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    processing: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    shipped: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
  }[s]);
  if (!orders.length) return <Empty icon="📦" text="Nessun ordine. Acquista dal catalogo per vedere qui ordini e fatture." />;
  return (
    <div className="space-y-4">
      {orders.map(o => (
        <div key={o.id} className={card}>
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div>
              <span className="font-bold">{o.id}</span>
              <span className="text-white/40 text-sm ml-3">{new Date(o.createdAt).toLocaleDateString('it-IT')}</span>
              {o.invoiceNumber && <span className="ml-3 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono">🧾 {o.invoiceNumber} • inviata al SdI</span>}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusCls(o.status)}`}>{o.status.toUpperCase()}</span>
          </div>
          <div className="text-sm text-white/60 space-y-1">
            {o.lines.map(l => <div key={l.productId} className="flex justify-between"><span>{l.qty}× {l.name}</span><span>€ {(l.price * l.qty).toFixed(2)}</span></div>)}
          </div>
          <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center text-sm">
            <span className="text-white/40">Sconto applicato: € {o.discount.toFixed(2)}</span>
            <span className="font-bold text-amber-400 text-lg">€ {o.total.toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ===== QUOTE BUILDER + PDF =====
function QuotesTab({ user, quotes }: { user: StoredUser; quotes: Quote[] }) {
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [lines, setLines] = useState<{ name: string; qty: number; unitPrice: number }[]>([{ name: '', qty: 1, unitPrice: 0 }]);
  const [installationFee, setInstallationFee] = useState(350);
  const [vatPct, setVatPct] = useState(22);
  const total = useMemo(() => lines.reduce((s, l) => s + l.qty * l.unitPrice, 0) + installationFee, [lines, installationFee]);

  const addPdf = async (q: Quote, includeVat: boolean) => {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    let page = pdfDoc.addPage([595, 842]);
    const { height } = page.getSize();
    let y = height - 60;
    const draw = (t: string, size = 11, f = font, x = 50, col = rgb(0.1, 0.1, 0.1)) => { page.drawText(t, { x, y, size, font: f, color: col }); y -= size + 6; };
    draw('AIRKLIM DISTRIBUTORE HVAC', 18, bold, 50, rgb(0, 0.4, 0.7));
    draw(`Preventivo ${q.id}`, 14, bold);
    draw(`Data: ${new Date(q.createdAt).toLocaleDateString('it-IT')}   Valido fino: ${new Date(q.validUntil).toLocaleDateString('it-IT')}`, 10);
    y -= 8;
    draw(`Cliente: ${q.clientName}`, 11, bold);
    draw(`Indirizzo: ${q.clientAddress}`, 10);
    draw(`Emesso da: ${q.businessName} (P.IVA ${user.vatNumber})`, 10);
    y -= 10;
    draw('ARTICOLO                                    QTA      PREZZO', 10, bold, 50, rgb(0.4, 0.4, 0.4));
    for (const l of q.lines) {
      draw(`${(l.name + '                              ').slice(0, 40)} ${String(l.qty).padStart(3)}   € ${(l.qty * l.unitPrice).toFixed(2).padStart(10)}`, 10, font, 50);
    }
    draw(`Installazione: € ${q.installationFee.toFixed(2)}`, 10, font, 50);
    y -= 6;
    draw(`TOTALE: € ${q.total.toFixed(2)}${includeVat ? ` + IVA ${vatPct}% = € ${(q.total * (1 + vatPct / 100)).toFixed(2)}` : ' (IVA esclusa)'}`, 13, bold, 50, rgb(0, 0.4, 0.7));
    y -= 20;
    draw('AIRKLIM S.r.l. - Via Libertà 100, Palermo - P.IVA 00000000000 - support@airklim.it', 8, font, 50, rgb(0.5, 0.5, 0.5));
    void page;
    const bytes = await pdfDoc.save();
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `preventivo-${q.id}.pdf`; a.click();
    URL.revokeObjectURL(url);
  };

  const createQuote = () => {
    const valid = lines.filter(l => l.name.trim() && l.unitPrice > 0);
    if (!clientName || !valid.length) return alert('Compila nome cliente e almeno una riga valida.');
    const q = saveQuote({
      businessId: user.id, businessName: user.company || `${user.name} ${user.surname}`,
      clientName, clientAddress, lines: valid, installationFee,
      total: Math.round((valid.reduce((s, l) => s + l.qty * l.unitPrice, 0) + installationFee) * 100) / 100,
      validUntil: new Date(Date.now() + 30 * 864e5).toISOString(),
    });
    void addPdf(q, false);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className={card}>
        <h3 className="font-bold text-lg mb-4">🛠️ Nuovo Preventivo (Quote Builder)</h3>
        <div className="space-y-3">
          <input className={inputCls} placeholder="Nome cliente finale *" value={clientName} onChange={e => setClientName(e.target.value)} />
          <input className={inputCls} placeholder="Indirizzo installazione" value={clientAddress} onChange={e => setClientAddress(e.target.value)} />
          {lines.map((l, i) => (
            <div key={i} className="flex gap-2">
              <input className={`${inputCls} flex-[2]`} placeholder="Prodotto / lavoro" value={l.name} onChange={e => setLines(lines.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
              <input className={`${inputCls} w-16`} type="number" min={1} value={l.qty} onChange={e => setLines(lines.map((x, j) => j === i ? { ...x, qty: +e.target.value || 1 } : x))} />
              <input className={`${inputCls} w-24`} type="number" min={0} placeholder="€ cad." value={l.unitPrice || ''} onChange={e => setLines(lines.map((x, j) => j === i ? { ...x, unitPrice: +e.target.value || 0 } : x))} />
              <button onClick={() => setLines(lines.filter((_, j) => j !== i))} className="text-red-400 px-2">✕</button>
            </div>
          ))}
          <button onClick={() => setLines([...lines, { name: '', qty: 1, unitPrice: 0 }])} className={btnGhost}>+ Aggiungi riga</button>
          <div className="grid grid-cols-3 gap-3">
            <label className="text-xs text-white/50">Costo installazione €<input className={inputCls} type="number" value={installationFee} onChange={e => setInstallationFee(+e.target.value || 0)} /></label>
            <label className="text-xs text-white/50">IVA %<input className={inputCls} type="number" value={vatPct} onChange={e => setVatPct(+e.target.value || 0)} /></label>
            <div className="flex items-end font-bold text-amber-400">€ {total.toFixed(2)}</div>
          </div>
          <button onClick={createQuote} className={btnAmber}>💾 Salva & Scarica PDF</button>
        </div>
      </div>
      <div className={card}>
        <h3 className="font-bold text-lg mb-4">📋 Preventivi ({quotes.length})</h3>
        {!quotes.length ? <p className="text-white/40 text-sm">Nessun preventivo salvato.</p> : (
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {quotes.map(q => (
              <div key={q.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-sm">{q.clientName} <span className="text-white/30 font-mono text-xs ml-2">{q.id}</span></div>
                    <div className="text-xs text-white/40">{q.lines.length} righe • valido fino al {new Date(q.validUntil).toLocaleDateString('it-IT')}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-amber-400">€ {q.total.toFixed(2)}</div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${q.status === 'converted' ? 'bg-green-500/20 text-green-300' : q.status === 'accepted' ? 'bg-sky-500/20 text-sky-300' : 'bg-white/10 text-white/50'}`}>{q.status}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => addPdf(q, true)} className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20">PDF con IVA</button>
                  <button onClick={() => updateQuote(q.id, { status: q.status === 'sent' ? 'accepted' : 'sent' })} className="text-xs px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30">{q.status === 'sent' ? 'Segna accettato' : 'Simula invio'}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== MAINTENANCE SCHEDULER =====
function MaintenanceTab({ user, tickets }: { user: StoredUser; tickets: MaintenanceTicket[] }) {
  const [f, setF] = useState({ customerName: '', customerAddress: '', serviceType: 'annual-check' as MaintenanceTicket['serviceType'], scheduledFor: '', autoReorderFilters: true, notes: '' });
  const labels: Record<MaintenanceTicket['serviceType'], string> = {
    'filter-replacement': 'Sostituzione filtri', 'annual-check': 'Controllo annuale', 'sanitization': 'Sanificazione', 'repair': 'Riparazione',
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.customerName || !f.scheduledFor) return;
    addMaintenance({ ...f, businessId: user.id });
    setF({ ...f, customerName: '', customerAddress: '', scheduledFor: '', notes: '' });
  };
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <form onSubmit={submit} className={card}>
        <h3 className="font-bold text-lg mb-4">🗓️ Pianifica Intervento</h3>
        <div className="space-y-3">
          <input className={inputCls} placeholder="Cliente finale *" value={f.customerName} onChange={e => setF({ ...f, customerName: e.target.value })} required />
          <input className={inputCls} placeholder="Indirizzo impianto" value={f.customerAddress} onChange={e => setF({ ...f, customerAddress: e.target.value })} />
          <select className={inputCls} value={f.serviceType} onChange={e => setF({ ...f, serviceType: e.target.value as MaintenanceTicket['serviceType'] })}>
            {Object.entries(labels).map(([k, v]) => <option key={k} value={k} className="bg-slate-900">{v}</option>)}
          </select>
          <input type="date" className={inputCls} value={f.scheduledFor} onChange={e => setF({ ...f, scheduledFor: e.target.value })} required />
          <textarea className={inputCls} placeholder="Note (modello impianto, accessi...)" rows={2} value={f.notes} onChange={e => setF({ ...f, notes: e.target.value })} />
          <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
            <input type="checkbox" checked={f.autoReorderFilters} onChange={e => setF({ ...f, autoReorderFilters: e.target.checked })} className="accent-amber-500" />
            Riordino automatico filtri 30 giorni prima dell\'intervento
          </label>
          <button className={btnAmber}>Aggiungi al calendario</button>
        </div>
      </form>
      <div className={card}>
        <h3 className="font-bold text-lg mb-4">Prossimi interventi ({tickets.length})</h3>
        {!tickets.length ? <p className="text-white/40 text-sm">Nessun intervento programmato.</p> : (
          <div className="space-y-3">
            {[...tickets].sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor)).map(t => (
              <div key={t.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-sm">{t.customerName} — {labels[t.serviceType]}</div>
                  <div className="text-xs text-white/40">{new Date(t.scheduledFor).toLocaleDateString('it-IT')} {t.customerAddress && `• ${t.customerAddress}`}</div>
                  {t.autoReorderFilters && <div className="text-[11px] text-emerald-400 mt-1">♻️ Ordine filtri previsto automaticamente</div>}
                </div>
                <div className="flex gap-2">
                  {t.status === 'scheduled' && <button onClick={() => updateMaintenance(t.id, { status: 'done' })} className="text-xs px-3 py-1.5 rounded-lg bg-green-500/20 text-green-300">Fatto ✓</button>}
                  <button onClick={() => updateMaintenance(t.id, { status: 'cancelled' })} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-300">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== INSTALLER JOB REQUESTS (from individual customers) =====
function InstallerJobsTab({ jobs }: { jobs: Order[] }) {
  if (!jobs.length) return <Empty icon="🔧" text="Nessuna richiesta di installazione nella tua zona. Le richieste arrivano quando i clienti Individual acquistano un prodotto." />;
  return (
    <div className="space-y-4">
      {jobs.map(o => (
        <div key={o.id} className={card}>
          <div className="flex justify-between items-start flex-wrap gap-3">
            <div>
              <div className="font-bold">{o.customerName} <span className="text-white/30 font-mono text-xs ml-2">{o.id}</span></div>
              <div className="text-sm text-white/50 mt-1">📍 {o.shippingAddress} • a {o.installer?.distanceKm} km da te</div>
              <div className="text-sm text-white/60 mt-2">{o.lines.map(l => `${l.qty}× ${l.name}`).join(', ')}</div>
              <div className="text-xs text-white/40 mt-1">✉️ {o.customerEmail}{o.customerEmail.includes('@') ? '' : ''}</div>
            </div>
            <div className="text-right space-y-2">
              <span className={`block px-3 py-1 rounded-full text-xs font-medium border ${o.installer?.status === 'accepted' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                {o.installer?.status === 'accepted' ? 'ACCETTATA' : 'NUOVA RICHIESTA'}
              </span>
              {o.installer?.status === 'assigned' && (
                <button onClick={() => acceptInstallerJob(o.id, 'me')} className={btnAmber}>Accetta installazione</button>
              )}
              {o.installer?.status === 'accepted' && o.status !== 'delivered' && (
                <button onClick={() => advanceOrder(o.id, 'delivered')} className={btnGhost}>Segna lavoro completato</button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ===== DOCUMENTS =====
function DocumentsTab({ user, docs }: { user: StoredUser; docs: any[] }) {
  const reqTypes: { t: any; label: string }[] = [
    { t: 'visura', label: 'Visura Camerale' },
    { t: 'duvri', label: 'DVR / DUVRI' },
    { t: 'certificazione-f-gas', label: 'Certificazione F-Gas' },
    { t: 'assicurazione', label: 'Assicurazione RC (opzionale)' },
  ];
  const byType = (t: string) => docs.filter(d => d.type === t);
  return (
    <div className={card}>
      <h3 className="font-bold text-lg mb-2">📄 Verifica Account B2B</h3>
      <p className="text-sm text-white/50 mb-6">Il back-office AIRKLIM verifica i documenti entro 48h. Con Visura, DUVRI e F-Gas approvati l\'account diventa <b>verificato</b> e sblocchi gli sconti partner.</p>
      <div className="grid md:grid-cols-2 gap-4">
        {reqTypes.map(({ t, label }) => {
          const list = byType(t);
          const approved = list.some(d => d.status === 'approved');
          return (
            <div key={t} className={`p-4 rounded-xl border ${approved ? 'border-green-500/30 bg-green-500/5' : 'border-white/10 bg-white/5'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm">{label}</span>
                <span className={`text-xs ${approved ? 'text-green-400' : list.some(d => d.status === 'rejected') ? 'text-red-400' : list.length ? 'text-yellow-400' : 'text-white/40'}`}>
                  {approved ? '✓ Approvato' : list.length ? (list[0].status === 'rejected' ? '✕ Respinto' : '⏳ In verifica') : 'mancante'}
                </span>
              </div>
              {list.map(d => <div key={d.id} className="text-xs text-white/40 truncate">📎 {d.fileName}</div>)}
              <label className={`mt-3 inline-block cursor-pointer text-xs px-3 py-1.5 rounded-lg ${btnAmber}`}>
                Carica documento
                <input type="file" className="hidden" onChange={e => { const file = e.target.files?.[0]; if (file) uploadDocument(user.id, t, file.name); }} />
              </label>
            </div>
          );
        })}
      </div>
      <div className="mt-6 p-4 rounded-xl bg-sky-500/5 border border-sky-500/20 text-sm text-white/60">
        🧾 <b>Fatturazione elettronica:</b> le fatture dei tuoi ordini (SDI code <code className="text-sky-300">{user.sdiCode || 'non impostato'}</code>) vengono trasmesse automaticamente al Sistema di Interscambio dopo la spedizione. Imposta il codice nel profilo.
      </div>
    </div>
  );
}

// ===== PROFILE =====
function ProfileTab({ user }: { user: StoredUser }) {
  return (
    <div className={card}>
      <h3 className="font-bold text-lg mb-4">⚙️ Profilo Aziendale</h3>
      <dl className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
        {[
          ['Azienda', user.company], ['P.IVA', user.vatNumber], ['Codice SDI', user.sdiCode || '—'],
          ['PEC', user.pec || '—'], ['Referente', `${user.name} ${user.surname}`], ['Email', user.email],
          ['Telefono', user.phone || '—'], ['Sede', user.address || '—'],
          ['Ruolo', user.isInstaller ? 'Installatore rete AIRKLIM 🔧' : 'Rivenditore / Azienda'],
          ['Codice Partner', user.installersCode], ['Registrazione', new Date(user.createdAt).toLocaleDateString('it-IT')],
        ].map(([k, v]) => (
          <div key={k as string} className="flex justify-between border-b border-white/5 pb-2">
            <dt className="text-white/40">{k}</dt><dd className="text-white/80 font-medium text-right">{v as string}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Empty({ icon, text }: { icon: string; text: string }) {
  return <div className={`${card} text-center py-16`}><div className="text-5xl mb-4">{icon}</div><p className="text-white/40">{text}</p></div>;
}
