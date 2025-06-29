import { apiClient } from '@/shared/services/apiClient';

export const scheduleAPI = {
    // GET /api/v1/buildings/schedule - Get all building schedules
    getBuildingsSchedule: async (params = {}) => {
        try {
            console.log('=== Schedule API Call ===');
            console.log('Request params:', params);
            console.log('API endpoint: /buildings/schedule');

            const response = await apiClient.get('/buildings/schedule', { params, silent: true });

            console.log('API Response received:', response);
            console.log('=== End Schedule API Call ===');

            return response;
        } catch (error) {
            console.error('Schedule API Error:', error);
            throw error;
        }
    },

    // GET /api/v1/bookings/user - Get user's own bookings as alternative
    getUserBookings: async (params = {}) => {
        try {
            const response = await apiClient.get('/bookings/user', { params, silent: true });
            return response;
        } catch (error) {
            console.error('User Bookings API Error:', error);
            throw error;
        }
    }
}; 