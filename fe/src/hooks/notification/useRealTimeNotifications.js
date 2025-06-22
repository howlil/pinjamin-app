import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@chakra-ui/react';
import pusherService from '../../services/notification/pusherService';
import { notificationService } from '../../services/notification/notificationService';
import { useAuth } from '../auth/useAuth';

export const useRealTimeNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [newNotification, setNewNotification] = useState(null);

    const { user, isAuthenticated } = useAuth();
    const toast = useToast();
    const channelRef = useRef(null);

    // Handle new real-time notification
    const handleNewNotification = useCallback((notification) => {
        console.log('🔔 Processing new notification:', notification);

        // Add to notifications list
        setNotifications(prev => [notification, ...prev]);

        // Update unread count
        setUnreadCount(prev => prev + 1);

        // Set as new notification for popup
        setNewNotification(notification);

        // Show toast notification
        toast({
            title: notification.title,
            description: notification.message,
            status: 'info',
            duration: 5000,
            isClosable: true,
            position: 'top-right'
        });

        // Play notification sound (optional)
        try {
            const audio = new Audio('/notification-sound.mp3');
            audio.play().catch(() => {
                // Ignore audio play errors (user might not have interacted with page yet)
            });
        } catch (error) {
            // Ignore audio errors
        }
    }, [toast]);

    // Initialize real-time connection
    const connectToNotifications = useCallback(async () => {
        if (!user?.id || !isAuthenticated) {
            return;
        }

        try {
            setIsLoading(true);

            // Initialize Pusher connection
            pusherService.init();

            // Subscribe to user notifications
            channelRef.current = pusherService.subscribeToUserNotifications(
                user.id,
                handleNewNotification
            );

            setIsConnected(pusherService.isConnectedToPusher());

            // Load initial notifications
            await loadNotifications();

        } catch (error) {
            console.error('Failed to connect to notifications:', error);
            toast({
                title: 'Connection Error',
                description: 'Failed to connect to real-time notifications',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        } finally {
            setIsLoading(false);
        }
    }, [user?.id, isAuthenticated, handleNewNotification, toast]);

    // Load notifications from API
    const loadNotifications = useCallback(async (page = 1, limit = 20) => {
        if (!user?.id) return;

        try {
            const response = await notificationService.getNotifications({ page, limit });

            if (response.status === 'success') {
                if (page === 1) {
                    setNotifications(response.data.notifications);
                } else {
                    setNotifications(prev => [...prev, ...response.data.notifications]);
                }

                // Get unread count
                const unreadResponse = await notificationService.getUnreadCount();
                if (unreadResponse.status === 'success') {
                    setUnreadCount(unreadResponse.data.unreadCount);
                }
            }
        } catch (error) {
            console.error('Failed to load notifications:', error);
        }
    }, [user?.id]);

    // Mark notification as read
    const markAsRead = useCallback(async (notificationId) => {
        if (!notificationId) return;

        try {
            const response = await notificationService.markAsRead(notificationId);

            if (response.status === 'success') {
                // Update local state
                setNotifications(prev =>
                    prev.map(notification =>
                        notification.notificationId === notificationId
                            ? { ...notification, readStatus: true }
                            : notification
                    )
                );

                // Decrease unread count
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            toast({
                title: 'Error',
                description: 'Failed to mark notification as read',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        }
    }, [toast]);

    // Mark all notifications as read
    const markAllAsRead = useCallback(async () => {
        try {
            const unreadNotifications = notifications.filter(n => !n.readStatus);

            await Promise.all(
                unreadNotifications.map(notification =>
                    notificationService.markAsRead(notification.notificationId)
                )
            );

            // Update local state
            setNotifications(prev =>
                prev.map(notification => ({ ...notification, readStatus: true }))
            );

            setUnreadCount(0);

            toast({
                title: 'Success',
                description: 'All notifications marked as read',
                status: 'success',
                duration: 2000,
                isClosable: true
            });
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
            toast({
                title: 'Error',
                description: 'Failed to mark all notifications as read',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        }
    }, [notifications, toast]);

    // Disconnect from notifications
    const disconnect = useCallback(() => {
        if (channelRef.current && user?.id) {
            pusherService.unsubscribe(`private-user-${user.id}`);
            channelRef.current = null;
        }

        setIsConnected(false);
        setNotifications([]);
        setUnreadCount(0);
        setNewNotification(null);
    }, [user?.id]);

    // Clear new notification popup
    const clearNewNotification = useCallback(() => {
        setNewNotification(null);
    }, []);

    // Refresh notifications
    const refreshNotifications = useCallback(async () => {
        await loadNotifications();
    }, [loadNotifications]);

    // Auto connect when user is authenticated
    useEffect(() => {
        if (isAuthenticated && user?.id) {
            connectToNotifications();
        } else {
            disconnect();
        }

        // Cleanup on unmount
        return () => {
            disconnect();
        };
    }, [isAuthenticated, user?.id, connectToNotifications, disconnect]);

    // Monitor connection status
    useEffect(() => {
        const interval = setInterval(() => {
            const currentStatus = pusherService.isConnectedToPusher();
            if (currentStatus !== isConnected) {
                setIsConnected(currentStatus);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [isConnected]);

    return {
        // State
        notifications,
        unreadCount,
        isConnected,
        isLoading,
        newNotification,

        // Actions
        markAsRead,
        markAllAsRead,
        loadNotifications,
        refreshNotifications,
        clearNewNotification,
        connectToNotifications,
        disconnect,

        // Connection info
        connectionState: pusherService.getConnectionState()
    };
}; 