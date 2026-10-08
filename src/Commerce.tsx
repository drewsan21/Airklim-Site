import { useState } from 'react';
import { useAuth, useCart, useOrders } from './hooks';

// ===== AUTH MODAL (quick login/register; full flows live on /#/signup-business, /#/signup-individual, /#/login) =====
export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [accountType, setAccountType] = useState<'individual' | 'business'>('individual');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    surname: '',
    phone: '',
    city: '',
    company: '',
    vatNumber: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const navigateTo = (hash: string) => {
    window.location.hash = hash;
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (mode === 'login') {
      const result = login(formData.email, formData.password);
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setTimeout(() => onClose(), 1200);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } else {
      const result = register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        surname: formData.surname,
        phone: formData.phone,
        city: formData.city || undefined,
        accountType,
        business: accountType === 'business'
          ? { company: formData.company, vatNumber: formData.vatNumber, city: formData.city }
          : undefined,
      });
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setTimeout(() => onClose(), 1500);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-900 rounded-2xl border border-white/10 p-8 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">{mode === 'login' ? 'Accedi' : 'Registrati'}</h2>
          <p className="text-white/50 text-sm">
            {mode === 'login' ? 'Accedi al tuo account AIRKLIM (Business o Individual)' : 'Crea un nuovo account AIRKLIM'}
          </p>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Nome *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
                />
                <input
                  type="text"
                  required
                  placeholder="Cognome *"
                  value={formData.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
                />
              </div>
              <input
                type="tel"
                placeholder="Telefono"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAccountType('individual')}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${accountType === 'individual' ? 'bg-sky-500 text-white' : 'bg-white/5 text-white/60'}`}
                >
                  🏠 Individual
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('business')}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${accountType === 'business' ? 'bg-amber-500 text-white' : 'bg-white/5 text-white/60'}`}
                >
                  🏢 Business
                </button>
              </div>
              {accountType === 'business' && (
                <>
                  <input
                    type="text"
                    required
                    placeholder="Ragione Sociale *"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Partita IVA * (11 cifre)"
                    value={formData.vatNumber}
                    onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
                  />
                </>
              )}
              <input
                type="text"
                placeholder="Città (es. Palermo)"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
              />
            </>
          )}
          <input
            type="email"
            required
            placeholder="Email *"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
          />
          <input
            type="password"
            required
            placeholder="Password *"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
          />
          <button type="submit" className="w-full px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all">
            {mode === 'login' ? 'Accedi' : 'Crea Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-white/50 space-y-2">
          {mode === 'login' ? (
            <>
              <p>Non hai un account?</p>
              <div className="flex gap-2 justify-center">
                <button onClick={() => navigateTo('signup-individual')} className="px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20">🏠 Signup Individual</button>
                <button onClick={() => navigateTo('signup-business')} className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20">🏢 Signup Business</button>
              </div>
            </>
          ) : (
            <>
              Hai già un account?{' '}
              <button onClick={() => setMode('login')} className="text-sky-400 hover:underline">Accedi</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== CART SIDEBAR =====
export function CartSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const isBusiness = user?.accountType === 'business';
  const [showCheckout, setShowCheckout] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<{ id: string; installer?: { name: string; phone: string; city: string; distanceKm: number; certified: boolean } } | null>(null);

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (!user) {
      // Send the shopper to the proper login/signup flow instead of a dead alert
      window.location.hash = 'login';
      onClose();
      return;
    }
    setShowCheckout(true);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.target as HTMLFormElement);
    const address = formData.get('address') as string;
    
    const order = createOrder(user, items, total, address);
    clearCart();
    setPlacedOrder({ id: order.id, installer: order.installer });
    setTimeout(() => {
      onClose();
      setShowCheckout(false);
      setPlacedOrder(null);
    }, 12000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-900 w-full max-w-md h-full overflow-y-auto border-l border-white/10" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Carrello ({items.length})</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {placedOrder ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Ordine Confermato!</h3>
            <p className="text-white/50 mb-1">Ordine <span className="text-sky-400 font-semibold">{placedOrder.id}</span></p>
            <p className="text-white/50 mb-4">Riceverai una email di conferma a breve.</p>
            {placedOrder.installer ? (
              <div className="mt-4 p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 text-left">
                <div className="text-sm font-bold text-sky-400 mb-1">🔧 Installatore collegato automaticamente</div>
                <div className="text-white text-sm font-semibold">{placedOrder.installer.name} {placedOrder.installer.certified && <span className="text-sky-400">✓ Certificato</span>}</div>
                <div className="text-white/50 text-xs mt-1">{placedOrder.installer.city} • a ~{placedOrder.installer.distanceKm} km da te</div>
                <a href={'tel:' + placedOrder.installer.phone.replace(/\s/g,'')} className="inline-block mt-2 text-sky-400 text-sm font-medium hover:text-sky-300">{placedOrder.installer.phone}</a>
                <p className="text-white/40 text-xs mt-2">L'installatore ti contatterà per concordare data e modalità di posa in opera.</p>
              </div>
            ) : (
              <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-left">
                <div className="text-sm font-bold text-amber-400">🏢 Acquisto Business (B2B)</div>
                <p className="text-white/50 text-xs mt-1">La merce verrà spedita alla tua sede. Preparala per i tuoi cantieri!</p>
              </div>
            )}
          </div>
        ) : showCheckout ? (
          <form onSubmit={handleConfirmOrder} className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-white mb-1">{isBusiness ? 'Consegna alla sede aziendale' : 'Indirizzo di Spedizione / Installazione'}</h3>
            <p className="text-xs text-white/40 mb-4">{isBusiness ? 'Listino B2B: spedizione senza installazione.' : 'In base alla località ti collegheremo automaticamente il miglior installatore certificato della zona.'}</p>
            <textarea
              name="address"
              required
              defaultValue={isBusiness ? ((user as any)?.business?.officeAddress || user?.address || '') : (user?.address || '')}
              placeholder="Via, numero civico, CAP, città, provincia"
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none resize-none"
            />
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex justify-between text-sm text-white/60 mb-2">
                <span>Subtotale</span>
                <span>€ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-white/60 mb-2">
                <span>Spedizione</span>
                <span className="text-green-400">Gratuita</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-white/10">
                <span>Totale</span>
                <span>€ {total.toFixed(2)}</span>
              </div>
            </div>
            <button type="submit" className="w-full px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all">
              Conferma Ordine
            </button>
            <button type="button" onClick={() => setShowCheckout(false)} className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all">
              Indietro
            </button>
          </form>
        ) : items.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-white/50">Il carrello è vuoto</p>
          </div>
        ) : (
          <>
            <div className="p-6 space-y-4">
              {items.map(item => (
                <div key={item.productId} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center flex-shrink-0">
                    <svg className="w-10 h-10 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm">{item.name}</h4>
                    <p className="text-xs text-white/40">{item.brand}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm">-</button>
                      <span className="text-white text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm">+</button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sky-400">€ {(item.price * item.quantity).toFixed(2)}</div>
                    <button onClick={() => removeItem(item.productId)} className="text-xs text-red-400 hover:text-red-300 mt-2">Rimuovi</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-white/10 space-y-4">
              <div className="flex justify-between text-lg font-bold text-white">
                <span>Totale</span>
                <span>€ {total.toFixed(2)}</span>
              </div>
              <button onClick={handleCheckout} className="w-full px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all">
                Procedi al Checkout
              </button>
              <button onClick={clearCart} className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all">
                Svuota Carrello
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ===== USER DASHBOARD =====
export function UserDashboard() {
  const { user, logout } = useAuth();
  const { getUserOrders } = useOrders();

  if (!user) return null;

  const orders = getUserOrders(user.id);

  return (
    <section id="dashboard" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Ciao, {user.name}!</h2>
              <p className="text-white/50 text-sm">{user.role === 'professionista' ? 'Account Professionista' : 'Account Privato'}</p>
            </div>
            <button onClick={logout} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-all">
              Esci
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="text-3xl font-bold text-sky-400">{orders.length}</div>
              <div className="text-sm text-white/50 mt-1">Ordini Totali</div>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="text-3xl font-bold text-green-400">
                € {orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
              </div>
              <div className="text-sm text-white/50 mt-1">Spesa Totale</div>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="text-3xl font-bold text-amber-400">
                {orders.filter(o => o.status === 'delivered').length}
              </div>
              <div className="text-sm text-white/50 mt-1">Ordini Completati</div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-4">I Tuoi Ordini</h3>
          {orders.length === 0 ? (
            <p className="text-white/50 text-center py-8">Nessun ordine ancora</p>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-bold text-white">{order.id}</div>
                      <div className="text-sm text-white/40">{new Date(order.createdAt).toLocaleDateString('it-IT')}</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                      order.status === 'confirmed' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      order.status === 'processing' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      order.status === 'shipped' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                      'bg-green-500/10 text-green-400 border border-green-500/20'
                    }`}>
                      {order.status === 'pending' && 'In Attesa'}
                      {order.status === 'confirmed' && 'Confermato'}
                      {order.status === 'processing' && 'In Lavorazione'}
                      {order.status === 'shipped' && 'Spedito'}
                      {order.status === 'delivered' && 'Consegnato'}
                    </div>
                  </div>
                  <div className="text-sm text-white/60">
                    {order.items.length} articol{order.items.length === 1 ? 'o' : 'i'} • € {order.total.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
