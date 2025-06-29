const Pusher = require('pusher');
const logger = require('./logger.lib');

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER || 'ap1',
    useTLS: true
});

const PusherHelper = {
    // Send notification to specific user
    async sendToUser(userId, event, data) {
        try {
            const channel = `user-${userId}`;
            await pusher.trigger(channel, event, data);
            logger.info(`Pusher notification sent to user ${userId} - event: ${event}`);
            return true;
        } catch (error) {
            logger.error('Pusher send to user error:', error);
            throw error;
        }
    },

    // Send booking notification
    async sendBookingNotification(userId, type, bookingData) {
        try {
            const notificationData = {
                type: 'BOOKING',
                subType: type,
                title: this.getBookingTitle(type),
                message: this.getBookingMessage(type, bookingData),
                data: bookingData,
                timestamp: new Date().toISOString()
            };

            await this.sendToUser(userId, 'booking-notification', notificationData);
            return true;
        } catch (error) {
            logger.error('Pusher booking notification error:', error);
            throw error;
        }
    },

    // Send payment notification
    async sendPaymentNotification(userId, type, paymentData) {
        try {
            const notificationData = {
                type: 'PAYMENT',
                subType: type,
                title: this.getPaymentTitle(type),
                message: this.getPaymentMessage(type, paymentData),
                data: paymentData,
                timestamp: new Date().toISOString()
            };

            await this.sendToUser(userId, 'payment-notification', notificationData);
            return true;
        } catch (error) {
            logger.error('Pusher payment notification error:', error);
            throw error;
        }
    },

    // Send admin notification (for all admins)
    async sendAdminNotification(type, data) {
        try {
            logger.info(`Attempting to send admin notification - type: ${type}`, {
                dataKeys: data ? Object.keys(data) : [],
                hasData: !!data,
                pusherConfig: {
                    appId: !!process.env.PUSHER_APP_ID,
                    key: !!process.env.PUSHER_KEY,
                    secret: !!process.env.PUSHER_SECRET,
                    cluster: process.env.PUSHER_CLUSTER || 'ap1'
                }
            });

            const notificationData = {
                type: 'ADMIN',
                subType: type,
                title: this.getAdminTitle(type),
                message: this.getAdminMessage(type, data),
                data: data,
                timestamp: new Date().toISOString()
            };

            logger.info(`Admin notification payload:`, {
                notificationType: notificationData.type,
                subType: notificationData.subType,
                title: notificationData.title,
                message: notificationData.message,
                hasData: !!notificationData.data,
                timestamp: notificationData.timestamp
            });

            await pusher.trigger('admin-channel', 'admin-notification', notificationData);

            logger.info(`Admin notification sent successfully - type: ${type}`, {
                channel: 'admin-channel',
                event: 'admin-notification',
                subType: type,
                timestamp: notificationData.timestamp
            });

            return true;
        } catch (error) {
            logger.error('Pusher admin notification error:', {
                error: error.message,
                stack: error.stack,
                type: type,
                data: data,
                pusherConfig: {
                    appId: !!process.env.PUSHER_APP_ID,
                    key: !!process.env.PUSHER_KEY,
                    secret: !!process.env.PUSHER_SECRET,
                    cluster: process.env.PUSHER_CLUSTER || 'ap1'
                }
            });
            throw error;
        }
    },

    // Helper functions for notification titles and messages
    getBookingTitle(type) {
        const titles = {
            'CREATED': 'Booking Dibuat',
            'APPROVED': 'Booking Disetujui',
            'REJECTED': 'Booking Ditolak',
            'COMPLETED': 'Booking Selesai',
            'PAYMENT_REQUIRED': 'Pembayaran Diperlukan'
        };
        return titles[type] || 'Notifikasi Booking';
    },

    getBookingMessage(type, data) {
        const messages = {
            'CREATED': `Booking untuk ${data.buildingName} berhasil dibuat dan menunggu pembayaran`,
            'APPROVED': `Booking untuk ${data.buildingName} telah disetujui`,
            'REJECTED': `Booking untuk ${data.buildingName} ditolak. ${data.rejectionReason || ''}`,
            'COMPLETED': `Booking untuk ${data.buildingName} telah selesai`,
            'PAYMENT_REQUIRED': `Silakan lakukan pembayaran untuk booking ${data.buildingName}`
        };
        return messages[type] || 'Update booking tersedia';
    },

    getPaymentTitle(type) {
        const titles = {
            'PAID': 'Pembayaran Berhasil',
            'FAILED': 'Pembayaran Gagal',
            'PENDING': 'Pembayaran Tertunda',
            'EXPIRED': 'Pembayaran Kedaluwarsa',
            'REFUNDED': 'Pembayaran Dikembalikan'
        };
        return titles[type] || 'Notifikasi Pembayaran';
    },

    getPaymentMessage(type, data) {
        const messages = {
            'PAID': `Pembayaran sebesar Rp ${data.amount?.toLocaleString('id-ID')} untuk ${data.buildingName} berhasil diproses`,
            'FAILED': `Pembayaran untuk ${data.buildingName} gagal diproses`,
            'PENDING': `Pembayaran untuk ${data.buildingName} sedang diproses`,
            'EXPIRED': `Pembayaran untuk ${data.buildingName} telah kedaluwarsa`,
            'REFUNDED': `Pembayaran sebesar Rp ${data.amount?.toLocaleString('id-ID')} telah dikembalikan`
        };
        return messages[type] || 'Update pembayaran tersedia';
    },

    getAdminTitle(type) {
        const titles = {
            'NEW_BOOKING': 'Booking Baru',
            'PAYMENT_SUCCESS': 'Pembayaran Berhasil',
            'REFUND_REQUEST': 'Permintaan Refund',
            'REFUND_PROCESSED': 'Refund Diproses',
            'BOOKING_APPROVED': 'Booking Disetujui',
            'BOOKING_REJECTED': 'Booking Ditolak',
            'BOOKING_EXPIRED': 'Booking Kedaluwarsa',
            'BOOKING_COMPLETED': 'Booking Selesai'
        };
        return titles[type] || 'Notifikasi Admin';
    },

    getAdminMessage(type, data) {
        const messages = {
            'NEW_BOOKING': `Booking baru untuk ${data.buildingName} oleh ${data.borrowerName} memerlukan persetujuan`,
            'PAYMENT_SUCCESS': `Pembayaran untuk booking ${data.buildingName} oleh ${data.borrowerName} berhasil`,
            'REFUND_REQUEST': `Permintaan refund untuk booking ${data.buildingName}`,
            'REFUND_PROCESSED': `Refund sebesar Rp ${data.refundAmount?.toLocaleString('id-ID')} untuk booking ${data.buildingName} oleh ${data.borrowerName} telah diproses. Alasan: ${data.refundReason}`,
            'BOOKING_APPROVED': `Booking ${data.buildingName} oleh ${data.borrowerName} telah disetujui`,
            'BOOKING_REJECTED': `Booking ${data.buildingName} oleh ${data.borrowerName} telah ditolak. Alasan: ${data.rejectionReason}`,
            'BOOKING_EXPIRED': `Booking ${data.buildingName} oleh ${data.borrowerName} telah kedaluwarsa`,
            'BOOKING_COMPLETED': `Booking ${data.buildingName} oleh ${data.borrowerName} telah selesai`
        };
        return messages[type] || 'Update admin tersedia';
    },

}

module.exports = PusherHelper; 