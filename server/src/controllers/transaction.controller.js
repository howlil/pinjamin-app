const { TransactionService } = require('../services');
const { Response, ErrorHandler } = require('../utils');

const TransactionController = {
    async getAllTransactions(req, res, next) {
        try {
            // Get pagination parameters
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            // Validate pagination parameters
            if (page < 1) {
                throw new ErrorHandler(400, 'Page must be greater than 0');
            }
            if (limit < 1 || limit > 100) {
                throw new ErrorHandler(400, 'Limit must be between 1 and 100');
            }

            // Get transactions
            const result = await TransactionService.getAllTransactions(page, limit);

            return Response.success(res, result.data, 'Transactions retrieved successfully', 200, result.pagination);
        } catch (error) {
            next(error);
        }
    },

    async exportTransactions(req, res, next) {
        try {
            // Get month and year from query parameters
            const month = req.query.month ? parseInt(req.query.month) : null;
            const year = req.query.year ? parseInt(req.query.year) : null;

            // Validate month if provided
            if (month !== null && (month < 1 || month > 12)) {
                throw new ErrorHandler(400, 'Month must be between 1 and 12');
            }

            // Validate year if provided
            if (year !== null && (year < 2000 || year > 2100)) {
                throw new ErrorHandler(400, 'Year must be between 2000 and 2100');
            }

            // Export transactions
            const result = await TransactionService.exportTransactionsToExcel(month, year);

            return Response.success(res, result, 'Transactions exported successfully');
        } catch (error) {
            next(error);
        }
    },

    async getUserTransactionHistory(req, res, next) {
        try {
            // Get user ID from authenticated user
            const userId = req.user.id;

            // Get pagination parameters
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            // Validate pagination parameters
            if (page < 1) {
                throw new ErrorHandler(400, 'Page must be greater than 0');
            }
            if (limit < 1 || limit > 100) {
                throw new ErrorHandler(400, 'Limit must be between 1 and 100');
            }

            // Get user transaction history
            const result = await TransactionService.getUserTransactionHistory(userId, page, limit);

            return Response.success(res, result.data, 'Transaction history retrieved successfully', 200, result.pagination);
        } catch (error) {
            next(error);
        }
    },

    async xenditCallback(req, res, next) {
        try {
            // Process Xendit payment callback
            const result = await TransactionService.processXenditCallback(req.body);

            return Response.success(res, { received: true }, 'Callback processed successfully');
        } catch (error) {
            next(error);
        }
    },

    async refundCallback(req, res, next) {
        try {
            // Process Xendit refund callback
            const result = await TransactionService.processRefundCallback(req.body);

            return Response.success(res, { received: true }, 'Refund callback processed successfully');
        } catch (error) {
            next(error);
        }
    }
};

module.exports = TransactionController; 