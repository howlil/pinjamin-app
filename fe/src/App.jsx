import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import AppRouter from './routes/AppRouter';
import { useRealTimeNotifications } from './hooks/notification/useRealTimeNotifications';
import { NotificationQueue } from './components/common/NotificationPopup';

function App() {
    const {
        newNotification,
        clearNewNotification,
        markAsRead,
        isConnected,
        connectionState
    } = useRealTimeNotifications();

    // Handle notification queue (for displaying new real-time notifications)
    const handleNotificationClose = () => {
        clearNewNotification();
    };

    const handleMarkAsRead = (notificationId) => {
        markAsRead(notificationId);
    };

    // Connection status logging (untuk debugging)
    React.useEffect(() => {
        console.log('🔄 Pusher connection state:', connectionState);
        console.log('📡 Is connected to real-time notifications:', isConnected);
    }, [connectionState, isConnected]);

    return (
        <ChakraProvider>
            {/* Main App Router */}
            <AppRouter />

            {/* Global Real-time Notification Popup */}
            <NotificationQueue
                notifications={newNotification ? [newNotification] : []}
                onClose={handleNotificationClose}
                onMarkAsRead={handleMarkAsRead}
            />

            {/* Connection Status Indicator (Optional - bisa dihapus di production) */}
         
        </ChakraProvider>
    );
}

export default App;
