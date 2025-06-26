import { apiClient } from '@/shared/services/apiClient';

/**
 * Auth API Functions
 * Base URL: /api/v1/auth
 */

export const authAPI = {
    // POST /api/v1/auth/register
    register: async (userData) => {
        const response = await apiClient.post('/auth/register', userData, { silent: true });
        return response;
    },

    // POST /api/v1/auth/login
    login: async (credentials) => {
        const response = await apiClient.post('/auth/login', credentials, { silent: true });
        return response;
    },

    // GET /api/v1/auth/profile
    getProfile: async () => {
        const response = await apiClient.get('/auth/profile', { silent: true });
        return response;
    },

    // PATCH /api/v1/auth/profile
    updateProfile: async (profileData) => {
        const response = await apiClient.patch('/auth/profile', profileData, { silent: true });
        return response;
    },

    // POST /api/v1/auth/logout
    logout: async () => {
        const response = await apiClient.post('/auth/logout', {}, { silent: true });
        return response;
    },

    // POST /api/v1/auth/change-password
    changePassword: async (passwordData) => {
        const response = await apiClient.post('/auth/change-password', passwordData, { silent: true });
        return response;
    },

    // POST /api/v1/auth/forgot-password
    forgotPassword: async (email) => {
        const response = await apiClient.post('/auth/forgot-password', { email }, { silent: true });
        return response;
    },

    // POST /api/v1/auth/reset-password
    resetPassword: async (resetData) => {
        const response = await apiClient.post('/auth/reset-password', resetData, { silent: true });
        return response;
    }
}; 