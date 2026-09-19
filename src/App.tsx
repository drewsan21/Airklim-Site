import { useState, useEffect, useCallback } from 'react';
import {
  ContoTermicoCalculator,
  BTUCalculator,
  ProductComparison,
  WhatsAppButton,
  EnergySavingsSimulator,
  PromotionsSection,
  KnowledgeBase,
  FinancingCalculator,
  OrderTracking,
  InstallerMap
} from './Features';
import { CookieBanner } from './CookieBanner';
import { LegalPages } from './LegalPages';
import { BlogSection } from './Blog';
import { VideoSection } from './VideoSection';
import { TestimonialsSection } from './TestimonialsSection';
import { GallerySection } from './GallerySection';
import { AuthModal, CartSidebar, UserDashboard } from './Commerce';
import { useAuth, useCart } from './hooks';
import { LeadMagnetSection, SmartPopupSystem, NewsletterSection, SocialSharing } from './Marketing';
import { LanguageProvider, LanguageSwitcher } from './LanguageContext';
import { EmailAutomationSystem, AnalyticsDashboard } from './Analytics';
import { useWebVitals, preloadCriticalResources } from './Performance';
import { NPSSurvey, FeedbackWidget, UsabilityTestRecorder } from './UXResearch';
import { ErrorBoundary, useErrorHandler, usePerformanceMonitoring, UptimeMonitor, ErrorLogViewer } from './ErrorTracking';
import { securityMiddleware } from './security';

// ===== LIFESTYLE IMAGES =====
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

// ===== PRODUCT IMAGES (AI Generated) =====
const panasonicEthereaImg = 'https://image.qwenlm.ai/generated-images/3d663212-3b4e-4de4-872f-4f64990b4f9d/_result.png';
const tclBreezeInImg = 'https://image.qwenlm.ai/generated-images/a0e66962-7390-4937-8e72-e1fe1b1f5530/_result.png';
const aquareaImg = 'https://image.qwenlm.ai/generated-images/7179235c-6d93-4cfa-83ba-456e0e5ac8f1/_result.png';
const ecoiVrfImg = 'https://image.qwenlm.ai/generated-images/515d4f46-b20c-4a09-a54b-4a10bc71a57c/_result.png';
const residentialLifeImg = 'https://image.qwenlm.ai/generated-images/75706634-c21a-45d5-93ba-e77cfb560606/_result.png';
const commercialLifeImg = 'https://image.qwenlm.ai/generated-images/434fb2dd-75c0-4b05-99a5-7a0004000853/_result.png';
const proPartnerBadge = 'https://image.qwenlm.ai/generated-images/46d68b15-8c7e-440f-965f-51820042b687/_result.png';

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
  image?: string;
  category: string;
}

// ===== PRODUCT DATA =====
const panasonicProducts: Product[] = [
  { name: 'Etherea Z35 – 3,5 kW', power: '3,5 kW', series: 'Z35-ZKE', stock: 30, brand: 'Panasonic', variant: 'indoor', desc: 'Design premium con nanoe™ X, SEER fino a 9.5, SCOP 5.2. Operatività silenziosa a 19dB(A). Wi-Fi integrato.', features: ['nanoe™ X', 'A+++', '19dB(A)', 'Wi-Fi', 'EcoNavi', 'R32'], price: '€ 1.190', image: panasonicEthereaImg, category: 'panasonic' },
  { name: 'Etherea Z25 – 2,5 kW', power: '2,5 kW', series: 'Z25-ZKE', stock: 30, brand: 'Panasonic', variant: 'indoor', desc: 'Il compatto di classe superiore. nanoe™ X per aria pura, Aerowings 2.0 per flusso ottimale.', features: ['nanoe™ X', 'A+++', '19dB(A)', 'Wi-Fi', 'Aerowings 2.0', 'R32'], price: '€ 990', image: panasonicEthereaImg, category: 'panasonic' },
  { name: 'TZ Super Compact – 3,5 kW', power: '3,5 kW', series: 'TZ35', stock: 30, brand: 'Panasonic', variant: 'indoor', desc: 'Design ultra-compatto 779mm. Ideale per spazi ridotti. Wi-Fi integrato con Comfort Cloud.', features: ['Compatto 779mm', 'A++', 'Wi-Fi', 'Voice Control', 'R32'], price: '€ 750', category: 'panasonic' },
  { name: 'Dual Split CU-2Z41 – 9+9', power: '4,1 kW', series: 'CU-2Z41CBE', stock: 20, brand: 'Panasonic', variant: 'outdoor', desc: 'Due unità interne con una esterna. Flessibilità totale per climatizzare più ambienti.', features: ['Dual Split', 'Inverter', 'R32', 'nanoe™ X', 'A++'], price: '€ 1.850', category: 'panasonic' },
  { name: 'Trial Split CU-3Z52 – 7+9+9', power: '5,2 kW', series: 'CU-3Z52CBE', stock: 10, brand: 'Panasonic', variant: 'outdoor', desc: 'Tre unità interne con una esterna. Soluzione completa per appartamenti.', features: ['Trial Split', 'Inverter', 'R32', 'nanoe™ X', 'A++'], price: '€ 2.690', category: 'panasonic' },
  { name: 'Etherea XZ Black – 3,5 kW', power: '3,5 kW', series: 'XZ35-H', stock: 15, brand: 'Panasonic', variant: 'indoor', desc: 'Design anthracite premium. nanoe™ X, Aerowings 2.0, la scelta di design per interni moderni.', features: ['nanoe™ X', 'A+++', 'Design Nero', 'Wi-Fi', 'Aerowings 2.0', 'R32'], price: '€ 1.390', image: panasonicEthereaImg, category: 'panasonic' },
];

const tclProducts: Product[] = [
  { name: 'BreezeIN 9000 BTU', power: '2,6 kW', series: 'S09P5S0', stock: 30, brand: 'TCL', variant: 'indoor', desc: 'Gentle Breeze con 1066 micro-fori. Wi-Fi, Google Home & Alexa. 4-step self-cleaning. A++ efficienza.', features: ['Gentle Breeze', 'Wi-Fi', 'A++', 'Self-Clean', 'Google/Alexa', 'R32'], price: '€ 490', image: tclBreezeInImg, category: 'tcl' },
  { name: 'BreezeIN 12000 BTU', power: '3,5 kW', series: 'S12P5S0', stock: 30, brand: 'TCL', variant: 'indoor', desc: 'Potenza media con tecnologia Gentle Breeze. Raffreddamento in 30s, riscaldamento in 60s.', features: ['Gentle Breeze', 'Wi-Fi', 'A++', '30s Fast Cool', 'Hotel Mode', 'R32'], price: '€ 590', image: tclBreezeInImg, category: 'tcl' },
  { name: 'BreezeIN 18000 BTU', power: '5,0 kW', series: 'S18P5S0', stock: 20, brand: 'TCL', variant: 'indoor', desc: 'Per ambienti grandi. 16 Gentle Breeze Blades, 1312 micro-fori. Operatività fino a 60°C.', features: ['Gentle Breeze', 'Wi-Fi', 'A++', '60°C Cooling', 'BMS', 'R32'], price: '€ 790', image: tclBreezeInImg, category: 'tcl' },
  { name: 'BreezeIN 24000 BTU', power: '7,0 kW', series: 'S24P5S0', stock: 15, brand: 'TCL', variant: 'indoor', desc: 'Massima potenza residenziale. 18 Gentle Breeze Blades. Ideale per open space.', features: ['Gentle Breeze', 'Wi-Fi', 'A++', 'Twin Rotary', 'Self-Diagnosis', 'R32'], price: '€ 990', image: tclBreezeInImg, category: 'tcl' },
  { name: 'Console UNITARY 12000 BTU', power: '3,5 kW', series: 'M12Z12', stock: 15, brand: 'TCL', variant: 'indoor', desc: 'Unità da pavimento Full DC Inverter. Ideale dove non è possibile installare a parete.', features: ['Console', 'DC Inverter', 'R32', '-15°C/~53°C', 'A++'], price: '€ 690', category: 'tcl' },
  { name: 'Cassette UNITARY 12000 BTU', power: '3,5 kW', series: 'M12S1S1', stock: 10, brand: 'TCL', variant: 'indoor', desc: 'Cassetta da soffitto 600x600. Perfetta per uffici e negozi. Flusso a 360°.', features: ['Cassette 60x60', 'DC Inverter', 'R32', '360° Airflow', 'A++'], price: '€ 850', category: 'tcl' },
];

const heaterProducts: Product[] = [
  { name: 'Aquarea Monoblocco L 9kW', power: '9 kW', series: 'L Series', stock: 10, brand: 'Panasonic', variant: 'outdoor', desc: 'Pompa di calore aria-acqua monoblocco. Riscaldamento, raffrescamento e ACS. SCOP 5.12. Funziona fino a -28°C.', features: ['Monoblocco', 'SCOP 5.12', '-28°C', 'R32', 'A+++', 'Wi-Fi'], price: '€ 4.990', image: aquareaImg, category: 'heaters' },
  { name: 'Aquarea Monoblocco L 12kW', power: '12 kW', series: 'L Series', stock: 8, brand: 'Panasonic', variant: 'outdoor', desc: 'Potenza superiore per abitazioni più grandi. Riscaldamento a pavimento o radiatori.', features: ['Monoblocco', 'SCOP 5.12', '-28°C', 'R32', 'A+++', 'Wi-Fi'], price: '€ 5.990', image: aquareaImg, category: 'heaters' },
  { name: 'Aquarea Split K 9kW', power: '9 kW', series: 'K Series', stock: 10, brand: 'Panasonic', variant: 'outdoor', desc: 'Sistema split con unità interna ed esterna. Installazione flessibile, massimo comfort.', features: ['Split', 'SCOP 4.8', '-20°C', 'R32', 'A+++', 'Aquarea Smart'], price: '€ 4.490', category: 'heaters' },
  { name: 'Aquarea Big M 25kW', power: '25 kW', series: 'M Series', stock: 5, brand: 'Panasonic', variant: 'outdoor', desc: 'Per grandi edifici e applicazioni commerciali. R290 refrigerante naturale. SCOP 5.22.', features: ['Big Capacity', 'SCOP 5.22', 'R290', 'Cascadabile', 'A+++', 'Commerciale'], price: '€ 12.900', category: 'heaters' },
];

const commercialProducts: Product[] = [
  { name: 'ECOi EX VRF 8HP', power: '22,4 kW', series: 'ECOi EX', stock: 5, brand: 'Panasonic', variant: 'outdoor', desc: 'Sistema VRF 3 tubi R32. Fino a 64 unità interne collegate. 41% meno refrigerante vs R410A.', features: ['VRF 3 tubi', 'R32', '64 UI max', 'A++', 'Autonomo', 'BMS'], image: ecoiVrfImg, category: 'commercial' },
  { name: 'ECOi EX VRF 16HP', power: '45 kW', series: 'ECOi EX', stock: 3, brand: 'Panasonic', variant: 'outdoor', desc: 'Massima potenza per grandi edifici. Funzionamento simultaneo caldo/freddo.', features: ['VRF 3 tubi', 'R32', '128 UI max', 'A++', 'Heat Recovery', 'BMS'], image: ecoiVrfImg, category: 'commercial' },
  { name: 'Cassette 600x600 12000 BTU', power: '3,5 kW', series: 'CS-3UBE', stock: 20, brand: 'Panasonic', variant: 'indoor', desc: 'Cassette compatta per controsoffitti standard. nanoe™ X, flusso a 360°.', features: ['Cassette 60x60', 'nanoe™ X', '360°', 'Inverter', 'R32', 'A++'], category: 'commercial' },
  { name: 'Canalizzato Slim 18000 BTU', power: '5,0 kW', series: 'CS-SE', stock: 15, brand: 'Panasonic', variant: 'indoor', desc: 'Altezza solo 200mm. Ideale per installazione in spazi ridotti sopra controsoffitto.', features: ['Slim 200mm', 'Inverter', 'R32', 'A++', 'Silenzioso'], category: 'commercial' },
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
    </svg>
  );
}

// ===== MODAL =====
function Modal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
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
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}

// ===== BACK TO TOP =====
function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const h = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`fixed bottom-6 left-6 z-[90] w-12 h-12 rounded-full bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center shadow-lg shadow-sky-500/25 transition-all duration-300 lg:left-[280px] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`} aria-label="Torna in cima">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
    </button>
  );
}

// ===== SIDEBAR =====
function Sidebar({ onPrivatiSignup, onProfessionistiSignup }: { onPrivatiSignup: () => void; onProfessionistiSignup: () => void }) {
  const [active, setActive] = useState('home');
  const items = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'offerte', label: 'Offerte', icon: '🏷️' },
    { id: 'benessere', label: 'Benessere', icon: '💙' },
    { id: 'panasonic', label: 'Panasonic', icon: '🔷' },
    { id: 'tcl', label: 'TCL', icon: '🔶' },
    { id: 'confronta', label: 'Confronta', icon: '⚖️' },
    { id: 'riscaldamento', label: 'Riscaldamento', icon: '🔥' },
    { id: 'btu-calculator', label: 'Calcola BTU', icon: '📐' },
    { id: 'residenziale', label: 'Residenziale', icon: '🏡' },
    { id: 'commerciale', label: 'Commerciale', icon: '🏢' },
    { id: 'risparmio', label: 'Risparmio', icon: '💰' },
    { id: 'conto-termico', label: 'Conto Termico', icon: '🧮' },
    { id: 'finanziamento', label: 'Finanziamento', icon: '💳' },
    { id: 'pro-partner', label: 'Pro Partner', icon: '🏆' },
    { id: 'guide', label: 'Guide', icon: '🎓' },
    { id: 'tracking', label: 'Tracking', icon: '📦' },
    { id: 'installatori', label: 'Installatori', icon: '🗺️' },
    { id: 'chi-siamo', label: 'Chi Siamo', icon: '👥' },
    { id: 'faq', label: 'FAQ', icon: '❓' },
    { id: 'contatti', label: 'Contatti', icon: '📞' },
  ];
  useEffect(() => {
    const h = () => {
      const secs = items.map(i => document.getElementById(i.id));
      const pos = window.scrollY + 200;
      for (let i = secs.length - 1; i >= 0; i--) {
        if (secs[i] && secs[i]!.offsetTop <= pos) { setActive(items[i].id); break; }
      }
    };
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-black/95 backdrop-blur-xl border-r border-white/5 z-50 hidden lg:flex flex-col">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl gradient-blue flex items-center justify-center shadow-lg shadow-sky-500/30">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <div className="text-xl font-bold text-white">AIR<span className="text-sky-400">KLIM</span></div>
            <div className="text-xs text-white/40">Il Comfort che Meriti</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-0.5">
          {items.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className={`flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 ${active === item.id ? 'bg-sky-500/10 text-sky-400 font-semibold border border-sky-500/20' : 'text-white/50 hover:bg-white/5 hover:text-white/80 border border-transparent'}`}>
                <span className="text-base mr-2.5">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
                {active === item.id && <span className="ml-auto w-1.5 h-1.5 bg-sky-400 rounded-full"></span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-white/5 space-y-2">
        <button onClick={onPrivatiSignup} className="block w-full px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold text-center transition-all hover:shadow-lg hover:shadow-sky-500/25 text-sm">🏠 Area Privati</button>
        <button onClick={onProfessionistiSignup} className="block w-full px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-semibold text-center transition-all hover:shadow-lg hover:shadow-amber-500/25 text-sm">🏢 Area Professionisti</button>
      </div>
    </aside>
  );
}

// ===== MOBILE MENU =====
function MobileMenu({ onPrivatiSignup, onProfessionistiSignup }: { onPrivatiSignup: () => void; onProfessionistiSignup: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const items = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'offerte', label: 'Offerte', icon: '🏷️' },
    { id: 'benessere', label: 'Benessere', icon: '💙' },
    { id: 'panasonic', label: 'Panasonic', icon: '🔷' },
    { id: 'tcl', label: 'TCL', icon: '🔶' },
    { id: 'confronta', label: 'Confronta', icon: '⚖️' },
    { id: 'riscaldamento', label: 'Riscaldamento', icon: '🔥' },
    { id: 'btu-calculator', label: 'Calcola BTU', icon: '📐' },
    { id: 'residenziale', label: 'Residenziale', icon: '🏡' },
    { id: 'commerciale', label: 'Commerciale', icon: '🏢' },
    { id: 'risparmio', label: 'Risparmio', icon: '💰' },
    { id: 'conto-termico', label: 'Conto Termico', icon: '🧮' },
    { id: 'finanziamento', label: 'Finanziamento', icon: '💳' },
    { id: 'pro-partner', label: 'Pro Partner', icon: '🏆' },
    { id: 'guide', label: 'Guide', icon: '🎓' },
    { id: 'tracking', label: 'Tracking', icon: '📦' },
    { id: 'installatori', label: 'Installatori', icon: '🗺️' },
    { id: 'chi-siamo', label: 'Chi Siamo', icon: '👥' },
    { id: 'faq', label: 'FAQ', icon: '❓' },
    { id: 'contatti', label: 'Contatti', icon: '📞' },
  ];
  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-white/5 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg gradient-blue flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <span className="text-xl font-bold text-white">AIR<span className="text-sky-400">KLIM</span></span>
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white/70 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{isOpen ? (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />) : (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />)}</svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-72 bg-slate-900/95 backdrop-blur-xl border-l border-white/5" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <span className="text-xl font-bold text-white">Menu</span>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <nav className="p-4">
              <ul className="space-y-1">{items.map((item) => (<li key={item.id}><a href={`#${item.id}`} onClick={() => setIsOpen(false)} className="flex items-center px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all"><span className="text-lg mr-3">{item.icon}</span><span className="text-sm font-medium">{item.label}</span></a></li>))}</ul>
              <div className="mt-4 space-y-2">
                <button onClick={() => { setIsOpen(false); onPrivatiSignup(); }} className="block w-full px-4 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold text-center transition-all text-sm">🏠 Area Privati</button>
                <button onClick={() => { setIsOpen(false); onProfessionistiSignup(); }} className="block w-full px-4 py-3 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-semibold text-center transition-all text-sm">🏢 Area Professionisti</button>
              </div>
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
      <div className="absolute inset-0"><img src={heroBg} alt="" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40"></div><div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div></div>
      <div className="absolute inset-0"><div className="absolute top-20 left-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl animate-pulse-slow"></div><div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay:'2s'}}></div></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-3xl space-y-8">
          <div className="animate-slide-up flex items-center gap-3">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-sm font-medium"><span className="w-2 h-2 bg-sky-400 rounded-full mr-2 animate-pulse"></span>Distributore Ufficiale Panasonic</span>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">🏆 PRO Partner Certificato</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight animate-slide-up-delay-1">Il Comfort che <br/><span className="text-gradient">Trasforma</span><br/>la Tua Vita</h1>
          <p className="text-xl text-white/60 max-w-xl animate-slide-up-delay-2 leading-relaxed">Perché ogni giorno meriti di essere vissuto nel massimo benessere. Panasonic, TCL e soluzioni di riscaldamento ad alta efficienza.</p>
          <div className="flex flex-wrap gap-4 animate-slide-up-delay-3">
            <a href="#panasonic" className="px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all hover:shadow-xl hover:shadow-sky-500/25 hover:-translate-y-0.5">Scopri Panasonic</a>
            <a href="#riscaldamento" className="px-8 py-4 border border-white/20 hover:border-white/40 text-white rounded-xl font-semibold transition-all hover:bg-white/5">Pompe di Calore</a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"><svg className="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg></div>
    </section>
  );
}

// ===== WELLBEING =====
function WellbeingSection() {
  return (
    <section id="benessere" className="relative py-24 bg-black overflow-hidden">
      <div className="absolute inset-0"><img src={happyFamily} alt="" className="w-full h-full object-cover opacity-20" /><div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black"></div></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Il Vero Valore</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mt-4">Non Vendiamo Climatizzatori.<br/><span className="text-gradient">Regaliamo Benessere.</span></h2>
          <p className="text-white/50 mt-6 max-w-2xl mx-auto text-lg">Ogni sistema che installiamo è un investimento nella qualità della tua vita.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[{img:familyHome,icon:'🏡',t:'A Casa Tua',d:'Ogni momento in famiglia diventa più prezioso quando l\'aria è pura.'},{img:bedroomPeace,icon:'😴',t:'Sonni Perfetti',d:'Il silenzio e la temperatura ideale per notti rigeneranti.'},{img:kidsPlay,icon:'👶',t:'Per i Più Piccoli',d:'nanoe™ X elimina il 99% di batteri e virus. Sicurezza per la famiglia.'}].map((c,i)=>(
            <div key={i} className="group relative overflow-hidden rounded-3xl">
              <div className="aspect-[3/4] relative"><img src={c.img} alt={c.t} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /><div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div></div>
              <div className="absolute bottom-0 left-0 right-0 p-8"><div className="text-4xl mb-3">{c.icon}</div><h3 className="text-2xl font-bold text-white mb-2">{c.t}</h3><p className="text-white/60">{c.d}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== BRAND SECTION COMPONENT =====
function BrandSection({ id, brandName, brandColor, tagline, description, products, heroImg, onProductClick }: { id: string; brandName: string; brandColor: string; tagline: string; description: string; products: Product[]; heroImg: string; onProductClick: (p: Product) => void }) {
  return (
    <section id={id} className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Header */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${brandColor}`}>
                <span className="text-2xl font-bold text-white">{brandName[0]}</span>
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white">{brandName}</h2>
                <p className={`text-sm font-medium ${brandColor.includes('sky') ? 'text-sky-400' : 'text-amber-400'}`}>{tagline}</p>
              </div>
            </div>
            <p className="text-white/60 text-lg leading-relaxed">{description}</p>
          </div>
          <div className="rounded-3xl overflow-hidden">
            <img src={heroImg} alt={brandName} className="w-full h-80 object-cover" />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <div key={i} onClick={() => onProductClick(product)} className="group bg-slate-900/50 rounded-2xl border border-white/5 hover:border-sky-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/5 cursor-pointer overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <ProductSVG variant={product.variant} />
                )}
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${brandColor.includes('sky') ? 'text-sky-400 bg-sky-500/10 border-sky-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20'}`}>{product.brand}</span>
                  <span className="text-xs text-white/40">{product.stock} disp.</span>
                </div>
                <h3 className="font-semibold text-white group-hover:text-sky-400 transition-colors">{product.name}</h3>
                <p className="text-white/40 text-sm line-clamp-2">{product.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {product.features.slice(0,3).map((f,j)=><span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/5">{f}</span>)}
                </div>
                {product.price && <div className="pt-2 border-t border-white/5"><span className="text-lg font-bold text-sky-400">{product.price}</span><span className="text-xs text-white/30 ml-2">IVA esclusa</span></div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== HEATERS SECTION =====
function HeatersSection({ onProductClick }: { onProductClick: (p: Product) => void }) {
  return (
    <section id="riscaldamento" className="relative py-24 bg-black overflow-hidden">
      <div className="absolute inset-0"><img src={aquareaImg} alt="" className="w-full h-full object-cover opacity-10" /><div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black"></div></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-orange-400 font-semibold text-sm uppercase tracking-wider">Riscaldamento Efficiente</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3">Pompe di Calore<br/><span className="text-gradient">Panasonic Aquarea</span></h2>
          <p className="text-white/50 mt-6 max-w-2xl mx-auto text-lg">Riscaldamento, raffrescamento e acqua calda sanitaria. Funzionamento garantito fino a -28°C. SCOP fino a 5.22.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {heaterProducts.map((p, i) => (
            <div key={i} onClick={() => onProductClick(p)} className="group bg-white/[0.03] rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-4">
                {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" /> : <ProductSVG variant="outdoor" />}
              </div>
              <div className="p-5 space-y-2">
                <span className="text-xs font-medium text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">Aquarea</span>
                <h3 className="font-semibold text-white text-sm">{p.name}</h3>
                <div className="flex flex-wrap gap-1">{p.features.slice(0,3).map((f,j)=><span key={j} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40">{f}</span>)}</div>
                {p.price && <div className="pt-2"><span className="text-base font-bold text-orange-400">{p.price}</span></div>}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div><div className="text-3xl font-bold text-orange-400">-28°C</div><div className="text-sm text-white/50 mt-1">Funzionamento garantito</div></div>
            <div><div className="text-3xl font-bold text-orange-400">SCOP 5.22</div><div className="text-sm text-white/50 mt-1">Massima efficienza</div></div>
            <div><div className="text-3xl font-bold text-orange-400">3-30 kW</div><div className="text-sm text-white/50 mt-1">Gamma completa</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== RESIDENTIAL SECTION =====
function ResidentialSection({ onProductClick }: { onProductClick: (p: Product) => void }) {
  const residentialProducts = [...panasonicProducts.slice(0,3), ...tclProducts.slice(0,3)];
  return (
    <section id="residenziale" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="rounded-3xl overflow-hidden">
            <img src={residentialLifeImg} alt="Applicazioni residenziali" className="w-full h-96 object-cover" />
          </div>
          <div className="space-y-6">
            <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Per la Tua Casa</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Soluzioni <span className="text-gradient">Residenziali</span></h2>
            <p className="text-white/60 text-lg leading-relaxed">Dal monosplit compatto al multi-split, soluzioni per ogni ambiente della tua casa. Silenziosità, efficienza e design per il massimo comfort domestico.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5"><div className="text-xl mb-1">🛋️</div><div className="text-sm font-medium text-white">Soggiorno</div><div className="text-xs text-white/40">Etherea Z35/XZ</div></div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5"><div className="text-xl mb-1">🛏️</div><div className="text-sm font-medium text-white">Camera</div><div className="text-xs text-white/40">19dB(A) Ultra-silent</div></div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5"><div className="text-xl mb-1">🍳</div><div className="text-sm font-medium text-white">Cucina</div><div className="text-xs text-white/40">TZ Compact</div></div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5"><div className="text-xl mb-1">🏠</div><div className="text-sm font-medium text-white">Appartamento</div><div className="text-xs text-white/40">Multi-Split</div></div>
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {residentialProducts.map((p, i) => (
            <div key={i} onClick={() => onProductClick(p)} className="group bg-slate-900/50 rounded-2xl p-5 border border-white/5 hover:border-sky-500/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.brand === 'Panasonic' ? 'text-sky-400 bg-sky-500/10 border border-sky-500/20' : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'}`}>{p.brand}</span>
                <span className="text-xs text-white/30">{p.power}</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-sky-400 transition-colors text-sm">{p.name}</h3>
              <p className="text-white/40 text-xs mt-1 line-clamp-2">{p.desc}</p>
              {p.price && <div className="mt-3 pt-2 border-t border-white/5"><span className="text-base font-bold text-sky-400">{p.price}</span></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== COMMERCIAL SECTION =====
function CommercialSection({ onProductClick }: { onProductClick: (p: Product) => void }) {
  return (
    <section id="commerciale" className="relative py-24 bg-black overflow-hidden">
      <div className="absolute inset-0"><img src={commercialLifeImg} alt="" className="w-full h-full object-cover opacity-10" /><div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black"></div></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6 order-2 lg:order-1">
            <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Per il Tuo Business</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Soluzioni <span className="text-gradient">Commerciali</span></h2>
            <p className="text-white/60 text-lg leading-relaxed">Dai sistemi VRF ECOi per grandi edifici alle cassette per negozi e uffici. Soluzioni scalabili per ogni esigenza professionale.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5"><div className="text-xl mb-1">🏢</div><div className="text-sm font-medium text-white">Uffici</div><div className="text-xs text-white/40">VRF ECOi / Cassette</div></div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5"><div className="text-xl mb-1">🏨</div><div className="text-sm font-medium text-white">Hotel</div><div className="text-xs text-white/40">BreezeIN Hotel Mode</div></div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5"><div className="text-xl mb-1">🍽️</div><div className="text-sm font-medium text-white">Ristoranti</div><div className="text-xs text-white/40">Canalizzato Slim</div></div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5"><div className="text-xl mb-1">🏗️</div><div className="text-sm font-medium text-white">Grandi Edifici</div><div className="text-xs text-white/40">ECOi VRF 16HP</div></div>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden order-1 lg:order-2">
            <img src={ecoiVrfImg} alt="Sistemi commerciali" className="w-full h-96 object-cover" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {commercialProducts.map((p, i) => (
            <div key={i} onClick={() => onProductClick(p)} className="group bg-white/[0.03] rounded-2xl border border-white/5 hover:border-sky-500/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-4">
                {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" /> : <ProductSVG variant={p.variant} />}
              </div>
              <div className="p-4 space-y-2">
                <span className="text-xs font-medium text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">{p.brand}</span>
                <h3 className="font-semibold text-white text-sm">{p.name}</h3>
                <div className="flex flex-wrap gap-1">{p.features.slice(0,3).map((f,j)=><span key={j} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40">{f}</span>)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== PRO PARTNER SECTION =====
function ProPartnerSection() {
  return (
    <section id="pro-partner" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <img src={proPartnerBadge} alt="Panasonic PRO Partner" className="w-20 h-20 rounded-2xl object-cover" />
              <div>
                <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Certificazione Ufficiale</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-white">Panasonic<br/><span className="text-gradient">PRO Partner</span></h2>
              </div>
            </div>
            <p className="text-white/60 text-lg leading-relaxed">
              AIRKLIM è <strong className="text-white">PRO Partner certificato Panasonic</strong>, un riconoscimento che attesta la nostra competenza tecnica, affidabilità e impegno nella qualità. Questo programma esclusivo garantisce ai nostri clienti standard elevati di installazione e assistenza.
            </p>
            <div className="space-y-4">
              {[
                { icon: '🛡️', title: '5 Anni di Garanzia Compressore', desc: 'Estensione di garanzia ufficiale Panasonic su tutti i compressori.' },
                { icon: '🎓', title: 'Installatori Accreditati', desc: 'Team formato e certificato direttamente da Panasonic.' },
                { icon: '📞', title: 'Supporto Diretto', desc: 'Contatto diretto con il team service e sales Panasonic.' },
                { icon: '⭐', title: 'Listato sul Sito Panasonic', desc: 'Presenti come partner affidabile sul sito ufficiale Panasonic.' },
                { icon: '🔧', title: 'Assistenza Certificata', desc: 'Interventi tecnici eseguiti secondo gli standard Panasonic.' },
                { icon: '📋', title: 'Commissioning Verificato', desc: 'Ogni installazione verificata e documentata correttamente.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-amber-500/20 transition-colors">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                    <p className="text-white/40 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden border border-amber-500/20">
              <img src={proPartnerBadge} alt="Panasonic PRO Partner Certificato" className="w-full h-[500px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-amber-500/10 rounded-2xl -z-10 blur-xl"></div>
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-sky-500/10 rounded-2xl -z-10 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== ABOUT =====
function AboutSection() {
  return (
    <section id="chi-siamo" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">La Nostra Storia</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">20 Anni di Passione<br/>per il <span className="text-gradient">Tuo Benessere</span></h2>
            <p className="text-white/60 text-lg leading-relaxed">Da oltre 20 anni, <strong className="text-white">AIRKLIM</strong> è il punto di riferimento in Sicilia per la climatizzazione professionale. Non siamo solo fornitori: siamo partner nel tuo comfort.</p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center"><div className="text-2xl font-bold text-sky-400">20+</div><div className="text-xs text-white/40 mt-1">Anni esperienza</div></div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center"><div className="text-2xl font-bold text-sky-400">500+</div><div className="text-xs text-white/40 mt-1">Clienti felici</div></div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center"><div className="text-2xl font-bold text-amber-400">PRO</div><div className="text-xs text-white/40 mt-1">Partner Panasonic</div></div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden"><img src={familyHome} alt="AIRKLIM" className="w-full h-[500px] object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== FAQ =====
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    { q: 'Cosa significa essere Panasonic PRO Partner?', a: 'Il PRO Partner è un programma di certificazione Panasonic che garantisce competenza tecnica, installatori accreditati, 5 anni di garanzia sul compressore, supporto diretto e assistenza certificata. AIRKLIM è orgoglioso di far parte di questo network esclusivo.' },
    { q: 'Quali marchi trattate?', a: 'Siamo distributori ufficiali Panasonic (Etherea, TZ, Aquarea, ECOi VRF) e TCL (BreezeIN, UNITARY). Trattiamo anche Sintra, Utek, Airzone, Rodigas e Caleffi.' },
    { q: 'Fornite pompe di calore per riscaldamento?', a: 'Sì, siamo specializzati in pompe di calore Panasonic Aquarea, dalla serie L monoblocco (3-16kW) alla serie M per applicazioni commerciali (fino a 30kW). Funzionamento garantito fino a -28°C.' },
    { q: 'Avete soluzioni per il commerciale?', a: 'Assolutamente. Offriamo sistemi VRF ECOi per grandi edifici, cassette 600x600, canalizzati slim e soluzioni light commercial. Abbiamo prodotti per uffici, hotel, ristoranti e negozi.' },
    { q: 'Come posso acquistare i vostri prodotti?', a: 'Contattaci per ricevere informazioni. Registrati sul nostro sito per accedere ai prezzi riservati ai professionisti del settore.' },
  ];
  return (
    <section id="faq" className="py-24 bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">Domande Frequenti</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white/[0.02] rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 transition-all">
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
function ContactSection({ showToast }: { showToast: (m: string) => void }) {
  return (
    <section id="contatti" className="relative py-24 bg-black overflow-hidden">
      <div className="absolute inset-0"><img src={modernLiving} alt="" className="w-full h-full object-cover opacity-5" /></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div><span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Contatti</span><h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">Parliamo del<br/>Tuo Progetto</h2></div>
            <div className="space-y-4">
              {[{icon:'📍',t:'Indirizzo',d:'Via Ciachea, 2/e - 90044 Carini (PA)'},{icon:'📞',t:'Telefono',d:'+39 091 8691680'},{icon:'🕐',t:'Orari',d:'Lun-Ven: 8:30-13:00 / 15:00-18:00'}].map((c,i)=>(
                <div key={i} className="flex items-center space-x-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-2xl">{c.icon}</span>
                  <div><h4 className="font-semibold text-white text-sm">{c.t}</h4><p className="text-white/50 text-sm">{c.d}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/[0.02] rounded-2xl p-8 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-6">Inviaci un Messaggio</h3>
            <form className="space-y-5" onSubmit={(e)=>{e.preventDefault();showToast('Messaggio inviato con successo!');}}>
              <div className="grid sm:grid-cols-2 gap-5">
                <input type="text" required placeholder="Nome" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none" />
                <input type="text" required placeholder="Cognome" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none" />
              </div>
              <input type="email" required placeholder="Email" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none" />
              <textarea rows={4} required placeholder="Come possiamo aiutarti?" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none resize-none"></textarea>
              <button type="submit" className="w-full px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-sky-500/25">Invia Messaggio</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== FOOTER =====
function Footer({ onNavigate }: { onNavigate: (s: string) => void }) {
  return (
    <footer className="bg-black border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-white/5">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg gradient-blue flex items-center justify-center"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
              <span className="text-xl font-bold text-white">AIR<span className="text-sky-400">KLIM</span></span>
            </div>
            <p className="text-white/40 text-sm">Panasonic PRO Partner certificato. Distributore ufficiale di climatizzazione professionale in Sicilia.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Prodotti</h4>
            <ul className="space-y-2 text-sm text-white/40">
              <li><button onClick={() => onNavigate('panasonic')} className="hover:text-sky-400 transition-colors text-left">Panasonic Etherea</button></li>
              <li><button onClick={() => onNavigate('tcl')} className="hover:text-sky-400 transition-colors text-left">TCL BreezeIN</button></li>
              <li><button onClick={() => onNavigate('riscaldamento')} className="hover:text-sky-400 transition-colors text-left">Aquarea Pompe di Calore</button></li>
              <li><button onClick={() => onNavigate('commerciale')} className="hover:text-sky-400 transition-colors text-left">ECOi VRF Commerciale</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Applicazioni</h4>
            <ul className="space-y-2 text-sm text-white/40">
              <li><button onClick={() => onNavigate('residenziale')} className="hover:text-sky-400 transition-colors text-left">Residenziale</button></li>
              <li><button onClick={() => onNavigate('commerciale')} className="hover:text-sky-400 transition-colors text-left">Commerciale</button></li>
              <li><button onClick={() => onNavigate('pro-partner')} className="hover:text-sky-400 transition-colors text-left">PRO Partner</button></li>
              <li><button onClick={() => onNavigate('chi-siamo')} className="hover:text-sky-400 transition-colors text-left">Chi Siamo</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Registrazione</h4>
            <ul className="space-y-2 text-sm text-white/40">
              <li><button onClick={() => onNavigate('privati')} className="hover:text-sky-400 transition-colors text-left">🏠 Area Privati</button></li>
              <li><button onClick={() => onNavigate('professionisti')} className="hover:text-amber-400 transition-colors text-left">🏢 Area Professionisti</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Contatti</h4>
            <ul className="space-y-2 text-sm text-white/40"><li>Via Ciachea, 2/e</li><li>90044 Carini (PA)</li><li>Tel. +39 091 8691680</li></ul>
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

// ===== PROFILE CHOICE SECTION =====
function ProfileChoiceSection({ onPrivatiSignup, onProfessionistiSignup }: { onPrivatiSignup: () => void; onProfessionistiSignup: () => void }) {
  return (
    <section className="py-20 bg-gradient-to-b from-black to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Scegli il Tuo Profilo</h2>
          <p className="text-white/60 text-lg">Seleziona l'area dedicata per accedere a prodotti e servizi su misura per te</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Privati Card */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500/10 to-blue-600/10 border border-sky-500/20 hover:border-sky-500/40 transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-8 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Privati</h3>
                <p className="text-white/60">Sei un privato cittadino? Accedi a prodotti residenziali, pompe di calore e soluzioni per il comfort domestico.</p>
              </div>
              <ul className="space-y-2 text-sm text-white/50">
                <li className="flex items-center gap-2"><span className="text-sky-400">✓</span> Climatizzatori residenziali</li>
                <li className="flex items-center gap-2"><span className="text-sky-400">✓</span> Pompe di calore Aquarea</li>
                <li className="flex items-center gap-2"><span className="text-sky-400">✓</span> Assistenza tecnica</li>
                <li className="flex items-center gap-2"><span className="text-sky-400">✓</span> Prezzi al pubblico</li>
              </ul>
              <button onClick={onPrivatiSignup} className="w-full px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-sky-500/25">
                Registrati come Privato
              </button>
            </div>
          </div>

          {/* Professionisti Card */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-8 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h-.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Installatori & Aziende</h3>
                <p className="text-white/60">Sei un installatore certificato o un'azienda? Accedi a prezzi riservati, supporto tecnico e servizi professionali.</p>
              </div>
              <ul className="space-y-2 text-sm text-white/50">
                <li className="flex items-center gap-2"><span className="text-amber-400">✓</span> Prezzi riservati B2B</li>
                <li className="flex items-center gap-2"><span className="text-amber-400">✓</span> Supporto tecnico dedicato</li>
                <li className="flex items-center gap-2"><span className="text-amber-400">✓</span> Sistemi VRF e commerciali</li>
                <li className="flex items-center gap-2"><span className="text-amber-400">✓</span> Formazione certificata</li>
              </ul>
              <button onClick={onProfessionistiSignup} className="w-full px-6 py-3 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-amber-500/25">
                Registrati come Professionista
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== PRIVATI SIGNUP MODAL =====
function PrivatiSignupModal({ isOpen, onClose, showToast }: { isOpen: boolean; onClose: () => void; showToast: (m: string) => void }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Registrazione completata! Riceverai una email di conferma.');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-slate-900 rounded-2xl border border-white/10 p-8">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <div className="mb-6">
          <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Registrazione Privati</h3>
          <p className="text-white/50 text-sm">Crea il tuo account per accedere ai prodotti residenziali e ricevere assistenza dedicata.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" required placeholder="Nome *" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none" />
            <input type="text" required placeholder="Cognome *" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none" />
          </div>
          <input type="email" required placeholder="Email *" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none" />
          <input type="tel" required placeholder="Telefono *" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none" />
          <input type="text" placeholder="Indirizzo" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none" />
          <div className="grid grid-cols-3 gap-4">
            <input type="text" placeholder="Città" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none" />
            <input type="text" placeholder="CAP" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none" />
            <input type="text" placeholder="Provincia" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none" />
          </div>
          <div className="flex items-start gap-2 text-sm text-white/40">
            <input type="checkbox" required className="mt-1" />
            <span>Accetto i <a href="#" className="text-sky-400 hover:underline">Termini e Condizioni</a> e la <a href="#" className="text-sky-400 hover:underline">Privacy Policy</a></span>
          </div>
          <button type="submit" className="w-full px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-sky-500/25">
            Crea Account
          </button>
        </form>
      </div>
    </Modal>
  );
}

// ===== PROFESSIONISTI SIGNUP MODAL =====
function ProfessionistiSignupModal({ isOpen, onClose, showToast }: { isOpen: boolean; onClose: () => void; showToast: (m: string) => void }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Richiesta inviata! Verificheremo i documenti e ti contatteremo entro 48 ore.');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-slate-900 rounded-2xl border border-white/10 p-8 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <div className="mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h-.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Registrazione Professionisti</h3>
          <p className="text-white/50 text-sm">Compila il form e carica i documenti richiesti per accedere ai prezzi riservati e ai servizi professionali.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dati Azienda */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Dati Aziendali</h4>
            <input type="text" required placeholder="Ragione Sociale *" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500 outline-none" />
            <div className="grid grid-cols-2 gap-4">
              <input type="text" required placeholder="Partita IVA *" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500 outline-none" />
              <input type="text" required placeholder="Codice Fiscale *" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500 outline-none" />
            </div>
            <input type="email" required placeholder="PEC (Posta Elettronica Certificata) *" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500 outline-none" />
            <input type="text" placeholder="Numero REA" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500 outline-none" />
          </div>

          {/* Contatto */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Referente Aziendale</h4>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" required placeholder="Nome *" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500 outline-none" />
              <input type="text" required placeholder="Cognome *" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500 outline-none" />
            </div>
            <input type="email" required placeholder="Email aziendale *" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500 outline-none" />
            <input type="tel" required placeholder="Telefono *" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500 outline-none" />
          </div>

          {/* Documenti */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Documenti Richiesti</h4>
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <p className="text-xs text-amber-400 mb-2">📋 Documenti obbligatori per la registrazione:</p>
              <ul className="text-xs text-white/50 space-y-1">
                <li>• Visura Camerale (non anteriore a 6 mesi)</li>
                <li>• Certificato di abilitazione DM 37/08 (lettera d)</li>
                <li>• DURC (Documento Unico Regolarità Contributiva)</li>
              </ul>
            </div>
            
            <div>
              <label className="block text-sm text-white/60 mb-2">Visura Camerale *</label>
              <input type="file" required accept=".pdf,.jpg,.png" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-500/20 file:text-amber-400 hover:file:bg-amber-500/30" />
            </div>
            
            <div>
              <label className="block text-sm text-white/60 mb-2">Certificato DM 37/08 *</label>
              <input type="file" required accept=".pdf,.jpg,.png" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-500/20 file:text-amber-400 hover:file:bg-amber-500/30" />
            </div>
            
            <div>
              <label className="block text-sm text-white/60 mb-2">DURC *</label>
              <input type="file" required accept=".pdf,.jpg,.png" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-500/20 file:text-amber-400 hover:file:bg-amber-500/30" />
            </div>
            
            <div>
              <label className="block text-sm text-white/60 mb-2">Certificato ISO 9001 (opzionale)</label>
              <input type="file" accept=".pdf,.jpg,.png" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white/60 hover:file:bg-white/20" />
            </div>
          </div>

          {/* Sede */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Sede Legale</h4>
            <input type="text" required placeholder="Indirizzo *" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500 outline-none" />
            <div className="grid grid-cols-3 gap-4">
              <input type="text" required placeholder="Città *" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500 outline-none" />
              <input type="text" required placeholder="CAP *" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500 outline-none" />
              <input type="text" required placeholder="Provincia *" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500 outline-none" />
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm text-white/40 pt-4">
            <input type="checkbox" required className="mt-1" />
            <span>Accetto i <a href="#" className="text-amber-400 hover:underline">Termini e Condizioni</a>, la <a href="#" className="text-amber-400 hover:underline">Privacy Policy</a> e autorizzo il trattamento dei dati ai sensi del GDPR</span>
          </div>
          
          <button type="submit" className="w-full px-6 py-3 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-amber-500/25">
            Invia Richiesta di Registrazione
          </button>
        </form>
      </div>
    </Modal>
  );
}

// ===== MAIN APP =====
export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [legalModal, setLegalModal] = useState<string | null>(null);
  const [privatiSignup, setPrivatiSignup] = useState(false);
  const [professionistiSignup, setProfessionistiSignup] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false });
  const [authModal, setAuthModal] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { user } = useAuth();
  const { itemCount } = useCart();
  
  // Phase 5: Performance & Monitoring Hooks
  useErrorHandler();
  usePerformanceMonitoring();
  useWebVitals();
  preloadCriticalResources();
  
  // Security Middleware Initialization
  useEffect(() => {
    securityMiddleware.initialize();
    console.log('[SECURITY] Security middleware initialized');
  }, []);

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast(p => ({ ...p, visible: false })), 4000);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleNavigate = useCallback((target: string) => {
    if (['privacy', 'cookie', 'termini'].includes(target)) setLegalModal(target);
    else if (target === 'privati') setPrivatiSignup(true);
    else if (target === 'professionisti') setProfessionistiSignup(true);
    else scrollToSection(target);
  }, [scrollToSection]);

  const legalContent: Record<string, { title: string; body: string }> = {
    privacy: { title: 'Privacy Policy', body: 'AIRKLIM rispetta la tua privacy. I dati personali raccolti vengono utilizzati esclusivamente per fornire i servizi richiesti e non vengono condivisi con terze parti senza il tuo consenso.' },
    cookie: { title: 'Cookie Policy', body: 'Questo sito utilizza cookie tecnici essenziali per il funzionamento e cookie analitici per migliorare l\'esperienza utente.' },
    termini: { title: 'Termini e Condizioni', body: 'L\'accesso e l\'utilizzo del sito AIRKLIM sono soggetti ai seguenti termini. I prezzi indicati sono IVA esclusa e riservati ai professionisti registrati.' },
  };

  return (
    <ErrorBoundary>
    <LanguageProvider>
    <div className="min-h-screen bg-black text-white">
      <Sidebar onPrivatiSignup={() => setPrivatiSignup(true)} onProfessionistiSignup={() => setProfessionistiSignup(true)} />
      <MobileMenu onPrivatiSignup={() => setPrivatiSignup(true)} onProfessionistiSignup={() => setProfessionistiSignup(true)} />
      <BackToTop />
      <Toast message={toast.message} isVisible={toast.visible} />
      <LanguageSwitcher />

      <main className="lg:ml-64">
        <HeroSection />
        <ProfileChoiceSection onPrivatiSignup={() => setPrivatiSignup(true)} onProfessionistiSignup={() => setProfessionistiSignup(true)} />
        <PromotionsSection />
        <WellbeingSection />
        <BrandSection id="panasonic" brandName="Panasonic" brandColor="bg-sky-600" tagline="Etherea • TZ • Multi-Split" description="Leader mondiale nella climatizzazione residenziale. La gamma Etherea con nanoe™ X offre aria pura, silenziosità a 19dB(A) e design premium. Sistemi multi-split fino a 5 unità interne." products={panasonicProducts} heroImg={panasonicEthereaImg} onProductClick={setSelectedProduct} />
        <BrandSection id="tcl" brandName="TCL" brandColor="bg-amber-600" tagline="BreezeIN • UNITARY • Hotel Mode" description="Innovazione e rapporto qualità-prezzo. La serie BreezeIN con Gentle Breeze offre 1422 micro-fori per un flusso d'aria delicato. Compatibile con Google Home, Alexa e TCL Home App." products={tclProducts} heroImg={tclBreezeInImg} onProductClick={setSelectedProduct} />
        <ProductComparison />
        <HeatersSection onProductClick={setSelectedProduct} />
        <BTUCalculator />
        <ResidentialSection onProductClick={setSelectedProduct} />
        <CommercialSection onProductClick={setSelectedProduct} />
        <EnergySavingsSimulator />
        <ContoTermicoCalculator />
        <FinancingCalculator />
        <ProPartnerSection />
        <KnowledgeBase />
        <OrderTracking />
        <InstallerMap />
        <AboutSection />
        <FAQSection />
        <LegalPages />
        <ContactSection showToast={showToast} />
        
        {/* Phase 2: Content & Engagement */}
        <BlogSection />
        <VideoSection />
        <TestimonialsSection />
        <GallerySection />
        
        {/* Phase 4: Marketing & Growth */}
        <LeadMagnetSection />
        <NewsletterSection />
        
        {/* Phase 3: Backend & Commerce */}
        {user && <UserDashboard />}
        
        <Footer onNavigate={handleNavigate} />
      </main>

      {/* Phase 3: Commerce Components */}
      <AuthModal isOpen={authModal} onClose={() => setAuthModal(false)} />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      
      {/* Cart Button */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-24 left-6 z-50 w-14 h-14 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center shadow-lg border border-white/10 transition-all hover:scale-110 lg:left-[280px]"
        aria-label="Apri carrello"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-sky-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>
      
      {/* User/Auth Button */}
      <button
        onClick={() => setAuthModal(true)}
        className="fixed top-24 right-6 z-50 px-4 py-2 rounded-full bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700 text-white text-sm font-medium flex items-center gap-2 shadow-lg border border-white/10 transition-all lg:right-8"
        aria-label={user ? 'Il tuo account' : 'Accedi'}
      >
        {user ? (
          <>
            <span className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center text-xs font-bold">
              {user.name[0]}
            </span>
            <span className="hidden sm:inline">{user.name}</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="hidden sm:inline">Accedi</span>
          </>
        )}
      </button>

      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* Phase 4: Marketing Components */}
      <SmartPopupSystem />
      <SocialSharing />
      <EmailAutomationSystem />
      <AnalyticsDashboard />
      
      {/* Phase 5: UX Research & Monitoring */}
      <NPSSurvey />
      <FeedbackWidget />
      <UsabilityTestRecorder />
      <UptimeMonitor />
      <ErrorLogViewer />
 
      {/* Cookie Banner */}
      <CookieBanner />
      {/* Signup Modals */}
      <PrivatiSignupModal isOpen={privatiSignup} onClose={() => setPrivatiSignup(false)} showToast={showToast} />
      <ProfessionistiSignupModal isOpen={professionistiSignup} onClose={() => setProfessionistiSignup(false)} showToast={showToast} />

      {/* Product Modal */}
      <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)}>
        {selectedProduct && (
          <div className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-8 relative">
              {selectedProduct.image ? <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-contain" /> : <ProductSVG variant={selectedProduct.variant} />}
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"><svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${selectedProduct.brand === 'Panasonic' ? 'text-sky-400 bg-sky-500/10 border-sky-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20'}`}>{selectedProduct.brand}</span>
                <span className="text-xs text-white/40">{selectedProduct.stock} disponibili</span>
              </div>
              <h3 className="text-xl font-bold text-white">{selectedProduct.name}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{selectedProduct.desc}</p>
              <div className="flex flex-wrap gap-2">{selectedProduct.features.map((f,i)=><span key={i} className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/60 border border-white/10">{f}</span>)}</div>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>{selectedProduct.price && <><span className="text-2xl font-bold text-sky-400">{selectedProduct.price}</span><span className="text-xs text-white/30 ml-2">IVA esclusa</span></>}</div>
                <span className="text-sm text-white/40">Serie {selectedProduct.series}</span>
              </div>
              <a href="#contatti" onClick={() => setSelectedProduct(null)} className="block w-full text-center px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all">Richiedi Informazioni</a>
            </div>
          </div>
        )}
      </Modal>

      {/* Legal Modal */}
      <Modal isOpen={!!legalModal} onClose={() => setLegalModal(null)}>
        {legalModal && legalContent[legalModal] && (
          <div className="bg-slate-900 rounded-2xl border border-white/10 p-8">
            <button onClick={() => setLegalModal(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"><svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            <h3 className="text-2xl font-bold text-white mb-4">{legalContent[legalModal].title}</h3>
            <p className="text-white/60 leading-relaxed">{legalContent[legalModal].body}</p>
            <button onClick={() => setLegalModal(null)} className="mt-6 w-full px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all border border-white/10">Chiudi</button>
          </div>
        )}
      </Modal>
    </div>
    </LanguageProvider>
    </ErrorBoundary>
  );
}
