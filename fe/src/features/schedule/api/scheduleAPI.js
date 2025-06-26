import { apiClient } from '@/shared/services/apiClient';


export const scheduleAPI = {
    // GET /api/v1/buildings/schedule
    getBuildingsSchedule: async (params = {}) => {
        const response = await apiClient.get('/buildings/schedule', { params, silent: true });
        return response;
    }
}; 