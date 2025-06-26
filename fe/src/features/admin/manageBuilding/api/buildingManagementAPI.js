import { apiClient } from '../../../../shared/services/apiClient';

/**
 * Admin Building Management API Functions
 * Base URL: /api/v1/buildings
 */

export const buildingManagementAPI = {
    // GET /api/v1/buildings/admin
    getAdminBuildings: async (params = {}) => {
        const response = await apiClient.get('/buildings/admin', { params });
        return response.data;
    },

    // POST /api/v1/buildings/admin
    createBuilding: async (buildingData) => {
        // Use FormData for multipart/form-data
        const formData = new FormData();
        Object.keys(buildingData).forEach(key => {
            if (buildingData[key] !== undefined && buildingData[key] !== null) {
                if (key === 'facilityIds' || key === 'buildingManagerIds') {
                    // Handle array fields
                    if (Array.isArray(buildingData[key])) {
                        formData.append(key, JSON.stringify(buildingData[key]));
                    } else {
                        formData.append(key, buildingData[key]);
                    }
                } else {
                    formData.append(key, buildingData[key]);
                }
            }
        });

        const response = await apiClient.post('/buildings/admin', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // PATCH /api/v1/buildings/admin/{id}
    updateBuilding: async (id, buildingData) => {
        // Use FormData for multipart/form-data
        const formData = new FormData();
        Object.keys(buildingData).forEach(key => {
            if (buildingData[key] !== undefined && buildingData[key] !== null) {
                if (key === 'facilityIds' || key === 'buildingManagerIds') {
                    // Handle array fields
                    if (Array.isArray(buildingData[key])) {
                        formData.append(key, JSON.stringify(buildingData[key]));
                    } else {
                        formData.append(key, buildingData[key]);
                    }
                } else {
                    formData.append(key, buildingData[key]);
                }
            }
        });

        const response = await apiClient.patch(`/buildings/admin/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // DELETE /api/v1/buildings/admin/{id}
    deleteBuilding: async (id) => {
        const response = await apiClient.delete(`/buildings/admin/${id}`);
        return response.data;
    }
}; 