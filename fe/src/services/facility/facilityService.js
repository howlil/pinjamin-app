import { apiClient } from '../core/apiClient';

// Facility API methods
export const facilityApi = {
    // Get all facilities with search/pagination
    getFacilities: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append('search', params.search);
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        const queryString = queryParams.toString();

        console.log('=== GET FACILITIES ===');
        console.log('Params:', params);
        console.log('Query string:', queryString);

        return apiClient.get(`/api/v1/facilities${queryString ? `?${queryString}` : ''}`);
    },

    // Get single facility by ID
    getFacilityById: (id) => {
        console.log('=== GET FACILITY BY ID ===');
        console.log('Facility ID:', id);
        return apiClient.get(`/api/v1/facilities/${id}`);
    },

    // Create new facility (requires admin authentication)
    createFacility: (facilityData) => {
        console.log('=== CREATE FACILITY ===');
        console.log('Facility data:', facilityData);

        // Validate required fields
        if (!facilityData.facilityName || facilityData.facilityName.trim().length < 2) {
            throw new Error('Nama fasilitas harus diisi minimal 2 karakter');
        }

        const payload = {
            facilityName: facilityData.facilityName.trim(),
            ...(facilityData.iconUrl && { iconUrl: facilityData.iconUrl.trim() })
        };

        console.log('Payload:', payload);
        return apiClient.post('/api/v1/facilities', payload);
    },

    // Update facility (requires admin authentication)
    updateFacility: (id, facilityData) => {
        console.log('=== UPDATE FACILITY ===');
        console.log('Facility ID:', id);
        console.log('Facility data:', facilityData);

        // Validate required fields if provided
        if (facilityData.facilityName !== undefined && facilityData.facilityName.trim().length < 2) {
            throw new Error('Nama fasilitas harus diisi minimal 2 karakter');
        }

        const payload = {};
        if (facilityData.facilityName !== undefined) {
            payload.facilityName = facilityData.facilityName.trim();
        }
        if (facilityData.iconUrl !== undefined) {
            payload.iconUrl = facilityData.iconUrl.trim();
        }

        console.log('Update payload:', payload);
        return apiClient.patch(`/api/v1/facilities/${id}`, payload);
    },

    // Delete facility (requires admin authentication)
    deleteFacility: (id) => {
        console.log('=== DELETE FACILITY ===');
        console.log('Facility ID:', id);
        return apiClient.delete(`/api/v1/facilities/${id}`);
    },

    // Get available icons (optional endpoint)
    getAvailableIcons: () => {
        console.log('=== GET AVAILABLE ICONS ===');
        return apiClient.get('/api/v1/facilities/icons').catch((error) => {
            console.log('Icons endpoint not available:', error.message);
            return { data: [] };
        });
    }
};

export default facilityApi; 