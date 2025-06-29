import { apiClient } from '../../../../shared/services/apiClient';

export const transactionAPI = {
    // GET /api/v1/transactions/history
    getTransactionHistory: async (params = {}) => {
        const response = await apiClient.get('/transactions/history', { params });
        return response;
    },

    // GET /api/v1/transactions/{id}/invoice - For generating transaction invoice
    generateTransactionInvoice: async (bookingId) => {
        // Use bookingId to generate invoice, endpoint might be different
        // Try both possible endpoints for invoice generation
        try {
            // First try the transactions endpoint
            const response = await apiClient.get(`/transactions/${bookingId}/invoice`);
            return response;
        } catch (error) {
            // If transactions endpoint fails, try bookings endpoint as fallback
            console.log('Trying fallback bookings endpoint for invoice...');
            const response = await apiClient.get(`/bookings/${bookingId}/invoice`);
            return response;
        }
    },

    // GET /api/v1/bookings/{id}/invoice - Alternative endpoint for invoice
    generateBookingInvoice: async (bookingId) => {
        const response = await apiClient.get(`/bookings/${bookingId}/invoice`);
        return response;
    },
}; 