/**
 * TypeScript types for Admin Management System
 */

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  surname: string;
  role: 'admin' | 'superadmin';
  permissions: string[];
  lastLogin?: string;
  createdAt: string;
}

export interface AdminSession {
  user: AdminUser;
  token: string;
  expiresAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  activeSessions: number;
  pendingOrders: number;
  lowStockProducts: number;
}

export interface AdminActivity {
  id: string;
  type: 'user_registered' | 'order_created' | 'product_updated' | 'backup_completed' | 'login_success' | 'login_failed';
  description: string;
  timestamp: string;
  userId?: string;
  userEmail?: string;
}

export interface AdminAction {
  id: string;
  action: string;
  resource: string;
  resourceId?: string;
  timestamp: string;
  adminId: string;
  adminEmail: string;
  details?: any;
}

export interface UserManagementData {
  id: string;
  email: string;
  name: string;
  surname: string;
  role: 'privato' | 'professionista' | 'admin';
  phone?: string;
  company?: string;
  vatNumber?: string;
  verified: boolean;
  createdAt: string;
  lastLogin?: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'suspended' | 'pending';
}

export interface OrderManagementData {
  id: string;
  userId: string;
  userEmail: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: string;
  paymentMethod?: string;
  trackingNumber?: string;
}

export interface ProductManagementData {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  createdAt: string;
  updatedAt: string;
}

export type AdminSection = 
  | 'dashboard'
  | 'users'
  | 'orders'
  | 'products'
  | 'content'
  | 'analytics'
  | 'audit'
  | 'backup'
  | 'settings';
