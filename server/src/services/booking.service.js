const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const prisma = require('../libs/database.lib');
const logger = require('../libs/logger.lib');
const XenditHelper = require('../libs/xendit.lib');
const { getFileUrl } = require('../libs/multer.lib');
const NotificationService = require('./notification.service');
const PusherHelper = require('../libs/pusher.lib');

const BookingService = {
    // Create booking
    async createBooking(userId, bookingData, proposalLetter) {
        try {
            const { buildingId, activityName, startDate, endDate, startTime, endTime } = bookingData;

            // Check if building exists
            const building = await prisma.building.findUnique({
                where: { id: buildingId }
            });

            if (!building) {
                throw new Error('Building tidak ditemukan');
            }

            // Check building availability
            const isAvailable = await this.checkBookingAvailability(
                buildingId, startDate, endDate, startTime, endTime
            );

            if (!isAvailable) {
                throw new Error('Building tidak tersedia pada waktu yang dipilih');
            }

            // Get user data
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            // Create booking
            const bookingId = uuidv4();
            const proposalLetterUrl = getFileUrl(proposalLetter.filename, 'documents');

            const booking = await prisma.booking.create({
                data: {
                    id: bookingId,
                    userId,
                    buildingId,
                    activityName,
                    startDate,
                    endDate: endDate || startDate,
                    startTime,
                    endTime,
                    proposalLetter: proposalLetterUrl,
                    bookingStatus: 'PROCESSING'
                }
            });

            // Create Xendit invoice
            const invoiceData = {
                externalId: bookingId,
                amount: building.rentalPrice,
                payerEmail: user.email,
                description: `Pembayaran sewa ${building.buildingName} - ${activityName}`,
                successRedirectUrl: `${process.env.FRONTEND_URL}/payment/success`,
                failureRedirectUrl: `${process.env.FRONTEND_URL}/payment/failed`,
                items: [{
                    name: building.buildingName,
                    quantity: 1,
                    price: building.rentalPrice
                }]
            };

            logger.info('Creating Xendit invoice for booking:', bookingId);
            let xenditInvoice;

            try {
                xenditInvoice = await XenditHelper.createInvoice(invoiceData);

                if (!xenditInvoice || !xenditInvoice.id) {
                    throw new Error('Invalid response from Xendit service');
                }

                logger.info(`Xendit invoice created successfully: ${xenditInvoice.id}`);
            } catch (xenditError) {
                logger.error('Failed to create Xendit invoice:', xenditError);

                // Clean up the booking if invoice creation fails
                await prisma.booking.delete({
                    where: { id: bookingId }
                });

                throw new Error('Gagal membuat invoice pembayaran. Silakan coba lagi.');
            }

            // Create payment record
            await prisma.payment.create({
                data: {
                    id: uuidv4(),
                    xenditTransactionId: xenditInvoice.id,
                    bookingId,
                    invoiceNumber: XenditHelper.generateInvoiceNumber(),
                    paymentDate: moment().format('DD-MM-YYYY'),
                    paymentAmount: building.rentalPrice,
                    totalAmount: building.rentalPrice,
                    paymentMethod: 'XENDIT',
                    paymentUrl: xenditInvoice.invoice_url,
                    snapToken: xenditInvoice.id,
                    paymentStatus: 'UNPAID'
                }
            });

            // Send notifications
            try {
                // Notification for user
                await NotificationService.createBookingNotification(userId, 'CREATED', {
                    buildingName: building.buildingName,
                    bookingId: booking.id,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    amount: building.rentalPrice
                });

                // Notification for admin
                await PusherHelper.sendAdminNotification('NEW_BOOKING', {
                    bookingId: booking.id,
                    buildingName: building.buildingName,
                    borrowerName: user.fullName,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    amount: building.rentalPrice
                });
            } catch (notificationError) {
                logger.warn('Failed to send booking notifications:', notificationError);
            }

            logger.info(`Booking created: ${bookingId}`);

            return {
                bookingId: booking.id,
                buildingName: building.buildingName,
                startDate: booking.startDate,
                endDate: booking.endDate,
                startTime: booking.startTime,
                endTime: booking.endTime,
                status: booking.bookingStatus,
                payment: {
                    paymentUrl: xenditInvoice.invoice_url
                }
            };
        } catch (error) {
            logger.error('Create booking service error:', error);
            throw error;
        }
    },

    // Check booking availability
    async checkBookingAvailability(buildingId, startDate, endDate, startTime, endTime) {
        try {
            const targetEndDate = endDate || startDate;

            const existingBookings = await prisma.booking.findMany({
                where: {
                    buildingId,
                    bookingStatus: {
                        in: ['APPROVED', 'PROCESSING']
                    },
                    OR: [
                        // Check date overlap
                        {
                            AND: [
                                { startDate: { lte: targetEndDate } },
                                { endDate: { gte: startDate } }
                            ]
                        }
                    ]
                }
            });

            // Check time conflicts on overlapping dates
            for (const booking of existingBookings) {
                const hasTimeConflict = this.checkTimeConflict(
                    startTime, endTime, booking.startTime, booking.endTime
                );

                if (hasTimeConflict) {
                    return false;
                }
            }

            return true;
        } catch (error) {
            logger.error('Check booking availability error:', error);
            throw error;
        }
    },

    // Check time conflict
    checkTimeConflict(startTime1, endTime1, startTime2, endTime2) {
        const start1 = moment(startTime1, 'HH:mm');
        const end1 = moment(endTime1, 'HH:mm');
        const start2 = moment(startTime2, 'HH:mm');
        const end2 = moment(endTime2, 'HH:mm');

        return start1.isBefore(end2) && end1.isAfter(start2);
    },

    // Process payment
    async processPayment(bookingId, userId) {
        try {
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: {
                    payment: true,
                    building: true
                }
            });

            if (!booking) {
                throw new Error('Booking tidak ditemukan');
            }

            if (booking.userId !== userId) {
                throw new Error('Tidak memiliki akses ke booking ini');
            }

            if (booking.bookingStatus !== 'PROCESSING') {
                throw new Error('Booking tidak bisa diproses untuk pembayaran');
            }

            if (!booking.payment) {
                throw new Error('Data payment tidak ditemukan');
            }

            // Get Xendit invoice details
            const xenditInvoice = await XenditHelper.getInvoice(booking.payment.xenditTransactionId);

            return {
                paymentUrl: xenditInvoice.invoice_url,
                snapToken: xenditInvoice.id
            };
        } catch (error) {
            logger.error('Process payment service error:', error);
            throw error;
        }
    },

    // Get booking history
    async getBookingHistory(userId, filters, pagination) {
        try {
            const { status } = filters || {};
            const { page = 1, limit = 10 } = pagination || {};
            const skip = (page - 1) * limit;

            // Build where clause
            const whereClause = { userId };
            if (status && status.trim() !== '') {
                whereClause.bookingStatus = status;
            }

            const [bookings, totalItems] = await Promise.all([
                prisma.booking.findMany({
                    where: whereClause,
                    include: {
                        building: {
                            select: {
                                buildingName: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    skip,
                    take: limit
                }),
                prisma.booking.count({
                    where: whereClause
                })
            ]);

            const formattedBookings = bookings.map(booking => ({
                bookingId: booking.id,
                buildingName: booking.building.buildingName,
                startDate: booking.startDate,
                endDate: booking.endDate,
                startTime: booking.startTime,
                endTime: booking.endTime,
                status: booking.bookingStatus
            }));

            return {
                bookings: formattedBookings,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: parseInt(page),
                itemsPerPage: parseInt(limit)
            };
        } catch (error) {
            logger.error('Get booking history service error:', error);
            throw error;
        }
    },

    // Generate invoice
    async generateInvoice(bookingId, userId) {
        try {
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: {
                    payment: true,
                    building: true,
                    user: true
                }
            });

            if (!booking) {
                throw new Error('Booking tidak ditemukan');
            }

            if (booking.userId !== userId) {
                throw new Error('Tidak memiliki akses ke booking ini');
            }

            if (!booking.payment || booking.payment.paymentStatus !== 'PAID') {
                throw new Error('Pembayaran belum selesai');
            }

            return {
                invoiceNumber: booking.payment.invoiceNumber,
                date: booking.payment.paymentDate,
                paymentMethod: booking.payment.paymentMethod,
                customer: {
                    borrowerName: booking.user.fullName,
                    email: booking.user.email,
                    phoneNumber: booking.user.phoneNumber
                },
                item: {
                    buildingName: booking.building.buildingName,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    startTime: booking.startTime,
                    endTime: booking.endTime,
                    totalAmount: booking.payment.totalAmount
                }
            };
        } catch (error) {
            logger.error('Generate invoice service error:', error);
            throw error;
        }
    },

    // Process Xendit webhook
    async processWebhook(webhookData) {
        try {
            const { external_id, status, payment_method, paid_amount } = webhookData;

            const booking = await prisma.booking.findUnique({
                where: { id: external_id },
                include: { payment: true }
            });

            if (!booking) {
                logger.warn(`Booking not found for webhook: ${external_id}`);
                return false;
            }

            const paymentStatus = XenditHelper.mapPaymentStatus(status);

            // Update payment status
            await prisma.payment.update({
                where: { bookingId: external_id },
                data: {
                    paymentStatus,
                    paymentMethod: payment_method,
                    paymentAmount: paid_amount
                }
            });

            // Update booking status if payment is successful
            if (paymentStatus === 'PAID') {
                await prisma.booking.update({
                    where: { id: external_id },
                    data: {
                        bookingStatus: 'PROCESSING' // Still needs admin approval
                    }
                });

                // Get booking details for notification
                const bookingWithDetails = await prisma.booking.findUnique({
                    where: { id: external_id },
                    include: {
                        building: true,
                        user: true
                    }
                });

                // Send payment success notifications
                try {
                    // Notification for user
                    await NotificationService.createPaymentNotification(booking.userId, 'PAID', {
                        buildingName: bookingWithDetails.building.buildingName,
                        amount: paid_amount,
                        bookingId: external_id,
                        paymentMethod: payment_method
                    });

                    // Notification for admin
                    await PusherHelper.sendAdminNotification('PAYMENT_SUCCESS', {
                        bookingId: external_id,
                        buildingName: bookingWithDetails.building.buildingName,
                        borrowerName: bookingWithDetails.user.fullName,
                        amount: paid_amount,
                        paymentMethod: payment_method
                    });
                } catch (notificationError) {
                    logger.warn('Failed to send payment notifications:', notificationError);
                }
            } else if (paymentStatus === 'FAILED' || paymentStatus === 'EXPIRED') {
                // Send failure notification for user
                try {
                    const bookingWithDetails = await prisma.booking.findUnique({
                        where: { id: external_id },
                        include: { building: true }
                    });

                    await NotificationService.createPaymentNotification(booking.userId, paymentStatus, {
                        buildingName: bookingWithDetails.building.buildingName,
                        amount: paid_amount,
                        bookingId: external_id,
                        paymentMethod: payment_method
                    });
                } catch (notificationError) {
                    logger.warn('Failed to send payment failure notification:', notificationError);
                }
            }

            logger.info(`Webhook processed for booking: ${external_id}, status: ${paymentStatus}`);
            return true;
        } catch (error) {
            logger.error('Process webhook service error:', error);
            throw error;
        }
    },

    // ===== ADMIN FUNCTIONS =====

    // Get bookings with filters (admin)
    async adminGetBookings(filters) {
        try {
            const { status, page = 1, limit = 10 } = filters;
            const skip = (page - 1) * limit;

            const whereClause = {};
            if (status && status.trim() !== '') {
                whereClause.bookingStatus = status;
            }

            const [bookings, totalItems] = await Promise.all([
                prisma.booking.findMany({
                    where: whereClause,
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
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    skip,
                    take: limit
                }),
                prisma.booking.count({
                    where: whereClause
                })
            ]);

            const formattedBookings = bookings.map(booking => ({
                bookingId: booking.id,
                buildingName: booking.building.buildingName,
                activityName: booking.activityName,
                startDate: booking.startDate,
                endDate: booking.endDate,
                startTime: booking.startTime,
                endTime: booking.endTime,
                status: booking.bookingStatus,
                borrowerName: booking.user?.fullName || 'Unknown'
            }));

            return {
                bookings: formattedBookings,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: parseInt(page),
                itemsPerPage: parseInt(limit)
            };
        } catch (error) {
            logger.error('Admin get bookings service error:', error);
            throw error;
        }
    },

    // Approve or reject booking
    async approveRejectBooking(bookingId, bookingStatus, rejectionReason) {
        try {
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: {
                    building: true,
                    user: true,
                    payment: true
                }
            });

            if (!booking) {
                throw new Error('Booking tidak ditemukan');
            }

            if (booking.bookingStatus !== 'PROCESSING') {
                throw new Error('Booking tidak bisa diproses karena status sudah berubah');
            }

            if (bookingStatus === 'REJECTED' && !rejectionReason) {
                throw new Error('Alasan penolakan wajib diisi untuk booking yang ditolak');
            }

            // Update booking status
            const updateData = {
                bookingStatus,
                rejectionReason: bookingStatus === 'REJECTED' ? rejectionReason : null
            };

            const updatedBooking = await prisma.booking.update({
                where: { id: bookingId },
                data: updateData
            });

            // Create notification for user
            if (bookingStatus === 'APPROVED') {
                await NotificationService.createBookingNotification(booking.userId, 'APPROVED', {
                    buildingName: booking.building.buildingName,
                    bookingId: booking.id,
                    startDate: booking.startDate,
                    endDate: booking.endDate
                });
            } else if (bookingStatus === 'REJECTED') {
                await NotificationService.createBookingNotification(booking.userId, 'REJECTED', {
                    buildingName: booking.building.buildingName,
                    bookingId: booking.id,
                    rejectionReason: rejectionReason,
                    startDate: booking.startDate,
                    endDate: booking.endDate
                });

                // Process refund if payment was made
                if (booking.payment && booking.payment.paymentStatus === 'PAID') {
                    await this.processAutomaticRefund(bookingId, 'Booking ditolak oleh admin');
                }
            }

            logger.info(`Booking ${bookingStatus.toLowerCase()}: ${bookingId}`);

            return {
                bookingId: updatedBooking.id,
                buildingName: booking.building.buildingName,
                startDate: updatedBooking.startDate,
                endDate: updatedBooking.endDate,
                status: updatedBooking.bookingStatus,
                rejectionReason: updatedBooking.rejectionReason
            };
        } catch (error) {
            logger.error('Approve/reject booking service error:', error);
            throw error;
        }
    },

    // Get booking history with filters (admin)
    async adminGetBookingHistory(filters) {
        try {
            const { buildingId, startDate, endDate, page = 1, limit = 10 } = filters;
            const skip = (page - 1) * limit;

            const whereClause = {};

            if (buildingId) {
                whereClause.buildingId = buildingId;
            }

            if (startDate && endDate) {
                whereClause.OR = [
                    {
                        startDate: {
                            gte: startDate,
                            lte: endDate
                        }
                    },
                    {
                        endDate: {
                            gte: startDate,
                            lte: endDate
                        }
                    }
                ];
            }

            const [bookings, totalItems] = await Promise.all([
                prisma.booking.findMany({
                    where: whereClause,
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
                        },
                        payment: {
                            select: {
                                paymentStatus: true,
                                totalAmount: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    skip,
                    take: limit
                }),
                prisma.booking.count({
                    where: whereClause
                })
            ]);

            const formattedBookings = bookings.map(booking => ({
                bookingId: booking.id,
                buildingName: booking.building.buildingName,
                activityName: booking.activityName,
                startDate: booking.startDate,
                endDate: booking.endDate,
                startTime: booking.startTime,
                endTime: booking.endTime,
                status: booking.bookingStatus,
                borrowerName: booking.user?.fullName || 'Unknown',
                paymentStatus: booking.payment?.paymentStatus || 'UNPAID',
                totalAmount: booking.payment?.totalAmount || 0
            }));

            return {
                bookings: formattedBookings,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: parseInt(page),
                itemsPerPage: parseInt(limit)
            };
        } catch (error) {
            logger.error('Admin get booking history service error:', error);
            throw error;
        }
    },

    // Process refund
    async processRefund(bookingId, refundReason) {
        try {
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: {
                    payment: true,
                    building: true,
                    user: true
                }
            });

            if (!booking) {
                throw new Error('Booking tidak ditemukan');
            }

            if (!booking.payment || booking.payment.paymentStatus !== 'PAID') {
                throw new Error('Booking tidak bisa direfund karena belum ada pembayaran yang berhasil');
            }

            if (booking.bookingStatus === 'COMPLETED') {
                throw new Error('Booking yang sudah selesai tidak bisa direfund');
            }

            // Create refund with Xendit (if supported)
            const refundData = {
                invoice_id: booking.payment.xenditTransactionId,
                reason: refundReason,
                amount: booking.payment.totalAmount
            };

            // For now, we'll mark as refunded without actually calling Xendit
            // In production, you would call Xendit's refund API here

            // Update payment status
            await prisma.payment.update({
                where: { id: booking.payment.id },
                data: {
                    paymentStatus: 'REFUNDED'
                }
            });

            // Update booking status
            await prisma.booking.update({
                where: { id: bookingId },
                data: {
                    bookingStatus: 'CANCELLED',
                    rejectionReason: refundReason
                }
            });

            // Send notification to user
            await NotificationService.createRefundNotification(booking.userId, {
                buildingName: booking.building.buildingName,
                bookingId: bookingId,
                refundAmount: booking.payment.totalAmount,
                refundReason: refundReason
            });

            logger.info(`Refund processed for booking: ${bookingId}`);

            return {
                bookingId: bookingId,
                buildingName: booking.building.buildingName,
                refundAmount: booking.payment.totalAmount,
                refundReason: refundReason,
                status: 'REFUNDED'
            };
        } catch (error) {
            logger.error('Process refund service error:', error);
            throw error;
        }
    },

    // Process automatic refund (when booking is rejected)
    async processAutomaticRefund(bookingId, reason) {
        try {
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: {
                    payment: true,
                    building: true
                }
            });

            if (!booking || !booking.payment || booking.payment.paymentStatus !== 'PAID') {
                return;
            }

            // Update payment status
            await prisma.payment.update({
                where: { id: booking.payment.id },
                data: {
                    paymentStatus: 'REFUNDED'
                }
            });

            // Send notification to user
            await NotificationService.createRefundNotification(booking.userId, {
                buildingName: booking.building.buildingName,
                bookingId: bookingId,
                refundAmount: booking.payment.totalAmount,
                refundReason: reason
            });

            logger.info(`Automatic refund processed for booking: ${bookingId}`);
        } catch (error) {
            logger.error('Process automatic refund error:', error);
            // Don't throw error to prevent breaking the main flow
        }
    },

    // Get today's bookings
    async getTodayBookings() {
        try {
            const today = moment().format('DD-MM-YYYY');

            const bookings = await prisma.booking.findMany({
                where: {
                    startDate: today,
                    bookingStatus: {
                        in: ['APPROVED', 'PROCESSING']
                    }
                },
                include: {
                    building: {
                        select: {
                            buildingName: true
                        }
                    }
                },
                orderBy: {
                    startTime: 'asc'
                }
            });

            return bookings.map(booking => ({
                id: booking.id,
                buildingName: booking.building.buildingName,
                description: booking.activityName,
                startTime: booking.startTime,
                endTime: booking.endTime,
                status: booking.bookingStatus
            }));
        } catch (error) {
            logger.error('Get today bookings service error:', error);
            throw error;
        }
    },

    // Process Xendit refund webhook
    async processRefundWebhook(webhookData) {
        try {
            const { id, status, reference_id, amount, payment_id } = webhookData;

            // Find the booking by payment ID or reference ID
            const booking = await prisma.booking.findFirst({
                where: {
                    OR: [
                        { id: reference_id },
                        { payment: { xenditTransactionId: payment_id } }
                    ]
                },
                include: {
                    payment: true,
                    building: true,
                    user: true
                }
            });

            if (!booking) {
                logger.warn(`Booking not found for refund webhook: ${reference_id || payment_id}`);
                return false;
            }

            // Update payment status based on refund status
            if (status === 'SUCCEEDED') {
                await prisma.payment.update({
                    where: { id: booking.payment.id },
                    data: {
                        paymentStatus: 'REFUNDED'
                    }
                });

                // Update booking status
                await prisma.booking.update({
                    where: { id: booking.id },
                    data: {
                        bookingStatus: 'CANCELLED'
                    }
                });

                // Send notification to user
                try {
                    await NotificationService.createRefundNotification(booking.userId, {
                        buildingName: booking.building.buildingName,
                        bookingId: booking.id,
                        refundAmount: amount,
                        refundReason: 'Refund berhasil diproses'
                    });
                } catch (notificationError) {
                    logger.warn('Failed to send refund notification:', notificationError);
                }
            }

            logger.info(`Refund webhook processed for booking: ${booking.id}, status: ${status}`);
            return true;
        } catch (error) {
            logger.error('Process refund webhook service error:', error);
            throw error;
        }
    }
};

module.exports = BookingService; 