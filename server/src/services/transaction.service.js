const { prisma } = require('../configs');
const { ErrorHandler } = require('../utils');
const moment = require('moment');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const TransactionService = {
    async getAllTransactions(page = 1, limit = 10) {
        try {
            // Calculate offset
            const offset = (page - 1) * limit;

            // Get total count
            const totalItems = await prisma.payment.count();

            // Get transactions
            const transactions = await prisma.payment.findMany({
                include: {
                    booking: {
                        include: {
                            building: true,
                            user: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: offset,
                take: limit
            });

            // Format transactions data
            const formattedTransactions = transactions.map(transaction => ({
                transactionId: transaction.id,
                buildingName: transaction.booking?.building?.buildingName || 'Unknown',
                paymentDate: transaction.paymentDate,
                totalAmount: transaction.totalAmount,
                paymentStatus: transaction.paymentStatus,
                paymentMethod: transaction.paymentMethod,
                invoiceNumber: transaction.invoiceNumber,
                borrowerName: transaction.booking?.user?.fullName || 'Unknown'
            }));

            // Calculate pagination data
            const totalPages = Math.ceil(totalItems / limit);

            return {
                data: formattedTransactions,
                pagination: {
                    totalItems,
                    totalPages,
                    currentPage: page,
                    itemsPerPage: limit
                }
            };
        } catch (error) {
            if (error.status) throw error;
            throw new ErrorHandler(500, error.message || 'Failed to get transactions');
        }
    },

    async exportTransactionsToExcel(month, year) {
        try {
            // Use current month/year if not provided
            const currentDate = moment();
            const targetMonth = month || currentDate.month() + 1; // moment months are 0-based
            const targetYear = year || currentDate.year();

            // Create date range for the month
            const startOfMonth = moment(`${targetYear}-${targetMonth}-01`, 'YYYY-MM-DD').startOf('month');
            const endOfMonth = moment(`${targetYear}-${targetMonth}-01`, 'YYYY-MM-DD').endOf('month');

            // Get transactions for the specified month
            const transactions = await prisma.payment.findMany({
                where: {
                    createdAt: {
                        gte: startOfMonth.toDate(),
                        lte: endOfMonth.toDate()
                    }
                },
                include: {
                    booking: {
                        include: {
                            building: true,
                            user: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            // Create Excel workbook
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Transactions');

            // Add headers
            worksheet.columns = [
                { header: 'Transaction ID', key: 'transactionId', width: 40 },
                { header: 'Building Name', key: 'buildingName', width: 30 },
                { header: 'Borrower Name', key: 'borrowerName', width: 25 },
                { header: 'Payment Date', key: 'paymentDate', width: 15 },
                { header: 'Payment Amount', key: 'paymentAmount', width: 15 },
                { header: 'Total Amount', key: 'totalAmount', width: 15 },
                { header: 'Payment Status', key: 'paymentStatus', width: 15 },
                { header: 'Payment Method', key: 'paymentMethod', width: 15 },
                { header: 'Invoice Number', key: 'invoiceNumber', width: 20 }
            ];

            // Add data rows
            transactions.forEach(transaction => {
                worksheet.addRow({
                    transactionId: transaction.id,
                    buildingName: transaction.booking?.building?.buildingName || 'Unknown',
                    borrowerName: transaction.booking?.user?.fullName || 'Unknown',
                    paymentDate: transaction.paymentDate,
                    paymentAmount: transaction.paymentAmount,
                    totalAmount: transaction.totalAmount,
                    paymentStatus: transaction.paymentStatus,
                    paymentMethod: transaction.paymentMethod,
                    invoiceNumber: transaction.invoiceNumber
                });
            });

            // Style the header row
            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE6E6FA' }
            };

            // Generate filename
            const fileName = `transactions_${targetMonth.toString().padStart(2, '0')}_${targetYear}.xlsx`;
            const filePath = path.join(process.cwd(), 'uploads', 'exports', fileName);

            // Ensure exports directory exists
            const exportsDir = path.dirname(filePath);
            if (!fs.existsSync(exportsDir)) {
                fs.mkdirSync(exportsDir, { recursive: true });
            }

            // Save file
            await workbook.xlsx.writeFile(filePath);

            // Return file URL
            const fileUrl = `/uploads/exports/${fileName}`;

            return {
                fileUrl
            };
        } catch (error) {
            if (error.status) throw error;
            throw new ErrorHandler(500, error.message || 'Failed to export transactions');
        }
    },

    async getUserTransactionHistory(userId, page = 1, limit = 10) {
        try {
            // Calculate offset
            const offset = (page - 1) * limit;

            // Get total count for user's transactions
            const totalItems = await prisma.payment.count({
                where: {
                    booking: {
                        userId: userId
                    }
                }
            });

            // Get user's transactions
            const transactions = await prisma.payment.findMany({
                where: {
                    booking: {
                        userId: userId
                    }
                },
                include: {
                    booking: {
                        include: {
                            building: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: offset,
                take: limit
            });

            // Format transactions data
            const formattedTransactions = transactions.map(transaction => ({
                transactionId: transaction.id,
                buildingName: transaction.booking?.building?.buildingName || 'Unknown',
                paymentDate: transaction.paymentDate,
                totalAmount: transaction.totalAmount,
                paymentStatus: transaction.paymentStatus,
                paymentMethod: transaction.paymentMethod,
                invoiceNumber: transaction.invoiceNumber
            }));

            // Calculate pagination data
            const totalPages = Math.ceil(totalItems / limit);

            return {
                data: formattedTransactions,
                pagination: {
                    totalItems,
                    totalPages,
                    currentPage: page,
                    itemsPerPage: limit
                }
            };
        } catch (error) {
            if (error.status) throw error;
            throw new ErrorHandler(500, error.message || 'Failed to get user transaction history');
        }
    },

    async processXenditCallback(callbackData) {
        try {
            const { id, external_id, status, payment_method, paid_amount, paid_at } = callbackData;

            // Find payment by external_id (booking ID)
            const payment = await prisma.payment.findFirst({
                where: {
                    booking: {
                        id: external_id
                    }
                },
                include: {
                    booking: {
                        include: {
                            user: true,
                            building: true
                        }
                    }
                }
            });

            if (!payment) {
                throw new ErrorHandler(404, 'Payment not found');
            }

            // Update payment status based on Xendit status
            let paymentStatus = 'PENDING';
            if (status === 'PAID' || status === 'SETTLED') {
                paymentStatus = 'PAID';
            } else if (status === 'EXPIRED') {
                paymentStatus = 'EXPIRED';
            }

            // Update payment record
            await prisma.payment.update({
                where: { id: payment.id },
                data: {
                    paymentStatus: paymentStatus,
                    paymentMethod: payment_method || payment.paymentMethod,
                    paymentDate: moment(paid_at).format('DD-MM-YYYY')
                }
            });

            // If payment is successful, update booking status
            if (paymentStatus === 'PAID') {
                await prisma.booking.update({
                    where: { id: external_id },
                    data: { bookingStatus: 'APPROVED' }
                });

                // Create notification for successful payment
                if (payment.booking.user) {
                    await prisma.notification.create({
                        data: {
                            userId: payment.booking.user.id,
                            notificationType: 'PAYMENT',
                            title: 'Payment Successful',
                            message: `Payment for ${payment.booking.building.buildingName} has been confirmed. Your booking is now approved.`,
                            date: moment().format('DD-MM-YYYY'),
                            readStatus: 0
                        }
                    });
                }
            }

            return { success: true };
        } catch (error) {
            if (error.status) throw error;
            throw new ErrorHandler(500, error.message || 'Failed to process Xendit callback');
        }
    },

    async processRefundCallback(callbackData) {
        try {
            const { id, status, reference_id, amount, payment_id } = callbackData;

            // Find refund by reference_id (refund ID in our system)
            const refund = await prisma.refund.findUnique({
                where: { id: reference_id },
                include: {
                    payment: {
                        include: {
                            booking: {
                                include: {
                                    user: true,
                                    building: true
                                }
                            }
                        }
                    }
                }
            });

            if (!refund) {
                throw new ErrorHandler(404, 'Refund record not found');
            }

            // Update refund status based on Xendit status
            let refundStatus = 'PENDING';
            if (status === 'SUCCEEDED') {
                refundStatus = 'SUCCEEDED';
            } else if (status === 'FAILED') {
                refundStatus = 'FAILED';
            }

            // Update refund record
            await prisma.refund.update({
                where: { id: reference_id },
                data: {
                    refundStatus: refundStatus,
                    xenditRefundTransactionId: id
                }
            });

            // Create notification for refund status update
            if (refund.payment.booking.user) {
                const message = refundStatus === 'SUCCEEDED'
                    ? `Refund of Rp ${amount.toLocaleString('id-ID')} for ${refund.payment.booking.building.buildingName} has been processed successfully.`
                    : `Refund processing failed for ${refund.payment.booking.building.buildingName}. Please contact support.`;

                await prisma.notification.create({
                    data: {
                        userId: refund.payment.booking.user.id,
                        notificationType: 'PAYMENT',
                        title: `Refund ${refundStatus}`,
                        message: message,
                        date: moment().format('DD-MM-YYYY'),
                        readStatus: 0
                    }
                });
            }

            return { success: true };
        } catch (error) {
            if (error.status) throw error;
            throw new ErrorHandler(500, error.message || 'Failed to process refund callback');
        }
    }
};

module.exports = TransactionService; 