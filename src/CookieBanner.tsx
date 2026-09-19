import { useState, useEffect } from 'react';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after 1 second delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }));
    setIsVisible(false);
    // Initialize analytics here
    console.log('All cookies accepted');
  };

  const acceptNecessary = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }));
    setIsVisible(false);
    console.log('Only necessary cookies accepted');
  };

  const savePreferences = (preferences: { analytics: boolean; marketing: boolean }) => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      analytics: preferences.analytics,
      marketing: preferences.marketing,
      timestamp: new Date().toISOString()
    }));
    setIsVisible(false);
    console.log('Cookie preferences saved:', preferences);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[200] p-4 bg-black/95 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          {!showDetails ? (
            // Main Banner
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🍪</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">
                    Utilizziamo i cookie per migliorare la tua esperienza
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    AIRKLIM utilizza cookie tecnici essenziali per il funzionamento del sito e, con il tuo consenso, 
                    cookie analitici e di marketing per offrirti contenuti personalizzati. Puoi accettare tutti i cookie 
                    o gestire le tue preferenze.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={acceptAll}
                  className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-sky-500/25"
                >
                  Accetta Tutti
                </button>
                <button
                  onClick={acceptNecessary}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all border border-white/10"
                >
                  Solo Necessari
                </button>
                <button
                  onClick={() => setShowDetails(true)}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all border border-white/10"
                >
                  Personalizza
                </button>
              </div>
            </div>
          ) : (
            // Detailed Preferences
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Gestisci le Preferenze Cookie
                </h3>
                <p className="text-white/60 text-sm">
                  Scegli quali cookie vuoi abilitare. Puoi modificare le tue preferenze in qualsiasi momento.
                </p>
              </div>

              {/* Necessary Cookies */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">Cookie Necessari</h4>
                    <p className="text-sm text-white/50">
                      Essenziali per il funzionamento del sito. Non possono essere disabilitati.
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-6 bg-sky-500 rounded-full relative cursor-not-allowed">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                    <div className="text-xs text-white/40 mt-1 text-center">Sempre attivo</div>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <AnalyticsToggle onSave={savePreferences} />

              {/* Marketing Cookies */}
              <MarketingToggle onSave={savePreferences} />

              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={acceptAll}
                  className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all"
                >
                  Accetta Tutti
                </button>
                <button
                  onClick={acceptNecessary}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all border border-white/10"
                >
                  Salva Preferenze
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all border border-white/10"
                >
                  Indietro
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 text-xs text-white/40">
            Per maggiori informazioni, leggi la nostra{' '}
            <button onClick={() => window.location.hash = 'privacy'} className="text-sky-400 hover:underline">
              Cookie Policy
            </button>
            {' '}e la{' '}
            <button onClick={() => window.location.hash = 'privacy'} className="text-sky-400 hover:underline">
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function AnalyticsToggle({ onSave }: { onSave: (prefs: { analytics: boolean; marketing: boolean }) => void }) {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-1">Cookie Analitici</h4>
          <p className="text-sm text-white/50">
            Ci aiutano a capire come i visitatori interagiscono con il sito, raccogliendo dati in forma anonima.
          </p>
          <ul className="text-xs text-white/40 mt-2 space-y-1">
            <li>• Google Analytics</li>
            <li>• Statistiche di navigazione</li>
            <li>• Performance del sito</li>
          </ul>
        </div>
        <div className="ml-4">
          <button
            onClick={() => setEnabled(!enabled)}
            className={`w-12 h-6 rounded-full relative transition-colors ${enabled ? 'bg-sky-500' : 'bg-white/20'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${enabled ? 'right-1' : 'left-1'}`}></div>
          </button>
          <div className="text-xs text-white/40 mt-1 text-center">
            {enabled ? 'Attivo' : 'Disattivo'}
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketingToggle({ onSave }: { onSave: (prefs: { analytics: boolean; marketing: boolean }) => void }) {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-1">Cookie di Marketing</h4>
          <p className="text-sm text-white/50">
            Utilizzati per mostrarti pubblicità personalizzate in base ai tuoi interessi.
          </p>
          <ul className="text-xs text-white/40 mt-2 space-y-1">
            <li>• Facebook Pixel</li>
            <li>• Pubblicità personalizzata</li>
            <li>• Tracking conversioni</li>
          </ul>
        </div>
        <div className="ml-4">
          <button
            onClick={() => setEnabled(!enabled)}
            className={`w-12 h-6 rounded-full relative transition-colors ${enabled ? 'bg-sky-500' : 'bg-white/20'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${enabled ? 'right-1' : 'left-1'}`}></div>
          </button>
          <div className="text-xs text-white/40 mt-1 text-center">
            {enabled ? 'Attivo' : 'Disattivo'}
          </div>
        </div>
      </div>
    </div>
  );
}
