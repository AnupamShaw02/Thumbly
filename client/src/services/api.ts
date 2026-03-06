import axios from 'axios';
import type { User, Thumbnail, GenerateFormData } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ user: User }>('/auth/login', { email, password }),

  signup: (name: string, email: string, password: string) =>
    api.post<{ user: User }>('/auth/signup', { name, email, password }),

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
