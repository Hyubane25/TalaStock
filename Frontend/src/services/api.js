import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5223/api', // Adjust port if needed
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);


export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
  getToken: () => localStorage.getItem('token'),
};

export const itemService = {
  getAll: async () => {
    const response = await api.get('/items');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },
  create: async (item) => {
    const response = await api.post('/items', item);
    return response.data;
  },
  update: async (id, item) => {
    const response = await api.put(`/items/${id}`, item);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  },
};

export const adminService = {
  getUsers: async () => (await api.get('/admin/users')).data,
  createUser: async (user) => (await api.post('/admin/users', user)).data,
  updateUserRole: async (userId, roleId) => (await api.put(`/admin/users/${userId}/role`, { roleId })).data,
  deleteUser: async (userId) => (await api.delete(`/admin/users/${userId}`)).data,
  getRoles: async () => (await api.get('/admin/roles')).data,
  getCurrencies: async () => (await api.get('/admin/currencies')).data,
  addCurrency: async (currency) => (await api.post('/admin/currencies', currency)).data,
  updateCurrency: async (id, currency) => (await api.put(`/admin/currencies/${id}`, currency)).data,
  deleteCurrency: async (id) => (await api.delete(`/admin/currencies/${id}`)).data,
  setDefaultCurrency: async (id) => (await api.post(`/admin/currencies/${id}/default`)).data,
  getAnalytics: async (period) => (await api.get(`/admin/analytics?period=${period}`)).data,
  getCategories: async () => (await api.get('/admin/categories')).data,
  addCategory: async (category) => (await api.post('/admin/categories', category)).data,
  updateCategory: async (id, category) => (await api.put(`/admin/categories/${id}`, category)).data,
  deleteCategory: async (id) => (await api.delete(`/admin/categories/${id}`)).data,
};

export const systemService = {
  getDefaultCurrency: async () => (await api.get('/system/currency/default')).data,
  getCategories: async () => (await api.get('/system/categories')).data,
};

export default api;
