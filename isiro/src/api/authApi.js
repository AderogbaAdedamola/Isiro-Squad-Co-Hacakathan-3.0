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

// Logout user
export const logoutUser = async () => {
  return apiClient.post('/users/logout');
};

// Request password reset OTP
export const requestPasswordReset = async (data) => {
  return apiClient.post('/users/password-reset/request', data);
};

// Set new password after OTP verification
export const resetPassword = async (data) => {
  return apiClient.post('/users/password-reset/new', data);
};

// Get WhatsApp verification code and link
export const getWhatsappVerification = async () => {
  return apiClient.get('/users/whatsapp-verification');
};
