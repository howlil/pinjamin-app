import { apiClient, withApiErrorHandling } from '../core/apiClient';

class AuthService {
    // Login user
    async login(credentials) {
        console.log('=== AUTH LOGIN ===');
        return apiClient.post('/api/v1/auth/login', credentials);
    }

    // Register new user
    async register(userData) {
        console.log('=== AUTH REGISTER ===');
        return apiClient.post('/api/v1/auth/register', userData);
    }

    // Logout user
    async logout() {
        console.log('=== AUTH LOGOUT ===');
        return apiClient.post('/api/v1/auth/logout');
    }

    // Refresh authentication token
    async refreshToken() {
        console.log('=== AUTH REFRESH TOKEN ===');
        return apiClient.post('/api/v1/auth/refresh');
    }

    // Forgot password
    async forgotPassword(email) {
        console.log('=== AUTH FORGOT PASSWORD ===');
        return apiClient.post('/api/v1/auth/forgot-password', { email });
    }

    // Reset password
    async resetPassword(token, password) {
        console.log('=== AUTH RESET PASSWORD ===');
        return apiClient.post('/api/v1/auth/reset-password', { token, password });
    }

    // Get user profile
    async getProfile() {
        console.log('=== GET USER PROFILE ===');
        return apiClient.get('/api/v1/auth/profile');
    }

    // Update user profile
    async updateProfile(userData) {
        console.log('=== UPDATE USER PROFILE ===');
        console.log('Profile data:', userData);
        return apiClient.patch('/api/v1/auth/profile', userData);
    }

    // Change password
    async changePassword(passwords) {
        console.log('=== CHANGE PASSWORD ===');
        console.log('Password change request');
        return apiClient.post('/api/v1/auth/change-password', passwords);
    }

    // Upload user avatar
    async uploadAvatar(formData) {
        console.log('=== UPLOAD AVATAR ===');
        return apiClient.uploadFile('/api/v1/user/avatar', formData);
    }
}

// Create service instance
const authService = new AuthService();

// Export wrapped methods with error handling
export const authApi = {
    login: withApiErrorHandling(authService.login.bind(authService)),
    register: withApiErrorHandling(authService.register.bind(authService)),
    logout: withApiErrorHandling(authService.logout.bind(authService)),
    refreshToken: withApiErrorHandling(authService.refreshToken.bind(authService)),
    forgotPassword: withApiErrorHandling(authService.forgotPassword.bind(authService)),
    resetPassword: withApiErrorHandling(authService.resetPassword.bind(authService)),
    getProfile: withApiErrorHandling(authService.getProfile.bind(authService)),
    updateProfile: withApiErrorHandling(authService.updateProfile.bind(authService)),
    changePassword: withApiErrorHandling(authService.changePassword.bind(authService)),
    uploadAvatar: withApiErrorHandling(authService.uploadAvatar.bind(authService)),
};

export default authService; 