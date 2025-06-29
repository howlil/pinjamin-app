import { apiClient } from '@/shared/services/apiClient';

/**
 * Booking API Functions
 * Base URL: /api/v1/bookings
 */

export const bookingAPI = {
    // POST /api/v1/bookings - Create a new booking
    createBooking: async (bookingData) => {
        const formData = new FormData();

        // Append required fields
        formData.append('buildingId', bookingData.buildingId);
        formData.append('activityName', bookingData.activityName);
        formData.append('startDate', bookingData.startDate);
        formData.append('startTime', bookingData.startTime);
        formData.append('endTime', bookingData.endTime);

        // Append optional fields
        if (bookingData.endDate) {
            formData.append('endDate', bookingData.endDate);
        }

        // Append proposal letter file
        if (bookingData.proposalLetter) {
            formData.append('proposalLetter', bookingData.proposalLetter);
        }

        const response = await apiClient.post('/bookings', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            hideErrorToast: true
        });
        return response;
    },

    // GET /api/v1/bookings/history - Get booking history for authenticated user
    getBookingHistory: async (params = {}) => {
        const { status, page = 1, limit = 10 } = params;
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        });

        if (status) {
            queryParams.append('status', status);
        }

        const response = await apiClient.get(`/bookings/history?${queryParams}`);
        return response;
    },

    // POST /api/v1/bookings/{id}/payment - Process payment for a booking
    processPayment: async (bookingId) => {
        const response = await apiClient.post(`/bookings/${bookingId}/payment`);
        return response;
    },

    // GET /api/v1/bookings/{id}/invoice - Generate invoice for a booking
    generateInvoice: async (bookingId) => {
        const response = await apiClient.get(`/bookings/${bookingId}/invoice`);
        return response;
    },

    // GET /api/v1/bookings/today - Get today's bookings (public)
    getTodayBookings: async () => {
        const response = await apiClient.get('/bookings/today');
        return response;
    },

    // GET /api/v1/bookings/{id}/refund - Get refund details for a booking
    getRefundDetails: async (bookingId) => {
        const response = await apiClient.get(`/bookings/${bookingId}/refund`);
        return response;
    },

    // POST /api/v1/bookings/{id}/refund - Process refund for a booking (user)
    processRefund: async (bookingId, refundData) => {
        const response = await apiClient.post(`/bookings/${bookingId}/refund`, refundData);
        return response;
    }
}; 