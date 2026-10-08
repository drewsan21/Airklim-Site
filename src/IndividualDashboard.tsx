/**
 * AIRKLIM Individual Customer Dashboard + Installer Matching Engine UI
 * - I clienti privati (Individual) vedono ordini, installatore abbinato, stato installazione
 * - Al checkout viene suggerito il miglior installatore per vicinanza (src/data/installers.ts)
 */
import { useState } from 'react';
import { useStore, signout, StoredUser, Order, InstallerLink } from './store';
import { findBestInstallers, Installer } from './data/installers';
import { AccountBadge } from './AuthPages';

const card = 'bg-white/[0.03] rounded-2xl border border-white/10 p-6';
const btnGhost = 'px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold text-sm transition-all';

export function matchInstallers(address: string): { installer: Installer; distanceKm: number }[] {
  return findBestInstallers(address || '', 3);
}

export function toInstallerLink(m: { installer: Installer; distanceKm: number }): InstallerLink {
  return {
    installerId: m.installer.id,
    installerName: m.installer.name,
    installerCompany: m.installer.company,
    installerPhone: m.installer.phone,
    installerEmail: m.installer.email,
    distanceKm: m.distanceKm,
    status: 'assigned',
  };
}

// ===== INSTALLER SUGGESTION CARD (usato nel checkout e nel dashboard) =====
export function InstallerSuggestion({ address, selected, onSelect }: {
  address: string; selected?: InstallerLink | null; onSelect: (l: InstallerLink | null) => void;
}) {
  const matches = matchInstallers(address);
  if (!matches.length) return null;
  return (
    <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20 space-y-2">
      <div className="text-sm font-bold text-sky-300">🔧 Installatore consigliato per la tua zona {address && `(${address})`}</div>
      {matches.map(m => {
        const link = toInstallerLink(m);
        const isSel = selected?.installerId === link.installerId;
        return (
          <button key={m.installer.id} type="button" onClick={() => onSelect(isSel ? null : link)}
            className={`w-full text-left p-3 rounded-lg border transition-all ${isSel ? 'border-sky-400 bg-sky-500/15' : 'border-white/10 bg-white/5 hover:border-sky-500/40'}`}>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-white text-sm">{m.installer.name} — {m.installer.company}</span>
              <span className="text-xs text-sky-300">{m.distanceKm} km</span>
            </div>
            <div className="text-xs text-white/50 mt-1">
              ⭐ {m.installer.rating}/5 • {m.installer.jobsCompleted} lavori • {m.installer.certified ? '✅ Certificato F-Gas' : 'In certificazione'} • {m.installer.specializations.slice(0, 2).join(', ')}
            </div>
            {isSel && <div className="text-[11px] text-green-400 mt-1">✓ Selezionato: verrà collegato al tuo ordine</div>}
          </button>
        );
      })}
      <p className="text-[11px] text-white/40">L\'abbinamento usa posizione (distanza), certificazioni e rating. L\'installatore ti contatterà per fissare l\'installazione.</p>
    </div>
  );
}

// ===== INDIVIDUAL DASHBOARD =====
export function IndividualDashboard({ user }: { user: StoredUser }) {
  const [tab, setTab] = useState<'orders' | 'installer' | 'profile'>('orders');
  const orders = useStore(s => s.orders).filter(o => o.userId === user.id);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-black/60 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-xl">🏠</div>
            <div>
              <div className="font-bold">Ciao, {user.name}! <AccountBadge user={user} /></div>
              <div className="text-xs text-white/40">{user.email}{user.city && ` • ${user.city}`}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <nav className="flex gap-1">
              {([['orders', '📦 Ordini'], ['installer', '🔧 Il mio installatore'], ['profile', '⚙️ Profilo']] as const).map(([id, lbl]) => (
                <button key={id} onClick={() => setTab(id)} className={`px-3 py-1.5 rounded-lg text-sm ${tab === id ? 'bg-sky-500 text-white' : 'text-white/50 hover:bg-white/10'}`}>{lbl}</button>
              ))}
            </nav>
            <button onClick={() => { window.location.hash = ''; }} className={btnGhost}>Catalogo →</button>
            <button onClick={() => { signout(); window.location.hash = ''; }} className={btnGhost}>Esci</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {tab === 'orders' && (
          orders.length === 0 ? (
            <div className={`${card} text-center py-16`}>
              <div className="text-5xl mb-4">🛒</div>
              <p className="text-white/50">Nessun ordine ancora. Scopri il catalogo e al checkout ti abbiniamo l\'installatore più vicino!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(o => <OrderCard key={o.id} order={o} />)}
            </div>
          )
        )}
        {tab === 'installer' && <MyInstallerTab user={user} orders={orders} />}
        {tab === 'profile' && (
          <div className={card}>
            <h3 className="font-bold text-lg mb-4">⚙️ Il mio profilo</h3>
            <dl className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-sm max-w-xl">
              {[['Nome', `${user.name} ${user.surname}`], ['Email', user.email], ['Telefono', user.phone || '—'], ['Città', user.city || '—'], ['Indirizzo installazione', user.address || '—'], ['Membro dal', new Date(user.createdAt).toLocaleDateString('it-IT')]].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-white/5 pb-2"><dt className="text-white/40">{k}</dt><dd className="text-white/80">{v}</dd></div>
              ))}
            </dl>
            <p className="text-xs text-white/30 mt-4">💡 L\'indirizzo di installazione determina l\'abbinamento con gli installatori della rete AIRKLIM.</p>
          </div>
        )}
      </main>
    </div>
  );
}

function OrderCard({ order: o }: { order: Order }) {
  const statusLabel: Record<Order['status'], string> = { pending: 'In attesa', confirmed: 'Confermato', processing: 'In lavorazione', shipped: 'Spedito', delivered: 'Consegnato' };
  const statusCls: Record<Order['status'], string> = {
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    processing: 'bg-purple-500/10 text-purple-400 border-purple-500/20', shipped: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
  };
  return (
    <div className={card}>
      <div className="flex justify-between items-center flex-wrap gap-2 mb-3">
        <div className="font-bold">{o.id} <span className="text-white/30 text-xs font-normal ml-2">{new Date(o.createdAt).toLocaleDateString('it-IT')}</span></div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusCls[o.status]}`}>{statusLabel[o.status]}</span>
      </div>
      <div className="text-sm text-white/60 space-y-1 mb-3">
        {o.lines.map(l => <div key={l.productId} className="flex justify-between"><span>{l.qty}× {l.name}</span><span>€ {(l.price * l.qty).toFixed(2)}</span></div>)}
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-white/10">
        <span className="text-sm text-white/50">Totale: <b className="text-sky-400">€ {o.total.toFixed(2)}</b></span>
        {o.installer ? (
          <span className={`text-xs px-3 py-1.5 rounded-lg border ${o.installer.status === 'accepted' ? 'bg-green-500/10 text-green-300 border-green-500/20' : 'bg-amber-500/10 text-amber-300 border-amber-500/20'}`}>
            🔧 {o.installer.installerName} ({o.installer.distanceKm} km) — {o.installer.status === 'accepted' ? 'Installazione confermata ✓' : 'In attesa di conferma installatore'}
          </span>
        ) : (
          <span className="text-xs text-white/30">Nessun installatore abbinato</span>
        )}
      </div>
    </div>
  );
}

function MyInstallerTab({ user, orders }: { user: StoredUser; orders: Order[] }) {
  const linked = orders.filter(o => o.installer);
  const suggestions = matchInstallers(user.address || user.city || '');
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className={card}>
        <h3 className="font-bold text-lg mb-4">🔧 I tuoi installatori abbinati</h3>
        {!linked.length ? <p className="text-white/40 text-sm">Ancora nessun installatore abbinato. Farlo è semplice: effettua un acquisto e seleziona l\'installatore consigliato al checkout.</p> : (
          <div className="space-y-3">
            {linked.map(o => (
              <div key={o.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="font-semibold">{o.installer!.installerName} <span className="text-white/30 text-xs">• {o.id}</span></div>
                <div className="text-sm text-white/50">{o.installer!.installerCompany} • a {o.installer!.distanceKm} km</div>
                <div className="text-sm text-white/60 mt-2">📞 <a href={`tel:${o.installer!.installerPhone}`} className="text-sky-400 hover:underline">{o.installer!.installerPhone}</a> • ✉️ {o.installer!.installerEmail}</div>
                <div className={`mt-2 text-xs px-2.5 py-1 rounded-full inline-block ${o.installer!.status === 'accepted' ? 'bg-green-500/15 text-green-300' : o.installer!.status === 'completed' ? 'bg-sky-500/15 text-sky-300' : 'bg-amber-500/15 text-amber-300'}`}>
                  {o.installer!.status === 'accepted' ? '✓ Installazione accettata — ti contatterà a breve' : o.installer!.status === 'completed' ? 'Lavoro completato' : '⏳ In attesa che l\'installatore accetti'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={card}>
        <h3 className="font-bold text-lg mb-2">⭐ Installatori disponibili nella tua zona</h3>
        <p className="text-xs text-white/40 mb-4">Rete AIRKLIM PRO Partner basata su indirizzo: <b>{user.address || user.city || 'non impostato — aggiungilo dal profilo'}</b></p>
        <div className="space-y-3">
          {suggestions.map(m => (
            <div key={m.installer.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex justify-between">
                <span className="font-semibold text-sm">{m.installer.name} — {m.installer.company}</span>
                <span className="text-xs text-sky-300">{m.distanceKm} km</span>
              </div>
              <div className="text-xs text-white/50 mt-1">⭐ {m.installer.rating} • {m.installer.jobsCompleted} lavori • {m.installer.certified ? '✅ F-Gas' : 'in certificazione'}</div>
              <div className="text-xs text-white/40 mt-1">{m.installer.specializations.join(' • ')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
