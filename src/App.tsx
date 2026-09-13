import { useState, useEffect } from 'react';

// Image URLs
const acUnitImg = 'https://images.unsplash.com/photo-1631545308456-7b5e2e990a5e?w=800&h=800&fit=crop&auto=format';
const acOutdoorImg = 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=800&fit=crop&auto=format';
const technicianImg = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&h=800&fit=crop&auto=format';
const livingRoomImg = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop&auto=format';
const commercialImg = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop&auto=format';

// Product SVG Component for consistent product display
function ProductSVG({ variant = 'indoor' }: { variant?: 'indoor' | 'outdoor' }) {
  if (variant === 'outdoor') {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
        <rect x="30" y="40" width="140" height="120" rx="12" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2"/>
        <rect x="45" y="55" width="110" height="70" rx="6" fill="#e2e8f0"/>
        <circle cx="100" cy="90" r="25" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2"/>
        <circle cx="100" cy="90" r="15" fill="#94a3b8"/>
        <path d="M85 90 L100 75 L115 90 L100 105 Z" fill="#64748b"/>
        <rect x="50" y="135" width="100" height="8" rx="4" fill="#cbd5e1"/>
        <rect x="60" y="148" width="80" height="4" rx="2" fill="#e2e8f0"/>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
      <rect x="20" y="60" width="160" height="50" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2"/>
      <rect x="25" y="65" width="150" height="40" rx="8" fill="white"/>
      <rect x="35" y="95" width="130" height="3" rx="1.5" fill="#e2e8f0"/>
      <rect x="35" y="100" width="130" height="3" rx="1.5" fill="#e2e8f0"/>
      <circle cx="160" cy="80" r="3" fill="#0ea5e9"/>
      <rect x="20" y="110" width="160" height="5" rx="2.5" fill="#e2e8f0"/>
      <path d="M40 85 Q100 75 160 85" stroke="#0ea5e9" strokeWidth="1" opacity="0.3"/>
      <path d="M40 88 Q100 78 160 88" stroke="#0ea5e9" strokeWidth="1" opacity="0.2"/>
    </svg>
  );
}

// Sidebar Component
function Sidebar() {
  const [activeSection, setActiveSection] = useState('home');

  const menuItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'prodotti', label: 'Prodotti', icon: '📦' },
    { id: 'chi-siamo', label: 'Chi Siamo', icon: '👥' },
    { id: 'categorie', label: 'Categorie', icon: '📂' },
    { id: 'marchi', label: 'Marchi', icon: '⭐' },
    { id: 'perche-noi', label: 'Perché Noi', icon: '✓' },
    { id: 'faq', label: 'FAQ', icon: '❓' },
    { id: 'news', label: 'News', icon: '📰' },
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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-50 hidden lg:flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl gradient-blue flex items-center justify-center shadow-lg shadow-sky-500/20">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">AIR<span className="text-sky-500">KLIM</span></div>
            <div className="text-xs text-slate-500">Climatizzazione Pro</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-sky-50 text-sky-600 font-semibold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* CTA Button */}
      <div className="p-4 border-t border-gray-100">
        <a
          href="#contatti"
          className="block w-full px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold text-center transition-all hover:shadow-lg hover:shadow-sky-500/25"
        >
          Registrati Ora
        </a>
      </div>
    </aside>
  );
}

// Mobile Menu
function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'prodotti', label: 'Prodotti', icon: '📦' },
    { id: 'chi-siamo', label: 'Chi Siamo', icon: '👥' },
    { id: 'categorie', label: 'Categorie', icon: '📂' },
    { id: 'marchi', label: 'Marchi', icon: '⭐' },
    { id: 'perche-noi', label: 'Perché Noi', icon: '✓' },
    { id: 'faq', label: 'FAQ', icon: '❓' },
    { id: 'news', label: 'News', icon: '📰' },
    { id: 'contatti', label: 'Contatti', icon: '📞' },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg gradient-blue flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900">AIR<span className="text-sky-500">KLIM</span></span>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-600 hover:text-slate-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-slate-900">Menu</span>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
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
                    <a
                      href={`#${item.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 rounded-xl text-slate-600 hover:bg-sky-50 hover:text-sky-600 transition-all"
                    >
                      <span className="text-xl mr-3">{item.icon}</span>
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

// Hero Section
function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen gradient-hero overflow-hidden flex items-center">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="animate-slide-up">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-sm font-medium">
                <span className="w-2 h-2 bg-sky-400 rounded-full mr-2 animate-pulse"></span>
                Distributore Ufficiale Panasonic
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight animate-slide-up-delay-1">
              Climatizzazione <br/>
              <span className="text-gradient">Professionale</span><br/>
              di Alto Livello
            </h1>
            
            <p className="text-lg text-white/60 max-w-lg animate-slide-up-delay-2">
              Da oltre 20 anni, AIRKLIM è il punto di riferimento in Sicilia per impianti di climatizzazione ad alta efficienza. Soluzioni innovative per il massimo comfort.
            </p>
            
            <div className="flex flex-wrap gap-4 animate-slide-up-delay-3">
              <a href="#prodotti" className="px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all hover:shadow-xl hover:shadow-sky-500/25 hover:-translate-y-0.5">
                Scopri i Prodotti
              </a>
              <a href="#contatti" className="px-8 py-4 border border-white/20 hover:border-white/40 text-white rounded-xl font-semibold transition-all hover:bg-white/5">
                Contattaci
              </a>
            </div>
            
            <div className="flex items-center gap-8 pt-4 animate-slide-up-delay-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">20+</div>
                <div className="text-sm text-white/50">Anni Esperienza</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-white/50">Qualità Garantita</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">7+</div>
                <div className="text-sm text-white/50">Top Marchi</div>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="relative">
              <img 
                src={technicianImg} 
                alt="Tecnico HVAC professionale" 
                className="rounded-3xl shadow-2xl animate-float"
              />
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl glass-card flex items-center justify-center animate-float-delayed">
                <div className="text-center">
                  <div className="text-2xl font-bold text-sky-400">99%</div>
                  <div className="text-[10px] text-white/50">Batteri Eliminati</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Features Banner
function FeaturesBanner() {
  const features = [
    { icon: '📦', title: 'Pronta Consegna', desc: 'Disponibilità immediata' },
    { icon: '🔧', title: 'Centro Assistenza', desc: 'Supporto specializzato' },
    { icon: '⭐', title: 'Grandi Marchi', desc: 'Solo i migliori brand' },
    { icon: '🚚', title: 'Distribuzione', desc: 'Logistica efficiente' },
  ];

  return (
    <section className="bg-white py-8 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="flex items-center space-x-3 p-4 rounded-xl hover:bg-sky-50 transition-colors group cursor-default">
              <span className="text-2xl group-hover:scale-110 transition-transform">{f.icon}</span>
              <div>
                <div className="font-semibold text-slate-800 text-sm">{f.title}</div>
                <div className="text-xs text-slate-500">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// About Section
function AboutSection() {
  return (
    <section id="chi-siamo" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-sky-500 font-semibold text-sm uppercase tracking-wider">Chi Siamo</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Esperti in Climatizzazione <br/>da <span className="text-gradient">20 Anni</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Da oltre 20 anni, <strong>AIRKLIM</strong> è un punto di riferimento in Sicilia per chi cerca impianti di climatizzazione ad alta efficienza, capaci di garantire il massimo comfort in ogni ambiente.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Offriamo prodotti di alta qualità e dalle elevate prestazioni, selezionati tra i migliori marchi del settore. La nostra esperienza e la professionalità del nostro team ci permettono di accompagnarti in ogni fase: dalla consulenza alla scelta dell'impianto più adatto, fino all'assistenza post-vendita.
            </p>
            
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-slate-50 text-center">
                <div className="text-2xl font-bold text-sky-600">20+</div>
                <div className="text-xs text-slate-500 mt-1">Anni di esperienza</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 text-center">
                <div className="text-2xl font-bold text-sky-600">500+</div>
                <div className="text-xs text-slate-500 mt-1">Clienti soddisfatti</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 text-center">
                <div className="text-2xl font-bold text-sky-600">7+</div>
                <div className="text-xs text-slate-500 mt-1">Brand partner</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src={livingRoomImg} 
              alt="Soggiorno moderno con climatizzazione" 
              className="rounded-3xl shadow-xl"
            />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-sky-100 rounded-2xl -z-10"></div>
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-2xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Products Section
function ProductsSection() {
  const products = [
    { name: 'Panasonic Mono Split 12000 BTU', power: '3,5 kW', series: 'Z35', stock: 30, brand: 'Panasonic' },
    { name: 'TCL Mono Split 9000 BTU', power: '2,5 kW', series: 'BreezeIN', stock: 30, brand: 'TCL' },
    { name: 'TCL Mono Split 12000 BTU', power: '3,5 kW', series: 'BreezeIN', stock: 30, brand: 'TCL' },
    { name: 'Panasonic Dual Split 9+9', power: 'Inverter R32', series: 'CU-2Z41CBE', stock: 30, brand: 'Panasonic' },
    { name: 'Panasonic Mono Split 9000 BTU', power: '2,5 kW', series: 'Z25', stock: 30, brand: 'Panasonic' },
    { name: 'Panasonic Mono Split 18000 BTU', power: '5,0 kW', series: 'Z50', stock: 15, brand: 'Panasonic' },
  ];

  return (
    <section id="prodotti" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sky-500 font-semibold text-sm uppercase tracking-wider">I Nostri Prodotti</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3">Prodotti in Evidenza</h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            Climatizzatori di alta qualità con prestazioni professionali. Tecnologia, efficienza e design per ogni esigenza.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <div key={i} className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="aspect-square rounded-xl bg-gradient-to-br from-slate-50 to-sky-50 flex items-center justify-center mb-5 group-hover:from-sky-50 group-hover:to-blue-50 transition-colors overflow-hidden p-8">
                <ProductSVG variant={i % 2 === 0 ? 'indoor' : 'outdoor'} />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-sky-600 bg-sky-50 px-2 py-1 rounded-full">{product.brand}</span>
                  <span className="text-xs text-slate-500">{product.stock} disponibili</span>
                </div>
                <h3 className="font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Serie {product.series}</span>
                  <span className="text-sm font-semibold text-slate-700">{product.power}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a href="#" className="inline-flex items-center px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-all hover:shadow-lg">
            Vedi Tutti i Prodotti
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

// Categories Section
function CategoriesSection() {
  const categories = [
    { name: 'Linea Residenziale', icon: '🏠', desc: 'Climatizzatori per la casa', image: livingRoomImg },
    { name: 'Linea Commerciale', icon: '🏢', desc: 'Soluzioni per uffici e negozi', image: commercialImg },
    { name: 'Pompe di Calore', icon: '🔥', desc: 'Aquarea - Efficienza massima', image: acOutdoorImg },
    { name: 'Sistemi VRF', icon: '🏗️', desc: 'Per grandi strutture', image: commercialImg },
    { name: 'Chiller e Rooftop', icon: '❄️', desc: 'Raffreddamento industriale', image: acOutdoorImg },
    { name: 'Accessori', icon: '🔧', desc: 'Tutto per l\'installazione', image: acUnitImg },
  ];

  return (
    <section id="categorie" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sky-500 font-semibold text-sm uppercase tracking-wider">Catalogo</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3">Le Nostre Categorie</h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            Soluzioni di condizionamento e riscaldamento per applicazioni residenziali, commerciali ed industriali.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl border border-gray-100 hover:border-sky-200 hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-slate-100 to-sky-50">
                <div className="absolute inset-0 flex items-center justify-center p-8 opacity-30 group-hover:opacity-50 transition-opacity">
                  <ProductSVG variant={i % 2 === 0 ? 'indoor' : 'outdoor'} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="text-3xl mb-2">{cat.icon}</div>
                <h3 className="text-xl font-bold mb-1">{cat.name}</h3>
                <p className="text-white/80 text-sm">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Brands Section
function BrandsSection() {
  const brands = ['Panasonic', 'TCL', 'Sintra', 'Utek', 'Airzone', 'Rodigas', 'Caleffi'];
  
  return (
    <section id="marchi" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sky-500 font-semibold text-sm uppercase tracking-wider">I Nostri Partner</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3">Scegliamo Solo il Meglio</h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            AIRKLIM tratta esclusivamente marchi leader per qualità, innovazione ed efficienza nel settore della climatizzazione.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map((brand, i) => (
            <div key={i} className="group flex items-center justify-center p-8 rounded-2xl bg-white border border-gray-100 hover:border-sky-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 group-hover:bg-sky-100 flex items-center justify-center mb-3 transition-colors">
                  <span className="text-xl font-bold text-slate-400 group-hover:text-sky-600 transition-colors">{brand[0]}</span>
                </div>
                <span className="font-semibold text-slate-700 group-hover:text-sky-600 transition-colors">{brand}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Why Choose Us Section
function WhyChooseSection() {
  const reasons = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      title: 'Pronta Consegna',
      desc: 'Disponibilità dei prodotti immediata. Ampia scelta e magazzino sempre fornito.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      ),
      title: 'Distribuzione e Logistica',
      desc: 'Ritiro presso la nostra sede o consegna diretta. Servizio efficiente e puntuale.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: 'Supporto Tecnico Specializzato',
      desc: 'Assistenza tecnica in fase di acquisto, progettazione ed installazione.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Assistenza Post Vendita',
      desc: 'Fornitura ricambi, supporto nella manutenzione e gestione degli impianti.'
    },
  ];

  return (
    <section id="perche-noi" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sky-500 font-semibold text-sm uppercase tracking-wider">I Nostri Plus</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3">Perché Sceglierci</h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            Tecnologia, qualità e supporto su misura per professionisti del settore.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, i) => (
            <div key={i} className="text-center group">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-sky-50 group-hover:bg-sky-100 flex items-center justify-center text-sky-600 mb-5 transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-sky-500/10">
                {reason.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">{reason.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-24 gradient-hero relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 right-20 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          Sei un Installatore?
        </h2>
        <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
          Scopri il listino a te dedicato. Climatizzatori e accessori per la climatizzazione con prezzi riservati ai professionisti.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#" className="px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all hover:shadow-xl hover:shadow-sky-500/25">
            Registrati per Acquistare
          </a>
          <a href="#" className="px-8 py-4 border border-white/30 hover:border-white/50 text-white rounded-xl font-semibold transition-all hover:bg-white/5">
            Scopri le Offerte
          </a>
        </div>
        
        <div className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-sky-400">€1.500+</div>
            <div className="text-xs text-white/50 mt-1">Sconto primo acquisto</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-sky-400">24h</div>
            <div className="text-xs text-white/50 mt-1">Consegna rapida</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-sky-400">100%</div>
            <div className="text-xs text-white/50 mt-1">Garanzia ufficiale</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = [
    {
      q: 'A chi si rivolge AIRKLIM?',
      a: 'AIRKLIM è un\'azienda specializzata nella fornitura di impianti di climatizzazione e soluzioni termoidrauliche, rivolta esclusivamente a professionisti del settore. Collaboriamo con installatori, imprese di costruzione, progettisti e rivenditori, fornendo prodotti di alta qualità e supporto tecnico specializzato.'
    },
    {
      q: 'Quali marchi trattate?',
      a: 'Siamo distributori di soluzioni per la climatizzazione e la ventilazione tra le più avanzate sul mercato. Trattiamo marchi come Panasonic, TCL, Sintra, Utek, Airzone, Rodigas e Caleffi. Offriamo impianti ad alta efficienza energetica, tecnologie innovative e soluzioni pensate per garantire il massimo comfort in ogni ambiente.'
    },
    {
      q: 'Fornite anche assistenza e manutenzione sugli impianti?',
      a: 'AIRKLIM non si occupa direttamente dell\'assistenza e della manutenzione, ma supporta gli installatori e le imprese fornendo consulenza tecnica e aggiornamenti sui prodotti. Il nostro team è sempre disponibile per supporto in fase di progettazione e installazione.'
    },
    {
      q: 'Come posso acquistare i vostri prodotti?',
      a: 'Puoi contattarci per ricevere informazioni sui prodotti disponibili e sulle modalità di acquisto. Il nostro team è a disposizione per fornire consulenza e supporto nella selezione delle migliori soluzioni per ogni tipo di impianto. Registrati sul nostro sito per accedere ai prezzi riservati.'
    },
  ];

  return (
    <section id="faq" className="py-24 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sky-500 font-semibold text-sm uppercase tracking-wider">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3">Domande Frequenti</h2>
          <p className="text-slate-600 mt-4">Le risposte alle domande più comuni sui nostri servizi.</p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all hover:shadow-md">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="font-semibold text-slate-900 pr-4">{faq.q}</span>
                <svg className={`w-5 h-5 text-sky-500 flex-shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-96 pb-5' : 'max-h-0'}`}>
                <p className="px-6 text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// News Section
function NewsSection() {
  const articles = [
    {
      title: 'Conto Termico 3.0 – La guida completa di Airklim',
      desc: 'La guida completa per accedere alla nuova agevolazione per la sostituzione del tuo impianto di condizionamento.',
      date: '15 Dicembre 2025',
      category: 'Novità',
      image: livingRoomImg
    },
    {
      title: 'Come Scegliere il Climatizzatore Giusto',
      desc: 'Guida per professionisti e imprese. Scegliere il giusto climatizzatore non è solo una questione di prezzo.',
      date: '12 Febbraio 2025',
      category: 'Climatizzazione',
      image: commercialImg
    },
    {
      title: 'Manutenzione e Assistenza',
      desc: 'Perché un climatizzatore di qualità deve essere seguito nel tempo per garantire efficienza e durata.',
      date: '12 Gennaio 2025',
      category: 'Climatizzazione',
      image: technicianImg
    },
  ];

  return (
    <section id="news" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sky-500 font-semibold text-sm uppercase tracking-wider">Blog & News</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3">Rimani Aggiornato</h2>
          <p className="text-slate-600 mt-4">Eventi, novità e consigli dal mondo della climatizzazione.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, i) => (
            <article key={i} className="group cursor-pointer">
              <div className="aspect-video rounded-2xl overflow-hidden mb-5 relative">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.classList.add('bg-gradient-to-br', 'from-sky-100', 'to-blue-50');
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-sky-600 bg-sky-50 px-2 py-1 rounded-full">{article.category}</span>
                  <span className="text-xs text-slate-400">{article.date}</span>
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors text-lg">{article.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{article.desc}</p>
                <span className="inline-flex items-center text-sky-600 text-sm font-medium group-hover:gap-2 gap-1 transition-all">
                  Leggi di più
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// Contact Section
function ContactSection() {
  return (
    <section id="contatti" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <span className="text-sky-500 font-semibold text-sm uppercase tracking-wider">Contatti</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3">Dove Siamo</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Indirizzo</h4>
                  <p className="text-slate-600">Via Ciachea, 2/e - Zona Industriale<br/>90044 Carini (Palermo)</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Telefono</h4>
                  <p className="text-slate-600">Tel. +39 091 8691680<br/>Fax +39 091 8690692</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Orari</h4>
                  <p className="text-slate-600">Lun - Ven: 8:30 - 13:00 / 15:00 - 18:00<br/>Sab: 8:30 - 12:00</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Contattaci</h3>
            <form className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all" placeholder="Il tuo nome" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Cognome</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all" placeholder="Il tuo cognome" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all" placeholder="email@esempio.it" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Telefono</label>
                <input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all" placeholder="+39 xxx xxx xxxx" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Messaggio</label>
                <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all resize-none" placeholder="Come possiamo aiutarti?"></textarea>
              </div>
              <button type="submit" className="w-full px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-sky-500/25">
                Invia Messaggio
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg gradient-blue flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold">AIR<span className="text-sky-400">KLIM</span></span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Distributore ufficiale di climatizzazione professionale in Sicilia. Da oltre 20 anni al servizio dei professionisti.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Prodotti</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><a href="#" className="hover:text-sky-400 transition-colors">Linea Residenziale</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Linea Commerciale</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Pompe di Calore</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Sistemi VRF</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Accessori</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Azienda</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><a href="#" className="hover:text-sky-400 transition-colors">Chi Siamo</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Marchi</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Blog & News</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Contatti</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Lavora con Noi</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contatti</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li>Via Ciachea, 2/e</li>
              <li>90044 Carini (PA)</li>
              <li>Tel. +39 091 8691680</li>
              <li>Fax +39 091 8690692</li>
            </ul>
            <div className="flex space-x-3 mt-4">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-sky-500 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-sky-500 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-sky-500 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">© 2025 AIRKLIM. Tutti i diritti riservati.</p>
          <div className="flex space-x-6 text-sm text-white/40">
            <a href="#" className="hover:text-sky-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-sky-400 transition-colors">Cookie Policy</a>
            <a href="#" className="hover:text-sky-400 transition-colors">Termini e Condizioni</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main App Component
export default function App() {
  return (
    <div className="min-h-screen">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Mobile Menu */}
      <MobileMenu />
      
      {/* Main Content */}
      <main className="lg:ml-64">
        <HeroSection />
        <FeaturesBanner />
        <AboutSection />
        <ProductsSection />
        <CategoriesSection />
        <BrandsSection />
        <WhyChooseSection />
        <CTASection />
        <FAQSection />
        <NewsSection />
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
}
