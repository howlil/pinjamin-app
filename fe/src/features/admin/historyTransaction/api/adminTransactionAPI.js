import { apiClient } from '../../../../shared/services/apiClient';

/**
 * Admin Transaction Management API Functions
 * Base URL: /api/v1/transactions/admin
 */

export const adminTransactionAPI = {
    // GET /api/v1/transactions/admin
    getAdminTransactions: async (params = {}) => {
        const response = await apiClient.get('/transactions/admin', { params });
        return response.data;
    },

    // GET /api/v1/transactions/admin/export
    exportTransactions: async (params = {}) => {
        const response = await apiClient.get('/transactions/admin/export', { params });
        return response.data;
    }
}; 