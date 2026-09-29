/**
 * AIRKLIM Backend API Layer
 * Simulazione completa di un backend REST API
 * In produzione: sostituire con chiamate HTTP reali a Node.js/Express
 */

import { securityMiddleware } from '../security/SecurityMiddleware';
import SecurityConfig, { SecurityUtils } from '../security/SecurityConfig';

// ===== DATABASE LAYER (Simulazione PostgreSQL) =====
class Database {
  private tables: Map<string, any[]> = new Map();

  constructor() {
    this.initializeTables();
  }

  private initializeTables() {
    const tables = ['users', 'orders', 'products', 'contents', 'audit_logs', 'backups', 'sessions'];
    tables.forEach(table => {
      const stored = localStorage.getItem(`airklim_db_${table}`);
      this.tables.set(table, stored ? JSON.parse(stored) : []);
    });
  }

  // CRUD Operations
  findAll(table: string): any[] {
    return this.tables.get(table) || [];
  }

  findById(table: string, id: string): any | undefined {
    return this.findAll(table).find(item => item.id === id);
  }

  findByField(table: string, field: string, value: any): any[] {
    return this.findAll(table).filter(item => item[field] === value);
  }

  insert(table: string, data: any): any {
    const items = this.findAll(table);
    const newItem = { ...data, id: data.id || `${table}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    items.push(newItem);
    this.tables.set(table, items);
    this.persist(table);
    return newItem;
  }

  update(table: string, id: string, data: any): any {
    const items = this.findAll(table);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) throw new Error(`Record not found: ${id}`);
    items[index] = { ...items[index], ...data, updated_at: new Date().toISOString() };
    this.tables.set(table, items);
    this.persist(table);
    return items[index];
  }

  delete(table: string, id: string): boolean {
    const items = this.findAll(table);
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === items.length) return false;
    this.tables.set(table, filtered);
    this.persist(table);
    return true;
  }

  count(table: string): number {
    return this.findAll(table).length;
  }

  aggregate(table: string, field: string, operation: 'sum' | 'avg' | 'min' | 'max'): number {
    const items = this.findAll(table);
    const values = items.map(item => item[field]).filter(v => typeof v === 'number');
    if (values.length === 0) return 0;
    switch (operation) {
      case 'sum': return values.reduce((a, b) => a + b, 0);
      case 'avg': return values.reduce((a, b) => a + b, 0) / values.length;
      case 'min': return Math.min(...values);
      case 'max': return Math.max(...values);
    }
  }

  private persist(table: string) {
    localStorage.setItem(`airklim_db_${table}`, JSON.stringify(this.tables.get(table)));
  }

  // Transaction support
  async transaction(callback: (db: Database) => Promise<void>): Promise<void> {
    const backup = new Map<string, any[]>();
    this.tables.forEach((items, table) => {
      backup.set(table, [...items]);
    });
    try {
      await callback(this);
    } catch (error) {
      // Rollback
      backup.forEach((items, table) => {
        this.tables.set(table, items);
        this.persist(table);
      });
      throw error;
    }
  }
}

export const db = new Database();

// ===== JWT AUTHENTICATION =====
class JWTAuth {
  private secret = 'airklim_jwt_secret_2026_' + Math.random().toString(36);
  private tokenExpiry = 24 * 60 * 60 * 1000; // 24 hours

  generateToken(payload: any): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = btoa(JSON.stringify({
      ...payload,
      iat: Date.now(),
      exp: Date.now() + this.tokenExpiry
    }));
    const signature = btoa(this.secret + header + body);
    return `${header}.${body}.${signature}`;
  }

  verifyToken(token: string): any | null {
    try {
      const [header, body, signature] = token.split('.');
      const expectedSignature = btoa(this.secret + header + body);
      if (signature !== expectedSignature) return null;
      
      const payload = JSON.parse(atob(body));
      if (payload.exp < Date.now()) return null;
      
      return payload;
    } catch {
      return null;
    }
  }

  hashPassword(password: string): string {
    // Simulated bcrypt - in production use real bcrypt
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `hashed_${Math.abs(hash).toString(36)}_${password.length}`;
  }

  verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }
}

export const jwt = new JWTAuth();

// ===== API RESPONSE TYPES =====
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    timestamp: string;
  };
}

// ===== API ENDPOINTS =====
export class API {
  // ===== AUTH ENDPOINTS =====
  static async login(email: string, password: string): Promise<ApiResponse> {
    // Rate limiting check
    const rateCheck = securityMiddleware.checkRateLimit('/api/auth/login', 'auth');
    if (!rateCheck.allowed) {
      return { success: false, error: 'Troppi tentativi di login. Riprova più tardi.' };
    }

    // Input validation
    const emailValidation = securityMiddleware.validateInput('email', email);
    if (!emailValidation.valid) {
      return { success: false, error: emailValidation.message };
    }

    // Find user
    const users = db.findAll('users');
    const user = users.find((u: any) => u.email === email);
    
    if (!user) {
      securityMiddleware.logSecurityEvent({
        type: 'login_failed',
        severity: 'medium',
        message: `Tentativo login fallito - utente non trovato: ${email}`
      });
      return { success: false, error: 'Credenziali non valide' };
    }

    if (!jwt.verifyPassword(password, user.password)) {
      securityMiddleware.logSecurityEvent({
        type: 'login_failed',
        severity: 'medium',
        message: `Tentativo login fallito - password errata: ${email}`
      });
      return { success: false, error: 'Credenziali non valide' };
    }

    if (user.status === 'suspended') {
      return { success: false, error: 'Account sospeso. Contatta il supporto.' };
    }

    // Generate token
    const token = jwt.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    });

    // Create session
    db.insert('sessions', {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      ipAddress: '0.0.0.0',
      userAgent: navigator.userAgent
    });

    // Audit log
    securityMiddleware.logAuditEvent({
      event: 'login_success',
      userId: user.id,
      action: 'login',
      resource: 'authentication'
    });

    const { password: _, ...userData } = user;
    return {
      success: true,
      data: { user: userData, token },
      meta: { timestamp: new Date().toISOString() }
    };
  }

  static async register(userData: any): Promise<ApiResponse> {
    // Input validation
    const emailValidation = securityMiddleware.validateInput('email', userData.email);
    if (!emailValidation.valid) {
      return { success: false, error: emailValidation.message };
    }

    const passwordValidation = SecurityUtils.validatePassword(userData.password);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.message };
    }

    // Check if email exists
    const existing = db.findByField('users', 'email', userData.email);
    if (existing.length > 0) {
      return { success: false, error: 'Email già registrata' };
    }

    // Sanitize input
    const sanitizedData = {
      ...userData,
      name: securityMiddleware.sanitizeInput(userData.name),
      surname: securityMiddleware.sanitizeInput(userData.surname),
      password: jwt.hashPassword(userData.password),
      role: userData.role || 'privato',
      status: userData.role === 'professionista' ? 'pending' : 'active',
      verified: userData.role === 'privato',
      permissions: userData.role === 'admin' ? ['all'] : 
                   userData.role === 'professionista' ? ['b2b_pricing', 'full_catalog', 'priority_support'] :
                   ['public_catalog', 'standard_pricing', 'basic_support']
    };

    const user = db.insert('users', sanitizedData);

    // Audit log
    securityMiddleware.logAuditEvent({
      event: 'user_registered',
      userId: user.id,
      action: 'create',
      resource: 'user'
    });

    // Send welcome email (simulated)
    console.log(`📧 Welcome email sent to ${user.email}`);

    const { password: _, ...userDataSafe } = user;
    return {
      success: true,
      data: userDataSafe,
      meta: { timestamp: new Date().toISOString() }
    };
  }

  // ===== USERS ENDPOINTS =====
  static async getUsers(filters?: { role?: string; status?: string; search?: string }): Promise<ApiResponse> {
    let users = db.findAll('users');

    if (filters?.role) {
      users = users.filter((u: any) => u.role === filters.role);
    }
    if (filters?.status) {
      users = users.filter((u: any) => u.status === filters.status);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      users = users.filter((u: any) => 
        u.name?.toLowerCase().includes(search) ||
        u.surname?.toLowerCase().includes(search) ||
        u.email?.toLowerCase().includes(search)
      );
    }

    // Remove passwords
    const safeUsers = users.map((u: any) => {
      const { password, ...safe } = u;
      return safe;
    });

    return {
      success: true,
      data: safeUsers,
      meta: { total: safeUsers.length, timestamp: new Date().toISOString() }
    };
  }

  static async getUser(id: string): Promise<ApiResponse> {
    const user = db.findById('users', id);
    if (!user) return { success: false, error: 'Utente non trovato' };
    const { password, ...safeUser } = user;
    return { success: true, data: safeUser };
  }

  static async updateUser(id: string, data: any): Promise<ApiResponse> {
    const sanitized = { ...data };
    if (data.name) sanitized.name = securityMiddleware.sanitizeInput(data.name);
    if (data.surname) sanitized.surname = securityMiddleware.sanitizeInput(data.surname);
    
    const user = db.update('users', id, sanitized);
    
    securityMiddleware.logAuditEvent({
      event: 'user_updated',
      userId: id,
      action: 'update',
      resource: 'user',
      metadata: { changes: data }
    });

    const { password, ...safeUser } = user;
    return { success: true, data: safeUser };
  }

  static async deleteUser(id: string): Promise<ApiResponse> {
    const deleted = db.delete('users', id);
    if (!deleted) return { success: false, error: 'Utente non trovato' };

    securityMiddleware.logAuditEvent({
      event: 'user_deleted',
      userId: id,
      action: 'delete',
      resource: 'user'
    });

    return { success: true, data: { deleted: true } };
  }

  // ===== ORDERS ENDPOINTS =====
  static async getOrders(filters?: { status?: string; userId?: string }): Promise<ApiResponse> {
    let orders = db.findAll('orders');

    if (filters?.status) {
      orders = orders.filter((o: any) => o.status === filters.status);
    }
    if (filters?.userId) {
      orders = orders.filter((o: any) => o.userId === filters.userId);
    }

    return {
      success: true,
      data: orders,
      meta: { total: orders.length, timestamp: new Date().toISOString() }
    };
  }

  static async createOrder(userId: string, items: any[], shippingAddress: string): Promise<ApiResponse> {
    // Validate stock
    for (const item of items) {
      const product = db.findById('products', item.productId);
      if (!product) return { success: false, error: `Prodotto non trovato: ${item.productId}` };
      if (product.stock < item.quantity) {
        return { success: false, error: `Stock insufficiente per: ${product.name}` };
      }
    }

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = db.insert('orders', {
      userId,
      items,
      total,
      status: 'pending',
      shippingAddress,
      createdAt: new Date().toISOString()
    });

    // Update stock
    await db.transaction(async (db) => {
      for (const item of items) {
        const product = db.findById('products', item.productId);
        db.update('products', item.productId, { stock: product.stock - item.quantity });
      }
    });

    securityMiddleware.logAuditEvent({
      event: 'order_created',
      userId,
      action: 'create',
      resource: 'order',
      metadata: { orderId: order.id, total }
    });

    return { success: true, data: order };
  }

  static async updateOrderStatus(orderId: string, status: string): Promise<ApiResponse> {
    const order = db.update('orders', orderId, { status });
    
    securityMiddleware.logAuditEvent({
      event: 'order_status_changed',
      action: 'update',
      resource: 'order',
      metadata: { orderId, newStatus: status }
    });

    return { success: true, data: order };
  }

  // ===== PRODUCTS ENDPOINTS =====
  static async getProducts(filters?: { brand?: string; status?: string; search?: string }): Promise<ApiResponse> {
    let products = db.findAll('products');

    if (filters?.brand) {
      products = products.filter((p: any) => p.brand === filters.brand);
    }
    if (filters?.status) {
      products = products.filter((p: any) => p.status === filters.status);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      products = products.filter((p: any) => 
        p.name?.toLowerCase().includes(search) ||
        p.brand?.toLowerCase().includes(search)
      );
    }

    return {
      success: true,
      data: products,
      meta: { total: products.length, timestamp: new Date().toISOString() }
    };
  }

  static async createProduct(data: any): Promise<ApiResponse> {
    const sanitized = {
      ...data,
      name: securityMiddleware.sanitizeInput(data.name),
      brand: securityMiddleware.sanitizeInput(data.brand),
      category: securityMiddleware.sanitizeInput(data.category)
    };

    const product = db.insert('products', sanitized);

    securityMiddleware.logAuditEvent({
      event: 'product_created',
      action: 'create',
      resource: 'product',
      metadata: { productId: product.id }
    });

    return { success: true, data: product };
  }

  static async updateProduct(id: string, data: any): Promise<ApiResponse> {
    const product = db.update('products', id, data);

    securityMiddleware.logAuditEvent({
      event: 'product_updated',
      action: 'update',
      resource: 'product',
      metadata: { productId: id, changes: data }
    });

    return { success: true, data: product };
  }

  // ===== ANALYTICS ENDPOINTS =====
  static async getAnalytics(): Promise<ApiResponse> {
    const users = db.findAll('users');
    const orders = db.findAll('orders');
    const products = db.findAll('products');

    const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
    const usersByRole = users.reduce((acc: any, u: any) => {
      acc[u.role] = (acc[u.role] || 0) + 1;
      return acc;
    }, {});

    return {
      success: true,
      data: {
        users: {
          total: users.length,
          byRole: usersByRole,
          active: users.filter((u: any) => u.status === 'active').length
        },
        orders: {
          total: orders.length,
          totalRevenue,
          pending: orders.filter((o: any) => o.status === 'pending').length,
          averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0
        },
        products: {
          total: products.length,
          active: products.filter((p: any) => p.status === 'active').length,
          outOfStock: products.filter((p: any) => p.stock === 0).length
        },
        conversions: {
          rate: users.length > 0 ? (orders.length / users.length) * 100 : 0
        }
      },
      meta: { timestamp: new Date().toISOString() }
    };
  }

  // ===== BACKUP ENDPOINTS =====
  static async createBackup(type: 'full' | 'incremental' = 'full'): Promise<ApiResponse> {
    const backupData = {
      users: db.findAll('users'),
      orders: db.findAll('orders'),
      products: db.findAll('products'),
      contents: db.findAll('contents'),
      timestamp: new Date().toISOString()
    };

    const backup = db.insert('backups', {
      type,
      size: JSON.stringify(backupData).length,
      status: 'completed',
      duration: Math.floor(Math.random() * 60) + 30,
      verified: true,
      data: backupData
    });

    securityMiddleware.logAuditEvent({
      event: 'backup_created',
      action: 'create',
      resource: 'backup',
      metadata: { backupId: backup.id, type }
    });

    return { success: true, data: { id: backup.id, type, size: backup.size } };
  }

  static async restoreBackup(backupId: string): Promise<ApiResponse> {
    const backup = db.findById('backups', backupId);
    if (!backup) return { success: false, error: 'Backup non trovato' };

    // Restore data
    if (backup.data) {
      Object.entries(backup.data).forEach(([table, data]) => {
        if (Array.isArray(data)) {
          db.findAll(table); // ensure table exists
          localStorage.setItem(`airklim_db_${table}`, JSON.stringify(data));
        }
      });
    }

    securityMiddleware.logAuditEvent({
      event: 'backup_restored',
      action: 'restore',
      resource: 'backup',
      metadata: { backupId }
    });

    return { success: true, data: { restored: true, backupId } };
  }

  // ===== SETTINGS ENDPOINTS =====
  static async getSettings(): Promise<ApiResponse> {
    const settings = localStorage.getItem('airklim-settings');
    return {
      success: true,
      data: settings ? JSON.parse(settings) : {}
    };
  }

  static async updateSettings(settings: any): Promise<ApiResponse> {
    localStorage.setItem('airklim-settings', JSON.stringify(settings));

    securityMiddleware.logAuditEvent({
      event: 'settings_updated',
      action: 'update',
      resource: 'settings'
    });

    return { success: true, data: settings };
  }

  // ===== AUDIT LOG ENDPOINTS =====
  static async getAuditLogs(filters?: { action?: string; severity?: string; userId?: string }): Promise<ApiResponse> {
    const logs = securityMiddleware.getAuditLogs();
    let filtered = logs;

    if (filters?.action) {
      filtered = filtered.filter(l => l.action === filters.action);
    }
    if (filters?.severity) {
      filtered = filtered.filter(l => l.event?.includes(filters.severity!));
    }
    if (filters?.userId) {
      filtered = filtered.filter(l => l.userId === filters.userId);
    }

    return {
      success: true,
      data: filtered,
      meta: { total: filtered.length, timestamp: new Date().toISOString() }
    };
  }
}

export default API;
