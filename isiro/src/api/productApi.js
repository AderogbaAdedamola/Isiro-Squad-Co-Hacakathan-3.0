import { apiClient } from './axios';

// Placeholder Product/Inventory APIs
export const getProducts = async () => {
  return new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 500));
};

export const addProduct = async (productData) => {
  return new Promise((resolve) => setTimeout(() => resolve({ data: { ...productData, id: Math.random().toString(36).substr(2, 9) } }), 500));
};
