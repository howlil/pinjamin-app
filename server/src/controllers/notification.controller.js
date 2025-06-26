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

    // Mark notification as read
    async markAsRead(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            await NotificationService.markAsRead(id, userId);

            return ResponseHelper.success(res, 'Notifikasi berhasil ditandai sebagai dibaca');
        } catch (error) {
            logger.error('Mark notification as read controller error:', error);

            if (error.message === 'Notifikasi tidak ditemukan') {
                return ResponseHelper.notFound(res, error.message);
            }

            if (error.message === 'Tidak memiliki akses ke notifikasi ini') {
                return ResponseHelper.forbidden(res, error.message);
            }

            return ResponseHelper.error(res, 'Terjadi kesalahan saat menandai notifikasi', 500);
        }
    }
};

module.exports = NotificationController; 