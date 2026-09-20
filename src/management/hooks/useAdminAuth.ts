import { useState, useEffect } from 'react';
import { AdminUser, AdminSession } from '../../types/admin';

export function useAdminAuth() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('airklim-admin-session');
    if (session) {
      try {
        const parsed: AdminSession = JSON.parse(session);
        if (new Date(parsed.expiresAt) > new Date()) {
          setAdmin(parsed.user);
        } else {
          localStorage.removeItem('airklim-admin-session');
        }
      } catch {
        localStorage.removeItem('airklim-admin-session');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): { success: boolean; message: string } => {
    const users = JSON.parse(localStorage.getItem('airklim-users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      return { success: false, message: 'Credenziali non valide' };
    }
    
    if (user.role !== 'admin') {
      return { success: false, message: 'Accesso negato. Solo amministratori.' };
    }
    
    const session: AdminSession = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        role: user.role,
        permissions: user.permissions || ['all'],
        createdAt: user.createdAt
      },
      token: `admin_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 ore
    };
    
    localStorage.setItem('airklim-admin-session', JSON.stringify(session));
    setAdmin(session.user);
    
    return { success: true, message: 'Login effettuato con successo' };
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('airklim-admin-session');
  };

  const hasPermission = (permission: string): boolean => {
    if (!admin) return false;
    return admin.permissions.includes('all') || admin.permissions.includes(permission);
  };

  return { admin, isLoading, login, logout, hasPermission };
}
