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
    }
};

module.exports = TransactionService; 