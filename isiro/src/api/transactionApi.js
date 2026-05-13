import { apiClient } from './axios';

// Placeholder Transaction APIs
export const getTransactions = async () => {
  return new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 500));
};

export const getPendingMatches = async () => {
  return new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 500));
};

export const resolveMatch = async (transactionId, resolutionData) => {
  return new Promise((resolve) => setTimeout(() => resolve({ data: { success: true } }), 500));
};
