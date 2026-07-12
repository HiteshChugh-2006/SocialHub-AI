/**
 * api.js — Axios HTTP client for SocialHub AI
 *
 * Configures a pre-configured Axios instance with:
 *   - Base URL (proxied by Vite in development)
 *   - Default headers
 *   - Request/response interceptors
 *
 * Future experiments will add:
 *   - Authorization header injection (JWT)
 *   - Token refresh logic
 *   - Request cancellation support
 */

import axios from 'axios';

// ─── Axios Instance ───────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: '/api',
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Future: Attach JWT token from localStorage/context
    // const token = localStorage.getItem('authToken');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalise error shape for consistent handling in components
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    const normalised = {
      ...error,
      message,
      status: error.response?.status,
      data: error.response?.data,
    };

    // Future: Handle 401 Unauthorised → redirect to login
    // if (normalised.status === 401) { ... }

    return Promise.reject(normalised);
  }
);

// ─── Post API Methods ─────────────────────────────────────────────────────────

/**
 * Create a new post (multipart/form-data to support file uploads).
 * @param {FormData} formData
 * @returns {Promise<{ success: boolean, data: object }>}
 */
export const createPost = (formData) =>
  api.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

/**
 * Retrieve paginated posts.
 * @param {{ page?: number, limit?: number }} params
 * @returns {Promise<{ success: boolean, data: object[], pagination: object }>}
 */
export const getPosts = (params = {}) => api.get('/posts', { params });

// ─── Health Check ─────────────────────────────────────────────────────────────
export const checkHealth = () => api.get('/health');

export default api;
