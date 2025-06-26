import { apiClient } from '../../../../shared/services/apiClient';

/**
 * Admin Building Management API Functions
 * Base URL: /api/v1/buildings
 */

export const buildingManagementAPI = {
    // GET /api/v1/buildings/admin/list
    getAdminBuildings: async (params = {}) => {
        // Filter out empty parameters to avoid API validation errors
        const filteredParams = {};

        Object.keys(params).forEach(key => {
            const value = params[key];
            // Only include non-empty values
            if (value !== '' && value !== null && value !== undefined) {
                filteredParams[key] = value;
            }
        });

        const response = await apiClient.get('/buildings/admin/list', { params: filteredParams });
        return response;
    },

    // POST /api/v1/buildings/admin
    createBuilding: async (buildingData) => {
        // Use FormData for multipart/form-data
        const formData = new FormData();
        Object.keys(buildingData).forEach(key => {
            if (buildingData[key] !== undefined && buildingData[key] !== null) {
                if (key === 'facilities' || key === 'buildingManagers') {
                    // Handle array fields
                    if (Array.isArray(buildingData[key])) {
                        console.log(`Creating building - ${key}:`, buildingData[key]);
                        formData.append(key, JSON.stringify(buildingData[key]));
                    } else {
                        formData.append(key, buildingData[key]);
                    }
                } else {
                    formData.append(key, buildingData[key]);
                }
            }
        });

        console.log('FormData entries:');
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        const response = await apiClient.post('/buildings/admin', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    },

    // PATCH /api/v1/buildings/admin/{id}
    updateBuilding: async (id, buildingData) => {
        // Use FormData for multipart/form-data
        const formData = new FormData();
        Object.keys(buildingData).forEach(key => {
            if (buildingData[key] !== undefined && buildingData[key] !== null) {
                if (key === 'facilities' || key === 'buildingManagers') {
                    // Handle array fields
                    if (Array.isArray(buildingData[key])) {
                        console.log(`Updating building - ${key}:`, buildingData[key]);
                        formData.append(key, JSON.stringify(buildingData[key]));
                    } else {
                        formData.append(key, buildingData[key]);
                    }
                } else {
                    formData.append(key, buildingData[key]);
                }
            }
        });

        console.log('FormData entries for update:');
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        const response = await apiClient.patch(`/buildings/admin/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    },

    // DELETE /api/v1/buildings/admin/{id}
    deleteBuilding: async (id) => {
        const response = await apiClient.delete(`/buildings/admin/${id}`);
        return response;
    }
}; 