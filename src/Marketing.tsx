import { useState, useEffect } from 'react';

// ===== LEAD MAGNET COMPONENT =====
export function LeadMagnetSection() {
  const [email, setEmail] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const guides = [
    {
      id: 'guida-scelta',
      title: 'Guida Completa alla Scelta del Climatizzatore',
      description: 'Scopri come scegliere il climatizzatore perfetto per le tue esigenze. 25 pagine di consigli pratici.',
      icon: '📖',
      pages: 25,
      value: '€29'
    },
    {
      id: 'errori-installazione',
      title: '10 Errori da Evitare nell\'Installazione',
      description: 'Gli errori più comuni che compromettono l\'efficienza del tuo impianto. Evitali con la nostra guida.',
      icon: '⚠️',
      pages: 15,
      value: '€19'
    },
    {
      id: 'conto-termico',
      title: 'Conto Termico 3.0: Guida Pratica',
      description: 'Come ottenere fino al 65% di detrazione. Guida passo-passo con esempi pratici e documenti necessari.',
      icon: '💰',
      pages: 20,
      value: '€24'
    }
  ];

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && selectedGuide) {
      setShowSuccess(true);
      // Simulate download
      setTimeout(() => {
        setShowSuccess(false);
        setEmail('');
        setSelectedGuide(null);
      }, 3000);
    }
  };

  return (
    <section id="lead-magnet" className="py-24 bg-gradient-to-b from-black to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Risorse Gratuite</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3">
            Scarica le Nostre Guide<br />
            <span className="text-gradient">Gratis per Te</span>
          </h2>
          <p className="text-white/50 mt-6 max-w-2xl mx-auto text-lg">
            Guide pratiche e approfondite per aiutarti a fare le scelte migliori. Inserisci la tua email per scaricarle subito.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {guides.map(guide => (
            <div
              key={guide.id}
              onClick={() => setSelectedGuide(guide.id)}
              className={`group cursor-pointer p-8 rounded-2xl border transition-all duration-300 ${
                selectedGuide === guide.id
                  ? 'bg-sky-500/10 border-sky-500/50 scale-105'
                  : 'bg-white/[0.02] border-white/10 hover:border-sky-500/30 hover:-translate-y-1'
              }`}
            >
              <div className="text-5xl mb-4">{guide.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{guide.title}</h3>
              <p className="text-white/50 text-sm mb-4">{guide.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">{guide.pages} pagine</span>
                <span className="text-sky-400 font-semibold line-through">{guide.value}</span>
                <span className="text-green-400 font-bold">GRATIS</span>
              </div>
            </div>
          ))}
        </div>

        {selectedGuide && (
          <div className="max-w-md mx-auto">
            <form onSubmit={handleDownload} className="bg-white/[0.03] rounded-2xl border border-white/10 p-8">
              <h3 className="text-xl font-bold text-white mb-4">Scarica la Guida Gratuita</h3>
              <input
                type="email"
                required
                placeholder="La tua email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none mb-4"
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all"
              >
                Scarica Ora Gratis
              </button>
              <p className="text-xs text-white/40 mt-3 text-center">
                Riceverai anche la nostra newsletter con offerte esclusive. Puoi cancellarti in qualsiasi momento.
              </p>
            </form>
          </div>
        )}

        {showSuccess && (
          <div className="fixed bottom-6 right-6 z-[110] bg-green-500 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Guida inviata alla tua email!</span>
          </div>
        )}
      </div>
    </section>
  );
}

// ===== SMART POPUP SYSTEM =====
export function SmartPopupSystem() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState<'exit' | 'scroll' | 'timed' | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    // Check if user already subscribed
    const hasSubscribed = localStorage.getItem('airklim-newsletter');
    if (hasSubscribed) return;

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !showPopup) {
        setPopupType('exit');
        setShowPopup(true);
      }
    };

    // Scroll trigger (50% scroll)
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent >= 50 && !showPopup) {
        setPopupType('scroll');
        setShowPopup(true);
      }
    };

    // Timed popup (30 seconds)
    const timer = setTimeout(() => {
      if (!showPopup) {
        setPopupType('timed');
        setShowPopup(true);
      }
    }, 30000);

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [showPopup]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      localStorage.setItem('airklim-newsletter', email);
      setSubscribed(true);
      setTimeout(() => {
        setShowPopup(false);
        setSubscribed(false);
        setEmail('');
      }, 2000);
    }
  };

  if (!showPopup) return null;

  const getPopupContent = () => {
    switch (popupType) {
      case 'exit':
        return {
          title: 'Aspetta! Non Andartene Ancora',
          description: 'Iscriviti alla newsletter e ricevi subito il 10% di sconto sul tuo primo acquisto.',
          cta: 'Ottieni il 10% di Sconto',
          icon: '🎁'
        };
      case 'scroll':
        return {
          title: 'Ti Stai Informando? Abbiamo una Sorpresa!',
          description: 'Iscriviti alla newsletter e ricevi guide esclusive e offerte riservate.',
          cta: 'Iscriviti Ora',
          icon: '📧'
        };
      case 'timed':
        return {
          title: 'Offerta Speciale per Te',
          description: 'Iscriviti alla newsletter e ricevi subito una guida gratuita + offerte esclusive.',
          cta: 'Ricevi la Guida Gratis',
          icon: '✨'
        };
      default:
        return null;
    }
  };

  const content = getPopupContent();
  if (!content) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowPopup(false)}>
      <div className="bg-slate-900 rounded-2xl border border-white/10 p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {subscribed ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-white mb-2">Iscrizione Completata!</h3>
            <p className="text-white/50">Controlla la tua email per la guida gratuita.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{content.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{content.title}</h3>
              <p className="text-white/50">{content.description}</p>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-4">
              <input
                type="email"
                required
                placeholder="La tua email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all"
              >
                {content.cta}
              </button>
            </form>

            <p className="text-xs text-white/40 mt-4 text-center">
              Nessuno spam. Puoi cancellarti in qualsiasi momento.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ===== NEWSLETTER SECTION =====
export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      localStorage.setItem('airklim-newsletter', email);
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <section id="newsletter" className="py-24 bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-sky-500/10 to-blue-600/10 rounded-3xl border border-sky-500/20 p-12 text-center">
          <div className="text-5xl mb-6">📬</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Resta Aggiornato
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
            Iscriviti alla newsletter per ricevere offerte esclusive, guide pratiche e novità sui prodotti.
          </p>

          {subscribed ? (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
              <div className="text-4xl mb-2">✅</div>
              <h3 className="text-xl font-bold text-white mb-2">Iscrizione Completata!</h3>
              <p className="text-white/60">Grazie per esserti iscritto. Riceverai presto la nostra newsletter.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="La tua email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all whitespace-nowrap"
              >
                Iscriviti Gratis
              </button>
            </form>
          )}

          <div className="grid grid-cols-3 gap-6 mt-12 text-center">
            <div>
              <div className="text-3xl font-bold text-sky-400">5.000+</div>
              <div className="text-sm text-white/50 mt-1">Iscritti</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-sky-400">Settimanale</div>
              <div className="text-sm text-white/50 mt-1">Frequenza</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-sky-400">0</div>
              <div className="text-sm text-white/50 mt-1">Spam</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== SOCIAL SHARING =====
export function SocialSharing() {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const title = 'AIRKLIM - Distributore Ufficiale Panasonic | Climatizzazione Sicilia';

  const shareLinks = [
    {
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      color: 'hover:bg-blue-600'
    },
    {
      name: 'Twitter',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`,
      color: 'hover:bg-sky-500'
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(title)}`,
      color: 'hover:bg-blue-700'
    },
    {
      name: 'WhatsApp',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      ),
      url: `https://wa.me/?text=${encodeURIComponent(title + ' ' + currentUrl)}`,
      color: 'hover:bg-green-500'
    }
  ];

  return (
    <div className="fixed bottom-40 right-6 z-40 flex flex-col gap-2 lg:right-8">
      {shareLinks.map((social, i) => (
        <a
          key={i}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-12 h-12 rounded-full bg-slate-800 ${social.color} text-white flex items-center justify-center shadow-lg border border-white/10 transition-all hover:scale-110`}
          aria-label={`Condividi su ${social.name}`}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
}
