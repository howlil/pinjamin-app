const DashboardService = require('../services/dashboard.service');
const ResponseHelper = require('../libs/response.lib');
const logger = require('../libs/logger.lib');

const DashboardController = {
    // Get booking statistics
    async getBookingStatistics(req, res) {
        try {
            const { month, year } = req.query;

            // Parse parameters as integers
            const targetMonth = month ? parseInt(month, 10) : undefined;
            const targetYear = year ? parseInt(year, 10) : undefined;

            logger.info('Booking statistics request:', {
                rawMonth: month,
                rawYear: year,
                parsedMonth: targetMonth,
                parsedYear: targetYear
            });

            const statistics = await DashboardService.getBookingStatistics(targetMonth, targetYear);
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

            // Parse parameters as integers
            const targetMonth = month ? parseInt(month, 10) : undefined;
            const targetYear = year ? parseInt(year, 10) : undefined;

            logger.info('Transaction statistics request:', {
                rawMonth: month,
                rawYear: year,
                parsedMonth: targetMonth,
                parsedYear: targetYear
            });

            const statistics = await DashboardService.getTransactionStatistics(targetMonth, targetYear);
            return ResponseHelper.success(res, 'Statistik transaksi berhasil diambil', statistics);
        } catch (error) {
            logger.error('Get transaction statistics controller error:', error);
            return ResponseHelper.error(res, 'Terjadi kesalahan saat mengambil statistik transaksi', 500);
        }
    }
};

module.exports = DashboardController; 