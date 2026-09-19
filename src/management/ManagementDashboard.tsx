import { useState } from 'react';
import { useAdminAuth } from './hooks/useAdminAuth';
import { useAdminData } from './hooks/useAdminData';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { StatsCard } from './components/StatsCard';
import { RecentActivity } from './components/RecentActivity';
import { QuickActions } from './components/QuickActions';
import { UsersManagement } from './sections/UsersManagement';
import { OrdersManagement } from './sections/OrdersManagement';
import { ProductsManagement } from './sections/ProductsManagement';
import { ContentManagement } from './sections/ContentManagement';
import { AnalyticsManagement } from './sections/AnalyticsManagement';
import { AdminSection } from '../types/admin';

export function ManagementDashboard() {
  const { admin, logout } = useAdminAuth();
  const { stats, recentActivity } = useAdminData();
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-black flex">
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 lg:ml-64">
        <AdminHeader admin={admin} onLogout={logout} />
        
        <main className="p-6 lg:p-8">
          {activeSection === 'dashboard' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-white/50">Panoramica generale della piattaforma AIRKLIM</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatsCard
                  title="Utenti Totali"
                  value={stats.totalUsers}
                  icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                  trend={{ value: 12, isPositive: true }}
                  color="sky"
                />
                <StatsCard
                  title="Ordini Totali"
                  value={stats.totalOrders}
                  icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
                  trend={{ value: 8, isPositive: true }}
                  color="green"
                />
                <StatsCard
                  title="Fatturato Totale"
                  value={`€${stats.totalRevenue.toLocaleString()}`}
                  icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  trend={{ value: 15, isPositive: true }}
                  color="amber"
                />
                <StatsCard
                  title="Ordini in Attesa"
                  value={stats.pendingOrders}
                  icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  color="red"
                />
                <StatsCard
                  title="Sessioni Attive"
                  value={stats.activeSessions}
                  icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                  color="sky"
                />
                <StatsCard
                  title="Prodotti Stock Basso"
                  value={stats.lowStockProducts}
                  icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
                  color="amber"
                />
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                <QuickActions />
                <RecentActivity activities={recentActivity} />
              </div>
            </div>
          )}

          {activeSection === 'users' && <UsersManagement />}
          {activeSection === 'orders' && <OrdersManagement />}
          {activeSection === 'products' && <ProductsManagement />}
          {activeSection === 'content' && <ContentManagement />}

          {activeSection === 'analytics' && <AnalyticsManagement />}

          {activeSection === 'audit' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Audit Log</h1>
              <p className="text-white/50">Log di tutte le attività</p>
              <div className="mt-8 p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-white/60">Sezione in sviluppo...</p>
              </div>
            </div>
          )}

          {activeSection === 'backup' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Backup</h1>
              <p className="text-white/50">Gestisci backup del database</p>
              <div className="mt-8 p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-white/60">Sezione in sviluppo...</p>
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Impostazioni</h1>
              <p className="text-white/50">Configura la piattaforma</p>
              <div className="mt-8 p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-white/60">Sezione in sviluppo...</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
