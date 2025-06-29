// Helper functions untuk aplikasi sesuai context.json

// Format currency to Indonesian Rupiah
export const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return 'Rp 0';

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

// Format date to Indonesian format
export const formatDate = (date, options = {}) => {
    if (!date) return '';

    const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options
    };

    return new Intl.DateTimeFormat('id-ID', defaultOptions).format(new Date(date));
};

// Format time
export const formatTime = (time) => {
    if (!time) return '';

    return new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(new Date(`2000-01-01T${time}`));
};

// Validate email format
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate phone number (Indonesian format)
export const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
};

// Generate unique ID
export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Debounce function for search
export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
};

// Convert date format from DD-MM-YYYY to YYYY-MM-DD
export const convertDateFormat = (dateString, fromFormat = 'DD-MM-YYYY', toFormat = 'YYYY-MM-DD') => {
    if (!dateString) return '';

    if (fromFormat === 'DD-MM-YYYY' && toFormat === 'YYYY-MM-DD') {
        const [day, month, year] = dateString.split('-');
        return `${year}-${month}-${day}`;
    }

    if (fromFormat === 'YYYY-MM-DD' && toFormat === 'DD-MM-YYYY') {
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    }

    return dateString;
};

// Get borrower type label
export const getBorrowerTypeLabel = (type) => {
    const labels = {
        'INTERNAL_UNAND': 'Internal UNAND',
        'EXTERNAL_UNAND': 'External UNAND'
    };
    return labels[type] || type;
};

// Get building type label
export const getBuildingTypeLabel = (type) => {
    const labels = {
        'CLASSROOM': 'Ruang Kelas',
        'PKM': 'PKM',
        'LABORATORY': 'Laboratorium',
        'MULTIFUNCTION': 'Multifungsi',
        'SEMINAR': 'Seminar'
    };
    return labels[type] || type;
};

// Get booking status label and color
export const getBookingStatus = (status) => {
    const statusMap = {
        'PROCESSING': {
            label: 'Diproses',
            color: 'yellow',
            bgColor: '#FFEBC8'
        },
        'APPROVED': {
            label: 'Disetujui',
            color: 'green',
            bgColor: '#C8FFDB'
        },
        'REJECTED': {
            label: 'Ditolak',
            color: 'red',
            bgColor: '#FFE5E5'
        },
        'COMPLETED': {
            label: 'Selesai',
            color: 'blue',
            bgColor: '#C8E4FF'
        }
    };

    return statusMap[status] || {
        label: status,
        color: 'gray',
        bgColor: '#F5F5F5'
    };
};

// Get payment status label and color
export const getPaymentStatus = (status) => {
    const statusMap = {
        'UNPAID': {
            label: 'Belum Dibayar',
            color: 'red',
            bgColor: '#FFE5E5'
        },
        'PAID': {
            label: 'Sudah Dibayar',
            color: 'green',
            bgColor: '#C8FFDB'
        },
        'PENDING': {
            label: 'Menunggu',
            color: 'yellow',
            bgColor: '#FFEBC8'
        },
        'SETTLED': {
            label: 'Selesai',
            color: 'blue',
            bgColor: '#C8E4FF'
        },
        'EXPIRED': {
            label: 'Kedaluwarsa',
            color: 'gray',
            bgColor: '#F5F5F5'
        }
    };

    return statusMap[status] || {
        label: status,
        color: 'gray',
        bgColor: '#F5F5F5'
    };
};

// Calculate booking duration in days
export const calculateBookingDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 1;

    const start = new Date(convertDateFormat(startDate));
    const end = new Date(convertDateFormat(endDate));
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays + 1; // Include both start and end date
};

// Check if date is in the past
export const isDateInPast = (dateString) => {
    if (!dateString) return false;

    const date = new Date(convertDateFormat(dateString));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date < today;
};

// Sort array by key
export const sortBy = (array, key, direction = 'asc') => {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        if (direction === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
};

// Group array by key
export const groupBy = (array, key) => {
    return array.reduce((groups, item) => {
        const value = item[key];
        if (!groups[value]) {
            groups[value] = [];
        }
        groups[value].push(item);
        return groups;
    }, {});
};

// Notification utilities
export const notificationUtils = {
    // Validate notification object structure
    validateNotification: (notification) => {
        if (!notification || typeof notification !== 'object') {
            return false;
        }

        const requiredFields = ['id', 'title', 'message', 'readStatus'];
        return requiredFields.every(field => notification.hasOwnProperty(field));
    },

    // Count unread notifications from array
    countUnreadNotifications: (notifications) => {
        if (!Array.isArray(notifications)) {
            console.warn('countUnreadNotifications: Expected array, got:', typeof notifications);
            return 0;
        }

        return notifications.filter(notif =>
            notificationUtils.validateNotification(notif) && notif.readStatus === 0
        ).length;
    },

    // Debug notification state
    debugNotificationState: (notifications, unreadCount, prefix = 'NOTIF_DEBUG') => {
        console.group(`[${prefix}] Notification State Debug`);
        console.log('Total notifications:', notifications?.length || 0);
        console.log('API unreadCount:', unreadCount);

        if (Array.isArray(notifications)) {
            const localUnreadCount = notificationUtils.countUnreadNotifications(notifications);
            console.log('Local unreadCount:', localUnreadCount);
            console.log('Count mismatch:', localUnreadCount !== unreadCount);

            const unreadNotifs = notifications.filter(n => n.readStatus === 0);
            console.log('Unread notifications:', unreadNotifs);
        }

        console.groupEnd();
    },

    // Format notification for logging
    formatNotificationForLogging: (notification) => {
        if (!notificationUtils.validateNotification(notification)) {
            return 'Invalid notification object';
        }

        return `[${notification.id}] ${notification.title} (${notification.readStatus === 0 ? 'UNREAD' : 'READ'})`;
    }
};

// Refund utilities
export const refundUtils = {
    // Check if booking has refund
    hasRefund: (booking) => {
        // Check if booking has refund information
        // Based on the API response structure, refund info could be in different places:

        // 1. Direct refund field in booking
        if (booking.refund && booking.refund.refundStatus) {
            return true;
        }

        // 2. Refund status field directly in booking
        if (booking.refundStatus && booking.refundStatus !== 'NO_REFUND' && booking.refundStatus !== null) {
            return true;
        }

        // 3. Has refund boolean field
        if (booking.hasRefund === true) {
            return true;
        }

        // 4. Refund info in detail object
        if (booking.detail && booking.detail.refund && booking.detail.refund.refundStatus) {
            return true;
        }

        // 5. Refund ID exists (indicates refund has been processed)
        if (booking.refundId || (booking.refund && booking.refund.id)) {
            return true;
        }

        // 6. Check for any refund-related fields that indicate refund exists
        if (booking.refundAmount || booking.refundDate || booking.refundReason) {
            return true;
        }

        return false;
    },

    // Check if refund button should be shown
    shouldShowRefundButton: (booking) => {
        const isRejected = booking.status?.toUpperCase() === 'REJECTED';
        return isRejected && !refundUtils.hasRefund(booking);
    },

    // Get refund status display text
    getRefundStatusText: (refundStatus) => {
        const statusMap = {
            'NO_REFUND': 'Tidak Ada Refund',
            'PENDING': 'Menunggu Proses',
            'PROCESSING': 'Sedang Diproses',
            'COMPLETED': 'Selesai',
            'SUCCEEDED': 'Berhasil',
            'FAILED': 'Gagal',
            'REJECTED': 'Ditolak'
        };
        return statusMap[refundStatus] || refundStatus;
    },

    // Get refund status color config
    getRefundStatusColor: (refundStatus) => {
        const colorMap = {
            'NO_REFUND': { color: 'gray', bg: '#9CA3AF' },
            'PENDING': { color: 'yellow', bg: '#F59E0B' },
            'PROCESSING': { color: 'blue', bg: '#3B82F6' },
            'COMPLETED': { color: 'green', bg: '#21D179' },
            'SUCCEEDED': { color: 'green', bg: '#21D179' },
            'FAILED': { color: 'red', bg: '#EF4444' },
            'REJECTED': { color: 'red', bg: '#EF4444' }
        };
        return colorMap[refundStatus] || colorMap['NO_REFUND'];
    }
};

export default {
    formatCurrency,
    formatDate,
    formatTime,
    validateEmail,
    validatePhoneNumber,
    generateId,
    debounce,
    truncateText,
    convertDateFormat,
    getBorrowerTypeLabel,
    getBuildingTypeLabel,
    getBookingStatus,
    getPaymentStatus,
    calculateBookingDuration,
    isDateInPast,
    sortBy,
    groupBy
}; 