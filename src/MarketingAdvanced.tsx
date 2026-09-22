/**
 * Marketing Avanzato
 * Google Ads, Facebook Pixel, GTM, Remarketing, Landing Pages, A/B Testing, Gamification, Referral, CRM, Email Marketing
 */

import { useState, useEffect } from 'react';

// ===== GOOGLE ANALYTICS 4 INTEGRATION =====
export function useGA4() {
  useEffect(() => {
    const GA4_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID || 'G-XXXXXXXXXX';
    
    // Load GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    document.head.appendChild(script);

    // Initialize GA4
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', GA4_ID);

    // Track page views
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href
    });
  }, []);

  const trackEvent = (eventName: string, parameters?: any) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...parameters
    });
  };

  return { trackEvent };
}

// ===== FACEBOOK PIXEL INTEGRATION =====
export function useFacebookPixel() {
  useEffect(() => {
    const FB_PIXEL_ID = import.meta.env.VITE_FACEBOOK_PIXEL_ID || 'XXXXXXXXXXXXXXXX';
    
    // Load Facebook Pixel script
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${FB_PIXEL_ID}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);
  }, []);

  const trackFBEvent = (eventName: string, parameters?: any) => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', eventName, parameters);
    }
  };

  return { trackFBEvent };
}

// ===== GOOGLE TAG MANAGER =====
export function useGTM() {
  useEffect(() => {
    const GTM_ID = import.meta.env.VITE_GTM_ID || 'GTM-XXXXXXX';
    
    // Load GTM script
    (function(w: any,d: any,s: any,l: any,i: any) {
      w[l]=w[l]||[];
      w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
      var f=d.getElementsByTagName(s)[0];
      var j=d.createElement(s);
      var dl=l!='dataLayer'?'&l='+l:'';
      j.async=true;
      j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
      if(f && f.parentNode) {
        f.parentNode.insertBefore(j,f);
      }
    })(window,document,'script','dataLayer',GTM_ID);
  }, []);

  const pushDataLayer = (data: any) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data);
  };

  return { pushDataLayer };
}

// ===== REMARKETING CAMPAIGNS =====
export function useRemarketing() {
  const [userBehavior, setUserBehavior] = useState<any[]>([]);

  useEffect(() => {
    // Track user behavior for remarketing
    const trackBehavior = () => {
      const behavior = {
        url: window.location.href,
        timestamp: Date.now(),
        referrer: document.referrer,
        userAgent: navigator.userAgent
      };
      
      const stored = JSON.parse(localStorage.getItem('airklim-behavior') || '[]');
      stored.push(behavior);
      localStorage.setItem('airklim-behavior', JSON.stringify(stored.slice(-100))); // Keep last 100
      setUserBehavior(stored);
    };

    // Track on page load
    trackBehavior();

    // Track on navigation
    window.addEventListener('popstate', trackBehavior);

    return () => {
      window.removeEventListener('popstate', trackBehavior);
    };
  }, []);

  return { userBehavior };
}

// ===== LANDING PAGES =====
export function LandingPage({ type }: { type: 'conto-termico' | 'panasonic-pro' | 'installazione' }) {
  const pages = {
    'conto-termico': {
      title: 'Conto Termico 3.0: Risparmia fino al 65%',
      subtitle: 'Scopri come ottenere incentivi statali per il tuo nuovo climatizzatore',
      cta: 'Calcola il Tuo Incentivo',
      benefits: [
        'Detrazione fiscale fino al 65%',
        'Procedure semplificate',
        'Assistenza completa AIRKLIM',
        'Rimborso in 5 anni'
      ]
    },
    'panasonic-pro': {
      title: 'Diventa Panasonic PRO Partner',
      subtitle: 'Unisciti alla rete di installatori certificati Panasonic',
      cta: 'Scopri i Vantaggi',
      benefits: [
        '5 anni di garanzia sul compressore',
        'Supporto tecnico dedicato',
        'Formazione certificata',
        'Listino riservato'
      ]
    },
    'installazione': {
      title: 'Installazione Professionale Certificata',
      subtitle: 'Affidati ai nostri tecnici certificati DM 37/08',
      cta: 'Richiedi Preventivo',
      benefits: [
        'Tecnici certificati',
        'Garanzia 2 anni',
        'Assistenza post-vendita',
        'Sopralluogo gratuito'
      ]
    }
  };

  const page = pages[type];

  return (
    <section className="py-24 bg-gradient-to-b from-black to-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">{page.title}</h1>
        <p className="text-xl text-white/60 mb-12">{page.subtitle}</p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {page.benefits.map((benefit, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white font-medium">{benefit}</span>
              </div>
            </div>
          ))}
        </div>

        <a href="#contatti" className="inline-block px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-sky-500/25">
          {page.cta}
        </a>
      </div>
    </section>
  );
}

// ===== GAMIFICATION =====
export function GamificationWidget() {
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('airklim-gamification');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setLevel(data.level);
        setXp(data.xp);
        setBadges(data.badges);
      } catch (e) {
        console.error('Error loading gamification data:', e);
      }
    }
  }, []);

  const addXP = (amount: number) => {
    const newXP = xp + amount;
    const xpPerLevel = 100;
    const newLevel = Math.floor(newXP / xpPerLevel) + 1;
    
    setXp(newXP);
    setLevel(newLevel);
    
    // Award badges
    const newBadges = [...badges];
    if (newLevel >= 5 && !newBadges.includes('Esperto')) {
      newBadges.push('Esperto');
    }
    if (newXP >= 500 && !newBadges.includes('Appassionato')) {
      newBadges.push('Appassionato');
    }
    setBadges(newBadges);
    
    localStorage.setItem('airklim-gamification', JSON.stringify({ level: newLevel, xp: newXP, badges: newBadges }));
  };

  const xpForNextLevel = 100;
  const currentLevelXP = xp % xpForNextLevel;
  const progress = (currentLevelXP / xpForNextLevel) * 100;

  return (
    <div className="fixed bottom-72 right-6 z-40 lg:right-8">
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 p-4 w-64">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold text-white">Livello {level}</div>
          <div className="text-xs text-white/50">{currentLevelXP}/{xpForNextLevel} XP</div>
        </div>
        
        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
          <div 
            className="h-full bg-gradient-to-r from-sky-500 to-blue-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {badges.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {badges.map((badge, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                🏆 {badge}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== REFERRAL SYSTEM =====
export function ReferralSystem() {
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate or retrieve referral code
    const stored = localStorage.getItem('airklim-referral-code');
    if (stored) {
      setReferralCode(stored);
    } else {
      const newCode = 'AIRKLIM-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      setReferralCode(newCode);
      localStorage.setItem('airklim-referral-code', newCode);
    }
  }, []);

  const copyReferralLink = () => {
    const link = `https://airklim.it/?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="referral" className="py-16 bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-sky-500/10 to-blue-600/10 rounded-2xl border border-sky-500/20 p-8 text-center">
          <div className="text-5xl mb-4">🎁</div>
          <h2 className="text-3xl font-bold text-white mb-3">Programma Referral</h2>
          <p className="text-white/60 mb-6">Invita i tuoi amici e ricevi €50 di sconto per ogni amico che acquista</p>

          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <div className="text-sm text-white/50 mb-2">Il tuo codice referral</div>
            <div className="text-2xl font-bold text-sky-400 font-mono">{referralCode}</div>
          </div>

          <button
            onClick={copyReferralLink}
            className="px-8 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all"
          >
            {copied ? '✓ Link Copiato!' : 'Copia Link Referral'}
          </button>

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-sky-400">€50</div>
              <div className="text-sm text-white/50">Per ogni amico</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-sky-400">∞</div>
              <div className="text-sm text-white/50">Amici invitabili</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-sky-400">30gg</div>
              <div className="text-sm text-white/50">Validità codice</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== EMAIL MARKETING AUTOMATION =====
export function useEmailAutomation() {
  const sendWelcomeSequence = async (email: string, name: string) => {
    const sequence = [
      { delay: 0, subject: 'Benvenuto in AIRKLIM!', template: 'welcome' },
      { delay: 1, subject: 'Scopri i nostri prodotti', template: 'products' },
      { delay: 3, subject: 'Offerta speciale per te', template: 'offer' },
      { delay: 7, subject: 'Come possiamo aiutarti?', template: 'followup' }
    ];

    sequence.forEach((email, index) => {
      setTimeout(() => {
        console.log(`📧 Sending email ${index + 1} to ${email}: ${email.subject}`);
        // In production: call email service API
      }, email.delay * 24 * 60 * 60 * 1000);
    });
  };

  const sendAbandonedCart = async (email: string, cartItems: any[]) => {
    setTimeout(() => {
      console.log(`📧 Sending abandoned cart email to ${email}`);
      // In production: call email service API
    }, 60 * 60 * 1000); // 1 hour
  };

  const sendOrderConfirmation = async (email: string, orderId: string) => {
    console.log(`📧 Sending order confirmation to ${email} for order ${orderId}`);
    // In production: call email service API
  };

  const sendReviewRequest = async (email: string, orderId: string) => {
    setTimeout(() => {
      console.log(`📧 Sending review request to ${email} for order ${orderId}`);
      // In production: call email service API
    }, 7 * 24 * 60 * 60 * 1000); // 7 days after delivery
  };

  return {
    sendWelcomeSequence,
    sendAbandonedCart,
    sendOrderConfirmation,
    sendReviewRequest
  };
}

// ===== CRM INTEGRATION =====
export function useCRM() {
  const syncCustomer = async (customerData: any) => {
    console.log('🔄 Syncing customer to CRM:', customerData);
    // In production: call CRM API (HubSpot, Salesforce, etc.)
  };

  const updateCustomerSegment = async (customerId: string, segment: string) => {
    console.log(`🔄 Updating customer ${customerId} to segment: ${segment}`);
    // In production: call CRM API
  };

  const trackCustomerInteraction = async (customerId: string, interaction: any) => {
    console.log(`🔄 Tracking interaction for customer ${customerId}:`, interaction);
    // In production: call CRM API
  };

  return {
    syncCustomer,
    updateCustomerSegment,
    trackCustomerInteraction
  };
}

// ===== SOCIAL MEDIA AUTOMATION =====
export function useSocialMedia() {
  const shareOnSocial = (platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp', content: any) => {
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(content.url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(content.url)}&text=${encodeURIComponent(content.title)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(content.url)}&title=${encodeURIComponent(content.title)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(content.title + ' ' + content.url)}`
    };

    window.open(urls[platform], '_blank');
  };

  return { shareOnSocial };
}

// Type declarations for external scripts
declare global {
  interface Window {
    dataLayer: any[];
    fbq: any;
  }
}
