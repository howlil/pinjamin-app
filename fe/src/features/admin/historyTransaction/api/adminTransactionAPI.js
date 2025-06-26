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
    exportTransactions: async (params = {}) => {
        try {
            // Use axios instance directly for blob response
            const response = await apiClient.axios.get('/api/v1/transactions/admin/export', {
                params,
                responseType: 'blob',
                headers: {
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }
            });

            // Create blob and download
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `transactions_${params.month || 'all'}_${params.year || 'all'}.xlsx`;
            document.body.appendChild(link);
            link.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);

            return { status: 'success' };
        } catch (error) {
            console.error('Export error:', error);
            throw error;
        }
    }
}; 