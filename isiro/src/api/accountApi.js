import { apiClient } from './axios';

// Create virtual account
export const createVirtualAccount = async (data) => {
  return apiClient.post('/accounts/create', data);
};

// Update virtual account
export const updateVirtualAccount = async (id, data) => {
  return apiClient.patch(`/accounts/update/${id}`, data);
};

// Delete virtual account
export const deleteVirtualAccount = async (id) => {
  return apiClient.delete(`/accounts/delete/${id}`);
};

// Lookup destination bank account
export const lookupAccount = async (bankCode, accountNumber) => {
  return apiClient.get(`/accounts/lookup`, {
    params: { bank_code: bankCode, account_number: accountNumber }
  });
};

// Withdraw funds
export const withdrawFunds = async (data) => {
  return apiClient.post('/accounts/withdraw', data);
};

// Get withdrawal history
export const getWithdrawalHistory = async () => {
  return apiClient.get('/accounts/history');
};
