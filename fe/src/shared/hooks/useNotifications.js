import { useState, useEffect, useCallback, useRef } from 'react';
import notificationAPI from '../services/notificationAPI';
import { useApiToast } from './useApiToast';
import { useAuthStore } from '../store/authStore';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [markingAsRead, setMarkingAsRead] = useState(new Set()); // Track which notifications are being marked as read
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10
    });

    // Add refs for debouncing and preventing duplicate calls
    const markAllAsReadInProgress = useRef(false);
    const lastMarkAllAsReadTime = useRef(0);

    const { showError, showSuccess, handleError } = useApiToast();
    const { isAuthenticated } = useAuthStore();

    // Fetch notifications
    const fetchNotifications = useCallback(async (params = {}) => {
        if (!isAuthenticated) return;

        try {
            setLoading(true);
            console.log('Fetching notifications with params:', params);
            const response = await notificationAPI.getNotifications(params);
            console.log('Notifications API response:', response);

            setNotifications(response.data || []);
            if (response.pagination) {
                setPagination(response.pagination);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            handleError(error, 'Gagal memuat notifikasi');
        } finally {
            setLoading(false);
        }
    }, [handleError, isAuthenticated]);

    // Fetch unread count
    const fetchUnreadCount = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            const response = await notificationAPI.getUnreadCount();
            setUnreadCount(response.data.unreadCount);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    }, [isAuthenticated]);

    // Mark notification as read with improved feedback
    const markAsRead = useCallback(async (notificationId) => {
        if (!isAuthenticated) {
            console.log('User not authenticated, cannot mark as read');
            return;
        }

        // Don't proceed if already marking this notification as read
        if (markingAsRead.has(notificationId)) {
            console.log('Already marking notification as read:', notificationId);
            return;
        }

        // Find the notification to check if it's already read
        const notification = notifications.find(n => n.id === notificationId);
        if (!notification) {
            console.log('Notification not found:', notificationId);
            return;
        }

        if (notification.readStatus === 1) {
            console.log('Notification already read:', notificationId);
            return; // Already read, no need to mark
        }

        console.log('Marking notification as read:', notificationId, notification);

        try {
            // Add to marking set for loading state
            setMarkingAsRead(prev => new Set([...prev, notificationId]));

            // Optimistic update - immediately update UI
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === notificationId
                        ? { ...notif, readStatus: 1 }
                        : notif
                )
            );

            // Update unread count optimistically
            setUnreadCount(prev => Math.max(0, prev - 1));

            // Make API call
            const response = await notificationAPI.markAsRead(notificationId);
            console.log('Mark as read successful:', response);

            // Refresh unread count and notification list after successful mark as read
            await fetchUnreadCount();
            // Don't refresh full list to avoid UI jump, optimistic update is enough

            // Show success feedback (optional - might be too noisy)
            // showSuccess('Notifikasi ditandai sebagai dibaca');

        } catch (error) {
            console.error('Error marking notification as read:', error);

            // Revert optimistic update on error
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === notificationId
                        ? { ...notif, readStatus: 0 }
                        : notif
                )
            );

            // Revert unread count
            setUnreadCount(prev => prev + 1);

            handleError(error, 'Gagal menandai notifikasi sebagai dibaca');
        } finally {
            // Remove from marking set
            setMarkingAsRead(prev => {
                const newSet = new Set(prev);
                newSet.delete(notificationId);
                return newSet;
            });
        }
    }, [notifications, markingAsRead, handleError, isAuthenticated]);

    // Mark all notifications as read - improved with debouncing and validation
    const markAllAsRead = useCallback(async () => {
        if (!isAuthenticated) {
            console.log('User not authenticated, cannot mark all as read');
            return;
        }

        // Debouncing - prevent rapid successive calls
        const now = Date.now();
        if (now - lastMarkAllAsReadTime.current < 2000) { // 2 second debounce
            console.log('markAllAsRead: Debouncing, ignoring rapid call');
            return;
        }

        // Prevent duplicate concurrent calls
        if (markAllAsReadInProgress.current) {
            console.log('markAllAsRead: Already in progress, ignoring call');
            return;
        }

        console.log('Current unreadCount:', unreadCount);
        console.log('Current notifications:', notifications);

        const unreadNotifications = notifications.filter(n => n.readStatus === 0);
        console.log('Unread notifications from local array:', unreadNotifications);

        // Use unreadCount from API instead of local notifications array
        // because there might be a sync issue between unreadCount and notifications list
        if (unreadCount === 0) {
            console.log('No unread notifications based on unreadCount');
            showSuccess('Semua notifikasi sudah dibaca');
            return;
        }

        console.log('Marking all notifications as read, unreadCount:', unreadCount);

        // Set flags for debouncing and duplicate prevention
        lastMarkAllAsReadTime.current = now;
        markAllAsReadInProgress.current = true;

        try {
            setLoading(true);

            // Optimistic update - mark all as read
            setNotifications(prev =>
                prev.map(notif => ({ ...notif, readStatus: 1 }))
            );
            setUnreadCount(0);

            // Call mark all as read API - always call if unreadCount > 0
            console.log('Calling markAllAsRead API...');
            const response = await notificationAPI.markAllAsRead();
            console.log('Mark all as read API response:', response);

            // Validate API response
            if (response?.data?.updatedCount !== undefined) {
                const updatedCount = response.data.updatedCount;
                console.log(`Successfully marked ${updatedCount} notifications as read`);

                if (updatedCount > 0) {
                    showSuccess(`${updatedCount} notifikasi ditandai sebagai dibaca`);
                } else {
                    showSuccess('Semua notifikasi sudah dibaca');
                }
            } else {
                console.warn('Unexpected API response structure:', response);
                showSuccess('Semua notifikasi ditandai sebagai dibaca');
            }

            // Refresh unread count and notifications after successful mark all
            await Promise.all([
                fetchUnreadCount(),
                fetchNotifications({ page: 1, limit: 10 })
            ]);

        } catch (error) {
            console.error('Error marking all notifications as read:', error);

            // Revert optimistic update on error
            setNotifications(prev =>
                prev.map(notif => {
                    const originalNotif = unreadNotifications.find(n => n.id === notif.id);
                    return originalNotif ? { ...notif, readStatus: 0 } : notif;
                })
            );
            setUnreadCount(unreadNotifications.length);

            handleError(error, 'Gagal menandai semua notifikasi sebagai dibaca');
        } finally {
            setLoading(false);
            markAllAsReadInProgress.current = false;
        }
    }, [notifications, unreadCount, handleError, showSuccess, isAuthenticated, fetchUnreadCount, fetchNotifications]);

    // Refresh notifications
    const refreshNotifications = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            await Promise.all([
                fetchNotifications({ page: 1, limit: 10 }),
                fetchUnreadCount()
            ]);
        } catch (error) {
            console.error('Error refreshing notifications:', error);
        }
    }, [fetchNotifications, fetchUnreadCount, isAuthenticated]);

    // Initial fetch - only when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            console.log('Initial fetch - user authenticated');
            fetchUnreadCount();
            // Don't auto-fetch notifications on mount to avoid unnecessary API calls
            // fetchNotifications({ page: 1, limit: 10 });
        }
    }, [fetchUnreadCount, isAuthenticated]);

    // Get notification icon based on type
    const getNotificationIcon = useCallback((type) => {
        switch (type) {
            case 'BOOKING': return '📅';
            case 'PAYMENT': return '💳';
            default: return '📢';
        }
    }, []);

    // Get notification type display name
    const getNotificationTypeDisplay = useCallback((type) => {
        switch (type) {
            case 'BOOKING': return 'Booking';
            case 'PAYMENT': return 'Pembayaran';
            default: return 'Notifikasi';
        }
    }, []);

    // Check if notification is being marked as read
    const isMarkingAsRead = useCallback((notificationId) => {
        return markingAsRead.has(notificationId);
    }, [markingAsRead]);

    return {
        notifications,
        unreadCount,
        loading,
        pagination,
        markingAsRead,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        refreshNotifications,
        getNotificationIcon,
        getNotificationTypeDisplay,
        isMarkingAsRead
    };
}; 