import { apiClient } from '../core/apiClient';

// Helper function untuk logging
const log = (action, data) => console.log(`=== ${action} ===`, data);

// Helper function untuk error handling
const handleError = (action, error) => {
    console.error(`Error ${action}:`, error);
    throw error;
};

// Get user notifications with pagination
const getNotifications = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);

        const queryString = queryParams.toString();
        log('GET NOTIFICATIONS', { params, queryString });

        return await apiClient.get(`/api/v1/notifications${queryString ? `?${queryString}` : ''}`);
    } catch (error) {
        handleError('getting notifications', error);
    }
};

// Get unread notification count
const getUnreadCount = async () => {
    try {
        log('GET UNREAD NOTIFICATION COUNT');
        return await apiClient.get('/api/v1/notifications/unread-count');
    } catch (error) {
        handleError('getting unread count', error);
    }
};

// Mark a notification as read
const markAsRead = async (notificationId) => {
    try {
        log('MARK NOTIFICATION AS READ', { notificationId });
        return await apiClient.patch(`/api/v1/notifications/${notificationId}/read`);
    } catch (error) {
        handleError('marking notification as read', error);
    }
};

// Create a new notification (for testing purposes)
const createNotification = async (notificationData) => {
    try {
        log('CREATE NOTIFICATION', notificationData);
        return await apiClient.post('/api/v1/notifications', notificationData);
    } catch (error) {
        handleError('creating notification', error);
    }
};

// Mark all notifications as read
const markAllAsRead = async () => {
    try {
        log('MARK ALL NOTIFICATIONS AS READ');
        return await apiClient.patch('/api/v1/notifications/mark-all-read');
    } catch (error) {
        handleError('marking all notifications as read', error);
    }
};

// Export functional API
export const notificationService = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    createNotification,
    markAllAsRead
};

// For backward compatibility
export const notificationApi = notificationService;
export default notificationService; 