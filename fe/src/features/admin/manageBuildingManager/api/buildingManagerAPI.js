import { apiClient } from '../../../../shared/services/apiClient';


export const buildingManagerAPI = {
    // GET /api/v1/building-managers
    getBuildingManagers: async (params = {}) => {
        const response = await apiClient.get('/building-managers', { params });
        return response;
    },

    // GET /api/v1/building-managers/available
    getAvailableBuildingManagers: async () => {
        const response = await apiClient.get('/building-managers/available');
        return response;
    },

    // POST /api/v1/building-managers
    createBuildingManager: async (managerData) => {
        const response = await apiClient.post('/building-managers', managerData);
        return response;
    },

    // POST /api/v1/building-managers/assign
    assignBuildingManager: async (assignmentData) => {
        const response = await apiClient.post('/building-managers/assign', assignmentData);
        return response;
    },

    // PATCH /api/v1/building-managers/{id}
    updateBuildingManager: async (id, managerData) => {
        const response = await apiClient.patch(`/building-managers/${id}`, managerData);
        return response;
    },

    // DELETE /api/v1/building-managers/{id}
    deleteBuildingManager: async (id) => {
        const response = await apiClient.delete(`/building-managers/${id}`);
        return response;
    }
}; 