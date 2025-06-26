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

// Mark notification as read
router.patch('/notifications/:id/read',
    AuthMiddleware.authenticate,
    ValidationMiddleware.validateParams(NotificationValidation.notificationParamsSchema),
    NotificationController.markAsRead
);

module.exports = router; 