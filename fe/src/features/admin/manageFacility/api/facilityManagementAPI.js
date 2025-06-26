import { apiClient } from '../../../../shared/services/apiClient';


export const facilityManagementAPI = {
    // GET /api/v1/facilities
    getFacilities: async (params = {}) => {
        const response = await apiClient.get('/facilities', { params });
        return response;
    },

    // POST /api/v1/facilities
    createFacility: async (facilityData) => {
        const response = await apiClient.post('/facilities', facilityData);
        return response;
    },

    // PATCH /api/v1/facilities/{id}
    updateFacility: async (id, facilityData) => {
        const response = await apiClient.patch(`/facilities/${id}`, facilityData);
        return response;
    },

    // DELETE /api/v1/facilities/{id}
    deleteFacility: async (id) => {
        const response = await apiClient.delete(`/facilities/${id}`);
        return response;
    }
}; 