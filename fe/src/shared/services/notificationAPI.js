import apiClient from './apiClient';

const notificationAPI = {
    // Get user notifications with pagination
    getNotifications: async (params = {}) => {
        const { page = 1, limit = 10 } = params;
        const response = await apiClient.get('/notifications', {
            params: {
                page,
                limit
            }
        });
        return response;
    },

    // Get unread notification count
    getUnreadCount: async () => {
        const response = await apiClient.get('/notifications/unread-count');
        return response;
    },

    // Mark notification as read
    markAsRead: async (notificationId) => {
        try {
            const response = await apiClient.put(`/notifications/${notificationId}/read`);
            console.log('Mark as read response:', response);
            return response;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            // Try alternative endpoint if first one fails
            try {
                const altResponse = await apiClient.patch(`/notifications/${notificationId}/mark-read`);
                console.log('Alternative mark as read response:', altResponse);
                return altResponse;
            } catch (altError) {
                console.error('Alternative endpoint also failed:', altError);
                throw error; // throw original error
            }
        }
    },

    // Mark all notifications as read
    markAllAsRead: async () => {
        try {
            const response = await apiClient.patch('/notifications/mark-all-read');
            console.log('Mark all as read response:', response);
            return response;
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    }
};

export default notificationAPI; 