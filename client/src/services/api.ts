import axios from 'axios';
import type { User, Thumbnail, GenerateFormData } from '../types';

const TOKEN_KEY = 'thumbly_auth_token';
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

type AuthResponse = { user: User; token?: string };

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),

  signup: (name: string, email: string, password: string) =>
    api.post<AuthResponse>('/auth/signup', { name, email, password }),

  logout: () => api.post('/auth/logout'),

  me: () => api.get<{ user: User }>('/auth/me'),
};

// Thumbnails
export const thumbnailApi = {
  generate: (data: GenerateFormData) =>
    api.post<{ thumbnail: Thumbnail }>('/thumbnails/generate', data),

  getAll: () => api.get<{ thumbnails: Thumbnail[] }>('/thumbnails'),

  getOne: (id: string) => api.get<{ thumbnail: Thumbnail }>(`/thumbnails/${id}`),

  delete: (id: string) => api.delete(`/thumbnails/${id}`),
};

export default api;
