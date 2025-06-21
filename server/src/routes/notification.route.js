const express = require('express');
const { NotificationController } = require('../controllers');
const { AuthMiddleware } = require('../middlewares');

function createNotificationRoutes() {
    const router = express.Router();

    // Get notifications endpoint (authenticated)
    router.get(
        '/',
        AuthMiddleware.authenticate,
        NotificationController.getNotifications
    );

    // Get unread notification count endpoint (authenticated)
    router.get(
        '/unread-count',
        AuthMiddleware.authenticate,
        NotificationController.getUnreadCount
    );

    // Mark notification as read endpoint (authenticated)
    router.patch(
        '/:notificationId/read',
        AuthMiddleware.authenticate,
        NotificationController.markAsRead
    );

    return router;
}

module.exports = createNotificationRoutes(); 