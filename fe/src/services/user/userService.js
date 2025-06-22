import { apiClient } from '../core/apiClient';

// User API methods  
export const userApi = {
    getProfile: () => {
        console.log('=== GET USER PROFILE ===');
        return apiClient.get('/api/v1/auth/profile');
    },
    updateProfile: (userData) => {
        console.log('=== UPDATE USER PROFILE ===');
        console.log('Profile data:', userData);
        return apiClient.patch('/api/v1/auth/profile', userData);
    },
    changePassword: (passwords) => {
        console.log('=== CHANGE PASSWORD ===');
        console.log('Password change request');
        return apiClient.post('/api/v1/auth/change-password', passwords);
    },
    uploadAvatar: (formData) => apiClient.uploadFile('/user/avatar', formData),
};

export default userApi; 