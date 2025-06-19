const { prisma } = require('../configs');
const { ErrorHandler } = require('../utils');
const moment = require('moment');

const DashboardService = {
    async getBookingStatistics(month, year) {
        try {
            // Use current month/year if not provided
            const currentDate = moment();
            const targetMonth = month || currentDate.month() + 1; // moment months are 0-based
            const targetYear = year || currentDate.year();

            // Create date range for the month
            const startOfMonth = moment(`${targetYear}-${targetMonth}-01`, 'YYYY-MM-DD').startOf('month');
            const endOfMonth = moment(`${targetYear}-${targetMonth}-01`, 'YYYY-MM-DD').endOf('month');

            // Get all bookings for the specified month
            const bookings = await prisma.booking.findMany({
                where: {
                    createdAt: {
                        gte: startOfMonth.toDate(),
                        lte: endOfMonth.toDate()
                    },
                    bookingStatus: {
                        in: ['APPROVED', 'COMPLETED']
                    }
                },
                include: {
                    building: true
                }
            });

            // Group bookings by building
            const buildingStats = {};
            bookings.forEach(booking => {
                const buildingName = booking.building.buildingName;
                if (!buildingStats[buildingName]) {
                    buildingStats[buildingName] = 0;
                }
                buildingStats[buildingName]++;
            });

            // Convert to array format
            const statistics = Object.entries(buildingStats).map(([buildingName, totalBookings]) => ({
                buildingName,
                totalBookings
            }));

            // Sort by total bookings descending
            statistics.sort((a, b) => b.totalBookings - a.totalBookings);

            return statistics;
        } catch (error) {
            if (error.status) throw error;
            throw new ErrorHandler(500, error.message || 'Failed to get booking statistics');
        }
    },

    async getTransactionStatistics(month, year) {
        try {
            // Use current month/year if not provided
            const currentDate = moment();
            const targetMonth = month || currentDate.month() + 1; // moment months are 0-based
            const targetYear = year || currentDate.year();

            // Create date range for the month
            const startOfMonth = moment(`${targetYear}-${targetMonth}-01`, 'YYYY-MM-DD').startOf('month');
            const endOfMonth = moment(`${targetYear}-${targetMonth}-01`, 'YYYY-MM-DD').endOf('month');

            // Get all payments for the specified month
            const payments = await prisma.payment.findMany({
                where: {
                    createdAt: {
                        gte: startOfMonth.toDate(),
                        lte: endOfMonth.toDate()
                    },
                    paymentStatus: {
                        in: ['PAID', 'SETTLED']
                    }
                }
            });

            // Calculate totals
            let totalTransactions = payments.length;
            let totalRevenue = payments.reduce((sum, payment) => sum + payment.totalAmount, 0);

            // Format month as MM-YYYY
            const monthString = moment(`${targetYear}-${targetMonth}-01`).format('MM-YYYY');

            return [{
                month: monthString,
                totalTransactions,
                totalRevenue
            }];
        } catch (error) {
            if (error.status) throw error;
            throw new ErrorHandler(500, error.message || 'Failed to get transaction statistics');
        }
    }
};

module.exports = DashboardService; 