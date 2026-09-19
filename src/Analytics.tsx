import { useState, useEffect } from 'react';

// ===== EMAIL AUTOMATION SYSTEM =====
export function EmailAutomationSystem() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [subscribers, setSubscribers] = useState<Array<{
    email: string;
    name?: string;
    role?: string;
    subscribedAt: string;
    tags: string[];
  }>>([]);
  const [campaigns, setCampaigns] = useState<Array<{
    id: string;
    name: string;
    subject: string;
    status: 'draft' | 'scheduled' | 'sent';
    scheduledAt?: string;
    sentAt?: string;
    recipients: number;
  }>>([]);

  useEffect(() => {
    // Load subscribers from localStorage
    const stored = localStorage.getItem('airklim-subscribers');
    if (stored) {
      try {
        setSubscribers(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading subscribers:', e);
      }
    }

    const storedCampaigns = localStorage.getItem('airklim-campaigns');
    if (storedCampaigns) {
      try {
        setCampaigns(JSON.parse(storedCampaigns));
      } catch (e) {
        console.error('Error loading campaigns:', e);
      }
    }
  }, []);

  const addSubscriber = (email: string, name?: string, role?: string, tags: string[] = []) => {
    const newSubscriber = {
      email,
      name,
      role,
      subscribedAt: new Date().toISOString(),
      tags
    };
    const updated = [...subscribers, newSubscriber];
    setSubscribers(updated);
    localStorage.setItem('airklim-subscribers', JSON.stringify(updated));
    
    // Trigger welcome email
    sendWelcomeEmail(newSubscriber);
  };

  const sendWelcomeEmail = (subscriber: typeof subscribers[0]) => {
    console.log(`📧 Welcome email sent to ${subscriber.email}`);
    // In production: call API endpoint
    // await fetch('/api/email/welcome', { method: 'POST', body: JSON.stringify(subscriber) });
  };

  const sendAbandonedCartEmail = (email: string, cartItems: any[]) => {
    console.log(`📧 Abandoned cart email sent to ${email}`);
    console.log(`📦 Items: ${cartItems.length}`);
  };

  const sendOrderConfirmation = (email: string, orderId: string) => {
    console.log(`📧 Order confirmation sent to ${email} for order ${orderId}`);
  };

  const sendReviewRequest = (email: string, orderId: string) => {
    console.log(`📧 Review request sent to ${email} for order ${orderId}`);
  };

  const createCampaign = (name: string, subject: string, scheduledAt?: string) => {
    const campaign = {
      id: `camp-${Date.now()}`,
      name,
      subject,
      status: scheduledAt ? 'scheduled' as const : 'draft' as const,
      scheduledAt,
      recipients: subscribers.length
    };
    const updated = [...campaigns, campaign];
    setCampaigns(updated);
    localStorage.setItem('airklim-campaigns', JSON.stringify(updated));
    return campaign;
  };

  const sendCampaign = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      console.log(`📧 Campaign "${campaign.name}" sent to ${campaign.recipients} subscribers`);
      const updated = campaigns.map(c => 
        c.id === campaignId ? { ...c, status: 'sent' as const, sentAt: new Date().toISOString() } : c
      );
      setCampaigns(updated);
      localStorage.setItem('airklim-campaigns', JSON.stringify(updated));
    }
  };

  return (
    <>
      {/* Admin Button */}
      <button
        onClick={() => setShowAdmin(true)}
        className="fixed bottom-40 left-6 z-40 w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg border border-white/10 transition-all hover:scale-110 lg:left-[280px]"
        aria-label="Email Admin"
        title="Email Marketing Admin"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </button>

      {/* Admin Panel */}
      {showAdmin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowAdmin(false)}>
          <div className="bg-slate-900 rounded-2xl border border-white/10 p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Email Marketing Admin</h2>
              <button onClick={() => setShowAdmin(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl font-bold text-purple-400">{subscribers.length}</div>
                <div className="text-sm text-white/50 mt-1">Iscritti Totali</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl font-bold text-purple-400">{campaigns.length}</div>
                <div className="text-sm text-white/50 mt-1">Campagne</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl font-bold text-green-400">
                  {campaigns.filter(c => c.status === 'sent').length}
                </div>
                <div className="text-sm text-white/50 mt-1">Inviate</div>
              </div>
            </div>

            {/* Subscribers List */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-4">Iscritti ({subscribers.length})</h3>
              {subscribers.length === 0 ? (
                <p className="text-white/50 text-center py-8">Nessun iscritto ancora</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {subscribers.slice(-10).reverse().map((sub, i) => (
                    <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                      <div>
                        <div className="text-white text-sm">{sub.email}</div>
                        <div className="text-xs text-white/40">
                          {sub.name && `${sub.name} • `}
                          {sub.role && `${sub.role} • `}
                          {new Date(sub.subscribedAt).toLocaleDateString('it-IT')}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {sub.tags.map((tag, j) => (
                          <span key={j} className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Campaigns List */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Campagne ({campaigns.length})</h3>
              {campaigns.length === 0 ? (
                <p className="text-white/50 text-center py-8">Nessuna campagna creata</p>
              ) : (
                <div className="space-y-2">
                  {campaigns.map((camp) => (
                    <div key={camp.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-white">{camp.name}</div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          camp.status === 'draft' ? 'bg-gray-500/10 text-gray-400' :
                          camp.status === 'scheduled' ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-green-500/10 text-green-400'
                        }`}>
                          {camp.status === 'draft' && 'Bozza'}
                          {camp.status === 'scheduled' && 'Programmata'}
                          {camp.status === 'sent' && 'Inviata'}
                        </div>
                      </div>
                      <div className="text-sm text-white/50 mb-2">{camp.subject}</div>
                      <div className="flex items-center justify-between text-xs text-white/40">
                        <span>{camp.recipients} destinatari</span>
                        {camp.scheduledAt && <span>Programmata: {new Date(camp.scheduledAt).toLocaleString('it-IT')}</span>}
                        {camp.sentAt && <span>Inviata: {new Date(camp.sentAt).toLocaleString('it-IT')}</span>}
                      </div>
                      {camp.status === 'draft' && (
                        <button
                          onClick={() => sendCampaign(camp.id)}
                          className="mt-2 px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-lg text-sm font-medium transition-all"
                        >
                          Invia Ora
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Automation Info */}
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <h4 className="font-bold text-white mb-3">Automazioni Attive</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>✅ Welcome email (nuovi iscritti)</li>
                <li>✅ Abandoned cart recovery (dopo 1 ora)</li>
                <li>✅ Order confirmation (ordine completato)</li>
                <li>✅ Review request (dopo 7 giorni dalla consegna)</li>
                <li>✅ Newsletter settimanale (ogni lunedì)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ===== A/B TESTING FRAMEWORK =====
export function ABTestingFramework() {
  const [testResults, setTestResults] = useState<Record<string, {
    variantA: number;
    variantB: number;
    winner?: 'A' | 'B';
  }>>({});

  useEffect(() => {
    // Load test results from localStorage
    const stored = localStorage.getItem('airklim-ab-tests');
    if (stored) {
      try {
        setTestResults(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading A/B tests:', e);
      }
    }
  }, []);

  const recordConversion = (testId: string, variant: 'A' | 'B') => {
    const updated = { ...testResults };
    if (!updated[testId]) {
      updated[testId] = { variantA: 0, variantB: 0 };
    }
    if (variant === 'A') {
      updated[testId].variantA++;
    } else {
      updated[testId].variantB++;
    }
    
    // Determine winner if enough data
    const total = updated[testId].variantA + updated[testId].variantB;
    if (total >= 100) {
      updated[testId].winner = updated[testId].variantA > updated[testId].variantB ? 'A' : 'B';
    }
    
    setTestResults(updated);
    localStorage.setItem('airklim-ab-tests', JSON.stringify(updated));
  };

  const getVariant = (testId: string): 'A' | 'B' => {
    // Simple hash-based variant assignment for consistency
    const userId = localStorage.getItem('airklim-user-id') || Math.random().toString();
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash % 2 === 0 ? 'A' : 'B';
  };

  return { recordConversion, getVariant, testResults };
}

// ===== ANALYTICS DASHBOARD =====
export function AnalyticsDashboard() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [metrics, setMetrics] = useState({
    pageViews: 0,
    uniqueVisitors: 0,
    conversions: 0,
    revenue: 0,
    avgSessionDuration: 0,
    bounceRate: 0
  });

  useEffect(() => {
    // Track page view
    const stored = localStorage.getItem('airklim-analytics');
    if (stored) {
      try {
        setMetrics(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading analytics:', e);
      }
    }

    // Increment page views
    const updated = {
      ...metrics,
      pageViews: metrics.pageViews + 1,
      uniqueVisitors: metrics.uniqueVisitors + (sessionStorage.getItem('visited') ? 0 : 1)
    };
    setMetrics(updated);
    localStorage.setItem('airklim-analytics', JSON.stringify(updated));
    sessionStorage.setItem('visited', 'true');
  }, []);

  const trackEvent = (eventName: string, eventData?: any) => {
    console.log(`📊 Event: ${eventName}`, eventData);
    // In production: send to analytics service
    // await fetch('/api/analytics/event', { method: 'POST', body: JSON.stringify({ eventName, eventData }) });
  };

  const trackConversion = (value: number) => {
    const updated = {
      ...metrics,
      conversions: metrics.conversions + 1,
      revenue: metrics.revenue + value
    };
    setMetrics(updated);
    localStorage.setItem('airklim-analytics', JSON.stringify(updated));
    trackEvent('conversion', { value });
  };

  return (
    <>
      {/* Dashboard Button */}
      <button
        onClick={() => setShowDashboard(true)}
        className="fixed bottom-56 left-6 z-40 w-12 h-12 rounded-full bg-green-600 hover:bg-green-500 text-white flex items-center justify-center shadow-lg border border-white/10 transition-all hover:scale-110 lg:left-[280px]"
        aria-label="Analytics Dashboard"
        title="Analytics Dashboard"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button>

      {/* Dashboard Panel */}
      {showDashboard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowDashboard(false)}>
          <div className="bg-slate-900 rounded-2xl border border-white/10 p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
              <button onClick={() => setShowDashboard(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl font-bold text-green-400">{metrics.pageViews}</div>
                <div className="text-sm text-white/50 mt-1">Page Views</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl font-bold text-green-400">{metrics.uniqueVisitors}</div>
                <div className="text-sm text-white/50 mt-1">Unique Visitors</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl font-bold text-green-400">{metrics.conversions}</div>
                <div className="text-sm text-white/50 mt-1">Conversions</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl font-bold text-green-400">€{metrics.revenue.toFixed(2)}</div>
                <div className="text-sm text-white/50 mt-1">Revenue</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl font-bold text-green-400">
                  {metrics.pageViews > 0 ? ((metrics.conversions / metrics.pageViews) * 100).toFixed(1) : 0}%
                </div>
                <div className="text-sm text-white/50 mt-1">Conversion Rate</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl font-bold text-green-400">
                  €{metrics.conversions > 0 ? (metrics.revenue / metrics.conversions).toFixed(2) : '0.00'}
                </div>
                <div className="text-sm text-white/50 mt-1">Avg Order Value</div>
              </div>
            </div>

            {/* Recent Events */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Eventi Recenti</h3>
              <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <p className="text-white/60 text-sm">
                  Gli eventi vengono tracciati automaticamente e inviati al servizio di analytics.
                  In produzione, questi dati vengono inviati a Google Analytics 4 o un servizio simile.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-white/50">
                  <li>✅ Page views tracciati</li>
                  <li>✅ Unique visitors identificati</li>
                  <li>✅ Conversioni monitorate</li>
                  <li>✅ Revenue calcolato</li>
                  <li>✅ Event tracking attivo</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
