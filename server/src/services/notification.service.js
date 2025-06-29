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

    // Mark all notifications as read
    async markAsAllRead(userId) {
        try {
            const result = await prisma.notification.updateMany({
                where: {
                    userId: userId,
                    readStatus: 0 // Only update unread notifications
                },
                data: {
                    readStatus: 1
                }
            });

            logger.info(`All notifications marked as read for user: ${userId}, updated count: ${result.count}`);

            return {
                updatedCount: result.count
            };
        } catch (error) {
            logger.error('Mark all notifications as read service error:', error);
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
    },

    // Create refund notification with Pusher and Email
    async createRefundNotification(userId, refundData) {
        try {
            const { v4: uuidv4 } = require('uuid');
            const moment = require('moment');

            const title = 'Refund Diproses';
            const message = `Refund sebesar Rp ${refundData.refundAmount?.toLocaleString('id-ID')} untuk ${refundData.buildingName} telah diproses. Alasan: ${refundData.refundReason}`;

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
                await PusherHelper.sendToUser(userId, 'refund-notification', {
                    id: notification.id,
                    type: 'REFUND',
                    title: title,
                    message: message,
                    date: notification.date,
                    readStatus: false,
                    refundData: refundData,
                    timestamp: new Date().toISOString()
                });
            } catch (pusherError) {
                logger.warn('Failed to send Pusher refund notification:', pusherError);
            }

            // Send email notification untuk refund
            try {
                await this.sendRefundEmailNotification(userId, refundData);
            } catch (emailError) {
                logger.warn('Failed to send refund email notification:', emailError);
                // Don't throw error if email fails, just log it
            }

            logger.info(`Refund notification created: ${notification.id}`);
            return notification;
        } catch (error) {
            logger.error('Create refund notification service error:', error);
            throw error;
        }
    },

    // Send refund email notification
    async sendRefundEmailNotification(userId, refundData) {
        try {
            // Get user email
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { email: true, fullName: true }
            });

            if (!user || !user.email) {
                logger.warn(`User email not found for refund notification: ${userId}`);
                return;
            }

            // Generate refund email HTML
            const generateRefundEmailHtml = (userFullName, refundData) => {
                return `
                <!DOCTYPE html>
                <html lang="id">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Refund Diproses</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
                        .content { background-color: #f8f9fa; padding: 20px; }
                        .details { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
                        .footer { background-color: #6c757d; color: white; padding: 10px; text-align: center; font-size: 12px; }
                        .amount { font-size: 24px; font-weight: bold; color: #28a745; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Refund Berhasil Diproses</h1>
                        </div>
                        <div class="content">
                            <h2>Halo ${userFullName},</h2>
                            <p>Refund Anda telah berhasil diproses.</p>
                            <div class="details">
                                <h3>Detail Refund:</h3>
                                <p><strong>Gedung:</strong> ${refundData.buildingName}</p>
                                <p><strong>Booking ID:</strong> ${refundData.bookingId}</p>
                                <p><strong>Jumlah Refund:</strong> <span class="amount">Rp ${refundData.refundAmount?.toLocaleString('id-ID')}</span></p>
                                <p><strong>Alasan:</strong> ${refundData.refundReason}</p>
                            </div>
                            <p>Dana akan kembali ke rekening Anda dalam 1-7 hari kerja.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2024 Building Rental System. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                `;
            };

            // Send email if email helper is configured
            if (EmailHelper.isConfigured()) {
                const htmlContent = generateRefundEmailHtml(user.fullName, refundData);
                const subject = `Refund Berhasil Diproses - ${refundData.buildingName}`;

                const emailData = {
                    to: user.email,
                    subject: subject,
                    htmlContent: htmlContent
                };

                await EmailHelper.sendEmail(emailData);
                logger.info(`Refund email sent to ${user.email}`);
            } else {
                logger.warn('Email service not configured, skipping refund email');
            }
        } catch (error) {
            logger.error('Send refund email notification error:', error);
            throw error;
        }
    }
};

module.exports = NotificationService; 