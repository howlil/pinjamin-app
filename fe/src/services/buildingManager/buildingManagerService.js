import { apiClient } from '../core/apiClient';

// Building Manager API methods
export const buildingManagerApi = {
    // Get all building managers with pagination
    getBuildingManagers: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.buildingId) queryParams.append('buildingId', params.buildingId);
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        const queryString = queryParams.toString();

        console.log('=== GET BUILDING MANAGERS ===');
        console.log('Params:', params);
        console.log('Query string:', queryString);

        return apiClient.get(`/api/v1/building-managers${queryString ? `?${queryString}` : ''}`);
    },

    // Get available building managers (not assigned to any building)
    getAvailableBuildingManagers: () => {
        console.log('=== GET AVAILABLE BUILDING MANAGERS ===');
        return apiClient.get('/api/v1/building-managers/available');
    },

    // Create new building manager (requires admin authentication)
    createBuildingManager: (managerData) => {
        console.log('=== CREATE BUILDING MANAGER ===');
        console.log('Manager data:', managerData);

        // Validate required fields
        if (!managerData.managerName || managerData.managerName.trim().length < 2) {
            throw new Error('Nama pengelola harus diisi minimal 2 karakter');
        }

        if (!managerData.phoneNumber || managerData.phoneNumber.trim().length < 10) {
            throw new Error('Nomor telepon harus diisi minimal 10 karakter');
        }

        const payload = {
            managerName: managerData.managerName.trim(),
            phoneNumber: managerData.phoneNumber.trim(),
            ...(managerData.buildingId && { buildingId: managerData.buildingId })
        };

        console.log('Payload:', payload);
        return apiClient.post('/api/v1/building-managers', payload);
    },

    // Update building manager (requires admin authentication)
    updateBuildingManager: (id, managerData) => {
        console.log('=== UPDATE BUILDING MANAGER ===');
        console.log('Manager ID:', id);
        console.log('Manager data:', managerData);

        // Validate required fields if provided
        if (managerData.managerName !== undefined && managerData.managerName.trim().length < 2) {
            throw new Error('Nama pengelola harus diisi minimal 2 karakter');
        }

        if (managerData.phoneNumber !== undefined && managerData.phoneNumber.trim().length < 10) {
            throw new Error('Nomor telepon harus diisi minimal 10 karakter');
        }

        const payload = {};
        if (managerData.managerName !== undefined) {
            payload.managerName = managerData.managerName.trim();
        }
        if (managerData.phoneNumber !== undefined) {
            payload.phoneNumber = managerData.phoneNumber.trim();
        }
        if (managerData.buildingId !== undefined) {
            payload.buildingId = managerData.buildingId;
        }

        console.log('Update payload:', payload);
        return apiClient.patch(`/api/v1/building-managers/${id}`, payload);
    },

    // Delete building manager (requires admin authentication)
    deleteBuildingManager: (id) => {
        console.log('=== DELETE BUILDING MANAGER ===');
        console.log('Manager ID:', id);
        return apiClient.delete(`/api/v1/building-managers/${id}`);
    },

    // Assign building manager to building (requires admin authentication)
    assignBuildingManager: (assignmentData) => {
        console.log('=== ASSIGN BUILDING MANAGER ===');
        console.log('Assignment data:', assignmentData);

        // Validate required fields
        if (!assignmentData.managerId || !assignmentData.buildingId) {
            throw new Error('Manager ID dan Building ID harus diisi');
        }

        const payload = {
            managerId: assignmentData.managerId,
            buildingId: assignmentData.buildingId
        };

        console.log('Assignment payload:', payload);
        return apiClient.post('/api/v1/building-managers/assign', payload);
    }
};

export default buildingManagerApi; 