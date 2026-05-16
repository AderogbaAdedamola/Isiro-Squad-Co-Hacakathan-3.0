import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor: attach access token ──
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: silent refresh on 401 ──
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh for 401/403 token errors, and not on auth endpoints themselves
    const isAuthEndpoint =
      originalRequest.url?.includes('/users/login') ||
      originalRequest.url?.includes('/users/register') ||
      originalRequest.url?.includes('/users/verify-email') ||
      originalRequest.url?.includes('/users/renew-token');

    const isTokenError = 
      error.response?.status === 401 || 
      (error.response?.status === 403 && 
        error.response?.data?.error?.toLowerCase().includes('token'));

    if (!isTokenError || isAuthEndpoint || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Attempt to renew the token using the refresh token cookie
      const response = await apiClient.post('/users/renew-token');
      const newToken = response.data?.token || response.data?.accessToken;

      if (newToken) {
        // Update token in store and localStorage
        useAuthStore.getState().setToken(newToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Process any queued requests
        processQueue(null, newToken);

        return apiClient(originalRequest);
      } else {
        throw new Error('No token in refresh response');
      }
    } catch (refreshError) {
      // Refresh failed — token is invalid, expired, or revoked
      // Force logout and redirect to login
      processQueue(refreshError, null);
      useAuthStore.getState().logout();
      
      // Redirect to login page
      window.location.href = '/login';

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
