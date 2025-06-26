import { apiClient } from '../../../../shared/services/apiClient';

/**
 * Admin Building Manager Management API Functions
 * Base URL: /api/v1/building-managers
 */

export const buildingManagerAPI = {
    // GET /api/v1/building-managers
    getBuildingManagers: async (params = {}) => {
        const response = await apiClient.get('/building-managers', { params });
        return response.data;
    },

    // GET /api/v1/building-managers/available
    getAvailableBuildingManagers: async () => {
        const response = await apiClient.get('/building-managers/available');
        return response.data;
    },

    // POST /api/v1/building-managers
    createBuildingManager: async (managerData) => {
        const response = await apiClient.post('/building-managers', managerData);
        return response.data;
    },

    // POST /api/v1/building-managers/assign
    assignBuildingManager: async (assignmentData) => {
        const response = await apiClient.post('/building-managers/assign', assignmentData);
        return response.data;
    },

    // PATCH /api/v1/building-managers/{id}
    updateBuildingManager: async (id, managerData) => {
        const response = await apiClient.patch(`/building-managers/${id}`, managerData);
        return response.data;
    },

    // DELETE /api/v1/building-managers/{id}
    deleteBuildingManager: async (id) => {
        const response = await apiClient.delete(`/building-managers/${id}`);
        return response.data;
    }
}; 