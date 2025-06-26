import { apiClient } from '@/shared/services/apiClient';

export const homeAPI = {
    getTodayBookings: async () => {
        const response = await apiClient.get('/bookings/today', { silent: true });
        return response;
    },

    getStats: async () => {
        const response = await apiClient.get('/dashboard/stats', { silent: true });
        return response;
    }
}; 