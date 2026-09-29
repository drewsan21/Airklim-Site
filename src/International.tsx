/**
 * AIRKLIM International Expansion
 * Multi-language, multi-currency, global payments
 */

import { useState, useEffect, createContext, useContext } from 'react';

// ===== LANGUAGE CONTEXT =====
type Language = 'it' | 'en' | 'es' | 'de' | 'fr';
type Currency = 'EUR' | 'USD' | 'GBP' | 'CHF';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  t: (key: string) => string;
  formatPrice: (price: number) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// ===== TRANSLATIONS =====
const translations: Record<Language, Record<string, string>> = {
  it: {
    'nav.home': 'Home',
    'nav.products': 'Prodotti',
    'nav.residential': 'Residenziale',
    'nav.commercial': 'Commerciale',
    'nav.blog': 'Blog',
    'nav.contact': 'Contatti',
    'hero.title': 'Il Comfort che Trasforma la Tua Vita',
    'hero.subtitle': 'Perché ogni giorno meriti di essere vissuto nel massimo benessere',
    'hero.cta': 'Scopri i Prodotti',
    'hero.cta2': 'Richiedi Preventivo',
    'products.title': 'I Nostri Prodotti',
    'products.subtitle': 'Solo i migliori marchi per garantirti prestazioni eccezionali',
    'products.viewAll': 'Vedi Tutti i Prodotti',
    'features.delivery': 'Pronta Consegna',
    'features.delivery.desc': 'Magazzino sempre fornito',
    'features.assistance': 'Centro Assistenza',
    'features.assistance.desc': 'Supporto specializzato',
    'features.brands': 'Grandi Marchi',
    'features.brands.desc': 'Solo i migliori brand',
    'features.distribution': 'Distribuzione',
    'features.distribution.desc': 'Logistica efficiente',
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
    'footer.cookies': 'Cookie Policy'
  },
  en: {
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.residential': 'Residential',
    'nav.commercial': 'Commercial',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'hero.title': 'Comfort that Transforms Your Life',
    'hero.subtitle': 'Because every day deserves to be lived in maximum well-being',
    'hero.cta': 'Discover Products',
    'hero.cta2': 'Request Quote',
    'products.title': 'Our Products',
    'products.subtitle': 'Only the best brands to guarantee you exceptional performance',
    'products.viewAll': 'View All Products',
    'features.delivery': 'Ready Delivery',
    'features.delivery.desc': 'Always stocked warehouse',
    'features.assistance': 'Assistance Center',
    'features.assistance.desc': 'Specialized support',
    'features.brands': 'Top Brands',
    'features.brands.desc': 'Only the best brands',
    'features.distribution': 'Distribution',
    'features.distribution.desc': 'Efficient logistics',
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
    'footer.cookies': 'Cookie Policy'
  },
  es: {
    'nav.home': 'Inicio',
    'nav.products': 'Productos',
    'nav.residential': 'Residencial',
    'nav.commercial': 'Comercial',
    'nav.blog': 'Blog',
    'nav.contact': 'Contacto',
    'hero.title': 'El Confort que Transforma tu Vida',
    'hero.subtitle': 'Porque cada día merece ser vivido con el máximo bienestar',
    'hero.cta': 'Descubrir Productos',
    'hero.cta2': 'Solicitar Presupuesto',
    'products.title': 'Nuestros Productos',
    'products.subtitle': 'Solo las mejores marcas para garantizarle un rendimiento excepcional',
    'products.viewAll': 'Ver Todos los Productos',
    'features.delivery': 'Entrega Inmediata',
    'features.delivery.desc': 'Almacén siempre surtido',
    'features.assistance': 'Centro de Asistencia',
    'features.assistance.desc': 'Soporte especializado',
    'features.brands': 'Grandes Marcas',
    'features.brands.desc': 'Solo las mejores marcas',
    'features.distribution': 'Distribución',
    'features.distribution.desc': 'Logística eficiente',
    'common.learnMore': 'Saber más',
    'common.contact': 'Contáctanos',
    'common.register': 'Registrarse',
    'common.login': 'Acceder',
    'common.logout': 'Salir',
    'common.cart': 'Carrito',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.sort': 'Ordenar',
    'common.price': 'Precio',
    'common.quantity': 'Cantidad',
    'common.total': 'Total',
    'common.addToCart': 'Añadir al Carrito',
    'common.buyNow': 'Comprar Ahora',
    'common.readMore': 'Leer más',
    'common.viewDetails': 'Ver Detalles',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.close': 'Cerrar',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
    'common.submit': 'Enviar',
    'common.send': 'Enviar',
    'common.loading': 'Cargando...',
    'common.success': 'Éxito',
    'common.error': 'Error',
    'common.warning': 'Advertencia',
    'common.info': 'Información',
    'footer.about': 'Sobre Nosotros',
    'footer.products': 'Productos',
    'footer.services': 'Servicios',
    'footer.contact': 'Contacto',
    'footer.follow': 'Síguenos',
    'footer.newsletter': 'Boletín',
    'footer.subscribe': 'Suscribirse',
    'footer.rights': 'Todos los derechos reservados',
    'footer.privacy': 'Política de Privacidad',
    'footer.terms': 'Términos y Condiciones',
    'footer.cookies': 'Política de Cookies'
  },
  de: {
    'nav.home': 'Startseite',
    'nav.products': 'Produkte',
    'nav.residential': 'Wohnbereich',
    'nav.commercial': 'Gewerbe',
    'nav.blog': 'Blog',
    'nav.contact': 'Kontakt',
    'hero.title': 'Komfort, der Ihr Leben verändert',
    'hero.subtitle': 'Weil jeder Tag es verdient, in maximalem Wohlbefinden gelebt zu werden',
    'hero.cta': 'Produkte entdecken',
    'hero.cta2': 'Angebot anfordern',
    'products.title': 'Unsere Produkte',
    'products.subtitle': 'Nur die besten Marken, um Ihnen außergewöhnliche Leistung zu garantieren',
    'products.viewAll': 'Alle Produkte anzeigen',
    'features.delivery': 'Sofortige Lieferung',
    'features.delivery.desc': 'Immer voll bestücktes Lager',
    'features.assistance': 'Assistenzzentrum',
    'features.assistance.desc': 'Spezialisierter Support',
    'features.brands': 'Top-Marken',
    'features.brands.desc': 'Nur die besten Marken',
    'features.distribution': 'Vertrieb',
    'features.distribution.desc': 'Effiziente Logistik',
    'common.learnMore': 'Mehr erfahren',
    'common.contact': 'Kontaktieren Sie uns',
    'common.register': 'Registrieren',
    'common.login': 'Anmelden',
    'common.logout': 'Abmelden',
    'common.cart': 'Warenkorb',
    'common.search': 'Suchen',
    'common.filter': 'Filtern',
    'common.sort': 'Sortieren',
    'common.price': 'Preis',
    'common.quantity': 'Menge',
    'common.total': 'Gesamt',
    'common.addToCart': 'In den Warenkorb',
    'common.buyNow': 'Jetzt kaufen',
    'common.readMore': 'Weiterlesen',
    'common.viewDetails': 'Details anzeigen',
    'common.back': 'Zurück',
    'common.next': 'Weiter',
    'common.previous': 'Zurück',
    'common.close': 'Schließen',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.confirm': 'Bestätigen',
    'common.submit': 'Senden',
    'common.send': 'Senden',
    'common.loading': 'Laden...',
    'common.success': 'Erfolg',
    'common.error': 'Fehler',
    'common.warning': 'Warnung',
    'common.info': 'Information',
    'footer.about': 'Über uns',
    'footer.products': 'Produkte',
    'footer.services': 'Dienstleistungen',
    'footer.contact': 'Kontakt',
    'footer.follow': 'Folgen Sie uns',
    'footer.newsletter': 'Newsletter',
    'footer.subscribe': 'Abonnieren',
    'footer.rights': 'Alle Rechte vorbehalten',
    'footer.privacy': 'Datenschutzrichtlinie',
    'footer.terms': 'Allgemeine Geschäftsbedingungen',
    'footer.cookies': 'Cookie-Richtlinie'
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.products': 'Produits',
    'nav.residential': 'Résidentiel',
    'nav.commercial': 'Commercial',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'hero.title': 'Le Confort qui Transforme Votre Vie',
    'hero.subtitle': 'Parce que chaque jour mérite d\'être vécu dans le bien-être maximum',
    'hero.cta': 'Découvrir les Produits',
    'hero.cta2': 'Demander un Devis',
    'products.title': 'Nos Produits',
    'products.subtitle': 'Seulement les meilleures marques pour vous garantir des performances exceptionnelles',
    'products.viewAll': 'Voir Tous les Produits',
    'features.delivery': 'Livraison Rapide',
    'features.delivery.desc': 'Entrepôt toujours approvisionné',
    'features.assistance': 'Centre d\'Assistance',
    'features.assistance.desc': 'Support spécialisé',
    'features.brands': 'Grandes Marques',
    'features.brands.desc': 'Seulement les meilleures marques',
    'features.distribution': 'Distribution',
    'features.distribution.desc': 'Logistique efficace',
    'common.learnMore': 'En savoir plus',
    'common.contact': 'Contactez-nous',
    'common.register': 'S\'inscrire',
    'common.login': 'Se connecter',
    'common.logout': 'Se déconnecter',
    'common.cart': 'Panier',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',
    'common.price': 'Prix',
    'common.quantity': 'Quantité',
    'common.total': 'Total',
    'common.addToCart': 'Ajouter au Panier',
    'common.buyNow': 'Acheter Maintenant',
    'common.readMore': 'Lire la suite',
    'common.viewDetails': 'Voir les Détails',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.close': 'Fermer',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.confirm': 'Confirmer',
    'common.submit': 'Soumettre',
    'common.send': 'Envoyer',
    'common.loading': 'Chargement...',
    'common.success': 'Succès',
    'common.error': 'Erreur',
    'common.warning': 'Avertissement',
    'common.info': 'Information',
    'footer.about': 'À Propos',
    'footer.products': 'Produits',
    'footer.services': 'Services',
    'footer.contact': 'Contact',
    'footer.follow': 'Suivez-nous',
    'footer.newsletter': 'Newsletter',
    'footer.subscribe': 'S\'abonner',
    'footer.rights': 'Tous droits réservés',
    'footer.privacy': 'Politique de Confidentialité',
    'footer.terms': 'Conditions Générales',
    'footer.cookies': 'Politique de Cookies'
  }
};

// ===== CURRENCY RATES =====
const currencyRates: Record<Currency, number> = {
  EUR: 1.0,
  USD: 1.08,
  GBP: 0.85,
  CHF: 0.95
};

const currencySymbols: Record<Currency, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  CHF: 'CHF'
};

// ===== TRANSLATION PROVIDER =====
export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('airklim-language');
    return (saved as Language) || 'it';
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('airklim-currency');
    return (saved as Currency) || 'EUR';
  });

  useEffect(() => {
    localStorage.setItem('airklim-language', language);
    localStorage.setItem('airklim-currency', currency);
    document.documentElement.lang = language;
  }, [language, currency]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const formatPrice = (price: number): string => {
    const convertedPrice = price * currencyRates[currency];
    const symbol = currencySymbols[currency];
    
    return new Intl.NumberFormat(language, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(convertedPrice);
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, currency, setCurrency, t, formatPrice }}>
      {children}
    </TranslationContext.Provider>
  );
}

// ===== USE TRANSLATION HOOK =====
export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}

// ===== LANGUAGE & CURRENCY SELECTOR =====
export function LanguageCurrencySelector() {
  const { language, setLanguage, currency, setCurrency } = useTranslation();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  const currencies: { code: Currency; name: string; symbol: string }[] = [
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' }
  ];

  return (
    <div className="fixed top-24 left-6 z-50 flex gap-2 lg:left-[280px]">
      {/* Language Selector */}
      <div className="relative group">
        <button className="flex items-center gap-2 px-3 py-2 bg-slate-800/80 backdrop-blur-sm rounded-full border border-white/10 hover:bg-slate-700 transition-all">
          <span className="text-sm">{languages.find(l => l.code === language)?.flag}</span>
          <span className="text-xs text-white font-medium hidden sm:inline">
            {languages.find(l => l.code === language)?.name}
          </span>
          <svg className="w-3 h-3 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900 rounded-xl border border-white/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all ${
                language === lang.code ? 'bg-sky-500/10' : ''
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="text-sm text-white">{lang.name}</span>
              {language === lang.code && (
                <svg className="w-4 h-4 text-sky-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Currency Selector */}
      <div className="relative group">
        <button className="flex items-center gap-2 px-3 py-2 bg-slate-800/80 backdrop-blur-sm rounded-full border border-white/10 hover:bg-slate-700 transition-all">
          <span className="text-xs text-white font-medium">
            {currencies.find(c => c.code === currency)?.symbol}
          </span>
          <svg className="w-3 h-3 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900 rounded-xl border border-white/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
          {currencies.map(curr => (
            <button
              key={curr.code}
              onClick={() => setCurrency(curr.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all ${
                currency === curr.code ? 'bg-sky-500/10' : ''
              }`}
            >
              <span className="text-lg">{curr.symbol}</span>
              <span className="text-sm text-white">{curr.name}</span>
              {currency === curr.code && (
                <svg className="w-4 h-4 text-sky-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== GLOBAL PAYMENT GATEWAYS =====
export function GlobalPaymentGateway({ amount, currency, onSuccess, onError }: {
  amount: number;
  currency: Currency;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}) {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [processing, setProcessing] = useState(false);

  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Credit Card',
      icon: '💳',
      description: 'Visa, Mastercard, Amex',
      supportedCurrencies: ['EUR', 'USD', 'GBP', 'CHF']
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '🅿️',
      description: 'Pay with PayPal',
      supportedCurrencies: ['EUR', 'USD', 'GBP', 'CHF']
    },
    {
      id: 'klarna',
      name: 'Klarna',
      icon: '🟡',
      description: 'Pay in 3 installments',
      supportedCurrencies: ['EUR', 'GBP']
    },
    {
      id: 'sofort',
      name: 'Sofort',
      icon: '🔵',
      description: 'Bank transfer (Germany)',
      supportedCurrencies: ['EUR']
    },
    {
      id: 'ideal',
      name: 'iDEAL',
      icon: '🟠',
      description: 'Bank transfer (Netherlands)',
      supportedCurrencies: ['EUR']
    },
    {
      id: 'bancontact',
      name: 'Bancontact',
      icon: '🟣',
      description: 'Bank transfer (Belgium)',
      supportedCurrencies: ['EUR']
    }
  ];

  const availableMethods = paymentMethods.filter(method => 
    method.supportedCurrencies.includes(currency)
  );

  const handlePayment = async () => {
    if (!selectedMethod) {
      onError('Please select a payment method');
      return;
    }

    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In production: integrate with actual payment gateway
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      console.log(`Payment processed: ${selectedMethod} - ${amount} ${currency}`);
      
      onSuccess(transactionId);
    } catch (error) {
      onError('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6">
      <h3 className="text-xl font-bold text-white mb-6">Payment Method</h3>

      <div className="space-y-3 mb-6">
        {availableMethods.map(method => (
          <button
            key={method.id}
            onClick={() => setSelectedMethod(method.id)}
            className={`w-full p-4 rounded-xl border transition-all ${
              selectedMethod === method.id
                ? 'bg-sky-500/10 border-sky-500/50'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">{method.icon}</div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-white">{method.name}</div>
                <div className="text-sm text-white/50">{method.description}</div>
              </div>
              {selectedMethod === method.id && (
                <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handlePayment}
        disabled={!selectedMethod || processing}
        className="w-full px-6 py-4 bg-sky-500 hover:bg-sky-400 disabled:bg-white/10 disabled:text-white/30 text-white rounded-xl font-semibold transition-all"
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </span>
        ) : (
          `Pay ${new Intl.NumberFormat('en', { style: 'currency', currency }).format(amount)}`
        )}
      </button>
    </div>
  );
}

// ===== INTERNATIONAL SHIPPING =====
export function InternationalShipping() {
  const { currency, formatPrice } = useTranslation();

  const shippingZones = [
    {
      zone: 'Italy',
      countries: ['IT'],
      standard: 15,
      express: 25,
      freeThreshold: 500,
      deliveryDays: '2-3'
    },
    {
      zone: 'Europe',
      countries: ['DE', 'FR', 'ES', 'PT', 'NL', 'BE', 'AT', 'CH'],
      standard: 25,
      express: 45,
      freeThreshold: 1000,
      deliveryDays: '3-5'
    },
    {
      zone: 'UK & Ireland',
      countries: ['GB', 'IE'],
      standard: 30,
      express: 50,
      freeThreshold: 1000,
      deliveryDays: '4-6'
    },
    {
      zone: 'Rest of World',
      countries: ['US', 'CA', 'AU', 'JP', 'CN'],
      standard: 50,
      express: 90,
      freeThreshold: 2000,
      deliveryDays: '7-14'
    }
  ];

  return (
    <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6">
      <h3 className="text-xl font-bold text-white mb-6">International Shipping</h3>

      <div className="space-y-4">
        {shippingZones.map((zone, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-white">{zone.zone}</h4>
              <span className="text-sm text-white/50">{zone.deliveryDays} days</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-white/50">Standard</div>
                <div className="text-white font-semibold">{formatPrice(zone.standard)}</div>
              </div>
              <div>
                <div className="text-white/50">Express</div>
                <div className="text-white font-semibold">{formatPrice(zone.express)}</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-green-400">
              ✓ Free shipping on orders over {formatPrice(zone.freeThreshold)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== TAX CALCULATOR =====
export function TaxCalculator() {
  const { currency } = useTranslation();

  const taxRates: Record<string, number> = {
    'IT': 0.22, // Italy VAT
    'DE': 0.19, // Germany VAT
    'FR': 0.20, // France VAT
    'ES': 0.21, // Spain VAT
    'GB': 0.20, // UK VAT
    'CH': 0.077, // Switzerland VAT
    'US': 0, // No VAT in US
    'default': 0.20
  };

  const calculateTax = (amount: number, country: string): number => {
    const rate = taxRates[country] || taxRates['default'];
    return amount * rate;
  };

  return { calculateTax, taxRates };
}

export default {
  TranslationProvider,
  useTranslation,
  LanguageCurrencySelector,
  GlobalPaymentGateway,
  InternationalShipping,
  TaxCalculator
};
