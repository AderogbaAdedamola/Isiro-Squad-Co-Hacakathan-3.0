import { apiClient } from './axios';

// Auth APIs
export const login = async (credentials) => {
  return apiClient.post('/users/login', credentials);
};

export const register = async (userData) => {
  return apiClient.post('/users/register', userData);
};

// Renew access token using refresh token (cookie-based)
export const renewToken = async () => {
  return apiClient.post('/users/renew-token');
};
