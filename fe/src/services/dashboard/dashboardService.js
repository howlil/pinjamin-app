import { apiClient } from '../core/apiClient';

// Dashboard API methods
export const dashboardApi = {
    getBookingStatistics: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.month) queryParams.append('month', params.month);
        if (params.year) queryParams.append('year', params.year);
        const queryString = queryParams.toString();
        return apiClient.get(`/api/v1/dashboard/statistics/bookings${queryString ? `?${queryString}` : ''}`);
    },
    getTransactionStatistics: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.month) queryParams.append('month', params.month);
        if (params.year) queryParams.append('year', params.year);
        const queryString = queryParams.toString();
        return apiClient.get(`/api/v1/dashboard/statistics/transactions${queryString ? `?${queryString}` : ''}`);
    },
};

export default dashboardApi; 