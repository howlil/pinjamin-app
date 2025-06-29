const express = require('express');
const NotificationController = require('../controllers/notification.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const ValidationMiddleware = require('../middlewares/validation.middleware');
const NotificationValidation = require('../validations/notification.validation');

const router = express.Router();

// Get notifications
router.get('/notifications',
    AuthMiddleware.authenticate,
    ValidationMiddleware.validateQuery(NotificationValidation.notificationQuerySchema),
    NotificationController.getNotifications
);

// Get unread notification count
router.get('/notifications/unread-count',
    AuthMiddleware.authenticate,
    NotificationController.getUnreadCount
);

// Mark all notifications as read
router.patch('/notifications/mark-all-read',
    AuthMiddleware.authenticate,
    NotificationController.markAsAllRead
);

module.exports = router; 