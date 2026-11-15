/**
 * Centralized REST API Service Client
 * Handles HTTP requests, JWT token header injection, and response parsing.
 */

const API_BASE = '/api/v1';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('b2b_jwt_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (response.status === 401 && !endpoint.includes('/auth/login')) {
    // Token expired or invalid
    localStorage.removeItem('b2b_jwt_token');
    localStorage.removeItem('b2b_user');
    window.location.reload();
    throw new Error('Session expired. Please log in again.');
  }

  const raw = await response.text();
  let data = {};
  try { data = raw ? JSON.parse(raw) : {}; } catch (_) {
    throw new Error(`Server returned an invalid response (${response.status})`);
  }
  if (!response.ok) {
    throw new Error(data.error || 'API Request failed');
  }

  return data;
}

export const api = {
  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  getProfile: () => request('/auth/me'),

  // Products
  getProducts: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/products${q ? `?${q}` : ''}`);
  },
  getProduct: (id) => request(`/products/${id}`),
  createProduct: (payload) => request('/products', { method: 'POST', body: payload }),
  updateStock: (id, stock) => request(`/products/${id}/stock`, { method: 'PATCH', body: { stock } }),

  // Orders
  getOrders: () => request('/orders'),
  getOrder: (id) => request(`/orders/${id}`),
  createOrder: (payload) => request('/orders', { method: 'POST', body: payload }),
  updateOrderStatus: (id, status) => request(`/orders/${id}/status`, { method: 'PATCH', body: { status } }),

  // Invoices
  getInvoices: () => request('/invoices'),
  getInvoice: (id) => request(`/invoices/${id}`),
  markInvoicePaid: (id) => request(`/invoices/${id}/pay`, { method: 'PATCH' }),

  // Users & Administration
  getUsers: () => request('/users'),
  toggleUserStatus: (id) => request(`/users/${id}/toggle`, { method: 'PATCH' }),

  // Audit Logs
  getAuditLogs: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/audit${q ? `?${q}` : ''}`);
  }
};

