import { apiClient } from '../../../../shared/services/apiClient';

export const historyAPI = {
    // GET /api/v1/bookings/history
    getBookingHistory: async (params = {}) => {
        const response = await apiClient.get('/bookings/history', { params });
        return response;
    },

}; 