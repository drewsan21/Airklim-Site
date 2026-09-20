import { useState, useEffect } from 'react';

interface AnalyticsData {
  sales: {
    daily: Array<{ date: string; revenue: number; orders: number }>;
    weekly: Array<{ week: string; revenue: number; orders: number }>;
    monthly: Array<{ month: string; revenue: number; orders: number }>;
  };
  users: {
    total: number;
    newThisMonth: number;
    active: number;
    byRole: { admin: number; professionista: number; privato: number };
  };
  products: {
    total: number;
    active: number;
    outOfStock: number;
    topSelling: Array<{ name: string; quantity: number; revenue: number }>;
  };
  conversions: {
    total: number;
    rate: number;
    bySource: Array<{ source: string; count: number; rate: number }>;
  };
}

export function AnalyticsManagement() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    setLoading(true);
    
    // Simula caricamento dati analytics
    setTimeout(() => {
      const orders = JSON.parse(localStorage.getItem('airklim-orders') || '[]');
      const users = JSON.parse(localStorage.getItem('airklim-users') || '[]');
      const products = JSON.parse(localStorage.getItem('airklim-products') || '[]');
      
      // Genera dati vendite
      const now = new Date();
      const daily = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        return {
          date: date.toISOString().split('T')[0],
          revenue: Math.random() * 5000 + 1000,
          orders: Math.floor(Math.random() * 10) + 1
        };
      }).reverse();

      const weekly = Array.from({ length: 12 }, (_, i) => {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - (i * 7));
        return {
          week: `Settimana ${12 - i}`,
          revenue: Math.random() * 30000 + 10000,
          orders: Math.floor(Math.random() * 50) + 20
        };
      }).reverse();

      const monthly = Array.from({ length: 12 }, (_, i) => {
        const month = new Date(now);
        month.setMonth(month.getMonth() - i);
        return {
          month: month.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' }),
          revenue: Math.random() * 150000 + 50000,
          orders: Math.floor(Math.random() * 200) + 100
        };
      }).reverse();

      // Calcola statistiche utenti
      const usersByRole = users.reduce((acc: any, user: any) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});

      // Calcola prodotti top selling
      const productSales: any = {};
      orders.forEach((order: any) => {
        order.items.forEach((item: any) => {
          if (!productSales[item.name]) {
            productSales[item.name] = { quantity: 0, revenue: 0 };
          }
          productSales[item.name].quantity += item.quantity;
          productSales[item.name].revenue += item.price * item.quantity;
        });
      });

      const topSelling = Object.entries(productSales)
        .map(([name, data]: [string, any]) => ({ name, ...data }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      setAnalytics({
        sales: { daily, weekly, monthly },
        users: {
          total: users.length,
          newThisMonth: Math.floor(users.length * 0.15),
          active: users.filter((u: any) => u.verified).length,
          byRole: usersByRole
        },
        products: {
          total: products.length,
          active: products.filter((p: any) => p.status === 'active').length,
          outOfStock: products.filter((p: any) => p.stock === 0).length,
          topSelling
        },
        conversions: {
          total: orders.length,
          rate: orders.length > 0 ? (orders.length / users.length) * 100 : 0,
          bySource: [
            { source: 'Organico', count: Math.floor(orders.length * 0.4), rate: 2.5 },
            { source: 'Social', count: Math.floor(orders.length * 0.3), rate: 1.8 },
            { source: 'Email', count: Math.floor(orders.length * 0.2), rate: 3.2 },
            { source: 'Diretto', count: Math.floor(orders.length * 0.1), rate: 5.1 }
          ]
        }
      });
      
      setLoading(false);
    }, 500);
  };

  const exportToCSV = (type: 'sales' | 'users' | 'products') => {
    if (!analytics) return;

    let csv = '';
    let filename = '';

    switch (type) {
      case 'sales':
        csv = 'Data,Fatturato (€),Ordini\n';
        analytics.sales[timeRange].forEach((item: any) => {
          const date = item.date || item.week || item.month;
          csv += `${date},${item.revenue.toFixed(2)},${item.orders}\n`;
        });
        filename = `analytics_vendite_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      case 'users':
        csv = 'Metrica,Valore\n';
        csv += `Utenti Totali,${analytics.users.total}\n`;
        csv += `Nuovi Questo Mese,${analytics.users.newThisMonth}\n`;
        csv += `Utenti Attivi,${analytics.users.active}\n`;
        csv += `Admin,${analytics.users.byRole.admin || 0}\n`;
        csv += `Professionisti,${analytics.users.byRole.professionista || 0}\n`;
        csv += `Privati,${analytics.users.byRole.privato || 0}\n`;
        filename = `analytics_utenti_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      case 'products':
        csv = 'Prodotto,Quantità Venduta,Fatturato (€)\n';
        analytics.products.topSelling.forEach((item) => {
          csv += `${item.name},${item.quantity},${item.revenue.toFixed(2)}\n`;
        });
        filename = `analytics_prodotti_${new Date().toISOString().split('T')[0]}.csv`;
        break;
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Caricamento analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">Errore nel caricamento dei dati analytics</p>
      </div>
    );
  }

  const salesData = analytics.sales[timeRange];
  const maxRevenue = Math.max(...salesData.map((d: any) => d.revenue));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Avanzati</h1>
          <p className="text-white/50">Analisi dettagliate e report sulla performance della piattaforma</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => exportToCSV('sales')}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all border border-white/10"
          >
            📥 Esporta Vendite
          </button>
          <button
            onClick={() => exportToCSV('users')}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all border border-white/10"
          >
            📥 Esporta Utenti
          </button>
          <button
            onClick={() => exportToCSV('products')}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all border border-white/10"
          >
            📥 Esporta Prodotti
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-500/10 to-blue-600/10 border border-sky-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-sky-400">
              €{salesData.reduce((sum: number, d: any) => sum + d.revenue, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="text-sm text-white/60">Fatturato Totale</div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-green-400">
              {salesData.reduce((sum: number, d: any) => sum + d.orders, 0)}
            </span>
          </div>
          <div className="text-sm text-white/60">Ordini Totali</div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-amber-400">{analytics.users.total}</span>
          </div>
          <div className="text-sm text-white/60">Utenti Totali</div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-purple-400">{analytics.conversions.rate.toFixed(1)}%</span>
          </div>
          <div className="text-sm text-white/60">Tasso Conversione</div>
        </div>
      </div>

      {/* Grafico Vendite */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Andamento Vendite</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange('daily')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === 'daily'
                  ? 'bg-sky-500 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Giornaliero
            </button>
            <button
              onClick={() => setTimeRange('weekly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === 'weekly'
                  ? 'bg-sky-500 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Settimanale
            </button>
            <button
              onClick={() => setTimeRange('monthly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === 'monthly'
                  ? 'bg-sky-500 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Mensile
            </button>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="h-64 flex items-end gap-2">
          {salesData.map((item: any, i: number) => {
            const height = (item.revenue / maxRevenue) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-sky-500 to-sky-400 rounded-t-lg hover:from-sky-400 hover:to-sky-300 transition-all cursor-pointer relative group"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="font-semibold">{item.date || item.week || item.month}</div>
                    <div>€{item.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                    <div>{item.orders} ordini</div>
                  </div>
                </div>
                <div className="text-xs text-white/40 text-center">
                  {timeRange === 'daily' && item.date?.split('-')[2]}
                  {timeRange === 'weekly' && `S${i + 1}`}
                  {timeRange === 'monthly' && item.month?.split(' ')[0]?.substring(0, 3)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utenti per Ruolo */}
        <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Utenti per Ruolo</h2>
          <div className="space-y-4">
            {Object.entries(analytics.users.byRole).map(([role, count]) => {
              const percentage = (count as number / analytics.users.total) * 100;
              return (
                <div key={role}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/70 capitalize">{role}</span>
                    <span className="text-sm font-semibold text-white">{count as number}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        role === 'admin' ? 'bg-red-500' :
                        role === 'professionista' ? 'bg-amber-500' :
                        'bg-sky-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-white/40 mt-1">{percentage.toFixed(1)}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prodotti Top Selling */}
        <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Prodotti Più Venduti</h2>
          <div className="space-y-4">
            {analytics.products.topSelling.map((product, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-sm">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">{product.name}</div>
                  <div className="text-xs text-white/50">{product.quantity} venduti</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-green-400">€{product.revenue.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversioni per Sorgente */}
        <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Conversioni per Sorgente</h2>
          <div className="space-y-4">
            {analytics.conversions.bySource.map((source, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/70">{source.source}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-white">{source.count} ordini</span>
                    <span className="text-xs text-green-400">{source.rate}% rate</span>
                  </div>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    style={{ width: `${(source.count / analytics.conversions.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistiche Prodotti */}
        <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Statistiche Prodotti</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-white">{analytics.products.total}</div>
              <div className="text-sm text-white/50">Prodotti Totali</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-green-400">{analytics.products.active}</div>
              <div className="text-sm text-white/50">Prodotti Attivi</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-red-400">{analytics.products.outOfStock}</div>
              <div className="text-sm text-white/50">Esauriti</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-amber-400">
                {analytics.products.total - analytics.products.active - analytics.products.outOfStock}
              </div>
              <div className="text-sm text-white/50">Inattivi</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
