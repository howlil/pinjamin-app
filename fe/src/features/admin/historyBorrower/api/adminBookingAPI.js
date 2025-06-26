import { apiClient } from '../../../../shared/services/apiClient';

/**
 * Admin Booking Management API Functions
 * Base URL: /api/v1/bookings
 */

export const adminBookingAPI = {
    // GET /api/v1/bookings/admin
    getPendingBookings: async (params = {}) => {
        const response = await apiClient.get('/bookings/admin', { params });
        return response.data;
    },

    // GET /api/v1/bookings/admin/history
    getBookingHistory: async (params = {}) => {
        const response = await apiClient.get('/bookings/admin/history', { params });
        return response.data;
    },

    // PATCH /api/v1/bookings/{id}/approval
    approveOrRejectBooking: async (id, approvalData) => {
        const response = await apiClient.patch(`/bookings/${id}/approval`, approvalData);
        return response.data;
    },

    // POST /api/v1/bookings/{id}/refund
    processRefund: async (id, refundData) => {
        const response = await apiClient.post(`/bookings/${id}/refund`, refundData);
        return response.data;
    }
}; 