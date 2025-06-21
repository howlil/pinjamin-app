const { prisma, pusher } = require('../configs');
const { ErrorHandler, Logger } = require('../utils');
const moment = require('moment');

const NotificationService = {
    async getNotifications(userId, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;

            const totalItems = await prisma.notification.count({
                where: { userId }
            });

            const notifications = await prisma.notification.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip: offset,
                take: limit
            });

            const formattedNotifications = notifications.map(notification => ({
                notificationId: notification.id,
                title: notification.title,
                message: notification.message,
                date: notification.date,
                readStatus: notification.readStatus === 1,
                notificationType: notification.notificationType
            }));

            const totalPages = Math.ceil(totalItems / limit);

            return {
                data: formattedNotifications,
                pagination: {
                    totalItems,
                    totalPages,
                    currentPage: page,
                    itemsPerPage: limit
                }
            };
        } catch (error) {
            Logger.error('Failed to get notifications:', error);
            if (error.status) throw error;
            throw ErrorHandler.internalServerError('Failed to get notifications');
        }
    },

    async markAsRead(notificationId, userId) {
        try {
            const notification = await prisma.notification.findFirst({
                where: {
                    id: notificationId,
                    userId
                }
            });

            if (!notification) {
                throw ErrorHandler.notFound('Notification not found');
            }

            await prisma.notification.update({
                where: { id: notificationId },
                data: { readStatus: 1 }
            });

            return { success: true };
        } catch (error) {
            Logger.error('Failed to mark notification as read:', error);
            if (error.status) throw error;
            throw ErrorHandler.internalServerError('Failed to update notification');
        }
    },

    async createNotification({ userId, title, message, date, notificationType }) {
        try {
            // Create a new notification in the database
            const notification = await prisma.notification.create({
                data: {
                    userId,
                    title,
                    message,
                    date: date || moment().format('DD-MM-YYYY'),
                    readStatus: 0,
                    notificationType
                }
            });

            // Format the notification for the response
            const formattedNotification = {
                notificationId: notification.id,
                title: notification.title,
                message: notification.message,
                date: notification.date,
                readStatus: false,
                notificationType: notification.notificationType
            };

            await this.sendRealTimeNotification(userId, formattedNotification);

            return formattedNotification;
        } catch (error) {
            Logger.error('Failed to create notification:', error);
            if (error.status) throw error;
            throw ErrorHandler.internalServerError('Failed to create notification');
        }
    },

    async sendRealTimeNotification(userId, notification) {
        try {
            // Channel name includes userId for private channel
            const channelName = `private-user-${userId}`;

            // Send notification using Pusher
            await pusher.trigger(
                channelName,
                'new-notification',
                {
                    notification
                }
            );

            Logger.info(`Real-time notification sent to channel ${channelName}`);

            return { success: true };
        } catch (error) {
            Logger.error('Failed to send real-time notification:', error);
            // Don't throw an error here to prevent the main flow from being interrupted
            // Just log the error
            return { success: false, error: error.message };
        }
    },

    async getUserUnreadCount(userId) {
        try {
            // Count unread notifications
            const unreadCount = await prisma.notification.count({
                where: {
                    userId,
                    readStatus: 0
                }
            });

            return { unreadCount };
        } catch (error) {
            Logger.error('Failed to get unread notification count:', error);
            if (error.status) throw error;
            throw ErrorHandler.internalServerError('Failed to get unread count');
        }
    }
};

module.exports = NotificationService; 