const DashboardService = require('../services/dashboard.service');
const ResponseHelper = require('../libs/response.lib');
const logger = require('../libs/logger.lib');

const DashboardController = {
    // Get booking statistics
    async getBookingStatistics(req, res) {
        try {
            const { month, year } = req.query;

            const statistics = await DashboardService.getBookingStatistics(month, year);
            return ResponseHelper.success(res, 'Statistik booking berhasil diambil', statistics);
        } catch (error) {
            logger.error('Get booking statistics controller error:', error);
            return ResponseHelper.error(res, 'Terjadi kesalahan saat mengambil statistik booking', 500);
        }
    },

    // Get transaction statistics
    async getTransactionStatistics(req, res) {
        try {
            const { month, year } = req.query;

            const statistics = await DashboardService.getTransactionStatistics(month, year);
            return ResponseHelper.success(res, 'Statistik transaksi berhasil diambil', statistics);
        } catch (error) {
            logger.error('Get transaction statistics controller error:', error);
            return ResponseHelper.error(res, 'Terjadi kesalahan saat mengambil statistik transaksi', 500);
        }
    }
};

module.exports = DashboardController; 