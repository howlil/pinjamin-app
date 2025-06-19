const { DashboardService } = require('../services');
const { Response, ErrorHandler } = require('../utils');

const DashboardController = {
    async getBookingStatistics(req, res, next) {
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

            // Get booking statistics
            const statistics = await DashboardService.getBookingStatistics(month, year);

            return Response.success(res, statistics, 'Booking statistics retrieved successfully');
        } catch (error) {
            next(error);
        }
    },

    async getTransactionStatistics(req, res, next) {
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

            // Get transaction statistics
            const statistics = await DashboardService.getTransactionStatistics(month, year);

            return Response.success(res, statistics, 'Transaction statistics retrieved successfully');
        } catch (error) {
            next(error);
        }
    }
};

module.exports = DashboardController; 