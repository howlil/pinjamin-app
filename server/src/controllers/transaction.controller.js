const TransactionService = require('../services/transaction.service');
const ResponseHelper = require('../libs/response.lib');
const logger = require('../libs/logger.lib');

const TransactionController = {
    // Get transaction history
    async getTransactionHistory(req, res) {
        try {
            const userId = req.user.id;
            const { page, limit } = req.query;

            const result = await TransactionService.getTransactionHistory(userId, { page, limit });

            return ResponseHelper.successWithPagination(
                res,
                'History transaksi berhasil diambil',
                result.transactions,
                {
                    totalItems: result.totalItems,
                    totalPages: result.totalPages,
                    currentPage: result.currentPage,
                    itemsPerPage: result.itemsPerPage
                }
            );
        } catch (error) {
            logger.error('Get transaction history controller error:', error);
            return ResponseHelper.error(res, 'Terjadi kesalahan saat mengambil history transaksi', 500);
        }
    },

    // ===== ADMIN FUNCTIONS =====

    // Get all transactions (admin)
    async adminGetAllTransactions(req, res) {
        try {
            const { page, limit } = req.query;

            const result = await TransactionService.getAllTransactions({ page, limit });

            return ResponseHelper.successWithPagination(
                res,
                'Data transaksi berhasil diambil',
                result.transactions,
                {
                    totalItems: result.totalItems,
                    totalPages: result.totalPages,
                    currentPage: result.currentPage,
                    itemsPerPage: result.itemsPerPage
                }
            );
        } catch (error) {
            logger.error('Admin get all transactions controller error:', error);
            return ResponseHelper.error(res, 'Terjadi kesalahan saat mengambil data transaksi', 500);
        }
    },

    // Export transactions
    async exportTransactions(req, res) {
        try {
            const { month, year } = req.query;

            const result = await TransactionService.exportTransactions(month, year);
            return ResponseHelper.success(res, 'Export transaksi berhasil', result);
        } catch (error) {
            logger.error('Admin export transactions controller error:', error);
            return ResponseHelper.error(res, 'Terjadi kesalahan saat export transaksi', 500);
        }
    }
};

module.exports = TransactionController; 