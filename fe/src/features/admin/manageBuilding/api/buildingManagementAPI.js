import { apiClient } from '../../../../shared/services/apiClient';

/**
 * Admin Building Management API Functions
 * Base URL: /api/v1/buildings
 */

export const buildingManagementAPI = {
    // GET /api/v1/buildings/admin/list
    getAdminBuildings: async (params = {}) => {
        try {
            // Filter out empty parameters to avoid API validation errors
            const filteredParams = {};

            Object.keys(params).forEach(key => {
                const value = params[key];
                // Only include non-empty values
                if (value !== '' && value !== null && value !== undefined) {
                    filteredParams[key] = value;
                }
            });

            const response = await apiClient.get('/buildings/admin/list', {
                params: filteredParams,
                hideErrorToast: false // Show error toasts for this endpoint
            });

            return response;
        } catch (error) {
            console.error('API Error - getAdminBuildings:', error);
            throw error;
        }
    },

    // POST /api/v1/buildings/admin
    createBuilding: async (buildingData) => {
        try {
            // Use FormData for multipart/form-data
            const formData = new FormData();
            Object.keys(buildingData).forEach(key => {
                if (buildingData[key] !== undefined && buildingData[key] !== null) {
                    if (key === 'facilities' || key === 'buildingManagers') {
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
                successMessage: 'Gedung berhasil dibuat'
            });

            return response;
        } catch (error) {
            console.error('API Error - createBuilding:', error);
            throw error;
        }
    },

    // PATCH /api/v1/buildings/admin/{id}
    updateBuilding: async (id, buildingData) => {
        try {
            console.log('=== API UPDATE BUILDING ===');
            console.log('Building ID:', id);
            console.log('Building data received:', buildingData);
            console.log('Facilities data:', buildingData.facilities);
            console.log('Building managers data:', buildingData.buildingManagers);

            // Use FormData for multipart/form-data
            const formData = new FormData();
            Object.keys(buildingData).forEach(key => {
                if (buildingData[key] !== undefined && buildingData[key] !== null) {
                    if (key === 'facilities' || key === 'buildingManagers') {
                        // Handle array fields - selalu kirim data array (baik kosong maupun berisi)
                        if (Array.isArray(buildingData[key])) {
                            console.log(`Adding ${key} to FormData:`, buildingData[key]);
                            formData.append(key, JSON.stringify(buildingData[key]));
                        } else if (buildingData[key]) {
                            console.log(`Adding ${key} to FormData (non-array):`, buildingData[key]);
                            formData.append(key, buildingData[key]);
                        } else {
                            // Kirim array kosong jika memang ingin mengosongkan
                            console.log(`Adding empty ${key} to FormData`);
                            formData.append(key, JSON.stringify([]));
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
                successMessage: 'Gedung berhasil diperbarui'
            });

            return response;
        } catch (error) {
            console.error('API Error - updateBuilding:', error);
            throw error;
        }
    },

    // DELETE /api/v1/buildings/admin/{id}
    deleteBuilding: async (id) => {
        try {
            const response = await apiClient.delete(`/buildings/admin/${id}`, {
                successMessage: 'Gedung berhasil dihapus'
            });

            return response;
        } catch (error) {
            console.error('API Error - deleteBuilding:', error);
            throw error;
        }
    }
}; 