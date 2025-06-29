import { apiClient } from '../../../../shared/services/apiClient';


export const adminBookingAPI = {

    getBookingHistory: async (params = {}) => {
        const response = await apiClient.get('/bookings/admin/history', { params });
        return response;
    },


    // POST /api/v1/bookings/admin/{id}/refund
    processRefund: async (id, refundData) => {
        const response = await apiClient.post(`/bookings/admin/${id}/refund`, refundData);
        return response.data;
    }
}; 