import { apiClient } from '../../../../shared/services/apiClient';

/**
 * Admin Borrower Management API Functions
 * Based on swagger.yml endpoints for admin booking management
 */

export const borrowerManagementAPI = {
    // Get pending bookings (PROCESSING status only) with pagination
    getPendingBookings: async (params = {}) => {
        const response = await apiClient.get('/bookings/admin/list', { params });
        console.log(response);
        return response;
    },

    // Approve or reject a booking
    updateBookingApproval: async (bookingId, approvalData) => {
        const response = await apiClient.patch(`/bookings/admin/${bookingId}/approval`, approvalData);
        return response.data;
    },


}; 