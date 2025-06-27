const prisma = require('../libs/database.lib');
const logger = require('../libs/logger.lib');
const moment = require('moment');

const DashboardService = {
    // Get booking statistics by building
    async getBookingStatistics(month, year) {
        try {
            const currentDate = new Date();
            const targetMonth = month || (currentDate.getMonth() + 1);
            const targetYear = year || currentDate.getFullYear();

            logger.info(`Getting booking statistics for month: ${targetMonth}, year: ${targetYear}`);

            // Create date range for the month
            const startDate = moment()
                .year(targetYear)
                .month(targetMonth - 1) // moment month is 0-indexed
                .startOf('month')
                .toDate();
            const endDate = moment()
                .year(targetYear)
                .month(targetMonth - 1)
                .endOf('month')
                .toDate();

            logger.info('Date range:', {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            });

            const bookingStats = await prisma.booking.groupBy({
                by: ['buildingId'],
                where: {
                    createdAt: {
                        gte: startDate,
                        lte: endDate
                    },
                    bookingStatus: {
                        in: ['APPROVED', 'COMPLETED']
                    }
                },
                _count: {
                    id: true
                }
            });

            logger.info(`Found ${bookingStats.length} buildings with bookings in the specified period`);

            // Get building names
            const buildingIds = bookingStats.map(stat => stat.buildingId);
            const buildings = await prisma.building.findMany({
                where: {
                    id: {
                        in: buildingIds
                    }
                },
                select: {
                    id: true,
                    buildingName: true
                }
            });

            const buildingMap = buildings.reduce((map, building) => {
                map[building.id] = building.buildingName;
                return map;
            }, {});

            const statistics = bookingStats.map(stat => ({
                buildingName: buildingMap[stat.buildingId] || 'Unknown Building',
                totalBookings: stat._count.id
            }));

            logger.info(`Booking statistics retrieved for ${targetMonth}/${targetYear}: ${statistics.length} buildings`);
            return statistics;
        } catch (error) {
            logger.error('Get booking statistics service error:', error);
            throw error;
        }
    },

    // Get transaction statistics by month
    async getTransactionStatistics(month, year) {
        try {
            const currentDate = new Date();
            const targetMonth = month || (currentDate.getMonth() + 1);
            const targetYear = year || currentDate.getFullYear();

            logger.info(`Getting transaction statistics for month: ${targetMonth}, year: ${targetYear}`);

            // Create date range for the specific month only
            const startDate = moment()
                .year(targetYear)
                .month(targetMonth - 1) // moment month is 0-indexed
                .startOf('month')
                .toDate();
            const endDate = moment()
                .year(targetYear)
                .month(targetMonth - 1)
                .endOf('month')
                .toDate();

            logger.info('Date range:', {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            });

            const transactions = await prisma.payment.findMany({
                where: {
                    createdAt: {
                        gte: startDate,
                        lte: endDate
                    },
                    paymentStatus: 'PAID'
                },
                select: {
                    totalAmount: true,
                    createdAt: true
                }
            });

            const totalTransactions = transactions.length;
            const totalRevenue = transactions.reduce((sum, transaction) => sum + transaction.totalAmount, 0);

            const monthName = moment()
                .year(targetYear)
                .month(targetMonth - 1)
                .format('MMMM YYYY');

            logger.info(`Transaction statistics for ${monthName}: ${totalTransactions} transactions, Revenue: ${totalRevenue}`);

            const statistics = [{
                month: moment().year(targetYear).month(targetMonth - 1).format('MM-YYYY'),
                monthName: monthName,
                totalTransactions,
                totalRevenue
            }];

            logger.info(`Transaction statistics retrieved for ${targetMonth}/${targetYear}: single month data`);
            return statistics;
        } catch (error) {
            logger.error('Get transaction statistics service error:', error);
            throw error;
        }
    }
};

module.exports = DashboardService; 