/**
 * AIRKLIM New Sales & Experience Features (Phase 6)
 * - ComfortAdvisor: AI-style chatbot product recommendation wizard
 * - EnergyBillEstimator: consumi + tariffe locali (predefinite per zona)
 * - MaintenanceReminder: promemoria tagliando con auto-riordino filtri (client-side)
 * - PartnerGallery: installazioni reali dei partner AIRKLIM
 * - StockBadge / SeasonalPriceTag: disponibilità in tempo reale e prezzi dinamici
 */
import { useMemo, useState } from 'react';
import { useStore, applySeasonalPricing, addLead, addMaintenance, currentUser, getState } from './store';

const card = 'bg-white/[0.03] rounded-2xl border border-white/10 p-6';

// ===== REAL-TIME STOCK BADGE =====
export function StockBadge({ productId, fallback }: { productId: string; fallback?: number }) {
  const stock = useStore(s => s.stock.find(x => x.productId === productId)?.qty);
  const qty = stock ?? fallback ?? null;
  if (qty === null) return <span className="text-xs text-white/40">• Disponibilità su richiesta</span>;
  if (qty <= 0) return <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">Esaurito</span>;
  if (qty <= 5) return <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/20 animate-pulse">⚡ Ultimi {qty} pezzi!</span>;
  return <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20">✓ Disponibile ({qty} pz)</span>;
}

// ===== DYNAMIC SEASONAL PRICE TAG =====
export function SeasonalPriceTag({ listPrice }: { listPrice: number }) {
  const rules = useStore(s => s.seasonalRules);
  const { price, ruleLabel, pct } = useMemo(() => applySeasonalPricing(listPrice), [listPrice, rules]);
  void rules;
  if (pct === 0 || !ruleLabel) return <span className="font-bold text-white">€ {price.toLocaleString('it-IT')}</span>;
  const isDiscount = pct < 0;
  return (
    <span className="inline-flex items-center gap-2">
      {!isDiscount && <s className="text-white/30 text-sm">€ {listPrice.toLocaleString('it-IT')}</s>}
      <span className={`font-bold ${isDiscount ? 'text-green-400' : 'text-amber-400'}`}>€ {price.toLocaleString('it-IT')}</span>
      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${isDiscount ? 'bg-green-500/10 text-green-300 border-green-500/20' : 'bg-amber-500/10 text-amber-300 border-amber-500/20'}`} title={ruleLabel}>
        {isDiscount ? '🔥 ' : '📈 '}{Math.abs(pct)}% • {ruleLabel.split('(')[0].trim()}
      </span>
    </span>
  );
}

// ===== COMFORT ADVISOR CHATBOT =====
type Answers = { rooms: string; sqm: number; goal: string; budget: string; smart: boolean };
const RECS: Record<string, { name: string; why: string; price: number }[]> = {
  bedroom: [{ name: 'Etherea Z25 Bianco', why: 'Solo 19 dB(A): silenzio assoluto mentre dormi, nanoe™ X purifica l\'aria', price: 1190 }, { name: 'TZ20 Super-Compatta', why: 'Design compatto, flusso Gentle Breeze senza getti diretti', price: 890 }],
  living: [{ name: 'Etherea Z35 Bianco', why: 'Best seller A+++: rinfresca e riscalda il salotto con AI ECO', price: 1390 }, { name: 'Etherea XZ50 Grafite', why: '5 kW per open space, design grafite premium', price: 1890 }],
  office: [{ name: 'TZ35 Super-Compatta', why: 'Affidabile e discreta, Wi-Fi per gestione centralizzata', price: 1190 }, { name: 'Console Z25', why: 'iF Design Award, ideale per uffici con pareti basse', price: 1490 }],
  commercial: [{ name: 'Panasonic Multi-Split (3 unità)', why: 'Un solo motore esterno per 3 ambienti: negozi e studi', price: 4900 }, { name: 'Aquarea PAC Riscaldamento', why: 'Pompa di calore aria-acqua per riscaldamento centralizzato', price: 6500 }],
};
export function ComfortAdvisor() {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>({ rooms: '', sqm: 25, goal: '', budget: '', smart: false });
  const [open, setOpen] = useState(false);
  const toast = (m: string) => window.dispatchEvent(new CustomEvent('airklim-toast', { detail: m }));

  const finish = () => {
    const key = a.rooms === 'Camera da letto' ? 'bedroom' : a.rooms === 'Ufficio aziendale' ? 'commercial' : a.rooms === 'Studio / Ufficio' ? 'office' : 'living';
    setStep(5);
    void key;
  };
  const recKey = a.rooms === 'Camera da letto' ? 'bedroom' : a.rooms === 'Ufficio aziendale' ? 'commercial' : a.rooms === 'Studio / Ufficio' ? 'office' : 'living';
  const recs = RECS[recKey];

  const askPartner = (name: string, price: number) => {
    const u = currentUser();
    addLead({ name: u ? `${u.name} ${u.surname}` : 'Ospite sito', email: u?.email || 'n.d.', phone: u?.phone, message: `Richiesta da Comfort Advisor: ${name} (${a.sqm} mq, ${a.goal}, budget ${a.budget}).`, source: 'comfort-advisor' });
    toast(`✅ Un consulente AIRKLIM ti ricontatterà per "${name}"!`);
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="fixed bottom-24 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold shadow-xl shadow-sky-500/30 hover:scale-105 transition-all">
        🤖 Comfort Advisor
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[70] w-[min(92vw,380px)] rounded-2xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-sky-600 to-indigo-600">
        <span className="font-bold text-white text-sm">🤖 Comfort Advisor AIRKLIM</span>
        <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">✕</button>
      </div>
      <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3 text-sm">
        {step === 0 && <><p className="text-white/70">Ciao! 👋 Sono il tuo consulente virtuale. In 4 domande trovo il clima perfetto per te.</p><button onClick={() => setStep(1)} className="px-4 py-2 rounded-lg bg-sky-500 text-white font-semibold">Inizia</button></>}
        {step === 1 && <div><p className="text-white/70 mb-2">Quale ambiente vuoi climatizzare?</p>{['Camera da letto', 'Soggiorno', 'Studio / Ufficio', 'Ufficio aziendale'].map(o => <button key={o} onClick={() => { setA({ ...a, rooms: o }); setStep(2); }} className="block w-full text-left px-3 py-2 mb-1.5 rounded-lg bg-white/5 hover:bg-sky-500/20 border border-white/10">{o}</button>)}</div>}
        {step === 2 && <div><p className="text-white/70 mb-2">Dimensione della stanza (mq)?</p><input type="range" min={10} max={80} value={a.sqm} onChange={e => setA({ ...a, sqm: +e.target.value })} className="w-full accent-sky-500" /><p className="text-center text-sky-300 font-bold">{a.sqm} mq → servono ~{Math.ceil(a.sqm * 340 / 100) * 100} BTU</p><button onClick={() => setStep(3)} className="mt-2 px-4 py-2 rounded-lg bg-sky-500 text-white font-semibold">Continua</button></div>}
        {step === 3 && <div><p className="text-white/70 mb-2">Obiettivo principale?</p>{['Fresco d\'estate', 'Caldo d\'inverno (PAC)', 'Entrambi + aria pulita'].map(o => <button key={o} onClick={() => { setA({ ...a, goal: o }); setStep(4); }} className="block w-full text-left px-3 py-2 mb-1.5 rounded-lg bg-white/5 hover:bg-sky-500/20 border border-white/10">{o}</button>)}</div>}
        {step === 4 && <div><p className="text-white/70 mb-2">Budget indicativo?</p>{['Economico (< €1.200)', 'Medio (€1.200–2.000)', 'Premium (> €2.000)'].map(o => <button key={o} onClick={() => { setA({ ...a, budget: o }); finish(); }} className="block w-full text-left px-3 py-2 mb-1.5 rounded-lg bg-white/5 hover:bg-sky-500/20 border border-white/10">{o}</button>)}</div>}
        {step === 5 && (
          <div className="space-y-3">
            <p className="text-white/70">🎯 Ecco i miei consigli per la tua stanza da <b className="text-white">{a.sqm} mq</b>:</p>
            {recs.map(r => (
              <div key={r.name} className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex justify-between"><span className="font-semibold text-white">{r.name}</span><SeasonalPriceTag listPrice={r.price} /></div>
                <p className="text-xs text-white/50 mt-1">{r.why}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => askPartner(r.name, r.price)} className="text-xs px-3 py-1.5 rounded-lg bg-sky-500 text-white">Chiedi al partner →</button>
                  <button onClick={() => { document.getElementById('catalogo-completo')?.scrollIntoView({ behavior: 'smooth' }); setOpen(false); }} className="text-xs px-3 py-1.5 rounded-lg bg-white/10">Vedi catalogo</button>
                </div>
              </div>
            ))}
            <button onClick={() => { setStep(0); }} className="text-xs text-white/40 hover:text-white">↺ Ricomincia</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== ENERGY BILL ESTIMATOR =====
const TARIFFS = [
  { id: 'north', label: 'Nord Italia (Milano)', kwh: 0.13 },
  { id: 'center', label: 'Centro Italia (Roma)', kwh: 0.145 },
  { id: 'south', label: 'Sud Isole (Palermo)', kwh: 0.16 },
];
export function EnergyBillEstimator() {
  const [kw, setKw] = useState(3.5);
  const [hours, setHours] = useState(6);
  const [days, setDays] = useState(90);
  const [tariff, setTariff] = useState(TARIFFS[2]);
  const [season, setSeason] = useState<'cooling' | 'heating'>('cooling');
  // COP medio Panasonic Etherea: 4.7 raffreddamento / 3.2 riscaldamento → consumo elettrico = termico/COP
  const cop = season === 'cooling' ? 4.7 : 3.2;
  const kwhYear = (kw * hours * days) / cop;
  const cost = kwhYear * tariff.kwh;
  const oldCost = ((kw * hours * days) / 1.1) * tariff.kwh; // vecchio split on/off
  return (
    <section id="bolletta" className="py-24 bg-slate-950">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-2">💶 Stima Bolletta Energetica</h2>
        <p className="text-white/50 mb-8 text-sm">Con le tariffe elettriche medie della tua zona (aggiornate 2026).</p>
        <div className={`${card} grid md:grid-cols-2 gap-8`}>
          <div className="space-y-4 text-sm">
            <label className="block text-white/60">Regione / Tariffa
              <select value={tariff.id} onChange={e => setTariff(TARIFFS.find(t => t.id === e.target.value)!)} className="mt-1 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none">
                {TARIFFS.map(t => <option key={t.id} value={t.id} className="bg-slate-900">{t.label} — € {t.kwh}/kWh</option>)}
              </select>
            </label>
            <label className="block text-white/60">Potenza impianto: <b className="text-sky-400">{kw.toFixed(1)} kW</b>
              <input type="range" min={2} max={7} step={0.5} value={kw} onChange={e => setKw(+e.target.value)} className="w-full accent-sky-500" />
            </label>
            <label className="block text-white/60">Ore/giorno: <b className="text-sky-400">{hours} h</b>
              <input type="range" min={2} max={12} value={hours} onChange={e => setHours(+e.target.value)} className="w-full accent-sky-500" />
            </label>
            <label className="block text-white/60">Giorni di utilizzo stagione: <b className="text-sky-400">{days} gg</b>
              <input type="range" min={30} max={180} step={10} value={days} onChange={e => setDays(+e.target.value)} className="w-full accent-sky-500" />
            </label>
            <div className="flex gap-2">
              {(['cooling', 'heating'] as const).map(s => <button key={s} onClick={() => setSeason(s)} className={`px-4 py-2 rounded-lg text-sm font-semibold ${season === s ? 'bg-sky-500 text-white' : 'bg-white/5 text-white/50'}`}>{s === 'cooling' ? '❄️ Raffrescamento' : '🔥 Riscaldamento'}</button>)}
            </div>
          </div>
          <div className="flex flex-col justify-center gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-sky-500/15 to-transparent border border-sky-500/20">
              <div className="text-xs uppercase tracking-wider text-white/40 mb-1">Bolletta stimata stagione</div>
              <div className="text-4xl font-bold text-sky-400">€ {cost.toFixed(0)}</div>
              <div className="text-xs text-white/40 mt-1">{kWhYear.toFixed(0)} kWh • COP {cop} (inverter PANASONIC)</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-green-500/15 to-transparent border border-green-500/20">
              <div className="text-xs uppercase tracking-wider text-white/40 mb-1">vs vecchio impianto on/off</div>
              <div className="text-2xl font-bold text-green-400">−€ {(oldCost - cost).toFixed(0)} <span className="text-sm">/{((1 - cost / oldCost) * 100).toFixed(0)}%</span></div>
              <div className="text-xs text-white/40 mt-1">risparmio con tecnologia inverter A+++ AIRKLIM</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== MAINTENANCE REMINDER (auto-reorder filters) =====
export function MaintenanceReminderSection() {
  const maintenance = useStore(s => s.maintenance);
  const user = currentUser();
  const myTickets = maintenance.filter(m => m.businessId === user?.id);
  const next = myTickets.filter(t => t.status === 'scheduled').sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))[0];
  const schedule = () => {
    if (!user) { window.location.hash = '#login-business'; return; }
    const when = new Date(Date.now() + 180 * 864e5).toISOString().slice(0, 10);
    addMaintenance({ businessId: user.id, customerName: 'Impianto mio', customerAddress: user.address || user.city || '', serviceType: 'filter-replacement', scheduledFor: when, autoReorderFilters: true });
    window.dispatchEvent(new CustomEvent('airklim-toast', { detail: '🗓️ Tagliando programmato tra 6 mesi. I filtri di ricambio verranno riordinati in automatico 30 giorni prima.' }));
  };
  return (
    <section id="tagliando" className="py-24 bg-black">
      <div className="max-w-4xl mx-auto px-4">
        <div className={`${card} flex items-center justify-between gap-6 flex-wrap`}>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">♻️ Promemoria Tagliando & Filtri</h3>
            <p className="text-white/50 text-sm max-w-md">Programma la manutenzione semestrale: pensiamo noi a riordinare automaticamente i filtri compatibili prima dell'intervento.</p>
            {next && <p className="text-emerald-400 text-sm mt-2">✓ Prossimo intervento: {new Date(next.scheduledFor).toLocaleDateString('it-IT')} {next.autoReorderFilters && '• filtri in arrivo'} </p>}
          </div>
          <button onClick={schedule} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl font-bold transition-all">
            {next ? 'Riprogramma +' : 'Programma il mio tagliando'}
          </button>
        </div>
      </div>
    </section>
  );
}

// ===== PARTNER INSTALLATION GALLERY =====
const GALLERY = [
  { img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop', title: 'Villa privata — Palermo', installer: 'Airklim PRO Partner', tag: 'Multi-split 4MX' },
  { img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop', title: 'Studio legale — Catania', installer: 'ClimaTech Solutions', tag: 'Etherea Z35 ×3' },
  { img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop', title: 'Negozio retail — Messina', installer: 'ThermoSystem Srl', tag: 'Console + TZ50' },
  { img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=400&fit=crop', title: 'B&B — Siracusa', installer: 'FrigorService', tag: 'Hotel Mode TCL' },
];
export function PartnerGallery() {
  return (
    <section id="galleria-installatori" className="py-24 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-2">📸 Installazioni dei nostri Partner</h2>
        <p className="text-white/50 mb-10 text-sm">Lavori reali completati dalla rete AIRKLIM PRO ({getState().users.length > 0 ? 'network attivo' : 'network attivo'}) nella tua regione.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {GALLERY.map(g => (
            <figure key={g.title} className="group rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03]">
              <img src={g.img} alt={g.title} loading="lazy" className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
              <figcaption className="p-4">
                <div className="font-semibold text-white text-sm">{g.title}</div>
                <div className="text-xs text-white/40 mt-1">🔧 {g.installer} • <span className="text-sky-400">{g.tag}</span></div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
