const prisma = require('../libs/database.lib');
const logger = require('../libs/logger.lib');
const PusherHelper = require('../libs/pusher.lib');
const EmailHelper = require('../libs/email.lib');

const NotificationService = {
    // Get notifications for user
    async getNotifications(userId, pagination) {
        try {
            const { page = 1, limit = 10 } = pagination;
            const skip = (page - 1) * limit;

            const [notifications, totalItems] = await Promise.all([
                prisma.notification.findMany({
                    where: { userId },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    skip,
                    take: limit
                }),
                prisma.notification.count({
                    where: { userId }
                })
            ]);

            const formattedNotifications = notifications.map(notification => ({
                notificationId: notification.id,
                title: notification.title,
                message: notification.message,
                date: notification.date,
                readStatus: notification.readStatus === 1,
                notificationType: notification.notificationType
            }));

            return {
                notifications: formattedNotifications,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: parseInt(page),
                itemsPerPage: parseInt(limit)
            };
        } catch (error) {
            logger.error('Get notifications service error:', error);
            throw error;
        }
    },

    // Get unread notification count
    async getUnreadCount(userId) {
        try {
            const unreadCount = await prisma.notification.count({
                where: {
                    userId,
                    readStatus: 0
                }
            });

            return unreadCount;
        } catch (error) {
            logger.error('Get unread count service error:', error);
            throw error;
        }
    },

    // Mark notification as read
    async markAsRead(notificationId, userId) {
        try {
            const notification = await prisma.notification.findUnique({
                where: { id: notificationId }
            });

            if (!notification) {
                throw new Error('Notifikasi tidak ditemukan');
            }

            if (notification.userId !== userId) {
                throw new Error('Tidak memiliki akses ke notifikasi ini');
            }

            await prisma.notification.update({
                where: { id: notificationId },
                data: { readStatus: 1 }
            });

            logger.info(`Notification marked as read: ${notificationId}`);
            return true;
        } catch (error) {
            logger.error('Mark notification as read service error:', error);
            throw error;
        }
    },

    // Create notification (for internal use)
    async createNotification(userId, type, title, message, additionalData = {}) {
        try {
            const { v4: uuidv4 } = require('uuid');
            const moment = require('moment');

            // Create notification in database
            const notification = await prisma.notification.create({
                data: {
                    id: uuidv4(),
                    userId,
                    notificationType: type,
                    title,
                    message,
                    date: moment().format('DD-MM-YYYY'),
                    readStatus: 0
                }
            });

            // Send real-time notification via Pusher
            try {
                await PusherHelper.sendToUser(userId, 'notification', {
                    id: notification.id,
                    type: type,
                    title: title,
                    message: message,
                    date: notification.date,
                    readStatus: false,
                    timestamp: new Date().toISOString(),
                    ...additionalData
                });
            } catch (pusherError) {
                logger.warn('Failed to send Pusher notification:', pusherError);
                // Don't throw error if Pusher fails, just log it
            }

            logger.info(`Notification created: ${notification.id}`);
            return notification;
        } catch (error) {
            logger.error('Create notification service error:', error);
            throw error;
        }
    },

    // Create booking notification with Pusher and Email
    async createBookingNotification(userId, type, bookingData) {
        try {
            const { v4: uuidv4 } = require('uuid');
            const moment = require('moment');

            const title = PusherHelper.getBookingTitle(type);
            const message = PusherHelper.getBookingMessage(type, bookingData);

            // Create notification in database
            const notification = await prisma.notification.create({
                data: {
                    id: uuidv4(),
                    userId,
                    notificationType: 'BOOKING',
                    title,
                    message,
                    date: moment().format('DD-MM-YYYY'),
                    readStatus: 0
                }
            });

            // Send real-time notification via Pusher
            try {
                await PusherHelper.sendBookingNotification(userId, type, bookingData);
            } catch (pusherError) {
                logger.warn('Failed to send Pusher booking notification:', pusherError);
            }

            // Send email notification
            try {
                await this.sendBookingEmailNotification(userId, type, bookingData);
            } catch (emailError) {
                logger.warn('Failed to send booking email notification:', emailError);
                // Don't throw error if email fails, just log it
            }

            logger.info(`Booking notification created: ${notification.id}`);
            return notification;
        } catch (error) {
            logger.error('Create booking notification service error:', error);
            throw error;
        }
    },

    // Create payment notification with Pusher and Email
    async createPaymentNotification(userId, type, paymentData) {
        try {
            const { v4: uuidv4 } = require('uuid');
            const moment = require('moment');

            const title = PusherHelper.getPaymentTitle(type);
            const message = PusherHelper.getPaymentMessage(type, paymentData);

            // Create notification in database
            const notification = await prisma.notification.create({
                data: {
                    id: uuidv4(),
                    userId,
                    notificationType: 'PAYMENT',
                    title,
                    message,
                    date: moment().format('DD-MM-YYYY'),
                    readStatus: 0
                }
            });

            // Send real-time notification via Pusher
            try {
                await PusherHelper.sendPaymentNotification(userId, type, paymentData);
            } catch (pusherError) {
                logger.warn('Failed to send Pusher payment notification:', pusherError);
            }

            // Send email notification
            try {
                await this.sendPaymentEmailNotification(userId, type, paymentData);
            } catch (emailError) {
                logger.warn('Failed to send payment email notification:', emailError);
                // Don't throw error if email fails, just log it
            }

            logger.info(`Payment notification created: ${notification.id}`);
            return notification;
        } catch (error) {
            logger.error('Create payment notification service error:', error);
            throw error;
        }
    },

    // Send booking email notification
    async sendBookingEmailNotification(userId, type, bookingData) {
        try {
            // Get user email
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { email: true, fullName: true }
            });

            if (!user || !user.email) {
                logger.warn(`User email not found for booking notification: ${userId}`);
                return;
            }

            switch (type) {
                case 'BOOKING_CREATED':
                    await EmailHelper.sendBookingConfirmationEmail(user.email, user.fullName, bookingData);
                    break;
                case 'BOOKING_APPROVED':
                    await EmailHelper.sendBookingStatusEmail(user.email, user.fullName, bookingData, 'APPROVED');
                    break;
                case 'BOOKING_REJECTED':
                    await EmailHelper.sendBookingStatusEmail(user.email, user.fullName, bookingData, 'REJECTED');
                    break;
                default:
                    logger.warn(`Unknown booking notification type: ${type}`);
                    break;
            }

            logger.info(`Booking email sent to ${user.email} for type: ${type}`);
        } catch (error) {
            logger.error('Send booking email notification error:', error);
            throw error;
        }
    },

    // Send payment email notification
    async sendPaymentEmailNotification(userId, type, paymentData) {
        try {
            // Get user email
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { email: true, fullName: true }
            });

            if (!user || !user.email) {
                logger.warn(`User email not found for payment notification: ${userId}`);
                return;
            }

            switch (type) {
                case 'PAYMENT_SUCCESS':
                    await EmailHelper.sendPaymentConfirmationEmail(user.email, user.fullName, paymentData);
                    break;
                default:
                    logger.warn(`Unknown payment notification type: ${type}`);
                    break;
            }

            logger.info(`Payment email sent to ${user.email} for type: ${type}`);
        } catch (error) {
            logger.error('Send payment email notification error:', error);
            throw error;
        }
    }
};

module.exports = NotificationService; 