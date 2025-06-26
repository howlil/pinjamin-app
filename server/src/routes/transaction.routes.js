const express = require('express');
const TransactionController = require('../controllers/transaction.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const ValidationMiddleware = require('../middlewares/validation.middleware');
const TransactionValidation = require('../validations/transaction.validation');

const router = express.Router();

// ===== USER ROUTES (Authentication required) =====

// Get transaction history for authenticated user
router.get('/transactions/history',
    AuthMiddleware.authenticate,
    ValidationMiddleware.validateQuery(TransactionValidation.historyQuerySchema),
    TransactionController.getTransactionHistory
);

// ===== ADMIN ROUTES (Admin authentication required) =====

// Get all transactions (admin)
router.get('/transactions/admin',
    AuthMiddleware.authenticate,
    AuthMiddleware.requireAdmin,
    ValidationMiddleware.validateQuery(TransactionValidation.adminPaginationQuerySchema),
    TransactionController.adminGetAllTransactions
);

// Export transactions to Excel
router.get('/transactions/admin/export',
    AuthMiddleware.authenticate,
    AuthMiddleware.requireAdmin,
    ValidationMiddleware.validateQuery(TransactionValidation.exportQuerySchema),
    TransactionController.exportTransactions
);

module.exports = router; 