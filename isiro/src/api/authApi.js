import { apiClient } from './axios';

// Placeholder Auth APIs
export const login = async (credentials) => {
  return new Promise((resolve) => setTimeout(() => resolve({ data: { token: 'fake-jwt-token', user: { name: 'Demo Trader' } } }), 800));
};

export const register = async (userData) => {
  return new Promise((resolve) => setTimeout(() => resolve({ data: { message: 'Success' } }), 800));
};
