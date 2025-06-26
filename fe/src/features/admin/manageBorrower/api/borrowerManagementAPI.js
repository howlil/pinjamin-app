import { apiClient } from '../../../../shared/services/apiClient';

/**
 * Admin Borrower Management API Functions
 * Note: These endpoints are not explicitly defined in swagger but are commonly needed
 * Base URL: /api/v1/users or similar
 */

export const borrowerManagementAPI = {
    // Placeholder functions - implement based on actual backend endpoints

    // Get all borrowers/users
    getBorrowers: async (params = {}) => {
        // This might be implemented as GET /api/v1/users or GET /api/v1/admin/users
        const response = await apiClient.get('/admin/users', { params });
        return response.data;
    },

    // Get borrower details
    getBorrowerById: async (id) => {
        const response = await apiClient.get(`/admin/users/${id}`);
        return response.data;
    },

    // Update borrower status or details
    updateBorrower: async (id, borrowerData) => {
        const response = await apiClient.patch(`/admin/users/${id}`, borrowerData);
        return response.data;
    },

    // Delete/deactivate borrower
    deleteBorrower: async (id) => {
        const response = await apiClient.delete(`/admin/users/${id}`);
        return response.data;
    }
}; 