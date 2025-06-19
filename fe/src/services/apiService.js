import { useAuthStore } from '../utils/store';
import { showToast } from '../utils/helpers';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

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
    login: (credentials) => apiService.post('/auth/login', credentials),
    register: (userData) => apiService.post('/auth/register', userData),
    logout: () => apiService.post('/auth/logout'),
    refreshToken: () => apiService.post('/auth/refresh'),
    forgotPassword: (email) => apiService.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => apiService.post('/auth/reset-password', { token, password }),
};

// User API methods
export const userApi = {
    getProfile: () => apiService.get('/user/profile'),
    updateProfile: (userData) => apiService.put('/user/profile', userData),
    changePassword: (passwords) => apiService.put('/user/change-password', passwords),
    uploadAvatar: (formData) => apiService.uploadFile('/user/avatar', formData),
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