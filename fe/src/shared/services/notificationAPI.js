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

    // Mark all notifications as read using individual calls as fallback
    markAllAsReadFallback: async () => {
        console.log('Using fallback method - marking individual notifications');

        try {
            // Get all unread notifications first
            const notificationsResponse = await notificationAPI.getNotifications({ page: 1, limit: 100 });
            const notifications = notificationsResponse.data || [];
            const unreadNotifications = notifications.filter(n => n.readStatus === 0);

            console.log('Found unread notifications:', unreadNotifications.length);

            if (unreadNotifications.length === 0) {
                return { data: { updatedCount: 0 } };
            }

            // Mark each unread notification as read
            const markPromises = unreadNotifications.map(notif =>
                notificationAPI.markAsRead(notif.id).catch(error => {
                    console.error(`Failed to mark notification ${notif.id} as read:`, error);
                    return null; // Continue with other notifications
                })
            );

            const results = await Promise.all(markPromises);
            const successCount = results.filter(result => result !== null).length;

            console.log(`Successfully marked ${successCount} notifications as read`);

            return {
                data: {
                    updatedCount: successCount,
                    fallbackMethod: true
                }
            };
        } catch (error) {
            console.error('Fallback method failed:', error);
            throw error;
        }
    },

    // Mark all notifications as read
    markAllAsRead: async () => {
        console.log('Calling markAllAsRead API endpoint...');

        // Try different endpoint variations
        const endpoints = [
            '/notifications/mark-all-as-read',
        ];

        let lastError = null;

        for (const endpoint of endpoints) {
            try {
                console.log(`Trying endpoint: ${endpoint}`);
                const response = await apiClient.patch(endpoint);
                console.log('Mark all as read API response:', response);

                // Validate response structure
                if (!response || !response.data) {
                    console.warn('Invalid response structure from markAllAsRead API');
                    return { data: { updatedCount: 0 } };
                }

                return response;
            } catch (error) {
                console.error(`Error with endpoint ${endpoint}:`, error?.response?.status);
                lastError = error;

                // If it's not a 404 error, don't try other endpoints
                if (error?.response?.status !== 404) {
                    break;
                }
            }
        }

        // If all bulk endpoints failed, try fallback method
        console.log('All bulk endpoints failed, trying fallback method...');
        try {
            const fallbackResult = await notificationAPI.markAllAsReadFallback();
            console.log('Fallback method succeeded:', fallbackResult);
            return fallbackResult;
        } catch (fallbackError) {
            console.error('Fallback method also failed:', fallbackError);
        }

        // If everything failed, throw the original API error
        console.error('All methods failed. Last API error:', lastError);

        if (lastError?.response) {
            console.error('Response error data:', lastError.response.data);
            console.error('Response status:', lastError.response.status);
        } else if (lastError?.request) {
            console.error('Request error:', lastError.request);
        } else {
            console.error('General error:', lastError.message);
        }

        throw lastError;
    }
};

export default notificationAPI; 