const express = require('express');
const DashboardController = require('../controllers/dashboard.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const ValidationMiddleware = require('../middlewares/validation.middleware');
const DashboardValidation = require('../validations/dashboard.validation');

const router = express.Router();

// ===== ADMIN ROUTES (Admin authentication required) =====

// Get booking statistics for dashboard
router.get('/dashboard/statistics/bookings',
    AuthMiddleware.authenticate,
    AuthMiddleware.requireAdmin,
    ValidationMiddleware.validateQuery(DashboardValidation.statisticsQuerySchema),
    DashboardController.getBookingStatistics
);

// Get transaction statistics for dashboard
router.get('/dashboard/statistics/transactions',
    AuthMiddleware.authenticate,
    AuthMiddleware.requireAdmin,
    ValidationMiddleware.validateQuery(DashboardValidation.statisticsQuerySchema),
    DashboardController.getTransactionStatistics
);

module.exports = router; 