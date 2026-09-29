/**
 * AIRKLIM Third-Party Integrations
 * ERP, Accounting, Shipping, Analytics
 */

import { useState, useEffect } from 'react';

// ===== ERP INTEGRATION (SAP, Oracle, Microsoft Dynamics) =====
export function ERPIntegration() {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSync, setLastSync] = useState<string | null>(null);

  const syncWithERP = async () => {
    setSyncStatus('syncing');
    
    try {
      // Simulate ERP sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production: call ERP API
      // await fetch('https://api.erp.com/sync', {
      //   method: 'POST',
      //   headers: { 'Authorization': 'Bearer ' + process.env.ERP_API_KEY },
      //   body: JSON.stringify({ products, orders, customers })
      // });
      
      setSyncStatus('success');
      setLastSync(new Date().toISOString());
      
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      setSyncStatus('error');
      console.error('ERP sync failed:', error);
    }
  };

  return (
    <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">ERP Integration</h3>
          <p className="text-sm text-white/50">Sync with SAP, Oracle, Microsoft Dynamics</p>
        </div>
        <div className={`w-3 h-3 rounded-full ${
          syncStatus === 'success' ? 'bg-green-500' :
          syncStatus === 'error' ? 'bg-red-500' :
          syncStatus === 'syncing' ? 'bg-yellow-500 animate-pulse' :
          'bg-white/20'
        }`}></div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-2xl font-bold text-white">1,234</div>
            <div className="text-xs text-white/50">Products Synced</div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-2xl font-bold text-white">567</div>
            <div className="text-xs text-white/50">Orders Synced</div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-2xl font-bold text-white">89</div>
            <div className="text-xs text-white/50">Customers Synced</div>
          </div>
        </div>

        {lastSync && (
          <div className="text-xs text-white/40">
            Last sync: {new Date(lastSync).toLocaleString('it-IT')}
          </div>
        )}

        <button
          onClick={syncWithERP}
          disabled={syncStatus === 'syncing'}
          className="w-full px-6 py-3 bg-sky-500 hover:bg-sky-400 disabled:bg-white/10 disabled:text-white/30 text-white rounded-xl font-semibold transition-all"
        >
          {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>
    </div>
  );
}

// ===== ACCOUNTING SOFTWARE INTEGRATION =====
export function AccountingIntegration() {
  const [integrations, setIntegrations] = useState([
    { id: 'quickbooks', name: 'QuickBooks', connected: false, icon: '🟢' },
    { id: 'xero', name: 'Xero', connected: false, icon: '🔵' },
    { id: 'sage', name: 'Sage', connected: false, icon: '🟣' },
    { id: 'freshbooks', name: 'FreshBooks', connected: false, icon: '🟠' }
  ]);

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(int => 
      int.id === id ? { ...int, connected: !int.connected } : int
    ));
  };

  return (
    <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6">
      <h3 className="text-xl font-bold text-white mb-6">Accounting Software</h3>

      <div className="space-y-3">
        {integrations.map(integration => (
          <div
            key={integration.id}
            className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">{integration.icon}</div>
              <div>
                <div className="font-semibold text-white">{integration.name}</div>
                <div className="text-xs text-white/50">
                  {integration.connected ? 'Connected' : 'Not connected'}
                </div>
              </div>
            </div>
            <button
              onClick={() => toggleIntegration(integration.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                integration.connected
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:border-white/20'
              }`}
            >
              {integration.connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== SHIPPING PROVIDERS INTEGRATION =====
export function ShippingIntegration() {
  const [selectedCarrier, setSelectedCarrier] = useState<string>('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const carriers = [
    { id: 'dhl', name: 'DHL', icon: '🟡', trackingUrl: 'https://www.dhl.com/it-it/home/tracking.html' },
    { id: 'ups', name: 'UPS', icon: '🟤', trackingUrl: 'https://www.ups.com/track' },
    { id: 'fedex', name: 'FedEx', icon: '🟣', trackingUrl: 'https://www.fedex.com/apps/fedextrack/' },
    { id: 'gls', name: 'GLS', icon: '🔴', trackingUrl: 'https://gls-italy.com/' },
    { id: 'sda', name: 'SDA', icon: '🟠', trackingUrl: 'https://www.sda.it/' },
    { id: 'bartolini', name: 'BRT', icon: '🔵', trackingUrl: 'https://www.brt.it/' }
  ];

  const generateLabel = async () => {
    if (!selectedCarrier || !trackingNumber) {
      alert('Please select a carrier and enter tracking number');
      return;
    }

    // In production: call carrier API to generate label
    console.log(`Generating shipping label for ${selectedCarrier}: ${trackingNumber}`);
    
    const carrier = carriers.find(c => c.id === selectedCarrier);
    if (carrier) {
      window.open(carrier.trackingUrl, '_blank');
    }
  };

  return (
    <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6">
      <h3 className="text-xl font-bold text-white mb-6">Shipping Providers</h3>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {carriers.map(carrier => (
          <button
            key={carrier.id}
            onClick={() => setSelectedCarrier(carrier.id)}
            className={`p-4 rounded-xl border transition-all ${
              selectedCarrier === carrier.id
                ? 'bg-sky-500/10 border-sky-500/50'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="text-3xl mb-2">{carrier.icon}</div>
            <div className="text-sm font-medium text-white">{carrier.name}</div>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">Tracking Number</label>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter tracking number"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
          />
        </div>

        <button
          onClick={generateLabel}
          className="w-full px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all"
        >
          Generate Shipping Label
        </button>
      </div>
    </div>
  );
}

// ===== ADVANCED ANALYTICS INTEGRATION =====
export function AdvancedAnalytics() {
  const [metrics, setMetrics] = useState({
    pageViews: 0,
    uniqueVisitors: 0,
    conversionRate: 0,
    averageOrderValue: 0,
    bounceRate: 0,
    sessionDuration: 0
  });

  useEffect(() => {
    // Load metrics from localStorage or API
    const stored = localStorage.getItem('airklim-analytics');
    if (stored) {
      setMetrics(JSON.parse(stored));
    } else {
      // Simulate metrics
      setMetrics({
        pageViews: 12450,
        uniqueVisitors: 3420,
        conversionRate: 3.2,
        averageOrderValue: 890,
        bounceRate: 42,
        sessionDuration: 245
      });
    }
  }, []);

  const exportReport = (format: 'pdf' | 'csv' | 'excel') => {
    console.log(`Exporting analytics report as ${format}`);
    // In production: call API to generate report
  };

  return (
    <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Advanced Analytics</h3>
        <div className="flex gap-2">
          <button
            onClick={() => exportReport('pdf')}
            className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-medium transition-all border border-white/10"
          >
            📄 PDF
          </button>
          <button
            onClick={() => exportReport('csv')}
            className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-medium transition-all border border-white/10"
          >
            📊 CSV
          </button>
          <button
            onClick={() => exportReport('excel')}
            className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-medium transition-all border border-white/10"
          >
            📈 Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-white">{metrics.pageViews.toLocaleString()}</div>
          <div className="text-xs text-white/50">Page Views</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-white">{metrics.uniqueVisitors.toLocaleString()}</div>
          <div className="text-xs text-white/50">Unique Visitors</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-green-400">{metrics.conversionRate}%</div>
          <div className="text-xs text-white/50">Conversion Rate</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-white">€{metrics.averageOrderValue}</div>
          <div className="text-xs text-white/50">Avg Order Value</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-amber-400">{metrics.bounceRate}%</div>
          <div className="text-xs text-white/50">Bounce Rate</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-white">{Math.floor(metrics.sessionDuration / 60)}m {metrics.sessionDuration % 60}s</div>
          <div className="text-xs text-white/50">Avg Session</div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-br from-sky-500/10 to-blue-600/10 border border-sky-500/20">
        <h4 className="font-bold text-white mb-2">Integration Status</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-white/60">Google Analytics 4</span>
            <span className="text-green-400">✓ Connected</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/60">Hotjar</span>
            <span className="text-green-400">✓ Connected</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/60">Facebook Pixel</span>
            <span className="text-green-400">✓ Connected</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/60">Google Tag Manager</span>
            <span className="text-green-400">✓ Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== INVENTORY MANAGEMENT =====
export function InventoryManagement() {
  const [inventory, setInventory] = useState([
    { id: '1', name: 'Panasonic Etherea Z35', stock: 35, reorderLevel: 10, status: 'in_stock' },
    { id: '2', name: 'TCL BreezeIN 12000', stock: 70, reorderLevel: 20, status: 'in_stock' },
    { id: '3', name: 'Panasonic Aquarea 9kW', stock: 8, reorderLevel: 5, status: 'low_stock' },
    { id: '4', name: 'Panasonic TZ35', stock: 0, reorderLevel: 10, status: 'out_of_stock' }
  ]);

  const updateStock = (id: string, newStock: number) => {
    setInventory(prev => prev.map(item => 
      item.id === id 
        ? { 
            ...item, 
            stock: newStock,
            status: newStock === 0 ? 'out_of_stock' : newStock < item.reorderLevel ? 'low_stock' : 'in_stock'
          }
        : item
    ));
  };

  return (
    <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6">
      <h3 className="text-xl font-bold text-white mb-6">Inventory Management</h3>

      <div className="space-y-3">
        {inventory.map(item => (
          <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-semibold text-white">{item.name}</div>
                <div className="text-xs text-white/50">Reorder level: {item.reorderLevel}</div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                item.status === 'in_stock' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                item.status === 'low_stock' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {item.status === 'in_stock' ? 'In Stock' :
                 item.status === 'low_stock' ? 'Low Stock' :
                 'Out of Stock'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={item.stock}
                onChange={(e) => updateStock(item.id, parseInt(e.target.value) || 0)}
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
              />
              <button
                onClick={() => updateStock(item.id, item.stock + 10)}
                className="px-4 py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-lg text-sm font-medium transition-all"
              >
                +10
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== CUSTOMER SUPPORT INTEGRATION =====
export function CustomerSupportIntegration() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');

  const platforms = [
    { id: 'intercom', name: 'Intercom', icon: '💬', description: 'Live chat & messaging' },
    { id: 'zendesk', name: 'Zendesk', icon: '🎫', description: 'Ticket management' },
    { id: 'freshdesk', name: 'Freshdesk', icon: '🎧', description: 'Customer support' },
    { id: 'crisp', name: 'Crisp', icon: '⚡', description: 'Live chat & helpdesk' }
  ];

  return (
    <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6">
      <h3 className="text-xl font-bold text-white mb-6">Customer Support</h3>

      <div className="grid grid-cols-2 gap-3">
        {platforms.map(platform => (
          <button
            key={platform.id}
            onClick={() => setSelectedPlatform(platform.id)}
            className={`p-4 rounded-xl border transition-all text-left ${
              selectedPlatform === platform.id
                ? 'bg-sky-500/10 border-sky-500/50'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="text-3xl mb-2">{platform.icon}</div>
            <div className="font-semibold text-white text-sm">{platform.name}</div>
            <div className="text-xs text-white/50 mt-1">{platform.description}</div>
          </button>
        ))}
      </div>

      {selectedPlatform && (
        <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-400 font-medium">Connected to {platforms.find(p => p.id === selectedPlatform)?.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default {
  ERPIntegration,
  AccountingIntegration,
  ShippingIntegration,
  AdvancedAnalytics,
  InventoryManagement,
  CustomerSupportIntegration
};
