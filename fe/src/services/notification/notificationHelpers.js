// Notification helpers dengan functional programming

// Notification types
export const NOTIFICATION_TYPES = {
    BOOKING_APPROVED: 'BOOKING_APPROVED',
    BOOKING_REJECTED: 'BOOKING_REJECTED',
    BOOKING_REMINDER: 'BOOKING_REMINDER',
    PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
    PAYMENT_FAILED: 'PAYMENT_FAILED',
    SYSTEM_MAINTENANCE: 'SYSTEM_MAINTENANCE',
    DEFAULT: 'DEFAULT'
};

// Notification configuration
export const getNotificationConfig = (type) => {
    const configs = {
        [NOTIFICATION_TYPES.BOOKING_APPROVED]: {
            icon: '✅',
            color: '#10b981',
            bg: 'rgba(16, 185, 129, 0.15)',
            title: 'Peminjaman Disetujui'
        },
        [NOTIFICATION_TYPES.BOOKING_REJECTED]: {
            icon: '❌',
            color: '#ef4444',
            bg: 'rgba(239, 68, 68, 0.15)',
            title: 'Peminjaman Ditolak'
        },
        [NOTIFICATION_TYPES.BOOKING_REMINDER]: {
            icon: '⏰',
            color: '#f59e0b',
            bg: 'rgba(245, 158, 11, 0.15)',
            title: 'Pengingat Peminjaman'
        },
        [NOTIFICATION_TYPES.PAYMENT_SUCCESS]: {
            icon: '💳',
            color: '#10b981',
            bg: 'rgba(16, 185, 129, 0.15)',
            title: 'Pembayaran Berhasil'
        },
        [NOTIFICATION_TYPES.PAYMENT_FAILED]: {
            icon: '💳❌',
            color: '#ef4444',
            bg: 'rgba(239, 68, 68, 0.15)',
            title: 'Pembayaran Gagal'
        },
        [NOTIFICATION_TYPES.SYSTEM_MAINTENANCE]: {
            icon: '🔧',
            color: '#3b82f6',
            bg: 'rgba(59, 130, 246, 0.15)',
            title: 'Pemeliharaan Sistem'
        },
        [NOTIFICATION_TYPES.DEFAULT]: {
            icon: '🔔',
            color: '#749c73',
            bg: 'rgba(116, 156, 115, 0.15)',
            title: 'Notifikasi'
        }
    };

    return configs[type] || configs[NOTIFICATION_TYPES.DEFAULT];
};

// Format date untuk Indonesia
export const formatDate = (dateString) => {
    try {
        const date = new Date(dateString);
        return {
            full: date.toLocaleString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            short: date.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }),
            time: date.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    } catch {
        return { full: dateString, short: dateString, time: dateString };
    }
};

// Create notification object
export const createNotification = (title, message, type = NOTIFICATION_TYPES.DEFAULT) => ({
    title,
    message,
    notificationType: type,
    date: new Date().toISOString().split('T')[0].split('-').reverse().join('-'), // DD-MM-YYYY
    readStatus: false
});

// Generate test notifications
export const generateTestNotifications = (count = 5) => {
    const types = Object.values(NOTIFICATION_TYPES);
    const messages = [
        'Peminjaman ruang seminar Anda telah disetujui untuk tanggal 25 Desember 2024.',
        'Pembayaran sebesar Rp 150.000 telah berhasil diproses.',
        'Sistem akan menjalani pemeliharaan pada pukul 02:00 - 04:00 WIB.',
        'Pengingat: Peminjaman Anda dimulai dalam 30 menit.',
        'Maaf, peminjaman Anda ditolak karena jadwal bentrok.',
        'Terima kasih telah menggunakan layanan kami.',
        'Pembayaran Anda sedang diproses, mohon tunggu konfirmasi.',
        'Ruangan telah siap untuk digunakan sesuai jadwal.'
    ];

    return Array.from({ length: count }, (_, index) => {
        const type = types[Math.floor(Math.random() * types.length)];
        const config = getNotificationConfig(type);
        const message = messages[Math.floor(Math.random() * messages.length)];

        return createNotification(
            `${config.title} #${index + 1}`,
            message,
            type
        );
    });
};

// Check if notification is unread
export const isUnread = (notification) => !notification.readStatus;

// Filter notifications by type
export const filterByType = (notifications, type) =>
    notifications.filter(notification => notification.notificationType === type);

// Filter notifications by read status  
export const filterByReadStatus = (notifications, isRead = false) =>
    notifications.filter(notification => notification.readStatus === isRead);

// Get unread count
export const getUnreadCount = (notifications) =>
    notifications.filter(isUnread).length;

// Sort notifications by date (newest first)
export const sortByDate = (notifications) =>
    [...notifications].sort((a, b) => new Date(b.date) - new Date(a.date));

// Group notifications by type
export const groupByType = (notifications) =>
    notifications.reduce((groups, notification) => {
        const type = notification.notificationType;
        groups[type] = groups[type] || [];
        groups[type].push(notification);
        return groups;
    }, {});

// Play notification sound
export const playNotificationSound = (volume = 0.5) => {
    try {
        const audio = new Audio('/notification-sound.mp3');
        audio.volume = volume;
        audio.play().catch(() => {
            // Ignore audio play errors
            console.log('🔇 Audio play failed (user interaction required)');
        });
    } catch {
        // Ignore audio errors
        console.log('🔇 Audio not available');
    }
};

// Show browser notification (if permission granted)
export const showBrowserNotification = (title, message, icon = '/favicon.ico') => {
    if ('Notification' in window && Notification.permission === 'granted') {
        return new Notification(title, {
            body: message,
            icon,
            badge: icon,
            tag: 'app-notification'
        });
    }
    return null;
};

// Request notification permission
export const requestNotificationPermission = async () => {
    if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }
    return false;
};

// Utility untuk debugging
export const logNotification = (notification, action = 'received') => {
    const config = getNotificationConfig(notification.notificationType);
    console.log(`${config.icon} Notification ${action}:`, {
        title: notification.title,
        type: notification.notificationType,
        read: notification.readStatus,
        date: notification.date
    });
};

export default {
    NOTIFICATION_TYPES,
    getNotificationConfig,
    formatDate,
    createNotification,
    generateTestNotifications,
    isUnread,
    filterByType,
    filterByReadStatus,
    getUnreadCount,
    sortByDate,
    groupByType,
    playNotificationSound,
    showBrowserNotification,
    requestNotificationPermission,
    logNotification
}; 