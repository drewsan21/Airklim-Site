import { useState, useEffect } from 'react';

interface Settings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  currency: string;
  timezone: string;
  maintenanceMode: boolean;
  emailSettings: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  paymentSettings: {
    stripeEnabled: boolean;
    stripeKey: string;
    paypalEnabled: boolean;
    paypalEmail: string;
    bankTransferEnabled: boolean;
    bankDetails: string;
  };
  shippingSettings: {
    freeShippingThreshold: number;
    standardShippingCost: number;
    expressShippingCost: number;
    deliveryDays: number;
  };
}

export function SettingsManagement() {
  const [settings, setSettings] = useState<Settings>({
    siteName: 'AIRKLIM',
    siteDescription: 'Distributore Ufficiale Panasonic PRO Partner | Climatizzazione Professionale Sicilia',
    contactEmail: 'info@airklim.it',
    contactPhone: '+39 091 8691680',
    address: 'Via Ciachea, 2/e - Zona Industriale, 90044 Carini (PA)',
    currency: 'EUR',
    timezone: 'Europe/Rome',
    maintenanceMode: false,
    emailSettings: {
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      fromEmail: 'noreply@airklim.it',
      fromName: 'AIRKLIM'
    },
    paymentSettings: {
      stripeEnabled: false,
      stripeKey: '',
      paypalEnabled: false,
      paypalEmail: '',
      bankTransferEnabled: true,
      bankDetails: 'IBAN: IT00 X000 0000 0000 0000 0000 000\nIntestatario: AIRKLIM S.r.l.'
    },
    shippingSettings: {
      freeShippingThreshold: 500,
      standardShippingCost: 15,
      expressShippingCost: 25,
      deliveryDays: 3
    }
  });

  const [activeTab, setActiveTab] = useState<'general' | 'email' | 'payment' | 'shipping' | 'roles' | 'api'>('general');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('airklim-settings');
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('airklim-settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'general' as const, label: 'Generali', icon: '⚙️' },
    { id: 'email' as const, label: 'Email', icon: '📧' },
    { id: 'payment' as const, label: 'Pagamenti', icon: '💳' },
    { id: 'shipping' as const, label: 'Spedizioni', icon: '🚚' },
    { id: 'roles' as const, label: 'Ruoli', icon: '👥' },
    { id: 'api' as const, label: 'API Keys', icon: '🔑' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Impostazioni</h1>
          <p className="text-white/50">Configura la piattaforma AIRKLIM</p>
        </div>
        <button
          onClick={handleSave}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-sky-500 hover:bg-sky-400 text-white'
          }`}
        >
          {saved ? '✅ Salvato!' : '💾 Salva Impostazioni'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-sky-400 border-b-2 border-sky-400'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6 space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">Informazioni Sito</h2>
            
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Nome Sito</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Descrizione Sito</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Email Contatto</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Telefono Contatto</label>
                <input
                  type="tel"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Indirizzo</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Valuta</label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Fuso Orario</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
                >
                  <option value="Europe/Rome">Europe/Rome</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="America/New_York">America/New_York</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <input
                type="checkbox"
                id="maintenance"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="w-5 h-5 rounded"
              />
              <label htmlFor="maintenance" className="flex-1">
                <div className="font-semibold text-white">Modalità Manutenzione</div>
                <div className="text-sm text-white/50">Il sito sarà visibile solo agli amministratori</div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Email Settings */}
      {activeTab === 'email' && (
        <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Configurazione Email</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">SMTP Host</label>
              <input
                type="text"
                value={settings.emailSettings.smtpHost}
                onChange={(e) => setSettings({ ...settings, emailSettings: { ...settings.emailSettings, smtpHost: e.target.value } })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
                placeholder="smtp.gmail.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">SMTP Port</label>
              <input
                type="number"
                value={settings.emailSettings.smtpPort}
                onChange={(e) => setSettings({ ...settings, emailSettings: { ...settings.emailSettings, smtpPort: parseInt(e.target.value) } })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">SMTP User</label>
              <input
                type="text"
                value={settings.emailSettings.smtpUser}
                onChange={(e) => setSettings({ ...settings, emailSettings: { ...settings.emailSettings, smtpUser: e.target.value } })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">SMTP Password</label>
              <input
                type="password"
                value={settings.emailSettings.smtpPassword}
                onChange={(e) => setSettings({ ...settings, emailSettings: { ...settings.emailSettings, smtpPassword: e.target.value } })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Email Mittente</label>
              <input
                type="email"
                value={settings.emailSettings.fromEmail}
                onChange={(e) => setSettings({ ...settings, emailSettings: { ...settings.emailSettings, fromEmail: e.target.value } })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Nome Mittente</label>
              <input
                type="text"
                value={settings.emailSettings.fromName}
                onChange={(e) => setSettings({ ...settings, emailSettings: { ...settings.emailSettings, fromName: e.target.value } })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Payment Settings */}
      {activeTab === 'payment' && (
        <div className="space-y-6">
          <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6 space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">Metodi di Pagamento</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <input
                  type="checkbox"
                  id="stripe"
                  checked={settings.paymentSettings.stripeEnabled}
                  onChange={(e) => setSettings({ ...settings, paymentSettings: { ...settings.paymentSettings, stripeEnabled: e.target.checked } })}
                  className="w-5 h-5 rounded"
                />
                <label htmlFor="stripe" className="flex-1">
                  <div className="font-semibold text-white">Stripe</div>
                  <div className="text-sm text-white/50">Accetta pagamenti con carta di credito</div>
                </label>
              </div>

              {settings.paymentSettings.stripeEnabled && (
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Stripe API Key</label>
                  <input
                    type="text"
                    value={settings.paymentSettings.stripeKey}
                    onChange={(e) => setSettings({ ...settings, paymentSettings: { ...settings.paymentSettings, stripeKey: e.target.value } })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none font-mono"
                    placeholder="sk_live_..."
                  />
                </div>
              )}

              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <input
                  type="checkbox"
                  id="paypal"
                  checked={settings.paymentSettings.paypalEnabled}
                  onChange={(e) => setSettings({ ...settings, paymentSettings: { ...settings.paymentSettings, paypalEnabled: e.target.checked } })}
                  className="w-5 h-5 rounded"
                />
                <label htmlFor="paypal" className="flex-1">
                  <div className="font-semibold text-white">PayPal</div>
                  <div className="text-sm text-white/50">Accetta pagamenti PayPal</div>
                </label>
              </div>

              {settings.paymentSettings.paypalEnabled && (
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Email PayPal</label>
                  <input
                    type="email"
                    value={settings.paymentSettings.paypalEmail}
                    onChange={(e) => setSettings({ ...settings, paymentSettings: { ...settings.paymentSettings, paypalEmail: e.target.value } })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <input
                  type="checkbox"
                  id="bank"
                  checked={settings.paymentSettings.bankTransferEnabled}
                  onChange={(e) => setSettings({ ...settings, paymentSettings: { ...settings.paymentSettings, bankTransferEnabled: e.target.checked } })}
                  className="w-5 h-5 rounded"
                />
                <label htmlFor="bank" className="flex-1">
                  <div className="font-semibold text-white">Bonifico Bancario</div>
                  <div className="text-sm text-white/50">Pagamento tramite bonifico</div>
                </label>
              </div>

              {settings.paymentSettings.bankTransferEnabled && (
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Dettagli Bancari</label>
                  <textarea
                    value={settings.paymentSettings.bankDetails}
                    onChange={(e) => setSettings({ ...settings, paymentSettings: { ...settings.paymentSettings, bankDetails: e.target.value } })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none resize-none font-mono"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Shipping Settings */}
      {activeTab === 'shipping' && (
        <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Configurazione Spedizioni</h2>
          
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Soglia Spedizione Gratuita (€)</label>
            <input
              type="number"
              value={settings.shippingSettings.freeShippingThreshold}
              onChange={(e) => setSettings({ ...settings, shippingSettings: { ...settings.shippingSettings, freeShippingThreshold: parseFloat(e.target.value) } })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Costo Spedizione Standard (€)</label>
              <input
                type="number"
                value={settings.shippingSettings.standardShippingCost}
                onChange={(e) => setSettings({ ...settings, shippingSettings: { ...settings.shippingSettings, standardShippingCost: parseFloat(e.target.value) } })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Costo Spedizione Express (€)</label>
              <input
                type="number"
                value={settings.shippingSettings.expressShippingCost}
                onChange={(e) => setSettings({ ...settings, shippingSettings: { ...settings.shippingSettings, expressShippingCost: parseFloat(e.target.value) } })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Giorni Consegna Stimati</label>
            <input
              type="number"
              value={settings.shippingSettings.deliveryDays}
              onChange={(e) => setSettings({ ...settings, shippingSettings: { ...settings.shippingSettings, deliveryDays: parseInt(e.target.value) } })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
            />
          </div>
        </div>
      )}

      {/* Roles Settings */}
      {activeTab === 'roles' && (
        <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Gestione Ruoli e Permessi</h2>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-white">Admin</h3>
                <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20">
                  Accesso Completo
                </span>
              </div>
              <p className="text-sm text-white/50">Accesso completo a tutte le funzionalità del sistema</p>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-white">Professionista</h3>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
                  B2B
                </span>
              </div>
              <p className="text-sm text-white/50">Prezzi B2B, catalogo completo, supporto prioritario</p>
            </div>

            <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-white">Privato</h3>
                <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-medium border border-sky-500/20">
                  B2C
                </span>
              </div>
              <p className="text-sm text-white/50">Catalogo pubblico, prezzi standard, supporto base</p>
            </div>
          </div>
        </div>
      )}

      {/* API Keys */}
      {activeTab === 'api' && (
        <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4">API Keys</h2>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">Google Analytics</h3>
                <button className="px-3 py-1 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-lg text-xs font-medium transition-all">
                  Configura
                </button>
              </div>
              <p className="text-sm text-white/50 font-mono">UA-XXXXXXXXX-X</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">Facebook Pixel</h3>
                <button className="px-3 py-1 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-lg text-xs font-medium transition-all">
                  Configura
                </button>
              </div>
              <p className="text-sm text-white/50 font-mono">XXXXXXXXXXXXXXXX</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">SendGrid API</h3>
                <button className="px-3 py-1 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-lg text-xs font-medium transition-all">
                  Configura
                </button>
              </div>
              <p className="text-sm text-white/50 font-mono">SG.XXXXXXXXXXXXXXXX</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
