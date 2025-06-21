const { NotificationService } = require('../services');
const { Response, ErrorHandler } = require('../utils');

const NotificationController = {
    getNotifications: ErrorHandler.asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Validate pagination parameters
        if (page < 1) {
            throw ErrorHandler.badRequest('Page must be greater than 0');
        }
        if (limit < 1 || limit > 100) {
            throw ErrorHandler.badRequest('Limit must be between 1 and 100');
        }

        const result = await NotificationService.getNotifications(userId, page, limit);

        return Response.success(res, result.data, 'Notifications retrieved successfully', 200, result.pagination);
    }),

    getUnreadCount: ErrorHandler.asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const result = await NotificationService.getUserUnreadCount(userId);

        return Response.success(res, result, 'Unread notification count retrieved successfully');
    }),

    markAsRead: ErrorHandler.asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const { notificationId } = req.params;

        if (!notificationId) {
            throw ErrorHandler.badRequest('Notification ID is required');
        }

        await NotificationService.markAsRead(notificationId, userId);

        return Response.success(res, { success: true }, 'Notification marked as read');
    })
};

module.exports = NotificationController; 