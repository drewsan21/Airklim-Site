import { useState, useEffect, useCallback } from 'react';

// ===== TYPES =====
interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  role: 'privato' | 'professionista';
  phone?: string;
  company?: string;
  vatNumber?: string;
  verified: boolean;
  createdAt: string;
}

interface CartItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  shippingAddress?: string;
}

// ===== AUTH CONTEXT =====
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('airklim-user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('airklim-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((email: string, password: string): { success: boolean; message: string } => {
    // Simulated login
    const users = JSON.parse(localStorage.getItem('airklim-users') || '[]');
    const found = users.find((u: User & { password: string }) => u.email === email);
    
    if (!found) return { success: false, message: 'Utente non trovato. Registrati prima.' };
    if (found.password !== password) return { success: false, message: 'Password errata.' };
    
    const { password: _, ...userData } = found;
    setUser(userData);
    localStorage.setItem('airklim-user', JSON.stringify(userData));
    return { success: true, message: 'Login effettuato con successo!' };
  }, []);

  const register = useCallback((data: {
    email: string;
    password: string;
    name: string;
    surname: string;
    phone?: string;
    role: 'privato' | 'professionista';
    company?: string;
    vatNumber?: string;
  }): { success: boolean; message: string } => {
    const users = JSON.parse(localStorage.getItem('airklim-users') || '[]');
    
    if (users.find((u: User) => u.email === data.email)) {
      return { success: false, message: 'Email già registrata.' };
    }

    const newUser: User & { password: string } = {
      id: `user-${Date.now()}`,
      email: data.email,
      password: data.password,
      name: data.name,
      surname: data.surname,
      phone: data.phone,
      role: data.role,
      company: data.company,
      vatNumber: data.vatNumber,
      verified: data.role === 'privato',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('airklim-users', JSON.stringify(users));

    const { password: _, ...userData } = newUser;
    setUser(userData);
    localStorage.setItem('airklim-user', JSON.stringify(userData));

    return { success: true, message: data.role === 'privato' 
      ? 'Account creato con successo!' 
      : 'Registrazione inviata! Verificheremo i documenti entro 48 ore.' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('airklim-user');
  }, []);

  return { user, isLoading, login, register, logout };
}

// ===== CART CONTEXT =====
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('airklim-cart');
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        localStorage.removeItem('airklim-cart');
      }
    }
  }, []);

  const saveCart = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem('airklim-cart', JSON.stringify(newItems));
  }, []);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      let newItems: CartItem[];
      if (existing) {
        newItems = prev.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        newItems = [...prev, { ...item, quantity: 1 }];
      }
      localStorage.setItem('airklim-cart', JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(prev => {
      const newItems = prev.filter(i => i.productId !== productId);
      localStorage.setItem('airklim-cart', JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems(prev => {
      let newItems: CartItem[];
      if (quantity <= 0) {
        newItems = prev.filter(i => i.productId !== productId);
      } else {
        newItems = prev.map(i => i.productId === productId ? { ...i, quantity } : i);
      }
      localStorage.setItem('airklim-cart', JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem('airklim-cart');
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { items, addItem, removeItem, updateQuantity, clearCart, total, itemCount };
}

// ===== ORDER CONTEXT =====
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('airklim-orders');
    if (stored) {
      try {
        setOrders(JSON.parse(stored));
      } catch {
        localStorage.removeItem('airklim-orders');
      }
    }
  }, []);

  const createOrder = useCallback((userId: string, items: CartItem[], total: number, shippingAddress: string): Order => {
    const order: Order = {
      id: `ORD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
      userId,
      items,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      shippingAddress,
    };

    const newOrders = [order, ...orders];
    setOrders(newOrders);
    localStorage.setItem('airklim-orders', JSON.stringify(newOrders));

    // Simulate order progression
    setTimeout(() => updateOrderStatus(order.id, 'confirmed'), 3000);
    setTimeout(() => updateOrderStatus(order.id, 'processing'), 8000);
    setTimeout(() => updateOrderStatus(order.id, 'shipped'), 15000);

    return order;
  }, [orders]);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders(prev => {
      const newOrders = prev.map(o => o.id === orderId ? { ...o, status } : o);
      localStorage.setItem('airklim-orders', JSON.stringify(newOrders));
      return newOrders;
    });
  }, []);

  const getUserOrders = useCallback((userId: string) => {
    return orders.filter(o => o.userId === userId);
  }, [orders]);

  return { orders, createOrder, updateOrderStatus, getUserOrders };
}

// ===== EMAIL AUTOMATION =====
export function useEmailAutomation() {
  const sendWelcomeEmail = useCallback((user: User) => {
    console.log(`📧 Welcome email sent to ${user.email}`);
    // In production: call API endpoint
  }, []);

  const sendOrderConfirmation = useCallback((order: Order, email: string) => {
    console.log(`📧 Order confirmation sent to ${email} for order ${order.id}`);
  }, []);

  const sendAbandonedCart = useCallback((email: string, items: CartItem[]) => {
    console.log(`📧 Abandoned cart reminder sent to ${email}`);
  }, []);

  const sendReviewRequest = useCallback((order: Order, email: string) => {
    console.log(`📧 Review request sent to ${email} for order ${order.id}`);
  }, []);

  return { sendWelcomeEmail, sendOrderConfirmation, sendAbandonedCart, sendReviewRequest };
}
