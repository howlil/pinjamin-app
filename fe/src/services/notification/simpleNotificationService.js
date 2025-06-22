// Simple notification service dengan functional programming
import { apiClient } from '../core/apiClient';

// Helper untuk logging yang simple
const log = (message, data) => console.log(`🔔 ${message}`, data || '');

// Get notifications
export const getNotifications = async (page = 1, limit = 10) => {
    try {
        log('Getting notifications', { page, limit });
        const query = `?page=${page}&limit=${limit}`;
        return await apiClient.get(`/api/v1/notifications${query}`);
    } catch (error) {
        log('Error getting notifications', error.message);
        throw error;
    }
};

// Get unread count
export const getUnreadCount = async () => {
    try {
        log('Getting unread count');
        return await apiClient.get('/api/v1/notifications/unread-count');
    } catch (error) {
        log('Error getting unread count', error.message);
        throw error;
    }
};

// Mark as read
export const markAsRead = async (id) => {
    try {
        log('Marking as read', id);
        return await apiClient.patch(`/api/v1/notifications/${id}/read`);
    } catch (error) {
        log('Error marking as read', error.message);
        throw error;
    }
};

// Create notification (for testing)
export const createNotification = async (data) => {
    try {
        log('Creating notification', data);
        return await apiClient.post('/api/v1/notifications', data);
    } catch (error) {
        log('Error creating notification', error.message);
        throw error;
    }
};

// Mark all as read
export const markAllAsRead = async () => {
    try {
        log('Marking all as read');
        return await apiClient.patch('/api/v1/notifications/mark-all-read');
    } catch (error) {
        log('Error marking all as read', error.message);
        throw error;
    }
};

// Export semua functions
export default {
    getNotifications,
    getUnreadCount,
    markAsRead,
    createNotification,
    markAllAsRead
}; 