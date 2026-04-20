import axios from 'axios';
import type { Thumbnail, GenerateFormData } from '../types';

type TokenGetter = () => Promise<string | null>;
let _getToken: TokenGetter | null = null;

export function setTokenGetter(fn: TokenGetter) {
  _getToken = fn;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Attach Clerk token to every request
api.interceptors.request.use(async (config) => {
  if (_getToken) {
    const token = await _getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Thumbnails
export const thumbnailApi = {
  generate: (data: GenerateFormData) =>
    api.post<{ thumbnail: Thumbnail }>('/thumbnails/generate', data),

  getAll: () => api.get<{ thumbnails: Thumbnail[] }>('/thumbnails'),

  getOne: (id: string) => api.get<{ thumbnail: Thumbnail }>(`/thumbnails/${id}`),

  delete: (id: string) => api.delete(`/thumbnails/${id}`),
};

// Community
export const communityApi = {
  getFeed: (style?: string, sort?: string) =>
    api.get<{ thumbnails: Thumbnail[] }>('/community', { params: { style, sort } }),

  like: (id: string) =>
    api.post<{ likes: number; liked: boolean }>(`/community/${id}/like`),

  toggleVisibility: (id: string) =>
    api.patch<{ isPublic: boolean }>(`/community/${id}/visibility`),
};

export default api;
