const BASE_URL = 'http://localhost:5223/api'; // Adjust port if needed

// Helper function to make fetch requests without auth token
async function apiRequest(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}


export const authService = {
  login: async (credentials) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return data;
  },
  register: async (userData) => {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  logout: () => {
    // No-op since we don't use authentication
  },
  getToken: () => null,
};

export const itemService = {
  getAll: async () => {
    return await apiRequest('/items', { method: 'GET' });
  },
  getById: async (id) => {
    return await apiRequest(`/items/${id}`, { method: 'GET' });
  },
  create: async (item) => {
    return await apiRequest('/items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },
  update: async (id, item) => {
    return await apiRequest(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  },
  delete: async (id) => {
    return await apiRequest(`/items/${id}`, { method: 'DELETE' });
  },
};

export const adminService = {
  getUsers: async () => await apiRequest('/admin/users', { method: 'GET' }),
  createUser: async (user) => await apiRequest('/admin/users', {
    method: 'POST',
    body: JSON.stringify(user),
  }),
  updateUser: async (userId, user) => await apiRequest(`/admin/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(user),
  }),
  updateUserRole: async (userId, roleId) => await apiRequest(`/admin/users/${userId}/role`, {
    method: 'PUT',
    body: JSON.stringify({ roleId }),
  }),
  deleteUser: async (userId) => await apiRequest(`/admin/users/${userId}`, { method: 'DELETE' }),
  getRoles: async () => await apiRequest('/admin/roles', { method: 'GET' }),
  getCurrencies: async () => await apiRequest('/admin/currencies', { method: 'GET' }),
  addCurrency: async (currency) => await apiRequest('/admin/currencies', {
    method: 'POST',
    body: JSON.stringify(currency),
  }),
  updateCurrency: async (id, currency) => await apiRequest(`/admin/currencies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(currency),
  }),
  deleteCurrency: async (id) => await apiRequest(`/admin/currencies/${id}`, { method: 'DELETE' }),
  setDefaultCurrency: async (id) => await apiRequest(`/admin/currencies/${id}/default`, {
    method: 'POST',
  }),
  getAnalytics: async (period) => await apiRequest(`/admin/analytics?period=${period}`, { method: 'GET' }),
  getCategories: async () => await apiRequest('/admin/categories', { method: 'GET' }),
  addCategory: async (category) => await apiRequest('/admin/categories', {
    method: 'POST',
    body: JSON.stringify(category),
  }),
  updateCategory: async (id, category) => await apiRequest(`/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(category),
  }),
  deleteCategory: async (id) => await apiRequest(`/admin/categories/${id}`, { method: 'DELETE' }),
};

export const systemService = {
  getDefaultCurrency: async () => await apiRequest('/system/currency/default', { method: 'GET' }),
  getCategories: async () => await apiRequest('/system/categories', { method: 'GET' }),
  getAnalytics: async (period) => await apiRequest(`/system/analytics?period=${period}`, { method: 'GET' }),
};
