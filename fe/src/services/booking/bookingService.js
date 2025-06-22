import { apiClient, withApiErrorHandling } from '../core/apiClient';


class BookingService {
    // Get today's bookings (public)
    async getTodayBookings() {
        console.log('=== GET TODAY\'S BOOKINGS ===');
        return apiClient.get('/api/v1/bookings/today');
    }

    // Create a new booking (user)
    async createBooking(bookingData) {
        console.log('=== CREATE BOOKING ===');
        console.log('Booking data:', bookingData);

        // Convert to FormData for multipart/form-data (proposal letter upload)
        const formData = new FormData();
        formData.append('buildingId', bookingData.buildingId);
        formData.append('activityName', bookingData.activityName);
        formData.append('startDate', bookingData.startDate);
        if (bookingData.endDate) formData.append('endDate', bookingData.endDate);
        formData.append('startTime', bookingData.startTime);
        formData.append('endTime', bookingData.endTime);
        if (bookingData.proposalLetter) formData.append('proposalLetter', bookingData.proposalLetter);

        return apiClient.uploadFile('/api/v1/bookings', formData);
    }

    // Get booking history for authenticated user
    async getUserBookingHistory(params = {}) {
        console.log('=== GET USER BOOKING HISTORY ===');
        console.log('Params:', params);
        return apiClient.getWithParams('/api/v1/bookings/history', params);
    }

    // Process payment for a booking
    async processPayment(bookingId) {
        console.log('=== PROCESS PAYMENT ===');
        console.log('Booking ID:', bookingId);
        return apiClient.post(`/api/v1/bookings/${bookingId}/payment`);
    }

    // Generate invoice for a booking
    async generateInvoice(bookingId) {
        console.log('=== GENERATE INVOICE ===');
        console.log('Booking ID:', bookingId);
        return apiClient.get(`/api/v1/bookings/${bookingId}/invoice`);
    }

    // Admin: Get pending bookings (PROCESSING status only)
    async getAdminBookings(params = {}) {
        console.log('=== GET ADMIN BOOKINGS ===');
        console.log('Params:', params);
        return apiClient.getWithParams('/api/v1/bookings/admin', params);
    }

    // Admin: Approve or reject a booking
    async updateBookingApproval(bookingId, bookingStatus, rejectionReason = null) {
        console.log('=== UPDATE BOOKING APPROVAL ===');
        console.log('Booking ID:', bookingId);
        console.log('Status:', bookingStatus);
        console.log('Rejection reason:', rejectionReason);

        const payload = { bookingStatus };
        if (rejectionReason) payload.rejectionReason = rejectionReason;

        return apiClient.patch(`/api/v1/bookings/${bookingId}/approval`, payload);
    }

    // Admin: Get booking history with filters
    async getAdminBookingHistory(params = {}) {
        console.log('=== GET ADMIN BOOKING HISTORY ===');
        console.log('Params:', params);
        return apiClient.getWithParams('/api/v1/bookings/admin/history', params);
    }

    // Admin: Process refund for a booking
    async processRefund(bookingId, refundData) {
        console.log('=== PROCESS BOOKING REFUND ===');
        console.log('Booking ID:', bookingId);
        console.log('Refund data:', refundData);
        return apiClient.post(`/api/v1/bookings/${bookingId}/refund`, refundData);
    }

    // Get booking statistics for dashboard
    async getBookingStats(params = {}) {
        console.log('=== GET BOOKING STATISTICS ===');
        console.log('Params:', params);
        return apiClient.getWithParams('/api/v1/dashboard/statistics/bookings', params);
    }

    // Legacy methods for backward compatibility
    async getBookings(params = {}) {
        // Redirect to admin bookings
        return this.getAdminBookings(params);
    }

    async updateBookingStatus(id, status, reason = null) {
        // Convert old status format to new approval format
        const statusMap = {
            'APPROVED': 'APPROVED',
            'REJECTED': 'REJECTED'
        };
        const bookingStatus = statusMap[status] || status;
        return this.updateBookingApproval(id, bookingStatus, reason);
    }
}

// Create service instance
const bookingService = new BookingService();

// Export wrapped methods with error handling
export const bookingApi = {
    getTodayBookings: withApiErrorHandling(bookingService.getTodayBookings.bind(bookingService)),
    createBooking: withApiErrorHandling(bookingService.createBooking.bind(bookingService)),
    getUserBookingHistory: withApiErrorHandling(bookingService.getUserBookingHistory.bind(bookingService)),
    processPayment: withApiErrorHandling(bookingService.processPayment.bind(bookingService)),
    generateInvoice: withApiErrorHandling(bookingService.generateInvoice.bind(bookingService)),
    getAdminBookings: withApiErrorHandling(bookingService.getAdminBookings.bind(bookingService)),
    updateBookingApproval: withApiErrorHandling(bookingService.updateBookingApproval.bind(bookingService)),
    getAdminBookingHistory: withApiErrorHandling(bookingService.getAdminBookingHistory.bind(bookingService)),
    processRefund: withApiErrorHandling(bookingService.processRefund.bind(bookingService)),
    getBookingStats: withApiErrorHandling(bookingService.getBookingStats.bind(bookingService)),

    // Legacy methods
    getBookings: withApiErrorHandling(bookingService.getBookings.bind(bookingService)),
    updateBookingStatus: withApiErrorHandling(bookingService.updateBookingStatus.bind(bookingService)),
};

export default bookingService; 