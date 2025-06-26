import { apiClient } from '@/shared/services/apiClient';

export const buildingsAPI = {
    // GET /api/v1/buildings
    getBuildings: async (params = {}) => {
        const response = await apiClient.get('/buildings', { params, silent: true });
        return response;
    },

    // GET /api/v1/buildings/{id}
    getBuildingById: async (id) => {
        const response = await apiClient.get(`/buildings/${id}`, { silent: true });
        return response;
    },

    // GET /api/v1/buildings/{id} - Alias untuk compatibility dengan buildingDetail
    getBuildingDetail: async (id) => {
        const response = await apiClient.get(`/buildings/${id}`, { silent: true });
        return response;
    },

    checkAvailability: async (availabilityData) => {
        const response = await apiClient.post('/buildings/check-availability', availabilityData, { silent: true });
        return response;
    },

    // GET /api/v1/buildings/schedule
    getSchedule: async (params = {}) => {
        const response = await apiClient.get('/buildings/schedule', { params, silent: true });
        return response;
    },

    // GET /api/v1/buildings/schedule - Alias untuk building schedule dengan buildingId
    getBuildingSchedule: async (params = {}) => {
        const response = await apiClient.get('/buildings/schedule', {
            params: {  ...params },
            silent: true
        });
        return response;
    }
}; 