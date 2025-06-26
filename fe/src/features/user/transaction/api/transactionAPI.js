import { apiClient } from '../../../../shared/services/apiClient';

export const transactionAPI = {
    // GET /api/v1/transactions/history
    getTransactionHistory: async (params = {}) => {
        const response = await apiClient.get('/transactions/history', { params });
        return response;
    },

    generateTransactionInvoice: async (id) => {
        const response = await apiClient.get(`/bookings/${id}/invoice`);
        return response;
    },
}; 