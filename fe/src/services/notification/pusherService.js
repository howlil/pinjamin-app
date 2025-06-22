import Pusher from 'pusher-js';
import { getToken } from '../../utils/storage/localStorage';

// State menggunakan closure
let pusher = null;
let channels = new Map();
let isConnected = false;

// Helper functions
const log = (message, type = 'info') => {
    const emoji = {
        success: '✅',
        error: '❌',
        info: '📬',
        warning: '🔄'
    };
    console.log(`${emoji[type]} ${message}`);
};

// Initialize Pusher connection
const init = () => {
    if (pusher) return pusher;

    try {
        pusher = new Pusher('862d5f8def70ea57a72d', {
            cluster: 'ap1',
            encrypted: true,
            authEndpoint: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/pusher/auth`,
            auth: {
                headers: { Authorization: `Bearer ${getToken()}` }
            }
        });

        // Connection events
        pusher.connection.bind('connected', () => {
            log('Pusher connected successfully', 'success');
            isConnected = true;
        });

        pusher.connection.bind('disconnected', () => {
            log('Pusher disconnected', 'error');
            isConnected = false;
        });

        pusher.connection.bind('error', (error) => {
            log(`Pusher connection error: ${error}`, 'error');
            isConnected = false;
        });

        return pusher;
    } catch (error) {
        log(`Failed to initialize Pusher: ${error}`, 'error');
        throw error;
    }
};

// Subscribe to notifications
const subscribeToUserNotifications = (userId, onNotification) => {
    if (!pusher) init();

    const channelName = `private-user-${userId}`;

    // Return existing channel if already subscribed
    if (channels.has(channelName)) {
        return channels.get(channelName);
    }

    try {
        const channel = pusher.subscribe(channelName);

        // Bind events
        channel.bind('new-notification', (data) => {
            log(`New notification received: ${data.notification?.title}`, 'info');
            onNotification?.(data.notification);
        });

        channel.bind('pusher:subscription_succeeded', () => {
            log(`Successfully subscribed to ${channelName}`, 'success');
        });

        channel.bind('pusher:subscription_error', (error) => {
            log(`Failed to subscribe to ${channelName}: ${error}`, 'error');
        });

        channels.set(channelName, channel);
        return channel;
    } catch (error) {
        log(`Failed to subscribe to user notifications: ${error}`, 'error');
        throw error;
    }
};

// Unsubscribe from channel
const unsubscribe = (channelName) => {
    if (!channels.has(channelName)) return;

    pusher?.unsubscribe(channelName);
    channels.delete(channelName);
    log(`Unsubscribed from ${channelName}`, 'warning');
};

// Disconnect all
const disconnect = () => {
    if (!pusher) return;

    // Unsubscribe from all channels
    channels.forEach((_, channelName) => pusher.unsubscribe(channelName));
    channels.clear();

    // Disconnect
    pusher.disconnect();
    pusher = null;
    isConnected = false;
    log('Pusher disconnected', 'warning');
};

// Getters
const getConnectionState = () => pusher?.connection.state || 'disconnected';
const isConnectedToPusher = () => isConnected;
const getPusher = () => pusher;
const getChannels = () => channels;

// Export functional API
export default {
    init,
    subscribeToUserNotifications,
    unsubscribe,
    disconnect,
    getConnectionState,
    isConnectedToPusher,
    getPusher,
    getChannels
}; 