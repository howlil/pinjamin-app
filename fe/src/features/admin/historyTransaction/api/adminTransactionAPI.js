import { apiClient } from '../../../../shared/services/apiClient';

/**
 * Admin Transaction Management API Functions
 * Base URL: /api/v1/transactions/admin
 */

export const adminTransactionAPI = {
    // GET /api/v1/transactions/admin
    getAdminTransactions: async (params = {}) => {
        const response = await apiClient.get('/transactions/admin', { params });
        return response;
    },

    // GET /api/v1/transactions/admin/export
    exportTransactions: async () => {
        try {
            const response = await apiClient.get('/transactions/admin/export');

            if (response.data.fileUrl) {
                // Direct download from server URL
                const link = document.createElement('a');
                link.href = response.data.fileUrl;
                link.download = response.data.fileUrl.split('/').pop(); // Get filename from URL
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            return response.data;
        } catch (error) {
            console.error('Export error:', error);
            throw error;
        }
    }
}; 