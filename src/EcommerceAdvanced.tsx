/**
 * Funzionalità E-commerce Avanzate
 * Wishlist, Recensioni, Coupon, Spedizione Multipla, Tracking, Fatturazione, Resi, Chat Live, Notifiche, Fedeltà
 */

import { useState, useEffect } from 'react';

// ===== WISHLIST COMPONENT =====
export function WishlistSection() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [showWishlist, setShowWishlist] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('airklim-wishlist');
    if (stored) {
      try {
        setWishlist(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading wishlist:', e);
      }
    }
  }, []);

  const addToWishlist = (product: any) => {
    const newWishlist = [...wishlist, { ...product, addedAt: new Date().toISOString() }];
    setWishlist(newWishlist);
    localStorage.setItem('airklim-wishlist', JSON.stringify(newWishlist));
  };

  const removeFromWishlist = (productId: string) => {
    const newWishlist = wishlist.filter(p => p.id !== productId);
    setWishlist(newWishlist);
    localStorage.setItem('airklim-wishlist', JSON.stringify(newWishlist));
  };

  return (
    <>
      {/* Wishlist Button */}
      <button
        onClick={() => setShowWishlist(true)}
        className="fixed bottom-56 right-6 z-40 w-14 h-14 rounded-full bg-pink-500 hover:bg-pink-400 text-white flex items-center justify-center shadow-lg shadow-pink-500/25 transition-all hover:scale-110 lg:right-8"
        aria-label="Wishlist"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        {wishlist.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {wishlist.length}
          </span>
        )}
      </button>

      {/* Wishlist Modal */}
      {showWishlist && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowWishlist(false)}>
          <div className="bg-slate-900 rounded-2xl border border-white/10 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">La Tua Wishlist ({wishlist.length})</h2>
              <button onClick={() => setShowWishlist(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {wishlist.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💔</div>
                <p className="text-white/50">La tua wishlist è vuota</p>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlist.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center flex-shrink-0">
                      <svg className="w-10 h-10 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{item.name}</h3>
                      <p className="text-sm text-white/50">{item.brand}</p>
                      <p className="text-lg font-bold text-sky-400 mt-1">{item.price}</p>
                    </div>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-all"
                    >
                      Rimuovi
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ===== REVIEWS COMPONENT =====
export function ReviewsSection() {
  const reviews = [
    {
      id: '1',
      productId: 'panasonic-etherea-z35',
      userName: 'Marco R.',
      rating: 5,
      title: 'Eccellente qualità dell\'aria',
      comment: 'Il nanoe™ X fa davvero la differenza. L\'aria è molto più pulita e si sente subito.',
      date: '2026-01-10',
      verified: true,
      helpful: 24
    },
    {
      id: '2',
      productId: 'panasonic-etherea-z25',
      userName: 'Giulia B.',
      rating: 5,
      title: 'Silenziosissimo',
      comment: '19 dB(A) sono veramente silenzio. Perfetto per la camera da letto.',
      date: '2026-01-08',
      verified: true,
      helpful: 18
    },
    {
      id: '3',
      productId: 'tcl-breezein-12',
      userName: 'Antonio F.',
      rating: 4,
      title: 'Ottimo rapporto qualità-prezzo',
      comment: 'Il Gentle Breeze è molto piacevole. Wi-Fi funziona bene con Alexa.',
      date: '2026-01-05',
      verified: true,
      helpful: 12
    }
  ];

  return (
    <section id="reviews" className="py-16 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Recensioni Clienti</h2>
          <p className="text-white/50">Cosa dicono i nostri clienti</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white/[0.02] rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold">
                  {review.userName[0]}
                </div>
                <div>
                  <div className="font-semibold text-white">{review.userName}</div>
                  {review.verified && (
                    <div className="text-xs text-green-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      Acquisto verificato
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-white/20'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <h3 className="font-bold text-white mb-2">{review.title}</h3>
              <p className="text-white/60 text-sm mb-4">{review.comment}</p>

              <div className="flex items-center justify-between text-xs text-white/40">
                <span>{new Date(review.date).toLocaleDateString('it-IT')}</span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  {review.helpful} utili
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== COUPON SYSTEM =====
export function CouponSystem() {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const validCoupons = [
    { code: 'WELCOME10', discount: 10, type: 'percent', description: '10% di sconto sul primo ordine' },
    { code: 'AIRKLIM50', discount: 50, type: 'fixed', description: '€50 di sconto su ordini superiori a €500' },
    { code: 'PRO2026', discount: 15, type: 'percent', description: '15% di sconto per professionisti' }
  ];

  const applyCoupon = () => {
    const coupon = validCoupons.find(c => c.code === couponCode.toUpperCase());
    if (coupon) {
      setAppliedCoupon(coupon);
      setMessage({ type: 'success', text: `Coupon applicato: ${coupon.description}` });
    } else {
      setMessage({ type: 'error', text: 'Coupon non valido' });
      setAppliedCoupon(null);
    }
  };

  return (
    <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6">
      <h3 className="text-lg font-bold text-white mb-4">Hai un codice coupon?</h3>
      
      <div className="flex gap-3">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Inserisci codice"
          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
        />
        <button
          onClick={applyCoupon}
          className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all"
        >
          Applica
        </button>
      </div>

      {message && (
        <div className={`mt-3 p-3 rounded-lg text-sm ${
          message.type === 'success' 
            ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {appliedCoupon && (
        <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-green-400 font-semibold">Coupon Applicato</div>
              <div className="text-xs text-white/60 mt-1">{appliedCoupon.description}</div>
            </div>
            <div className="text-2xl font-bold text-green-400">
              {appliedCoupon.type === 'percent' ? `${appliedCoupon.discount}%` : `€${appliedCoupon.discount}`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== ORDER TRACKING =====
export function OrderTrackingAdvanced() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderStatus, setOrderStatus] = useState<any>(null);

  const trackOrder = () => {
    // Simulated tracking
    if (trackingNumber) {
      setOrderStatus({
        orderNumber: trackingNumber,
        status: 'shipped',
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('it-IT'),
        trackingHistory: [
          { date: '2026-01-15 09:00', status: 'Ordine confermato', location: 'Carini (PA)' },
          { date: '2026-01-15 14:30', status: 'In preparazione', location: 'Magazzino AIRKLIM' },
          { date: '2026-01-16 08:00', status: 'Spedito', location: 'Corriere Espresso' },
          { date: '2026-01-16 15:00', status: 'In transito', location: 'Hub Roma' }
        ]
      });
    }
  };

  return (
    <section id="tracking-advanced" className="py-16 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Traccia il Tuo Ordine</h2>
          <p className="text-white/50">Inserisci il numero d'ordine per vedere lo stato della spedizione</p>
        </div>

        <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-8">
          <div className="flex gap-3 mb-8">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Numero ordine (es: ORD-2026-001234)"
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
            />
            <button
              onClick={trackOrder}
              className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all"
            >
              Traccia
            </button>
          </div>

          {orderStatus && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-gradient-to-r from-sky-500/10 to-blue-600/10 border border-sky-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-sky-400">Ordine</div>
                    <div className="text-xl font-bold text-white">{orderStatus.orderNumber}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-sky-400">Consegna stimata</div>
                    <div className="text-xl font-bold text-white">{orderStatus.estimatedDelivery}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-sky-500 to-blue-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-sm text-white/60">In transito</span>
                </div>
              </div>

              <div className="space-y-3">
                {orderStatus.trackingHistory.map((event: any, i: number) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 rounded-full bg-sky-400"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white">{event.status}</div>
                      <div className="text-sm text-white/50">{event.location}</div>
                      <div className="text-xs text-white/40 mt-1">{event.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ===== LOYALTY PROGRAM =====
export function LoyaltyProgram() {
  const [points, setPoints] = useState(0);
  const [tier, setTier] = useState('Bronzo');

  useEffect(() => {
    const stored = localStorage.getItem('airklim-loyalty');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setPoints(data.points);
        setTier(data.tier);
      } catch (e) {
        console.error('Error loading loyalty data:', e);
      }
    }
  }, []);

  const tiers = [
    { name: 'Bronzo', minPoints: 0, color: 'from-amber-700 to-amber-900', benefits: ['5% sconto', 'Supporto base'] },
    { name: 'Argento', minPoints: 500, color: 'from-gray-400 to-gray-600', benefits: ['10% sconto', 'Supporto prioritario', 'Spedizione gratuita'] },
    { name: 'Oro', minPoints: 1500, color: 'from-yellow-400 to-yellow-600', benefits: ['15% sconto', 'Supporto VIP', 'Spedizione gratuita', 'Accesso anteprime'] },
    { name: 'Platino', minPoints: 3000, color: 'from-sky-400 to-blue-600', benefits: ['20% sconto', 'Supporto dedicato 24/7', 'Spedizione express gratuita', 'Accesso esclusivo', 'Gift annuale'] }
  ];

  const currentTier = tiers.find(t => t.name === tier) || tiers[0];
  const nextTier = tiers[tiers.indexOf(currentTier) + 1];

  return (
    <section id="loyalty" className="py-16 bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Programma Fedeltà AIRKLIM</h2>
          <p className="text-white/50">Accumula punti e ottieni vantaggi esclusivi</p>
        </div>

        <div className={`bg-gradient-to-br ${currentTier.color} rounded-2xl p-8 mb-8`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-sm text-white/80">Il tuo livello</div>
              <div className="text-3xl font-bold text-white">{currentTier.name}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/80">Punti accumulati</div>
              <div className="text-3xl font-bold text-white">{points}</div>
            </div>
          </div>

          {nextTier && (
            <div>
              <div className="flex items-center justify-between text-sm text-white/80 mb-2">
                <span>Progresso verso {nextTier.name}</span>
                <span>{points} / {nextTier.minPoints}</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${(points / nextTier.minPoints) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-white/60 mt-2">
                Mancano {nextTier.minPoints - points} punti per raggiungere il livello {nextTier.name}
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentTier.benefits.map((benefit, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/10 text-center">
                <div className="text-xs text-white/80">{benefit}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {tiers.map((t, i) => (
            <div key={i} className={`p-4 rounded-xl border ${t.name === tier ? 'bg-white/10 border-white/30' : 'bg-white/5 border-white/10'}`}>
              <div className={`text-lg font-bold bg-gradient-to-r ${t.color} bg-clip-text text-transparent mb-2`}>
                {t.name}
              </div>
              <div className="text-sm text-white/60 mb-2">{t.minPoints}+ punti</div>
              <ul className="space-y-1 text-xs text-white/50">
                {t.benefits.map((b, j) => (
                  <li key={j}>✓ {b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
