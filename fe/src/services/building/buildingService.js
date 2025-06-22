import { apiClient, withApiErrorHandling } from '../core/apiClient';

/**
 * Building Service
 * Handles all building-related API calls
 */
class BuildingService {
    // Get all buildings with search/filter/pagination (ADMIN)
    async getBuildings(params = {}) {
        console.log('=== GET BUILDINGS (ADMIN) ===');
        console.log('Params:', params);
        return apiClient.getWithParams('/api/v1/buildings/admin', params);
    }

    // Get all buildings with search/filter/pagination (PUBLIC)
    async getPublicBuildings(params = {}) {
        console.log('=== GET PUBLIC BUILDINGS ===');
        console.log('Params:', params);
        return apiClient.getWithParams('/api/v1/buildings', params);
    }

    // Get single building by ID
    async getBuildingById(id) {
        console.log('=== GET BUILDING BY ID ===');
        console.log('Building ID:', id);
        return apiClient.get(`/api/v1/buildings/${id}`);
    }

    // Check building availability
    async checkAvailability(availabilityData) {
        console.log('=== CHECK BUILDING AVAILABILITY ===');
        console.log('Availability data:', availabilityData);
        return apiClient.post('/api/v1/buildings/check-availability', availabilityData);
    }

    // Create new building (ADMIN)
    async createBuilding(buildingData) {
        console.log('=== CREATE BUILDING ===');

        // Check if we have an image - use different approach based on this
        if (buildingData.image) {
            return this._createBuildingWithImage(buildingData);
        } else {
            return this._createBuildingWithoutImage(buildingData);
        }
    }

    // Helper: Create building with image
    async _createBuildingWithImage(buildingData) {
        const formData = new FormData();

        // Required fields
        formData.append('buildingName', buildingData.buildingName || '');
        formData.append('description', buildingData.description || '');
        formData.append('rentalPrice', String(buildingData.rentalPrice || 0));
        formData.append('capacity', String(buildingData.capacity || 0));
        formData.append('location', buildingData.location || '');
        formData.append('buildingType', buildingData.buildingType || '');

        // Handle arrays as JSON strings
        const facilityIds = Array.isArray(buildingData.facilityIds) ? buildingData.facilityIds : [];
        const buildingManagerIds = Array.isArray(buildingData.buildingManagerIds) ? buildingData.buildingManagerIds : [];

        formData.append('facilityIds', JSON.stringify(facilityIds));
        formData.append('buildingManagerIds', JSON.stringify(buildingManagerIds));
        formData.append('image', buildingData.image);

        console.log('Using FormData with image');
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`  ${key}: [File] ${value.name}`);
            } else {
                console.log(`  ${key}: ${value}`);
            }
        }

        return apiClient.uploadFile('/api/v1/buildings/admin', formData);
    }

    // Helper: Create building without image
    async _createBuildingWithoutImage(buildingData) {
        const payload = {
            buildingName: buildingData.buildingName || '',
            description: buildingData.description || '',
            rentalPrice: parseInt(buildingData.rentalPrice) || 0,
            capacity: parseInt(buildingData.capacity) || 0,
            location: buildingData.location || '',
            buildingType: buildingData.buildingType || '',
            facilityIds: Array.isArray(buildingData.facilityIds) ? buildingData.facilityIds : [],
            buildingManagerIds: Array.isArray(buildingData.buildingManagerIds) ? buildingData.buildingManagerIds : []
        };

        console.log('Using JSON payload');
        console.log('Payload:', JSON.stringify(payload, null, 2));

        return apiClient.post('/api/v1/buildings/admin', payload);
    }

    // Update building (ADMIN)
    async updateBuilding(id, buildingData) {
        console.log('=== UPDATE BUILDING ===');
        console.log('Building ID:', id);

        // Convert to FormData for multipart/form-data
        const formData = new FormData();

        // Only append fields that are provided
        Object.entries(buildingData).forEach(([key, value]) => {
            if (value !== undefined) {
                if (key === 'facilityIds' || key === 'buildingManagerIds') {
                    const arrayValue = Array.isArray(value) ? value : [];
                    formData.append(key, JSON.stringify(arrayValue));
                    console.log(`Update - ${key}:`, arrayValue);
                } else if (key === 'image' && value instanceof File) {
                    formData.append(key, value);
                } else if (key !== 'image') {
                    formData.append(key, String(value));
                }
            }
        });

        // Use PATCH method for admin update
        const headers = {};
        const token = apiClient.getAuthToken();
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${apiClient.baseURL}/api/v1/buildings/admin/${id}`, {
            method: 'PATCH',
            headers,
            body: formData,
        });

        return apiClient.handleResponse(response);
    }

    // Delete building (ADMIN)
    async deleteBuilding(id) {
        console.log('=== DELETE BUILDING ===');
        console.log('Building ID:', id);
        return apiClient.delete(`/api/v1/buildings/admin/${id}`);
    }

    // Get building types (for filter dropdown)
    async getBuildingTypes() {
        console.log('=== GET BUILDING TYPES ===');
        return apiClient.get('/api/v1/buildings/types');
    }

    // Upload building photo
    async uploadBuildingPhoto(buildingId, formData) {
        console.log('=== UPLOAD BUILDING PHOTO ===');
        console.log('Building ID:', buildingId);
        return apiClient.uploadFile(`/api/v1/buildings/${buildingId}/photo`, formData);
    }

    // Get building schedule for calendar
    async getBuildingSchedule(params = {}) {
        console.log('=== GET BUILDING SCHEDULE ===');
        console.log('Params:', params);
        return apiClient.getWithParams('/api/v1/buildings/schedule', params);
    }
}

// Create service instance
const buildingService = new BuildingService();

// Export wrapped methods with error handling
export const buildingApi = {
    getBuildings: withApiErrorHandling(buildingService.getBuildings.bind(buildingService)),
    getPublicBuildings: withApiErrorHandling(buildingService.getPublicBuildings.bind(buildingService)),
    getBuildingById: withApiErrorHandling(buildingService.getBuildingById.bind(buildingService)),
    checkAvailability: withApiErrorHandling(buildingService.checkAvailability.bind(buildingService)),
    createBuilding: withApiErrorHandling(buildingService.createBuilding.bind(buildingService)),
    updateBuilding: withApiErrorHandling(buildingService.updateBuilding.bind(buildingService)),
    deleteBuilding: withApiErrorHandling(buildingService.deleteBuilding.bind(buildingService)),
    getBuildingTypes: withApiErrorHandling(buildingService.getBuildingTypes.bind(buildingService)),
    uploadBuildingPhoto: withApiErrorHandling(buildingService.uploadBuildingPhoto.bind(buildingService)),
    getBuildingSchedule: withApiErrorHandling(buildingService.getBuildingSchedule.bind(buildingService)),
};

export default buildingService; 