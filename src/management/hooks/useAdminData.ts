import { useState, useEffect } from 'react';
import { AdminStats, AdminActivity } from '../../types/admin';

export function useAdminData() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeSessions: 0,
    pendingOrders: 0,
    lowStockProducts: 0
  });
  
  const [recentActivity, setRecentActivity] = useState<AdminActivity[]>([]);

  useEffect(() => {
    // Carica statistiche da localStorage
    const users = JSON.parse(localStorage.getItem('airklim-users') || '[]');
    const orders = JSON.parse(localStorage.getItem('airklim-orders') || '[]');
    
    const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total, 0);
    const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
    
    setStats({
      totalUsers: users.length,
      totalOrders: orders.length,
      totalRevenue,
      activeSessions: 1, // Placeholder
      pendingOrders,
      lowStockProducts: 0 // Placeholder
    });
    
    // Genera attività recente
    const activities: AdminActivity[] = [
      {
        id: '1',
        type: 'user_registered',
        description: 'Nuovo utente registrato: Mario Rossi',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        userId: 'user-001',
        userEmail: 'user@example.com'
      },
      {
        id: '2',
        type: 'order_created',
        description: 'Nuovo ordine creato: ORD-2026-001234',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString()
      },
      {
        id: '3',
        type: 'backup_completed',
        description: 'Backup automatico completato con successo',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
      },
      {
        id: '4',
        type: 'login_success',
        description: 'Login amministratore effettuato',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        userEmail: 'admin@example.com'
      }
    ];
    
    setRecentActivity(activities);
  }, []);

  return { stats, recentActivity };
}
