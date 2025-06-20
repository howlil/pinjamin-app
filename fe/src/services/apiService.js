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
    getProfile: () => {
        console.log('=== GET USER PROFILE ===');
        return apiService.get('/api/v1/auth/profile');
    },
    updateProfile: (userData) => {
        console.log('=== UPDATE USER PROFILE ===');
        console.log('Profile data:', userData);
        return apiService.patch('/api/v1/auth/profile', userData);
    },
    changePassword: (passwords) => {
        console.log('=== CHANGE PASSWORD ===');
        console.log('Password change request');
        return apiService.post('/api/v1/auth/change-password', passwords);
    },
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

    // Check building availability
    checkAvailability: (availabilityData) => {
        return apiService.post('/api/v1/buildings/check-availability', availabilityData);
    },

    // Get single building by ID
    getBuildingById: (id) => apiService.get(`/api/v1/buildings/${id}`),

    // Create new building (ADMIN)
    createBuilding: (buildingData) => {
        // Check if we have an image - use different approach based on this
        if (buildingData.image) {
            // Use FormData for multipart/form-data when image is present
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

            console.log('=== CREATE BUILDING (WITH IMAGE) ===');
            console.log('Using FormData with image');
            for (let [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`  ${key}: [File] ${value.name}`);
                } else {
                    console.log(`  ${key}: ${value}`);
                }
            }

            return apiService.uploadFile('/api/v1/buildings/admin', formData);
        } else {
            // Use JSON payload when no image
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

            console.log('=== CREATE BUILDING (NO IMAGE) ===');
            console.log('Using JSON payload');
            console.log('Payload:', JSON.stringify(payload, null, 2));
            console.log('facilityIds type:', typeof payload.facilityIds, 'isArray:', Array.isArray(payload.facilityIds));
            console.log('buildingManagerIds type:', typeof payload.buildingManagerIds, 'isArray:', Array.isArray(payload.buildingManagerIds));

            return apiService.post('/api/v1/buildings/admin', payload);
        }
    },

    // Update building (ADMIN)
    updateBuilding: (id, buildingData) => {
        // Convert to FormData for multipart/form-data
        const formData = new FormData();

        // Only append fields that are provided
        if (buildingData.buildingName !== undefined) {
            formData.append('buildingName', buildingData.buildingName);
        }
        if (buildingData.description !== undefined) {
            formData.append('description', buildingData.description);
        }
        if (buildingData.rentalPrice !== undefined) {
            formData.append('rentalPrice', buildingData.rentalPrice);
        }
        if (buildingData.capacity !== undefined) {
            formData.append('capacity', buildingData.capacity);
        }
        if (buildingData.location !== undefined) {
            formData.append('location', buildingData.location);
        }
        if (buildingData.buildingType !== undefined) {
            formData.append('buildingType', buildingData.buildingType);
        }
        if (buildingData.image) {
            formData.append('image', buildingData.image);
        }

        // Handle arrays - always send as JSON string arrays if provided
        if (buildingData.facilityIds !== undefined) {
            const facilityIds = Array.isArray(buildingData.facilityIds) ? buildingData.facilityIds : [];
            formData.append('facilityIds', JSON.stringify(facilityIds));
            console.log('Update - facilityIds:', facilityIds, 'JSON:', JSON.stringify(facilityIds));
        }

        if (buildingData.buildingManagerIds !== undefined) {
            const buildingManagerIds = Array.isArray(buildingData.buildingManagerIds) ? buildingData.buildingManagerIds : [];
            formData.append('buildingManagerIds', JSON.stringify(buildingManagerIds));
            console.log('Update - buildingManagerIds:', buildingManagerIds, 'JSON:', JSON.stringify(buildingManagerIds));
        }

        // Use PATCH method for admin update
        const headers = {};
        const token = apiService.getAuthToken();
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        return fetch(`${apiService.baseURL}/api/v1/buildings/admin/${id}`, {
            method: 'PATCH',
            headers,
            body: formData,
        }).then(response => apiService.handleResponse(response));
    },

    // Delete building (ADMIN)
    deleteBuilding: (id) => apiService.delete(`/api/v1/buildings/admin/${id}`),

    // Get building types (for filter dropdown)
    getBuildingTypes: () => apiService.get('/api/v1/buildings/types'),

    // Upload building photo
    uploadBuildingPhoto: (buildingId, formData) =>
        apiService.uploadFile(`/api/v1/buildings/${buildingId}/photo`, formData),

    // Get building schedule for calendar
    getBuildingSchedule: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.month) queryParams.append('month', params.month);
        if (params.year) queryParams.append('year', params.year);
        const queryString = queryParams.toString();
        return apiService.get(`/api/v1/buildings/schedule${queryString ? `?${queryString}` : ''}`);
    },
};

// Booking API methods
export const bookingApi = {
    // Get today's bookings (public)
    getTodayBookings: () => {
        console.log('=== GET TODAY\'S BOOKINGS ===');
        return apiService.get('/api/v1/bookings/today');
    },

    // Create a new booking (user)
    createBooking: (bookingData) => {
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

        return apiService.uploadFile('/api/v1/bookings', formData);
    },

    // Get booking history for authenticated user
    getUserBookingHistory: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.status) queryParams.append('status', params.status);
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        const queryString = queryParams.toString();

        console.log('=== GET USER BOOKING HISTORY ===');
        console.log('Params:', params);
        console.log('Query string:', queryString);

        return apiService.get(`/api/v1/bookings/history${queryString ? `?${queryString}` : ''}`);
    },

    // Process payment for a booking
    processPayment: (bookingId) => {
        console.log('=== PROCESS PAYMENT ===');
        console.log('Booking ID:', bookingId);
        return apiService.post(`/api/v1/bookings/${bookingId}/payment`);
    },

    // Generate invoice for a booking
    generateInvoice: (bookingId) => {
        console.log('=== GENERATE INVOICE ===');
        console.log('Booking ID:', bookingId);
        return apiService.get(`/api/v1/bookings/${bookingId}/invoice`);
    },

    // Admin: Get pending bookings (PROCESSING status only)
    getAdminBookings: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        const queryString = queryParams.toString();

        console.log('=== GET ADMIN BOOKINGS ===');
        console.log('Params:', params);
        console.log('Query string:', queryString);

        return apiService.get(`/api/v1/bookings/admin${queryString ? `?${queryString}` : ''}`);
    },

    // Admin: Approve or reject a booking
    updateBookingApproval: (bookingId, bookingStatus, rejectionReason = null) => {
        console.log('=== UPDATE BOOKING APPROVAL ===');
        console.log('Booking ID:', bookingId);
        console.log('Status:', bookingStatus);
        console.log('Rejection reason:', rejectionReason);

        const payload = { bookingStatus };
        if (rejectionReason) payload.rejectionReason = rejectionReason;

        return apiService.patch(`/api/v1/bookings/${bookingId}/approval`, payload);
    },

    // Admin: Get booking history with filters
    getAdminBookingHistory: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.buildingId) queryParams.append('buildingId', params.buildingId);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        const queryString = queryParams.toString();

        console.log('=== GET ADMIN BOOKING HISTORY ===');
        console.log('Params:', params);
        console.log('Query string:', queryString);

        return apiService.get(`/api/v1/bookings/admin/history${queryString ? `?${queryString}` : ''}`);
    },

    // Admin: Process refund for a booking
    processRefund: (bookingId, refundData) => {
        console.log('=== PROCESS BOOKING REFUND ===');
        console.log('Booking ID:', bookingId);
        console.log('Refund data:', refundData);

        return apiService.post(`/api/v1/bookings/${bookingId}/refund`, refundData);
    },

    // Get booking statistics for dashboard
    getBookingStats: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.month) queryParams.append('month', params.month);
        if (params.year) queryParams.append('year', params.year);
        const queryString = queryParams.toString();

        console.log('=== GET BOOKING STATISTICS ===');
        console.log('Params:', params);
        console.log('Query string:', queryString);

        return apiService.get(`/api/v1/dashboard/statistics/bookings${queryString ? `?${queryString}` : ''}`);
    },

    // Legacy methods for backward compatibility
    getBookings: (params = {}) => {
        // Redirect to admin bookings
        return bookingApi.getAdminBookings(params);
    },

    updateBookingStatus: (id, status, reason = null) => {
        // Convert old status format to new approval format
        const statusMap = {
            'APPROVED': 'APPROVED',
            'REJECTED': 'REJECTED'
        };
        const bookingStatus = statusMap[status] || status;
        return bookingApi.updateBookingApproval(id, bookingStatus, reason);
    }
};

// Transaction API methods
export const transactionApi = {
    // Get all transactions with filter/pagination for admin
    getTransactions: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        const queryString = queryParams.toString();

        console.log('=== GET ADMIN TRANSACTIONS ===');
        console.log('Params:', params);
        console.log('Query string:', queryString);

        return apiService.get(`/api/v1/transactions/admin${queryString ? `?${queryString}` : ''}`);
    },

    // Get user transaction history
    getUserTransactionHistory: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        const queryString = queryParams.toString();

        console.log('=== GET USER TRANSACTION HISTORY ===');
        console.log('Params:', params);
        console.log('Query string:', queryString);

        return apiService.get(`/api/v1/transactions/history${queryString ? `?${queryString}` : ''}`);
    },

    // Export transactions to Excel (Admin)
    exportTransactions: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.month) queryParams.append('month', params.month);
        if (params.year) queryParams.append('year', params.year);
        const queryString = queryParams.toString();

        console.log('=== EXPORT TRANSACTIONS ===');
        console.log('Params:', params);
        console.log('Query string:', queryString);

        return apiService.get(`/api/v1/transactions/admin/export${queryString ? `?${queryString}` : ''}`);
    },

    // Get single transaction by ID
    getTransactionById: (id) => {
        console.log('=== GET TRANSACTION BY ID ===');
        console.log('Transaction ID:', id);
        return apiService.get(`/api/v1/transactions/${id}`);
    },

    // Update transaction status
    updateTransactionStatus: (id, status, notes = null) => {
        console.log('=== UPDATE TRANSACTION STATUS ===');
        console.log('Transaction ID:', id);
        console.log('Status:', status);
        console.log('Notes:', notes);
        return apiService.put(`/api/v1/transactions/${id}/status`, { status, notes });
    },

    // Create manual transaction (admin)
    createTransaction: (transactionData) => {
        console.log('=== CREATE TRANSACTION ===');
        console.log('Transaction data:', transactionData);
        return apiService.post('/api/v1/transactions', transactionData);
    },

    // Update transaction details
    updateTransaction: (id, transactionData) => {
        console.log('=== UPDATE TRANSACTION ===');
        console.log('Transaction ID:', id);
        console.log('Transaction data:', transactionData);
        return apiService.put(`/api/v1/transactions/${id}`, transactionData);
    },

    // Delete transaction
    deleteTransaction: (id) => {
        console.log('=== DELETE TRANSACTION ===');
        console.log('Transaction ID:', id);
        return apiService.delete(`/api/v1/transactions/${id}`);
    },

    // Get transaction statistics for dashboard
    getTransactionStats: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.month) queryParams.append('month', params.month);
        if (params.year) queryParams.append('year', params.year);
        const queryString = queryParams.toString();

        console.log('=== GET TRANSACTION STATISTICS ===');
        console.log('Params:', params);
        console.log('Query string:', queryString);

        return apiService.get(`/api/v1/dashboard/statistics/transactions${queryString ? `?${queryString}` : ''}`);
    },

    // Send payment reminder
    sendPaymentReminder: (id) => {
        console.log('=== SEND PAYMENT REMINDER ===');
        console.log('Transaction ID:', id);
        return apiService.post(`/api/v1/transactions/${id}/reminder`);
    },

    // Process refund
    processRefund: (id, refundData) => {
        console.log('=== PROCESS REFUND ===');
        console.log('Transaction ID:', id);
        console.log('Refund data:', refundData);
        return apiService.post(`/api/v1/transactions/${id}/refund`, refundData);
    }
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

        console.log('=== GET FACILITIES ===');
        console.log('Params:', params);
        console.log('Query string:', queryString);

        return apiService.get(`/api/v1/facilities${queryString ? `?${queryString}` : ''}`);
    },

    // Get single facility by ID
    getFacilityById: (id) => {
        console.log('=== GET FACILITY BY ID ===');
        console.log('Facility ID:', id);
        return apiService.get(`/api/v1/facilities/${id}`);
    },

    // Create new facility (requires admin authentication)
    createFacility: (facilityData) => {
        console.log('=== CREATE FACILITY ===');
        console.log('Facility data:', facilityData);

        // Validate required fields
        if (!facilityData.facilityName || facilityData.facilityName.trim().length < 2) {
            throw new Error('Nama fasilitas harus diisi minimal 2 karakter');
        }

        const payload = {
            facilityName: facilityData.facilityName.trim(),
            ...(facilityData.iconUrl && { iconUrl: facilityData.iconUrl.trim() })
        };

        console.log('Payload:', payload);
        return apiService.post('/api/v1/facilities', payload);
    },

    // Update facility (requires admin authentication)
    updateFacility: (id, facilityData) => {
        console.log('=== UPDATE FACILITY ===');
        console.log('Facility ID:', id);
        console.log('Facility data:', facilityData);

        // Validate required fields if provided
        if (facilityData.facilityName !== undefined && facilityData.facilityName.trim().length < 2) {
            throw new Error('Nama fasilitas harus diisi minimal 2 karakter');
        }

        const payload = {};
        if (facilityData.facilityName !== undefined) {
            payload.facilityName = facilityData.facilityName.trim();
        }
        if (facilityData.iconUrl !== undefined) {
            payload.iconUrl = facilityData.iconUrl.trim();
        }

        console.log('Update payload:', payload);
        return apiService.patch(`/api/v1/facilities/${id}`, payload);
    },

    // Delete facility (requires admin authentication)
    deleteFacility: (id) => {
        console.log('=== DELETE FACILITY ===');
        console.log('Facility ID:', id);
        return apiService.delete(`/api/v1/facilities/${id}`);
    },

    // Get available icons (optional endpoint)
    getAvailableIcons: () => {
        console.log('=== GET AVAILABLE ICONS ===');
        return apiService.get('/api/v1/facilities/icons').catch((error) => {
            console.log('Icons endpoint not available:', error.message);
            return { data: [] };
        });
    }
};

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

        return apiService.get(`/api/v1/building-managers${queryString ? `?${queryString}` : ''}`);
    },

    // Get available building managers (not assigned to any building)
    getAvailableBuildingManagers: () => {
        console.log('=== GET AVAILABLE BUILDING MANAGERS ===');
        return apiService.get('/api/v1/building-managers/available');
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
        return apiService.post('/api/v1/building-managers', payload);
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
        return apiService.patch(`/api/v1/building-managers/${id}`, payload);
    },

    // Delete building manager (requires admin authentication)
    deleteBuildingManager: (id) => {
        console.log('=== DELETE BUILDING MANAGER ===');
        console.log('Manager ID:', id);
        return apiService.delete(`/api/v1/building-managers/${id}`);
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
        return apiService.post('/api/v1/building-managers/assign', payload);
    }
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
                // Handle validation errors - message can be string or array
                if (error.data?.message) {
                    // showToast.error can handle both string and array messages
                    showToast.error(error.data.message);
                } else {
                    showToast.error('Data yang dikirim tidak valid');
                }
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

// Notification API methods
export const notificationApi = {
    // Get user notifications
    getNotifications: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        const queryString = queryParams.toString();

        console.log('=== GET NOTIFICATIONS ===');
        console.log('Params:', params);
        console.log('Query string:', queryString);

        return apiService.get(`/api/v1/notifications${queryString ? `?${queryString}` : ''}`);
    },

    // Get unread notification count
    getUnreadCount: () => {
        console.log('=== GET UNREAD NOTIFICATION COUNT ===');
        return apiService.get('/api/v1/notifications/unread-count');
    },

    // Mark a notification as read
    markAsRead: (notificationId) => {
        console.log('=== MARK NOTIFICATION AS READ ===');
        console.log('Notification ID:', notificationId);
        return apiService.patch(`/api/v1/notifications/${notificationId}/read`);
    }
};

// Xendit Callback API methods
export const callbackApi = {
    // Xendit payment callback webhook
    xenditPaymentCallback: (callbackData) => {
        console.log('=== XENDIT PAYMENT CALLBACK ===');
        console.log('Callback data:', callbackData);
        return apiService.post('/api/v1/transactions/callback/xendit', callbackData);
    },

    // Xendit refund callback webhook
    xenditRefundCallback: (callbackData) => {
        console.log('=== XENDIT REFUND CALLBACK ===');
        console.log('Callback data:', callbackData);
        return apiService.post('/api/v1/transactions/callback/refund', callbackData);
    }
};

export default apiService; 