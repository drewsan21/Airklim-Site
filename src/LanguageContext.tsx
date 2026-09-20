import { useState, createContext, useContext, ReactNode } from 'react';

// ===== LANGUAGE CONTEXT =====
type Language = 'it' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// ===== TRANSLATIONS =====
const translations: Record<Language, Record<string, string>> = {
  it: {
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Prodotti',
    'nav.residential': 'Residenziale',
    'nav.commercial': 'Commerciale',
    'nav.blog': 'Blog',
    'nav.contact': 'Contatti',
    
    // Hero
    'hero.title': 'Il Comfort che Trasforma la Tua Vita',
    'hero.subtitle': 'Perché ogni giorno meriti di essere vissuto nel massimo benessere',
    'hero.cta': 'Scopri i Prodotti',
    'hero.cta2': 'Richiedi Preventivo',
    
    // Profile Choice
    'profile.title': 'Scegli il Tuo Profilo',
    'profile.subtitle': 'Seleziona l\'area dedicata per accedere a prodotti e servizi su misura',
    'profile.privati': 'Privati',
    'profile.privati.desc': 'Sei un privato cittadino? Accedi a prodotti residenziali, pompe di calore e soluzioni per il comfort domestico.',
    'profile.professionisti': 'Installatori & Aziende',
    'profile.professionisti.desc': 'Sei un installatore certificato o un\'azienda? Accedi a prezzi riservati, supporto tecnico e servizi professionali.',
    
    // Products
    'products.title': 'I Nostri Prodotti',
    'products.subtitle': 'Solo i migliori marchi per garantirti prestazioni eccezionali',
    'products.viewAll': 'Vedi Tutti i Prodotti',
    
    // Features
    'features.delivery': 'Pronta Consegna',
    'features.delivery.desc': 'Magazzino sempre fornito',
    'features.assistance': 'Centro Assistenza',
    'features.assistance.desc': 'Supporto specializzato',
    'features.brands': 'Grandi Marchi',
    'features.brands.desc': 'Solo i migliori brand',
    'features.distribution': 'Distribuzione',
    'features.distribution.desc': 'Logistica efficiente',
    
    // Common
    'common.learnMore': 'Scopri di più',
    'common.contact': 'Contattaci',
    'common.register': 'Registrati',
    'common.login': 'Accedi',
    'common.logout': 'Esci',
    'common.cart': 'Carrello',
    'common.search': 'Cerca',
    'common.filter': 'Filtra',
    'common.sort': 'Ordina',
    'common.price': 'Prezzo',
    'common.quantity': 'Quantità',
    'common.total': 'Totale',
    'common.addToCart': 'Aggiungi al Carrello',
    'common.buyNow': 'Acquista Ora',
    'common.readMore': 'Leggi di più',
    'common.viewDetails': 'Vedi Dettagli',
    'common.back': 'Indietro',
    'common.next': 'Avanti',
    'common.previous': 'Precedente',
    'common.close': 'Chiudi',
    'common.save': 'Salva',
    'common.cancel': 'Annulla',
    'common.confirm': 'Conferma',
    'common.submit': 'Invia',
    'common.send': 'Invia',
    'common.loading': 'Caricamento...',
    'common.success': 'Successo',
    'common.error': 'Errore',
    'common.warning': 'Attenzione',
    'common.info': 'Informazione',
    
    // Footer
    'footer.about': 'Chi Siamo',
    'footer.products': 'Prodotti',
    'footer.services': 'Servizi',
    'footer.contact': 'Contatti',
    'footer.follow': 'Seguici',
    'footer.newsletter': 'Newsletter',
    'footer.subscribe': 'Iscriviti',
    'footer.rights': 'Tutti i diritti riservati',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Termini e Condizioni',
    'footer.cookies': 'Cookie Policy',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.residential': 'Residential',
    'nav.commercial': 'Commercial',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    
    // Hero
    'hero.title': 'Comfort that Transforms Your Life',
    'hero.subtitle': 'Because every day deserves to be lived in maximum well-being',
    'hero.cta': 'Discover Products',
    'hero.cta2': 'Request Quote',
    
    // Profile Choice
    'profile.title': 'Choose Your Profile',
    'profile.subtitle': 'Select the dedicated area to access products and services tailored to you',
    'profile.privati': 'Individuals',
    'profile.privati.desc': 'Are you a private citizen? Access residential products, heat pumps and home comfort solutions.',
    'profile.professionisti': 'Installers & Businesses',
    'profile.professionisti.desc': 'Are you a certified installer or business? Access reserved prices, technical support and professional services.',
    
    // Products
    'products.title': 'Our Products',
    'products.subtitle': 'Only the best brands to guarantee you exceptional performance',
    'products.viewAll': 'View All Products',
    
    // Features
    'features.delivery': 'Ready Delivery',
    'features.delivery.desc': 'Always stocked warehouse',
    'features.assistance': 'Assistance Center',
    'features.assistance.desc': 'Specialized support',
    'features.brands': 'Top Brands',
    'features.brands.desc': 'Only the best brands',
    'features.distribution': 'Distribution',
    'features.distribution.desc': 'Efficient logistics',
    
    // Common
    'common.learnMore': 'Learn More',
    'common.contact': 'Contact Us',
    'common.register': 'Register',
    'common.login': 'Login',
    'common.logout': 'Logout',
    'common.cart': 'Cart',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.price': 'Price',
    'common.quantity': 'Quantity',
    'common.total': 'Total',
    'common.addToCart': 'Add to Cart',
    'common.buyNow': 'Buy Now',
    'common.readMore': 'Read More',
    'common.viewDetails': 'View Details',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.submit': 'Submit',
    'common.send': 'Send',
    'common.loading': 'Loading...',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.warning': 'Warning',
    'common.info': 'Information',
    
    // Footer
    'footer.about': 'About Us',
    'footer.products': 'Products',
    'footer.services': 'Services',
    'footer.contact': 'Contact',
    'footer.follow': 'Follow Us',
    'footer.newsletter': 'Newsletter',
    'footer.subscribe': 'Subscribe',
    'footer.rights': 'All rights reserved',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms and Conditions',
    'footer.cookies': 'Cookie Policy',
  }
};

// ===== LANGUAGE PROVIDER =====
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('airklim-language');
    return (saved === 'en' || saved === 'it') ? saved : 'it';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('airklim-language', lang);
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ===== USE LANGUAGE HOOK =====
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

// ===== LANGUAGE SWITCHER COMPONENT =====
export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-24 left-6 z-50 lg:left-[280px]">
      <div className="flex items-center gap-1 bg-slate-800/80 backdrop-blur-sm rounded-full p-1 border border-white/10">
        <button
          onClick={() => setLanguage('it')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            language === 'it'
              ? 'bg-sky-500 text-white'
              : 'text-white/60 hover:text-white'
          }`}
          aria-label="Italiano"
        >
          🇮🇹 IT
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            language === 'en'
              ? 'bg-sky-500 text-white'
              : 'text-white/60 hover:text-white'
          }`}
          aria-label="English"
        >
          🇬🇧 EN
        </button>
      </div>
    </div>
  );
}
