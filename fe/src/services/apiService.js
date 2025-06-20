import { useAuthStore } from '../utils/store';
import { showToast } from '../utils/helpers';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ApiService {
    constructor(baseURL = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    getAuthToken() {
        const { token } = useAuthStore.getState();
        return token;
    }

    createHeaders(customHeaders = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...customHeaders,
        };

        const token = this.getAuthToken();
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        return headers;
    }

    async handleResponse(response) {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
            error.status = response.status;
            error.data = errorData;

            // Handle 401 Unauthorized
            if (response.status === 401) {
                const { logout } = useAuthStore.getState();
                logout();
                showToast.error('Sesi Anda telah berakhir. Silakan login kembali.');
                window.location.href = '/login';
            }

            throw error;
        }

        return response.json();
    }

    // GET request
    async get(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'GET',
                headers: this.createHeaders(options.headers),
                ...options,
            });

            return this.handleResponse(response);
        } catch (error) {
            console.error('GET request failed:', error);
            throw error;
        }
    }

    // POST request
    async post(endpoint, data = null, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: this.createHeaders(options.headers),
                body: data ? JSON.stringify(data) : null,
                ...options,
            });

            return this.handleResponse(response);
        } catch (error) {
            console.error('POST request failed:', error);
            throw error;
        }
    }

    // PUT request
    async put(endpoint, data = null, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'PUT',
                headers: this.createHeaders(options.headers),
                body: data ? JSON.stringify(data) : null,
                ...options,
            });

            return this.handleResponse(response);
        } catch (error) {
            console.error('PUT request failed:', error);
            throw error;
        }
    }

    // DELETE request
    async delete(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'DELETE',
                headers: this.createHeaders(options.headers),
                ...options,
            });

            return this.handleResponse(response);
        } catch (error) {
            console.error('DELETE request failed:', error);
            throw error;
        }
    }

    // Upload file
    async uploadFile(endpoint, formData, options = {}) {
        try {
            const headers = { ...options.headers };
            const token = this.getAuthToken();
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers,
                body: formData,
                ...options,
            });

            return this.handleResponse(response);
        } catch (error) {
            console.error('File upload failed:', error);
            throw error;
        }
    }
}

// Create singleton instance
const apiService = new ApiService();

// Auth API methods
export const authApi = {
    login: (credentials) => apiService.post('/api/v1/auth/login', credentials),
    register: (userData) => apiService.post('/api/v1/auth/register', userData),
    logout: () => apiService.post('/api/v1/auth/logout'),
    refreshToken: () => apiService.post('/api/v1/auth/refresh'),
    forgotPassword: (email) => apiService.post('/api/v1/auth/forgot-password', { email }),
    resetPassword: (token, password) => apiService.post('/api/v1/auth/reset-password', { token, password }),
};

// User API methods  
export const userApi = {
    getProfile: () => apiService.get('/user/profile'),
    updateProfile: (userData) => apiService.put('/user/profile', userData),
    changePassword: (passwords) => apiService.put('/user/change-password', passwords),
    uploadAvatar: (formData) => apiService.uploadFile('/user/avatar', formData),
};

// Dashboard API methods
export const dashboardApi = {
    getBookingStatistics: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.month) queryParams.append('month', params.month);
        if (params.year) queryParams.append('year', params.year);
        const queryString = queryParams.toString();
        return apiService.get(`/api/v1/dashboard/statistics/bookings${queryString ? `?${queryString}` : ''}`);
    },
    getTransactionStatistics: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.month) queryParams.append('month', params.month);
        if (params.year) queryParams.append('year', params.year);
        const queryString = queryParams.toString();
        return apiService.get(`/api/v1/dashboard/statistics/transactions${queryString ? `?${queryString}` : ''}`);
    },
};

// Building API methods
export const buildingApi = {
    // Get all buildings with search/filter/pagination (ADMIN)
    getBuildings: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append('search', params.search);
        if (params.buildingType) queryParams.append('buildingType', params.buildingType);
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        const queryString = queryParams.toString();
        return apiService.get(`/api/v1/buildings/admin${queryString ? `?${queryString}` : ''}`);
    },

    // Get all buildings with search/filter/pagination (PUBLIC)
    getPublicBuildings: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append('search', params.search);
        if (params.buildingType) queryParams.append('buildingType', params.buildingType);
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        const queryString = queryParams.toString();
        return apiService.get(`/api/v1/buildings${queryString ? `?${queryString}` : ''}`);
    },

    // Get single building by ID
    getBuildingById: (id) => apiService.get(`/api/v1/buildings/${id}`),

    // Create new building
    createBuilding: (buildingData) => apiService.post('/api/v1/buildings', buildingData),

    // Update building
    updateBuilding: (id, buildingData) => apiService.put(`/api/v1/buildings/${id}`, buildingData),

    // Delete building
    deleteBuilding: (id) => apiService.delete(`/api/v1/buildings/${id}`),

    // Get building types (for filter dropdown)
    getBuildingTypes: () => apiService.get('/api/v1/buildings/types'),

    // Upload building photo
    uploadBuildingPhoto: (buildingId, formData) =>
        apiService.uploadFile(`/api/v1/buildings/${buildingId}/photo`, formData),
};

// Booking API methods
export const bookingApi = {
    // Get all bookings with filter/pagination for admin
    getBookings: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.status) queryParams.append('status', params.status);
        if (params.search) queryParams.append('search', params.search);
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        const queryString = queryParams.toString();
        return apiService.get(`/api/v1/bookings/admin${queryString ? `?${queryString}` : ''}`);
    },

    // Get single booking by ID
    getBookingById: (id) => apiService.get(`/api/v1/bookings/${id}`),

    // Update booking status (approve/reject)
    updateBookingStatus: (id, status, reason = null) =>
        apiService.put(`/api/v1/bookings/${id}/status`, { status, reason }),

    // Create new booking (admin can create bookings)
    createBooking: (bookingData) => apiService.post('/api/v1/bookings', bookingData),

    // Update booking details
    updateBooking: (id, bookingData) => apiService.put(`/api/v1/bookings/${id}`, bookingData),

    // Delete booking
    deleteBooking: (id) => apiService.delete(`/api/v1/bookings/${id}`),

    // Get booking statistics
    getBookingStats: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.period) queryParams.append('period', params.period);
        if (params.year) queryParams.append('year', params.year);
        if (params.month) queryParams.append('month', params.month);
        const queryString = queryParams.toString();
        return apiService.get(`/api/v1/bookings/statistics${queryString ? `?${queryString}` : ''}`);
    },

    // Export bookings data
    exportBookings: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.status) queryParams.append('status', params.status);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.format) queryParams.append('format', params.format);
        const queryString = queryParams.toString();
        return apiService.get(`/api/v1/bookings/export${queryString ? `?${queryString}` : ''}`);
    }
};

// Transaction API methods
export const transactionApi = {
    // Get all transactions with filter/pagination for admin
    getTransactions: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus);
        if (params.paymentMethod) queryParams.append('paymentMethod', params.paymentMethod);
        if (params.search) queryParams.append('search', params.search);
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        const queryString = queryParams.toString();
        return apiService.get(`/api/v1/transactions/admin${queryString ? `?${queryString}` : ''}`);
    },

    // Get single transaction by ID
    getTransactionById: (id) => apiService.get(`/api/v1/transactions/${id}`),

    // Update transaction status
    updateTransactionStatus: (id, status, notes = null) =>
        apiService.put(`/api/v1/transactions/${id}/status`, { status, notes }),

    // Create manual transaction (admin)
    createTransaction: (transactionData) => apiService.post('/api/v1/transactions', transactionData),

    // Update transaction details
    updateTransaction: (id, transactionData) => apiService.put(`/api/v1/transactions/${id}`, transactionData),

    // Delete transaction
    deleteTransaction: (id) => apiService.delete(`/api/v1/transactions/${id}`),

    // Get transaction statistics
    getTransactionStats: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.period) queryParams.append('period', params.period);
        if (params.year) queryParams.append('year', params.year);
        if (params.month) queryParams.append('month', params.month);
        const queryString = queryParams.toString();
        return apiService.get(`/api/v1/transactions/statistics${queryString ? `?${queryString}` : ''}`);
    },

    // Export transactions data
    exportTransactions: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus);
        if (params.paymentMethod) queryParams.append('paymentMethod', params.paymentMethod);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.format) queryParams.append('format', params.format);
        const queryString = queryParams.toString();
        return apiService.get(`/api/v1/transactions/export${queryString ? `?${queryString}` : ''}`);
    },

    // Send payment reminder
    sendPaymentReminder: (id) => apiService.post(`/api/v1/transactions/${id}/reminder`),

    // Process refund
    processRefund: (id, refundData) => apiService.post(`/api/v1/transactions/${id}/refund`, refundData)
};

// Facility API methods
export const facilityApi = {
    // Get all facilities with search/pagination
    getFacilities: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append('search', params.search);
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        const queryString = queryParams.toString();
        return apiService.get(`/api/v1/facilities${queryString ? `?${queryString}` : ''}`);
    },

    // Get single facility by ID
    getFacilityById: (id) => apiService.get(`/api/v1/facilities/${id}`),

    // Create new facility
    createFacility: (facilityData) => apiService.post('/api/v1/facilities', facilityData),

    // Update facility
    updateFacility: (id, facilityData) => apiService.patch(`/api/v1/facilities/${id}`, facilityData),

    // Delete facility
    deleteFacility: (id) => apiService.delete(`/api/v1/facilities/${id}`),

    // Get available icons (if endpoint exists)
    getAvailableIcons: () => apiService.get('/api/v1/facilities/icons').catch(() => ({ data: [] }))
};

// Higher order function for API calls with error handling
export const withApiErrorHandling = (apiCall) => {
    return async (...args) => {
        try {
            const result = await apiCall(...args);
            return result;
        } catch (error) {
            // Handle specific error types
            if (error.status === 400) {
                showToast.error(error.data.message || 'Data yang dikirim tidak valid');
            } else if (error.status === 403) {
                showToast.error('Anda tidak memiliki akses untuk melakukan tindakan ini');
            } else if (error.status === 404) {
                showToast.error('Data tidak ditemukan');
            } else if (error.status === 500) {
                showToast.error('Terjadi kesalahan pada server');
            } else {
                showToast.error(error.message || 'Terjadi kesalahan');
            }
            throw error;
        }
    };
};

export default apiService; 