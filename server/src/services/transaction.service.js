const prisma = require('../libs/database.lib');
const logger = require('../libs/logger.lib');

const TransactionService = {
    // Get transaction history for user
    async getTransactionHistory(userId, pagination) {
        try {
            const { page = 1, limit = 10 } = pagination;
            const skip = (page - 1) * limit;

            const [transactions, totalItems] = await Promise.all([
                prisma.payment.findMany({
                    where: {
                        booking: {
                            userId: userId
                        }
                    },
                    include: {
                        booking: {
                            include: {
                                building: {
                                    select: {
                                        buildingName: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    skip,
                    take: limit
                }),
                prisma.payment.count({
                    where: {
                        booking: {
                            userId: userId
                        }
                    }
                })
            ]);

            logger.info('Transactions:', transactions);

            const formattedTransactions = transactions.map(transaction => ({
                transactionId: transaction.id,
                bookingId: transaction.bookingId,
                buildingName: transaction.booking.building.buildingName,
                paymentDate: transaction.paymentDate,
                totalAmount: transaction.totalAmount,
                paymentStatus: transaction.paymentStatus,
                paymentMethod: transaction.paymentMethod,
                invoiceNumber: transaction.invoiceNumber
            }));

            return {
                transactions: formattedTransactions,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: parseInt(page),
                itemsPerPage: parseInt(limit)
            };
        } catch (error) {
            logger.error('Get transaction history service error:', error);
            throw error;
        }
    },

    // Get all transactions for admin
    async getAllTransactions(pagination) {
        try {
            const { page = 1, limit = 10 } = pagination;
            const skip = (page - 1) * limit;

            const [transactions, totalItems] = await Promise.all([
                prisma.payment.findMany({
                    include: {
                        booking: {
                            include: {
                                building: {
                                    select: {
                                        buildingName: true
                                    }
                                },
                                user: {
                                    select: {
                                        fullName: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    skip,
                    take: limit
                }),
                prisma.payment.count()
            ]);

            const formattedTransactions = transactions.map(transaction => ({
                transactionId: transaction.id,
                buildingName: transaction.booking.building.buildingName,
                paymentDate: transaction.paymentDate,
                totalAmount: transaction.totalAmount,
                paymentStatus: transaction.paymentStatus,
                paymentMethod: transaction.paymentMethod,
                invoiceNumber: transaction.invoiceNumber,
                borrowerName: transaction.booking.user.fullName
            }));

            return {
                transactions: formattedTransactions,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: parseInt(page),
                itemsPerPage: parseInt(limit)
            };
        } catch (error) {
            logger.error('Get all transactions service error:', error);
            throw error;
        }
    },

    // Export transactions to Excel
    async exportTransactions(month, year) {
        try {
            const XLSX = require('xlsx');
            const moment = require('moment');
            const path = require('path');
            const fs = require('fs');

            // Create date filter
            const startDate = moment(`01-${month.toString().padStart(2, '0')}-${year}`, 'DD-MM-YYYY');
            const endDate = startDate.clone().endOf('month');

            const transactions = await prisma.payment.findMany({
                where: {
                    paymentDate: {
                        gte: startDate.format('DD-MM-YYYY'),
                        lte: endDate.format('DD-MM-YYYY')
                    },
                    paymentStatus: 'PAID'
                },
                include: {
                    booking: {
                        include: {
                            building: {
                                select: {
                                    buildingName: true
                                }
                            },
                            user: {
                                select: {
                                    fullName: true,
                                    email: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    paymentDate: 'asc'
                }
            });

            // Prepare data for Excel
            const excelData = transactions.map((transaction, index) => ({
                'No': index + 1,
                'Invoice Number': transaction.invoiceNumber,
                'Tanggal Pembayaran': transaction.paymentDate,
                'Nama Peminjam': transaction.booking.user.fullName,
                'Email': transaction.booking.user.email,
                'Building': transaction.booking.building.buildingName,
                'Metode Pembayaran': transaction.paymentMethod,
                'Total Amount': transaction.totalAmount,
                'Status': transaction.paymentStatus
            }));

            // Create workbook and worksheet
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(excelData);

            // Auto-width columns
            const maxWidths = {};
            excelData.forEach(row => {
                Object.keys(row).forEach(key => {
                    const length = String(row[key]).length;
                    maxWidths[key] = Math.max(maxWidths[key] || 0, length);
                });
            });

            worksheet['!cols'] = Object.keys(maxWidths).map(key => ({
                wch: Math.min(maxWidths[key] + 2, 50)
            }));

            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

            // Generate filename and save
            const filename = `transactions_${month.toString().padStart(2, '0')}_${year}.xlsx`;
            const filepath = path.join(__dirname, '../../uploads/exports', filename);

            // Ensure exports directory exists
            const exportsDir = path.join(__dirname, '../../uploads/exports');
            if (!fs.existsSync(exportsDir)) {
                fs.mkdirSync(exportsDir, { recursive: true });
            }

            XLSX.writeFile(workbook, filepath);

            const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
            const fileUrl = `${baseUrl}/uploads/exports/${filename}`;

            logger.info(`Transactions exported: ${filename}`);
            return { fileUrl };
        } catch (error) {
            logger.error('Export transactions service error:', error);
            throw error;
        }
    }
};

module.exports = TransactionService; 