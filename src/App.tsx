import { useState, useEffect, useCallback } from 'react';

// Lifestyle images - people enjoying comfort
const heroBg = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=1080&fit=crop&auto=format';
const familyHome = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop&auto=format';
const officeComfort = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop&auto=format';
const happyFamily = 'https://images.unsplash.com/photo-1511895426328-dc87141913bf?w=1200&h=800&fit=crop&auto=format';
const modernLiving = 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&h=800&fit=crop&auto=format';
const coupleRelax = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop&auto=format';
const shopComfort = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop&auto=format';
const bedroomPeace = 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&h=800&fit=crop&auto=format';
const kidsPlay = 'https://images.unsplash.com/photo-1587653263995-422546a7a569?w=1200&h=800&fit=crop&auto=format';
const restaurantGuest = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop&auto=format';
const gymWorkout = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=800&fit=crop&auto=format';
const hotelRoom = 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&h=800&fit=crop&auto=format';

// ===== TYPES =====
interface Product {
  name: string;
  power: string;
  series: string;
  stock: number;
  brand: string;
  variant: 'indoor' | 'outdoor';
  desc: string;
  features: string[];
  price?: string;
}

// ===== DATA =====
const allProducts: Product[] = [
  { name: 'Panasonic Mono Split 12000 BTU', power: '3,5 kW', series: 'Z35', stock: 30, brand: 'Panasonic', variant: 'indoor', desc: 'Climatizzatore monosplit con tecnologia nanoe™ X per aria pura e igienizzata. Ideale per ambienti fino a 35mq.', features: ['nanoe™ X', 'Inverter', 'R32', 'Wi-Fi opzionale', 'Classe A+++'], price: '€ 890' },
  { name: 'TCL Mono Split 9000 BTU', power: '2,5 kW', series: 'BreezeIN', stock: 30, brand: 'TCL', variant: 'indoor', desc: 'Serie BreezeIN con flusso d\'aria intelligente. Silenzioso ed efficiente per camere da letto e uffici.', features: ['Flusso intelligente', 'Inverter', 'R32', 'Wi-Fi integrato', 'Classe A++'], price: '€ 590' },
  { name: 'Panasonic Dual Split 9+9', power: 'Inverter R32', series: 'CU-2Z41CBE', stock: 30, brand: 'Panasonic', variant: 'outdoor', desc: 'Sistema dual split con una unità esterna e due interne. Perfetto per climatizzare due ambienti con un solo motore.', features: ['Dual Split', 'Inverter', 'R32', 'nanoe™ X', 'Classe A++'], price: '€ 1.650' },
  { name: 'Panasonic Mono Split 9000 BTU', power: '2,5 kW', series: 'Z25', stock: 30, brand: 'Panasonic', variant: 'indoor', desc: 'Il modello entry-level della serie Z con tutta la qualità Panasonic. Compatto e silenzioso.', features: ['nanoe™ X', 'Inverter', 'R32', 'Modalità sonno', 'Classe A+++'], price: '€ 750' },
  { name: 'Panasonic Mono Split 18000 BTU', power: '5,0 kW', series: 'Z50', stock: 15, brand: 'Panasonic', variant: 'outdoor', desc: 'Potenza elevata per ambienti grandi fino a 50mq. Ideale per soggiorni open space e uffici.', features: ['nanoe™ X', 'Inverter', 'R32', 'Eco mode', 'Classe A++'], price: '€ 1.290' },
  { name: 'TCL Mono Split 12000 BTU', power: '3,5 kW', series: 'BreezeIN', stock: 30, brand: 'TCL', variant: 'indoor', desc: 'La versione più potente della serie BreezeIN. Rapporto qualità-prezzo eccezionale.', features: ['Flusso intelligente', 'Inverter', 'R32', 'Wi-Fi integrato', 'Classe A++'], price: '€ 690' },
];

// ===== SVG COMPONENT =====
function ProductSVG({ variant = 'indoor' }: { variant?: 'indoor' | 'outdoor' }) {
  if (variant === 'outdoor') {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
        <rect x="30" y="40" width="140" height="120" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="2"/>
        <rect x="45" y="55" width="110" height="70" rx="6" fill="#0f172a"/>
        <circle cx="100" cy="90" r="25" fill="#334155" stroke="#475569" strokeWidth="2"/>
        <circle cx="100" cy="90" r="15" fill="#475569"/>
        <path d="M85 90 L100 75 L115 90 L100 105 Z" fill="#0ea5e9"/>
        <rect x="50" y="135" width="100" height="8" rx="4" fill="#334155"/>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
      <rect x="20" y="60" width="160" height="50" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="2"/>
      <rect x="25" y="65" width="150" height="40" rx="8" fill="#0f172a"/>
      <rect x="35" y="95" width="130" height="3" rx="1.5" fill="#334155"/>
      <rect x="35" y="100" width="130" height="3" rx="1.5" fill="#334155"/>
      <circle cx="160" cy="80" r="3" fill="#0ea5e9"/>
      <rect x="20" y="110" width="160" height="5" rx="2.5" fill="#334155"/>
      <path d="M40 85 Q100 75 160 85" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.5"/>
      <path d="M40 88 Q100 78 160 88" stroke="#0ea5e9" strokeWidth="1" opacity="0.3"/>
    </svg>
  );
}

// ===== PARALLAX IMAGE =====
function ParallaxImage({ src, children, height = 'h-[70vh]' }: { src: string; children: React.ReactNode; height?: string }) {
  return (
    <div className={`relative ${height} overflow-hidden`}>
      <div className="absolute inset-0">
        <img src={src} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      <div className="relative h-full flex items-center justify-center">{children}</div>
    </div>
  );
}

// ===== MODAL COMPONENT =====
function Modal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
      <div className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// ===== TOAST =====
function Toast({ message, isVisible }: { message: string; isVisible: boolean }) {
  return (
    <div className={`fixed bottom-6 right-6 z-[110] transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
      <div className="bg-sky-500 text-white px-6 py-4 rounded-xl shadow-xl shadow-sky-500/25 flex items-center gap-3">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}

// ===== BACK TO TOP =====
function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 left-6 z-[90] w-12 h-12 rounded-full bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center shadow-lg shadow-sky-500/25 transition-all duration-300 lg:left-[280px] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      aria-label="Torna in cima"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
}

// ===== SIDEBAR =====
function Sidebar() {
  const [activeSection, setActiveSection] = useState('home');

  const menuItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'benessere', label: 'Benessere', icon: '💙' },
    { id: 'prodotti', label: 'Prodotti', icon: '📦' },
    { id: 'scenari', label: 'Scenari', icon: '🌟' },
    { id: 'chi-siamo', label: 'Chi Siamo', icon: '👥' },
    { id: 'marchi', label: 'Marchi', icon: '⭐' },
    { id: 'perche-noi', label: 'Perché Noi', icon: '✓' },
    { id: 'faq', label: 'FAQ', icon: '❓' },
    { id: 'contatti', label: 'Contatti', icon: '📞' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = menuItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(menuItems[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-black/95 backdrop-blur-xl border-r border-white/5 z-50 hidden lg:flex flex-col">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl gradient-blue flex items-center justify-center shadow-lg shadow-sky-500/30">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <div className="text-xl font-bold text-white">AIR<span className="text-sky-400">KLIM</span></div>
            <div className="text-xs text-white/40">Il Comfort che Meriti</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-sky-500/10 text-sky-400 font-semibold border border-sky-500/20'
                    : 'text-white/50 hover:bg-white/5 hover:text-white/80 border border-transparent'
                }`}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
                {activeSection === item.id && <span className="ml-auto w-1.5 h-1.5 bg-sky-400 rounded-full"></span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/5">
        <a href="#contatti" className="block w-full px-4 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold text-center transition-all hover:shadow-lg hover:shadow-sky-500/25 text-sm">
          Registrati per Acquistare
        </a>
        <p className="text-center text-[10px] text-white/30 mt-2">Area riservata professionisti</p>
      </div>
    </aside>
  );
}

// ===== MOBILE MENU =====
function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'benessere', label: 'Benessere', icon: '💙' },
    { id: 'prodotti', label: 'Prodotti', icon: '📦' },
    { id: 'scenari', label: 'Scenari', icon: '🌟' },
    { id: 'chi-siamo', label: 'Chi Siamo', icon: '👥' },
    { id: 'marchi', label: 'Marchi', icon: '⭐' },
    { id: 'perche-noi', label: 'Perché Noi', icon: '✓' },
    { id: 'faq', label: 'FAQ', icon: '❓' },
    { id: 'contatti', label: 'Contatti', icon: '📞' },
  ];

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-white/5 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg gradient-blue flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">AIR<span className="text-sky-400">KLIM</span></span>
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white/70 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-72 bg-slate-900/95 backdrop-blur-xl border-l border-white/5" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-white">Menu</span>
                <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <nav className="p-4">
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} onClick={() => setIsOpen(false)} className="flex items-center px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all">
                      <span className="text-lg mr-3">{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

// ===== HERO =====
function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden flex items-center">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>
      </div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-3xl space-y-8">
          <div className="animate-slide-up">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-sm font-medium">
              <span className="w-2 h-2 bg-sky-400 rounded-full mr-2 animate-pulse"></span>
              Distributore Ufficiale Panasonic
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight animate-slide-up-delay-1">
            Il Comfort che <br/><span className="text-gradient">Trasforma</span><br/>la Tua Vita
          </h1>
          <p className="text-xl text-white/60 max-w-xl animate-slide-up-delay-2 leading-relaxed">
            Perché ogni giorno meriti di essere vissuto nel massimo benessere. Aria pura, temperatura perfetta, serenità assoluta.
          </p>
          <div className="flex flex-wrap gap-4 animate-slide-up-delay-3">
            <a href="#benessere" className="px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all hover:shadow-xl hover:shadow-sky-500/25 hover:-translate-y-0.5">
              Scopri il Benessere
            </a>
            <a href="#scenari" className="px-8 py-4 border border-white/20 hover:border-white/40 text-white rounded-xl font-semibold transition-all hover:bg-white/5">
              Vedi gli Scenari
            </a>
          </div>
          <div className="flex items-center gap-8 pt-8 animate-slide-up-delay-3">
            <div className="text-center"><div className="text-3xl font-bold text-white">20+</div><div className="text-sm text-white/40">Anni di Passione</div></div>
            <div className="w-px h-12 bg-white/10"></div>
            <div className="text-center"><div className="text-3xl font-bold text-white">99%</div><div className="text-sm text-white/40">Batteri Eliminati</div></div>
            <div className="w-px h-12 bg-white/10"></div>
            <div className="text-center"><div className="text-3xl font-bold text-white">∞</div><div className="text-sm text-white/40">Momenti Perfetti</div></div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
      </div>
    </section>
  );
}

// ===== WELLBEING =====
function WellbeingSection() {
  return (
    <section id="benessere" className="relative py-24 bg-black overflow-hidden">
      <div className="absolute inset-0">
        <img src={happyFamily} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Il Vero Valore</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mt-4">Non Vendiamo Climatizzatori.<br/><span className="text-gradient">Regaliamo Benessere.</span></h2>
          <p className="text-white/50 mt-6 max-w-2xl mx-auto text-lg">Ogni sistema che installiamo è un investimento nella qualità della tua vita. Perché il comfort non è un lusso, è un diritto.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="group relative overflow-hidden rounded-3xl">
            <div className="aspect-[3/4] relative">
              <img src={familyHome} alt="Famiglia felice a casa" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="text-4xl mb-3">🏡</div>
              <h3 className="text-2xl font-bold text-white mb-2">A Casa Tua</h3>
              <p className="text-white/60">Ogni momento in famiglia diventa più prezioso quando l'aria è pura e la temperatura è perfetta.</p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-3xl">
            <div className="aspect-[3/4] relative">
              <img src={bedroomPeace} alt="Camera da letto serena" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="text-4xl mb-3">😴</div>
              <h3 className="text-2xl font-bold text-white mb-2">Sonni Perfetti</h3>
              <p className="text-white/60">Il silenzio e la temperatura ideale per notti rigeneranti e risvegli pieni di energia.</p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-3xl">
            <div className="aspect-[3/4] relative">
              <img src={kidsPlay} alt="Bambini che giocano" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="text-4xl mb-3">👶</div>
              <h3 className="text-2xl font-bold text-white mb-2">Per i Più Piccoli</h3>
              <p className="text-white/60">Aria igienizzata con nanoe™ X che elimina il 99% di batteri e virus. Sicurezza per tutta la famiglia.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== PRODUCTS =====
function ProductsSection({ onProductClick }: { onProductClick: (product: Product) => void }) {
  return (
    <section id="prodotti" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Tecnologia al Servizio del Comfort</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">I Nostri Prodotti</h2>
          <p className="text-white/50 mt-4 max-w-2xl mx-auto">Solo i migliori marchi per garantirti prestazioni eccezionali, efficienza energetica e design raffinato.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProducts.map((product, i) => (
            <div
              key={i}
              onClick={() => onProductClick(product)}
              className="group bg-slate-900/50 rounded-2xl p-6 border border-white/5 hover:border-sky-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/5 cursor-pointer"
            >
              <div className="aspect-square rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center mb-5 p-8 group-hover:from-slate-800/80 group-hover:to-sky-900/20 transition-colors">
                <ProductSVG variant={product.variant} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">{product.brand}</span>
                  <span className="text-xs text-white/40">{product.stock} disponibili</span>
                </div>
                <h3 className="font-semibold text-white group-hover:text-sky-400 transition-colors">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/40">Serie {product.series}</span>
                  <span className="text-sm font-semibold text-white/70">{product.power}</span>
                </div>
                {product.price && (
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-lg font-bold text-sky-400">{product.price}</span>
                    <span className="text-xs text-white/30 ml-2">IVA esclusa</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <a href="#contatti" className="inline-flex items-center px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all border border-white/10 hover:border-white/20">
            Richiedi Listino Completo
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>
      </div>
    </section>
  );
}

// ===== SCENARIOS =====
function ScenariosSection({ onScenarioClick }: { onScenarioClick: (title: string) => void }) {
  const scenarios = [
    { title: 'La Tua Casa', subtitle: 'Un rifugio di comfort', image: modernLiving, desc: 'Trasforma ogni stanza in un oasis di benessere.' },
    { title: 'Il Tuo Ufficio', subtitle: 'Produttività al massimo', image: officeComfort, desc: 'Un ambiente di lavoro che ispira concentrazione.' },
    { title: 'Il Tuo Negozio', subtitle: 'Clienti felici', image: shopComfort, desc: 'I clienti restano più a lungo quando si sentono a loro agio.' },
    { title: 'Il Tuo Ristorante', subtitle: 'Atmosfera perfetta', image: restaurantGuest, desc: 'Ogni pasto diventa un\'esperienza indimenticabile.' },
    { title: 'La Tua Palestra', subtitle: 'Performance elevate', image: gymWorkout, desc: 'Aria fresca per allenamenti intensi.' },
    { title: 'Il Tuo Hotel', subtitle: 'Ospiti soddisfatti', image: hotelRoom, desc: 'Recensioni a 5 stelle partono dal comfort.' },
  ];

  return (
    <section id="scenari" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Dove Portiamo il Comfort</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3">Ogni Spazio Merita<br/><span className="text-gradient">la Sua Perfezione</span></h2>
          <p className="text-white/50 mt-6 max-w-2xl mx-auto text-lg">Dalle case alle aziende, dagli uffici ai negozi. Portiamo il benessere ovunque la vita accade.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario, i) => (
            <div key={i} onClick={() => onScenarioClick(scenario.title)} className="group relative overflow-hidden rounded-2xl cursor-pointer h-80">
              <img src={scenario.image} alt={scenario.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent group-hover:via-black/70 transition-all duration-500"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 transform group-hover:-translate-y-2 transition-transform duration-500">
                <div className="text-xs text-sky-400 font-medium uppercase tracking-wider mb-1">{scenario.subtitle}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{scenario.title}</h3>
                <p className="text-white/60 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">{scenario.desc}</p>
                <span className="inline-flex items-center text-sky-400 text-xs font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Richiedi soluzione →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== LIFESTYLE BREAK =====
function LifestyleBreak() {
  return (
    <ParallaxImage src={coupleRelax} height="h-[60vh]">
      <div className="text-center max-w-3xl px-4">
        <div className="text-5xl mb-6">💙</div>
        <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">"Il comfort non è un lusso.<br/>È la base per vivere meglio."</h2>
        <p className="text-white/50 text-lg">Da oltre 20 anni aiutiamo le persone a trasformare i loro spazi in luoghi di benessere.</p>
      </div>
    </ParallaxImage>
  );
}

// ===== ABOUT =====
function AboutSection() {
  return (
    <section id="chi-siamo" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">La Nostra Storia</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">20 Anni di Passione<br/>per il <span className="text-gradient">Tuo Benessere</span></h2>
            <p className="text-white/60 text-lg leading-relaxed">Da oltre 20 anni, <strong className="text-white">AIRKLIM</strong> è il punto di riferimento in Sicilia per chi cerca impianti di climatizzazione ad alta efficienza. Non siamo solo fornitori: siamo partner nel tuo comfort.</p>
            <p className="text-white/50 leading-relaxed">La nostra esperienza e la professionalità del nostro team ci permettono di accompagnarti in ogni fase: dalla consulenza alla scelta dell'impianto più adatto, fino all'assistenza post-vendita.</p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center"><div className="text-2xl font-bold text-sky-400">20+</div><div className="text-xs text-white/40 mt-1">Anni di esperienza</div></div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center"><div className="text-2xl font-bold text-sky-400">500+</div><div className="text-xs text-white/40 mt-1">Clienti felici</div></div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center"><div className="text-2xl font-bold text-sky-400">7+</div><div className="text-xs text-white/40 mt-1">Brand partner</div></div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden">
              <img src={familyHome} alt="Famiglia che gode del comfort" className="w-full h-[500px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-sky-500/10 rounded-2xl -z-10 blur-xl"></div>
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500/10 rounded-2xl -z-10 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== BRANDS =====
function BrandsSection({ onBrandClick }: { onBrandClick: (brand: string) => void }) {
  const brands = ['Panasonic', 'TCL', 'Sintra', 'Utek', 'Airzone', 'Rodigas', 'Caleffi'];
  return (
    <section id="marchi" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">I Nostri Partner</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">Solo i Migliori Marchi</h2>
          <p className="text-white/50 mt-4 max-w-2xl mx-auto">Selezioniamo esclusivamente brand leader per qualità, innovazione ed efficienza.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map((brand, i) => (
            <div key={i} onClick={() => onBrandClick(brand)} className="group flex items-center justify-center p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-sky-500/30 hover:bg-sky-500/5 transition-all duration-300 cursor-pointer">
              <div className="text-center">
                <div className="w-14 h-14 mx-auto rounded-xl bg-white/5 group-hover:bg-sky-500/10 flex items-center justify-center mb-3 transition-colors border border-white/10 group-hover:border-sky-500/20">
                  <span className="text-2xl font-bold text-white/30 group-hover:text-sky-400 transition-colors">{brand[0]}</span>
                </div>
                <span className="font-semibold text-white/60 group-hover:text-white transition-colors">{brand}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== WHY CHOOSE US =====
function WhyChooseSection() {
  const reasons = [
    { icon: '📦', title: 'Pronta Consegna', desc: 'Magazzino sempre fornito. Quando ne hai bisogno, noi ci siamo.' },
    { icon: '🚚', title: 'Logistica Efficiente', desc: 'Ritiro in sede o consegna diretta. Veloce, puntuale, affidabile.' },
    { icon: '🔧', title: 'Supporto Tecnico', desc: 'Assistenza in ogni fase: acquisto, progettazione e installazione.' },
    { icon: '🛡️', title: 'Post Vendita', desc: 'Ricambi, manutenzione e gestione degli impianti nel tempo.' },
  ];
  return (
    <section id="perche-noi" className="relative py-24 bg-slate-950 overflow-hidden">
      <div className="absolute inset-0"><img src={officeComfort} alt="" className="w-full h-full object-cover opacity-5" /></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">I Nostri Plus</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">Perché Scegliere AIRKLIM</h2>
          <p className="text-white/50 mt-4 max-w-2xl mx-auto">Tecnologia, qualità e supporto su misura per professionisti del settore.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, i) => (
            <div key={i} className="text-center group p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-sky-500/20 hover:bg-sky-500/5 transition-all duration-300">
              <div className="text-4xl mb-5 group-hover:scale-110 transition-transform">{reason.icon}</div>
              <h3 className="font-bold text-white text-lg mb-3">{reason.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== FAQ =====
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    { q: 'A chi si rivolge AIRKLIM?', a: 'AIRKLIM è un\'azienda specializzata nella fornitura di impianti di climatizzazione, rivolta a professionisti del settore: installatori, imprese di costruzione, progettisti e rivenditori.' },
    { q: 'Quali marchi trattate?', a: 'Trattiamo marchi come Panasonic, TCL, Sintra, Utek, Airzone, Rodigas e Caleffi. Offriamo impianti ad alta efficienza energetica e tecnologie innovative.' },
    { q: 'Fornite assistenza e manutenzione?', a: 'AIRKLIM supporta gli installatori fornendo consulenza tecnica e aggiornamenti sui prodotti. Il nostro team è sempre disponibile per supporto in fase di progettazione e installazione.' },
    { q: 'Come posso acquistare i vostri prodotti?', a: 'Contattaci per ricevere informazioni. Registrati sul nostro sito per accedere ai prezzi riservati ai professionisti.' },
  ];
  return (
    <section id="faq" className="py-24 bg-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">Domande Frequenti</h2>
          <p className="text-white/50 mt-4">Le risposte alle domande più comuni sui nostri servizi.</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white/[0.02] rounded-2xl border border-white/5 overflow-hidden transition-all hover:border-white/10">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full px-6 py-5 flex items-center justify-between text-left">
                <span className="font-semibold text-white pr-4">{faq.q}</span>
                <svg className={`w-5 h-5 text-sky-400 flex-shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-96 pb-5' : 'max-h-0'}`}>
                <p className="px-6 text-white/50 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== CONTACT =====
function ContactSection({ showToast }: { showToast: (msg: string) => void }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Messaggio inviato con successo! Ti ricontatteremo presto.');
  };

  return (
    <section id="contatti" className="relative py-24 bg-slate-950 overflow-hidden">
      <div className="absolute inset-0"><img src={modernLiving} alt="" className="w-full h-full object-cover opacity-5" /></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Contatti</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">Parliamo del<br/>Tuo Progetto</h2>
              <p className="text-white/50 mt-4">Siamo qui per aiutarti a trovare la soluzione perfetta per ogni esigenza.</p>
            </div>
            <div className="space-y-5">
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center flex-shrink-0 border border-sky-500/20">
                  <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div><h4 className="font-semibold text-white text-sm">Indirizzo</h4><p className="text-white/50 text-sm">Via Ciachea, 2/e - 90044 Carini (PA)</p></div>
              </div>
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center flex-shrink-0 border border-sky-500/20">
                  <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div><h4 className="font-semibold text-white text-sm">Telefono</h4><p className="text-white/50 text-sm">+39 091 8691680</p></div>
              </div>
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center flex-shrink-0 border border-sky-500/20">
                  <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div><h4 className="font-semibold text-white text-sm">Orari</h4><p className="text-white/50 text-sm">Lun-Ven: 8:30-13:00 / 15:00-18:00</p></div>
              </div>
            </div>
          </div>
          <div className="bg-white/[0.02] rounded-2xl p-8 border border-white/5 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-6">Inviaci un Messaggio</h3>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-5">
                <div><label className="block text-sm font-medium text-white/60 mb-1.5">Nome</label><input type="text" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all" placeholder="Il tuo nome" /></div>
                <div><label className="block text-sm font-medium text-white/60 mb-1.5">Cognome</label><input type="text" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all" placeholder="Il tuo cognome" /></div>
              </div>
              <div><label className="block text-sm font-medium text-white/60 mb-1.5">Email</label><input type="email" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all" placeholder="email@esempio.it" /></div>
              <div><label className="block text-sm font-medium text-white/60 mb-1.5">Messaggio</label><textarea rows={4} required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all resize-none" placeholder="Come possiamo aiutarti?"></textarea></div>
              <button type="submit" className="w-full px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-sky-500/25">Invia Messaggio</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== FOOTER =====
function Footer({ onNavigate }: { onNavigate: (section: string) => void }) {
  return (
    <footer className="bg-black border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-white/5">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg gradient-blue flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <span className="text-xl font-bold text-white">AIR<span className="text-sky-400">KLIM</span></span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">Il comfort che trasforma la tua vita. Da oltre 20 anni al servizio del benessere.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Prodotti</h4>
            <ul className="space-y-2 text-sm text-white/40">
              <li><button onClick={() => onNavigate('prodotti')} className="hover:text-sky-400 transition-colors text-left">Linea Residenziale</button></li>
              <li><button onClick={() => onNavigate('prodotti')} className="hover:text-sky-400 transition-colors text-left">Linea Commerciale</button></li>
              <li><button onClick={() => onNavigate('prodotti')} className="hover:text-sky-400 transition-colors text-left">Pompe di Calore</button></li>
              <li><button onClick={() => onNavigate('prodotti')} className="hover:text-sky-400 transition-colors text-left">Sistemi VRF</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Azienda</h4>
            <ul className="space-y-2 text-sm text-white/40">
              <li><button onClick={() => onNavigate('chi-siamo')} className="hover:text-sky-400 transition-colors text-left">Chi Siamo</button></li>
              <li><button onClick={() => onNavigate('marchi')} className="hover:text-sky-400 transition-colors text-left">Marchi</button></li>
              <li><button onClick={() => onNavigate('contatti')} className="hover:text-sky-400 transition-colors text-left">Contatti</button></li>
              <li><button onClick={() => onNavigate('contatti')} className="hover:text-sky-400 transition-colors text-left">Lavora con Noi</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Contatti</h4>
            <ul className="space-y-2 text-sm text-white/40">
              <li>Via Ciachea, 2/e</li>
              <li>90044 Carini (PA)</li>
              <li>Tel. +39 091 8691680</li>
            </ul>
            <div className="flex space-x-3 mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-sky-500 flex items-center justify-center transition-colors border border-white/5">
                <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-sky-500 flex items-center justify-center transition-colors border border-white/5">
                <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">© 2025 AIRKLIM. Tutti i diritti riservati.</p>
          <div className="flex space-x-6 text-sm text-white/30">
            <button onClick={() => onNavigate('privacy')} className="hover:text-sky-400 transition-colors">Privacy</button>
            <button onClick={() => onNavigate('cookie')} className="hover:text-sky-400 transition-colors">Cookie</button>
            <button onClick={() => onNavigate('termini')} className="hover:text-sky-400 transition-colors">Termini</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ===== MAIN APP =====
export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [scenarioModal, setScenarioModal] = useState<string | null>(null);
  const [brandModal, setBrandModal] = useState<string | null>(null);
  const [legalModal, setLegalModal] = useState<string | null>(null);
  const [toast, setToast] = useState({ message: '', visible: false });

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleNavigate = useCallback((target: string) => {
    if (['privacy', 'cookie', 'termini'].includes(target)) {
      setLegalModal(target);
    } else {
      scrollToSection(target);
    }
  }, [scrollToSection]);

  const legalContent: Record<string, { title: string; body: string }> = {
    privacy: { title: 'Privacy Policy', body: 'AIRKLIM rispetta la tua privacy. I dati personali raccolti vengono utilizzati esclusivamente per fornire i servizi richiesti e non vengono condivisi con terze parti senza il tuo consenso. Per maggiori informazioni, contattaci al numero +39 091 8691680.' },
    cookie: { title: 'Cookie Policy', body: 'Questo sito utilizza cookie tecnici essenziali per il funzionamento e cookie analitici per migliorare l\'esperienza utente. Puoi gestire le preferenze sui cookie nelle impostazioni del tuo browser. Continuando la navigazione accetti l\'utilizzo dei cookie.' },
    termini: { title: 'Termini e Condizioni', body: 'L\'accesso e l\'utilizzo del sito AIRKLIM sono soggetti ai seguenti termini. I prezzi indicati sono da considerarsi IVA esclusa e riservati ai professionisti registrati. AIRKLIM si riserva il diritto di modificare prezzi e disponibilità senza preavviso. Per qualsiasi controversia, fare riferimento alla legislazione italiana vigente.' },
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar />
      <MobileMenu />
      <BackToTop />
      <Toast message={toast.message} isVisible={toast.visible} />

      <main className="lg:ml-64">
        <HeroSection />
        <WellbeingSection />
        <ProductsSection onProductClick={setSelectedProduct} />
        <ScenariosSection onScenarioClick={setScenarioModal} />
        <LifestyleBreak />
        <AboutSection />
        <BrandsSection onBrandClick={setBrandModal} />
        <WhyChooseSection />
        <FAQSection />
        <ContactSection showToast={showToast} />
        <Footer onNavigate={handleNavigate} />
      </main>

      {/* Product Detail Modal */}
      <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)}>
        {selectedProduct && (
          <div className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-12 relative">
              <ProductSVG variant={selectedProduct.variant} />
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">{selectedProduct.brand}</span>
                <span className="text-xs text-white/40">{selectedProduct.stock} disponibili</span>
              </div>
              <h3 className="text-xl font-bold text-white">{selectedProduct.name}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{selectedProduct.desc}</p>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.features.map((f, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/60 border border-white/10">{f}</span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                  <span className="text-2xl font-bold text-sky-400">{selectedProduct.price}</span>
                  <span className="text-xs text-white/30 ml-2">IVA esclusa</span>
                </div>
                <span className="text-sm text-white/40">Serie {selectedProduct.series} • {selectedProduct.power}</span>
              </div>
              <a href="#contatti" onClick={() => setSelectedProduct(null)} className="block w-full text-center px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all">
                Richiedi Informazioni
              </a>
            </div>
          </div>
        )}
      </Modal>

      {/* Scenario Modal */}
      <Modal isOpen={!!scenarioModal} onClose={() => setScenarioModal(null)}>
        <div className="bg-slate-900 rounded-2xl border border-white/10 p-8">
          <button onClick={() => setScenarioModal(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="text-4xl mb-4">🌟</div>
          <h3 className="text-2xl font-bold text-white mb-3">Soluzione per {scenarioModal}</h3>
          <p className="text-white/50 mb-6">Compila il form e ti proposeremo la soluzione di climatizzazione ideale per il tuo spazio.</p>
          <form onSubmit={(e) => { e.preventDefault(); setScenarioModal(null); showToast('Richiesta inviata! Ti contatteremo per una soluzione su misura.'); }}>
            <div className="space-y-4">
              <input type="text" required placeholder="Nome e Cognome" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none" />
              <input type="email" required placeholder="Email" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none" />
              <input type="tel" placeholder="Telefono" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none" />
              <textarea rows={3} placeholder={`Descrivi le tue esigenze per ${scenarioModal}...`} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none resize-none"></textarea>
              <button type="submit" className="w-full px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all">Invia Richiesta</button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Brand Modal */}
      <Modal isOpen={!!brandModal} onClose={() => setBrandModal(null)}>
        <div className="bg-slate-900 rounded-2xl border border-white/10 p-8">
          <button onClick={() => setBrandModal(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="w-16 h-16 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4">
            <span className="text-3xl font-bold text-sky-400">{brandModal?.[0]}</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">{brandModal}</h3>
          <p className="text-white/50 mb-4">AIRKLIM è distributore ufficiale {brandModal}. Scopri la gamma completa di prodotti disponibili nel nostro catalogo.</p>
          <div className="flex gap-3">
            <button onClick={() => { setBrandModal(null); scrollToSection('prodotti'); }} className="flex-1 px-4 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all text-sm">Vedi Prodotti</button>
            <button onClick={() => { setBrandModal(null); scrollToSection('contatti'); }} className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all border border-white/10 text-sm">Contattaci</button>
          </div>
        </div>
      </Modal>

      {/* Legal Modal */}
      <Modal isOpen={!!legalModal} onClose={() => setLegalModal(null)}>
        {legalModal && legalContent[legalModal] && (
          <div className="bg-slate-900 rounded-2xl border border-white/10 p-8">
            <button onClick={() => setLegalModal(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-2xl font-bold text-white mb-4">{legalContent[legalModal].title}</h3>
            <p className="text-white/60 leading-relaxed">{legalContent[legalModal].body}</p>
            <button onClick={() => setLegalModal(null)} className="mt-6 w-full px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all border border-white/10">Chiudi</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
