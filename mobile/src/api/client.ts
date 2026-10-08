/**
 * Minimal API client for the AIRKLIM backend (Express + JWT).
 * Mirrors the endpoints used by the web app:
 *   POST /api/auth/login | register | logout
 *   GET  /api/products | /api/orders
 */
import Constants from 'expo-constants';

const API_URL: string =
  (Constants.expoConfig?.extra?.apiUrl as string) ?? 'http://localhost:3000';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  description?: string;
  price: number;
  stock: number;
  image_url?: string | null;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  surname: string;
  role: 'privato' | 'professionista' | 'admin';
}

let token: string | null = null;
export const setToken = (t: string | null) => { token = t; };
export const getToken = () => token;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  const body = await res.json().catch(() => ({ success: false, error: 'Risposta non valida' }));
  if (!res.ok || body.success === false) {
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return body as T;
}

export async function login(email: string, password: string) {
  const r = await request<{ success: boolean; data: { user: AuthUser; token: string } }>(
    '/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  setToken(r.data.token);
  return r.data.user;
}

export async function logout() {
  try { await request('/api/auth/logout', { method: 'POST' }); } finally { setToken(null); }
}

export const getProducts = (query = '') =>
  request<{ success: boolean; data: Product[] }>(`/api/products${query}`);

export const getOrders = () =>
  request<{ success: boolean; data: unknown[] }>('/api/orders');
