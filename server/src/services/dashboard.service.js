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

            // Create date range for the month
            const startDate = moment(`01-${targetMonth.toString().padStart(2, '0')}-${targetYear}`, 'DD-MM-YYYY');
            const endDate = startDate.clone().endOf('month');

            const bookingStats = await prisma.booking.groupBy({
                by: ['buildingId'],
                where: {
                    createdAt: {
                        gte: startDate.toDate(),
                        lte: endDate.toDate()
                    },
                    bookingStatus: {
                        in: ['APPROVED', 'COMPLETED']
                    }
                },
                _count: {
                    id: true
                }
            });

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

            logger.info(`Booking statistics retrieved for ${targetMonth}/${targetYear}`);
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

            // Get statistics for multiple months (for comparison)
            const months = [];
            for (let i = 5; i >= 0; i--) {
                const date = moment(`01-${targetMonth.toString().padStart(2, '0')}-${targetYear}`, 'DD-MM-YYYY')
                    .subtract(i, 'months');
                months.push({
                    month: date.format('MM-YYYY'),
                    startDate: date.format('DD-MM-YYYY'),
                    endDate: date.clone().endOf('month').format('DD-MM-YYYY')
                });
            }

            const statistics = [];

            for (const monthData of months) {
                const transactions = await prisma.payment.findMany({
                    where: {
                        paymentDate: {
                            gte: monthData.startDate,
                            lte: monthData.endDate
                        },
                        paymentStatus: 'PAID'
                    },
                    select: {
                        totalAmount: true
                    }
                });

                const totalTransactions = transactions.length;
                const totalRevenue = transactions.reduce((sum, transaction) => sum + transaction.totalAmount, 0);

                statistics.push({
                    month: monthData.month,
                    totalTransactions,
                    totalRevenue
                });
            }

            logger.info(`Transaction statistics retrieved for ${targetMonth}/${targetYear}`);
            return statistics;
        } catch (error) {
            logger.error('Get transaction statistics service error:', error);
            throw error;
        }
    }
};

module.exports = DashboardService; 