import { useAuthStore } from '../../utils/store';
import { showToast } from '../../utils/helpers';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ApiClient {
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

    // PATCH request
    async patch(endpoint, data = null, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'PATCH',
                headers: this.createHeaders(options.headers),
                body: data ? JSON.stringify(data) : null,
                ...options,
            });

            return this.handleResponse(response);
        } catch (error) {
            console.error('PATCH request failed:', error);
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

    // Build query string from parameters
    buildQueryString(params = {}) {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value);
            }
        });
        return queryParams.toString();
    }

    // GET with query parameters
    async getWithParams(endpoint, params = {}, options = {}) {
        const queryString = this.buildQueryString(params);
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.get(url, options);
    }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Error handling wrapper
export const withApiErrorHandling = (apiCall) => {
    return async (...args) => {
        try {
            return await apiCall(...args);
        } catch (error) {
            console.error('API Error:', error);

            // You can add global error handling logic here
            if (error.status === 403) {
                showToast.error('Anda tidak memiliki akses untuk melakukan aksi ini');
            } else if (error.status === 404) {
                showToast.error('Data tidak ditemukan');
            } else if (error.status >= 500) {
                showToast.error('Terjadi kesalahan server. Silakan coba lagi nanti.');
            }

            throw error;
        }
    };
};

export default apiClient; 