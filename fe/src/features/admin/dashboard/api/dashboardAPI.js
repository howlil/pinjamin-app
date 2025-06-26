import { apiClient } from '../../../../shared/services/apiClient';

/**
 * Admin Dashboard API Functions
 * Base URL: /api/v1/dashboard
 */

export const dashboardAPI = {
    // GET /api/v1/dashboard/statistics/bookings
    getBookingStatistics: async (params = {}) => {
        const response = await apiClient.get('/dashboard/statistics/bookings', { params });
        return response;
    },

    // GET /api/v1/dashboard/statistics/transactions
    getTransactionStatistics: async (params = {}) => {
        const response = await apiClient.get('/dashboard/statistics/transactions', { params });
        return response;
    }
}; 