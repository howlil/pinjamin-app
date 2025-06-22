import { apiClient } from '../core/apiClient';

// Transaction API methods
export const transactionApi = {
    // Get all transactions with filter/pagination for admin
    getTransactions: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        const queryString = queryParams.toString();

        console.log('=== GET ADMIN TRANSACTIONS ===');
        console.log('Params:', params);
        console.log('Query string:', queryString);

        return apiClient.get(`/api/v1/transactions/admin${queryString ? `?${queryString}` : ''}`);
    },

    // Get user transaction history
    getUserTransactionHistory: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        const queryString = queryParams.toString();

        console.log('=== GET USER TRANSACTION HISTORY ===');
        console.log('Params:', params);
        console.log('Query string:', queryString);

        return apiClient.get(`/api/v1/transactions/history${queryString ? `?${queryString}` : ''}`);
    },

    // Export transactions to Excel (Admin)
    exportTransactions: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.month) queryParams.append('month', params.month);
        if (params.year) queryParams.append('year', params.year);
        const queryString = queryParams.toString();

        console.log('=== EXPORT TRANSACTIONS ===');
        console.log('Params:', params);
        console.log('Query string:', queryString);

        return apiClient.get(`/api/v1/transactions/admin/export${queryString ? `?${queryString}` : ''}`);
    },

    // Get single transaction by ID
    getTransactionById: (id) => {
        console.log('=== GET TRANSACTION BY ID ===');
        console.log('Transaction ID:', id);
        return apiClient.get(`/api/v1/transactions/${id}`);
    },

    // Update transaction status
    updateTransactionStatus: (id, status, notes = null) => {
        console.log('=== UPDATE TRANSACTION STATUS ===');
        console.log('Transaction ID:', id);
        console.log('Status:', status);
        console.log('Notes:', notes);
        return apiClient.put(`/api/v1/transactions/${id}/status`, { status, notes });
    },

    // Create manual transaction (admin)
    createTransaction: (transactionData) => {
        console.log('=== CREATE TRANSACTION ===');
        console.log('Transaction data:', transactionData);
        return apiClient.post('/api/v1/transactions', transactionData);
    },

    // Update transaction details
    updateTransaction: (id, transactionData) => {
        console.log('=== UPDATE TRANSACTION ===');
        console.log('Transaction ID:', id);
        console.log('Transaction data:', transactionData);
        return apiClient.put(`/api/v1/transactions/${id}`, transactionData);
    },

    // Delete transaction
    deleteTransaction: (id) => {
        console.log('=== DELETE TRANSACTION ===');
        console.log('Transaction ID:', id);
        return apiClient.delete(`/api/v1/transactions/${id}`);
    },

    // Get transaction statistics for dashboard
    getTransactionStats: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.month) queryParams.append('month', params.month);
        if (params.year) queryParams.append('year', params.year);
        const queryString = queryParams.toString();

        console.log('=== GET TRANSACTION STATISTICS ===');
        console.log('Params:', params);
        console.log('Query string:', queryString);

        return apiClient.get(`/api/v1/dashboard/statistics/transactions${queryString ? `?${queryString}` : ''}`);
    },

    // Send payment reminder
    sendPaymentReminder: (id) => {
        console.log('=== SEND PAYMENT REMINDER ===');
        console.log('Transaction ID:', id);
        return apiClient.post(`/api/v1/transactions/${id}/reminder`);
    },

    // Process refund
    processRefund: (id, refundData) => {
        console.log('=== PROCESS REFUND ===');
        console.log('Transaction ID:', id);
        console.log('Refund data:', refundData);
        return apiClient.post(`/api/v1/transactions/${id}/refund`, refundData);
    }
};

export default transactionApi; 