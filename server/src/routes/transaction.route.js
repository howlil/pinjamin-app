const express = require('express');
const { TransactionController } = require('../controllers');
const { AuthMiddleware } = require('../middlewares');

function createTransactionRoutes() {
    const router = express.Router();

    // User endpoints (authenticated)
    // Get transaction history endpoint
    router.get(
        '/history',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('BORROWER'),
        TransactionController.getUserTransactionHistory
    );

    // Admin endpoints
    // Get all transactions endpoint
    router.get(
        '/admin',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('ADMIN'),
        TransactionController.getAllTransactions
    );

    // Export transactions to Excel endpoint
    router.get(
        '/admin/export',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('ADMIN'),
        TransactionController.exportTransactions
    );

    // Xendit webhook callback endpoint
    router.post(
        '/callback/xendit',
        TransactionController.xenditCallback
    );

    // Xendit refund webhook callback endpoint
    router.post(
        '/callback/refund',
        TransactionController.refundCallback
    );

    return router;
}

module.exports = createTransactionRoutes(); 