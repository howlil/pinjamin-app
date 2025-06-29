const NotificationService = require('../services/notification.service');
const ResponseHelper = require('../libs/response.lib');
const logger = require('../libs/logger.lib');

const NotificationController = {
    // Get notifications
    async getNotifications(req, res) {
        try {
            const userId = req.user.id;
            const { page, limit } = req.query;

            const result = await NotificationService.getNotifications(userId, { page, limit });

            return ResponseHelper.successWithPagination(
                res,
                'Notifikasi berhasil diambil',
                result.notifications,
                {
                    totalItems: result.totalItems,
                    totalPages: result.totalPages,
                    currentPage: result.currentPage,
                    itemsPerPage: result.itemsPerPage
                }
            );
        } catch (error) {
            logger.error('Get notifications controller error:', error);
            return ResponseHelper.error(res, 'Terjadi kesalahan saat mengambil notifikasi', 500);
        }
    },

    // Get unread notification count
    async getUnreadCount(req, res) {
        try {
            const userId = req.user.id;

            const unreadCount = await NotificationService.getUnreadCount(userId);

            return ResponseHelper.success(res, 'Jumlah notifikasi belum dibaca berhasil diambil', {
                unreadCount
            });
        } catch (error) {
            logger.error('Get unread count controller error:', error);
            return ResponseHelper.error(res, 'Terjadi kesalahan saat mengambil jumlah notifikasi', 500);
        }
    },

    // Mark all notifications as read
    async markAsAllRead(req, res) {
        try {
            const userId = req.user.id;

            // Log request details for debugging
            logger.info('Mark all notifications as read request:', {
                userId: userId,
                hasBody: !!req.body,
                bodyKeys: req.body ? Object.keys(req.body) : [],
                contentType: req.get('Content-Type'),
                method: req.method,
                url: req.originalUrl
            });

            const result = await NotificationService.markAsAllRead(userId);

            logger.info('Mark all notifications as read result:', {
                userId: userId,
                updatedCount: result.updatedCount
            });

            return ResponseHelper.success(res, 'Semua notifikasi berhasil ditandai sebagai dibaca', {
                updatedCount: result.updatedCount
            });
        } catch (error) {
            logger.error('Mark all notifications as read controller error:', error);
            return ResponseHelper.error(res, 'Terjadi kesalahan saat menandai semua notifikasi', 500);
        }
    }
};

module.exports = NotificationController; 