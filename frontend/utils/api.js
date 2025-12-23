import axios from 'axios';

// For local development: use old backend server
// For Vercel production: will use relative /api paths automatically
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const memberAPI = {
  getAll: () => apiClient.get('/members'),
  getById: (id) => apiClient.get(`/members/${id}`),
  create: (data) => apiClient.post('/members', data),
  update: (id, data) => apiClient.put(`/members/${id}`, data),
  delete: (id) => apiClient.delete(`/members/${id}`),
  search: (query) => apiClient.get(`/members/search?name=${query}`),
  getExpired: () => apiClient.get('/members/expired'),
};

export default apiClient;
