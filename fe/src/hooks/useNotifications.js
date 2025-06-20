import { useState, useEffect, useCallback } from 'react';
import { notificationApi } from '@/services/apiService';
import { showToast } from '@/utils/helpers';

export const useNotifications = () => {
    // State management
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const limit = 10; // Items per page

    // Fetch notifications
    const fetchNotifications = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            setError(null);

            console.log('=== FETCH NOTIFICATIONS ===');
            console.log('Page:', page);

            const params = {
                page,
                limit
            };

            const response = await notificationApi.getNotifications(params);

            if (response.status === 'success') {
                setNotifications(response.data || []);
                setTotalItems(response.pagination?.totalItems || 0);
                setTotalPages(response.pagination?.totalPages || 1);
                setCurrentPage(page);
                console.log('Notifications loaded:', response.data?.length || 0);
            }
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError(err.message || 'Failed to fetch notifications');
            showToast.error('Gagal memuat notifikasi');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch unread count
    const fetchUnreadCount = useCallback(async () => {
        try {
            console.log('=== FETCH UNREAD COUNT ===');

            const response = await notificationApi.getUnreadCount();

            if (response.status === 'success') {
                setUnreadCount(response.data?.unreadCount || 0);
                console.log('Unread count:', response.data?.unreadCount || 0);
            }
        } catch (err) {
            console.error('Error fetching unread count:', err);
            // Don't show error toast for unread count as it's not critical
        }
    }, []);

    // Mark notification as read
    const markAsRead = useCallback(async (notificationId) => {
        try {
            console.log('=== MARK NOTIFICATION AS READ ===');
            console.log('Notification ID:', notificationId);

            await notificationApi.markAsRead(notificationId);

            // Update local state
            setNotifications(prev =>
                prev.map(notification =>
                    notification.id === notificationId
                        ? { ...notification, readStatus: 1 }
                        : notification
                )
            );

            // Update unread count
            setUnreadCount(prev => Math.max(0, prev - 1));

            console.log('Notification marked as read');
            return true;
        } catch (err) {
            console.error('Error marking notification as read:', err);
            showToast.error('Gagal menandai notifikasi sebagai dibaca');
            return false;
        }
    }, []);

    // Mark all notifications as read
    const markAllAsRead = useCallback(async () => {
        try {
            const unreadNotifications = notifications.filter(n => n.readStatus === 0);

            for (const notification of unreadNotifications) {
                await markAsRead(notification.id);
            }

            showToast.success('Semua notifikasi telah ditandai sebagai dibaca');
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
            showToast.error('Gagal menandai semua notifikasi sebagai dibaca');
        }
    }, [notifications, markAsRead]);

    // Handle pagination
    const handlePageChange = useCallback((page) => {
        fetchNotifications(page);
    }, [fetchNotifications]);

    // Refresh notifications
    const refreshNotifications = useCallback(() => {
        fetchNotifications(currentPage);
        fetchUnreadCount();
    }, [fetchNotifications, fetchUnreadCount, currentPage]);

    // Get notification by type
    const getNotificationsByType = useCallback((type) => {
        return notifications.filter(notification => notification.notificationType === type);
    }, [notifications]);

    // Get unread notifications
    const getUnreadNotifications = useCallback(() => {
        return notifications.filter(notification => notification.readStatus === 0);
    }, [notifications]);

    // Format notification date
    const formatNotificationDate = useCallback((dateString) => {
        if (!dateString) return '';

        try {
            // Handle DD-MM-YYYY format
            const [day, month, year] = dateString.split('-');
            const date = new Date(year, month - 1, day);

            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                return 'Hari ini';
            } else if (diffDays === 1) {
                return 'Kemarin';
            } else if (diffDays <= 7) {
                return `${diffDays} hari yang lalu`;
            } else {
                return date.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                });
            }
        } catch (err) {
            return dateString;
        }
    }, []);

    // Get notification icon
    const getNotificationIcon = useCallback((type) => {
        const icons = {
            'PAYMENT': '💳',
            'BOOKING': '📅',
            'SYSTEM': '⚙️',
            'REMINDER': '⏰'
        };
        return icons[type] || '📢';
    }, []);

    // Get notification color
    const getNotificationColor = useCallback((type) => {
        const colors = {
            'PAYMENT': 'green',
            'BOOKING': 'blue',
            'SYSTEM': 'purple',
            'REMINDER': 'orange'
        };
        return colors[type] || 'gray';
    }, []);

    // Initial data fetch
    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
    }, [fetchNotifications, fetchUnreadCount]);

    // Poll for new notifications every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchUnreadCount();
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchUnreadCount]);

    return {
        // State
        notifications,
        unreadCount,
        loading,
        error,
        currentPage,
        totalPages,
        totalItems,

        // Actions
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        handlePageChange,
        refreshNotifications,

        // Utilities
        getNotificationsByType,
        getUnreadNotifications,
        formatNotificationDate,
        getNotificationIcon,
        getNotificationColor
    };
}; 