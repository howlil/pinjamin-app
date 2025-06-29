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

            // Validate dates
            const startMomentValidation = moment(startDate, 'DD-MM-YYYY');
            const endMomentValidation = moment(endDate || startDate, 'DD-MM-YYYY');
            const today = moment().startOf('day');

            if (!startMomentValidation.isValid()) {
                throw new Error('Format tanggal mulai tidak valid. Gunakan format DD-MM-YYYY');
            }

            if (endDate && !endMomentValidation.isValid()) {
                throw new Error('Format tanggal selesai tidak valid. Gunakan format DD-MM-YYYY');
            }

            if (startMomentValidation.isBefore(today)) {
                throw new Error('Tanggal mulai tidak boleh di masa lalu');
            }

            if (endDate && endMomentValidation.isBefore(startMomentValidation)) {
                throw new Error('Tanggal selesai tidak boleh lebih awal dari tanggal mulai');
            }

            // Calculate rental duration and total cost
            const targetEndDate = endDate || startDate;
            const startMoment = moment(startDate, 'DD-MM-YYYY');
            const endMoment = moment(targetEndDate, 'DD-MM-YYYY');

            // Calculate number of days (inclusive of both start and end date)
            const rentalDays = endMoment.diff(startMoment, 'days') + 1;

            // Validate rental duration (max 30 days)
            const maxRentalDays = 30;
            if (rentalDays > maxRentalDays) {
                throw new Error(`Durasi peminjaman maksimal ${maxRentalDays} hari`);
            }

            if (rentalDays < 1) {
                throw new Error('Durasi peminjaman minimal 1 hari');
            }

            const totalAmount = building.rentalPrice * rentalDays;

            logger.info(`Booking calculation: ${rentalDays} days × Rp${building.rentalPrice.toLocaleString()} = Rp${totalAmount.toLocaleString()}`);

            // Create booking
            const bookingId = uuidv4();
            let proposalLetterUrl = null;

            // Handle proposal letter file upload
            if (proposalLetter && proposalLetter.filename) {
                proposalLetterUrl = getFileUrl(proposalLetter.filename, 'documents');
            }

            const booking = await prisma.booking.create({
                data: {
                    id: bookingId,
                    userId,
                    buildingId,
                    activityName,
                    startDate,
                    endDate: targetEndDate,
                    startTime,
                    endTime,
                    proposalLetter: proposalLetterUrl,
                    bookingStatus: 'PROCESSING'
                }
            });

            // Create Xendit invoice
            const invoiceData = {
                externalId: bookingId,
                amount: totalAmount,
                payerEmail: user.email,
                description: `Pembayaran sewa ${building.buildingName} - ${activityName} (${rentalDays} hari)`,
                successRedirectUrl: `${process.env.FRONTEND_URL}/payment/success`,
                failureRedirectUrl: `${process.env.FRONTEND_URL}/payment/failed`,
                items: [{
                    name: `${building.buildingName} (${rentalDays} hari)`,
                    quantity: rentalDays,
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
                    paymentAmount: totalAmount,
                    totalAmount: totalAmount,
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
                    rentalDays: rentalDays,
                    amount: totalAmount
                });

                // Notification for admin
                await PusherHelper.sendAdminNotification('NEW_BOOKING', {
                    bookingId: booking.id,
                    buildingName: building.buildingName,
                    borrowerName: user.fullName,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    rentalDays: rentalDays,
                    amount: totalAmount
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
                rentalDays: rentalDays,
                pricePerDay: building.rentalPrice,
                totalAmount: totalAmount,
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
                        },
                        payment: {
                            select: {
                                id: true,
                                paymentStatus: true,
                                totalAmount: true,
                                refund: {
                                    select: {
                                        id: true,
                                        refundAmount: true,
                                        refundStatus: true,
                                        refundReason: true,
                                        refundDate: true
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
                payment: booking.payment ? {
                    paymentStatus: booking.payment.paymentStatus,
                    totalAmount: booking.payment.totalAmount,
                    refund: booking.payment.refund ? {
                        refundAmount: booking.payment.refund.refundAmount,
                        refundStatus: booking.payment.refund.refundStatus,
                        refundReason: booking.payment.refund.refundReason,
                        refundDate: booking.payment.refund.refundDate
                    } : null
                } : null
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
            const nodeEnv = process.env.NODE_ENV || 'development';

            logger.info('Processing webhook for external_id:', external_id);

            // For test webhooks in development, process and return success immediately
            if (nodeEnv === 'development' && external_id && external_id.includes('test')) {
                logger.info(`Test webhook detected in development: ${external_id}`);
                logger.info(`Test webhook payload:`, { external_id, status, payment_method, paid_amount });
                logger.info('Test webhook processed successfully (development mode)');
                return true;
            }

            const booking = await prisma.booking.findUnique({
                where: { id: external_id },
                include: { payment: true }
            });

            if (!booking) {
                logger.warn(`Booking not found for webhook: ${external_id}. This might be a test webhook.`);

                // In development mode, treat missing bookings as successful test webhooks
                if (nodeEnv === 'development') {
                    logger.info(`Development mode: Treating unknown booking ${external_id} as successful test webhook`);
                    return true;
                }
                return false;
            }

            const paymentStatus = XenditHelper.mapPaymentStatus(status);
            logger.info(`Updating payment for booking ${external_id} to status: ${paymentStatus}`);

            // Check if payment record exists
            if (!booking.payment) {
                logger.warn(`Payment record not found for booking: ${external_id}`);
                return false;
            }

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
            const nodeEnv = process.env.NODE_ENV || 'development';
            logger.error('Process webhook service error:', error);

            // In development mode, if it's a test webhook, return true despite errors
            if (nodeEnv === 'development' && webhookData.external_id && webhookData.external_id.includes('test')) {
                logger.warn('Test webhook encountered error in development mode, but returning success anyway');
                return true;
            }

            throw error;
        }
    },

    // ===== ADMIN FUNCTIONS =====

    // Get bookings with filters (admin)
    async adminGetBookings(filters) {
        try {
            const { page = 1, limit = 10 } = filters;
            const skip = (page - 1) * limit;

            const whereClause = {
                bookingStatus: 'PROCESSING'
            };

            const [bookings, totalItems] = await Promise.all([
                prisma.booking.findMany({
                    where: whereClause,
                    include: {
                        building: {
                            select: {
                                id: true,
                                buildingName: true,
                                description: true,
                                location: true,
                                buildingType: true,
                                capacity: true,
                                rentalPrice: true,
                                buildingPhoto: true
                            }
                        },
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                                phoneNumber: true,
                                borrowerType: true,
                                bankName: true,
                                bankNumber: true
                            }
                        },
                        payment: {
                            select: {
                                id: true,
                                paymentStatus: true,
                                totalAmount: true,
                                paymentMethod: true,
                                paymentDate: true,
                                invoiceNumber: true,
                                paymentUrl: true,
                                refund: {
                                    select: {
                                        id: true,
                                        refundAmount: true,
                                        refundStatus: true,
                                        refundReason: true,
                                        refundDate: true
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
                prisma.booking.count({
                    where: whereClause
                })
            ]);

            const formattedBookings = bookings.map(booking => ({
                // Basic booking info
                bookingId: booking.id,
                activityName: booking.activityName,
                startDate: booking.startDate,
                endDate: booking.endDate,
                startTime: booking.startTime,
                endTime: booking.endTime,
                status: booking.bookingStatus,
                rejectionReason: booking.rejectionReason,
                proposalLetter: booking.proposalLetter,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt,

                // Detail object
                detail: {
                    borrower: {
                        id: booking.user?.id,
                        fullName: booking.user?.fullName || 'Unknown',
                        email: booking.user?.email,
                        phoneNumber: booking.user?.phoneNumber,
                        borrowerType: booking.user?.borrowerType,
                        bankInfo: {
                            bankName: booking.user?.bankName,
                            bankNumber: booking.user?.bankNumber
                        }
                    },
                    building: {
                        id: booking.building?.id,
                        buildingName: booking.building?.buildingName,
                        description: booking.building?.description,
                        location: booking.building?.location,
                        buildingType: booking.building?.buildingType,
                        capacity: booking.building?.capacity,
                        rentalPrice: booking.building?.rentalPrice,
                        buildingPhoto: booking.building?.buildingPhoto
                    },
                    payment: booking.payment ? {
                        id: booking.payment.id,
                        paymentStatus: booking.payment.paymentStatus,
                        totalAmount: booking.payment.totalAmount,
                        paymentMethod: booking.payment.paymentMethod,
                        paymentDate: booking.payment.paymentDate,
                        invoiceNumber: booking.payment.invoiceNumber,
                        paymentUrl: booking.payment.paymentUrl,
                        refund: booking.payment.refund ? {
                            id: booking.payment.refund.id,
                            refundAmount: booking.payment.refund.refundAmount,
                            refundStatus: booking.payment.refund.refundStatus,
                            refundReason: booking.payment.refund.refundReason,
                            refundDate: booking.payment.refund.refundDate
                        } : null
                    } : null,
                    documents: {
                        proposalLetter: booking.proposalLetter ? {
                            url: booking.proposalLetter,
                            previewUrl: booking.proposalLetter,
                            downloadUrl: booking.proposalLetter
                        } : null
                    }
                }
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
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            phoneNumber: true
                        }
                    },
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

            // Create notifications
            if (bookingStatus === 'APPROVED') {
                // Notification for user
                await NotificationService.createBookingNotification(booking.userId, 'APPROVED', {
                    buildingName: booking.building.buildingName,
                    bookingId: booking.id,
                    startDate: booking.startDate,
                    endDate: booking.endDate
                });

                // Notification for admin (log the approval)
                await PusherHelper.sendAdminNotification('BOOKING_APPROVED', {
                    bookingId: booking.id,
                    buildingName: booking.building.buildingName,
                    borrowerName: booking.user.fullName,
                    borrowerEmail: booking.user.email,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    action: 'APPROVED'
                });

            } else if (bookingStatus === 'REJECTED') {
                // Notification for user
                await NotificationService.createBookingNotification(booking.userId, 'REJECTED', {
                    buildingName: booking.building.buildingName,
                    bookingId: booking.id,
                    rejectionReason: rejectionReason,
                    startDate: booking.startDate,
                    endDate: booking.endDate
                });

                // Notification for admin (log the rejection)
                await PusherHelper.sendAdminNotification('BOOKING_REJECTED', {
                    bookingId: booking.id,
                    buildingName: booking.building.buildingName,
                    borrowerName: booking.user.fullName,
                    borrowerEmail: booking.user.email,
                    rejectionReason: rejectionReason,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    action: 'REJECTED'
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
                                id: true,
                                buildingName: true,
                                description: true,
                                location: true,
                                buildingType: true,
                                capacity: true,
                                rentalPrice: true,
                                buildingPhoto: true
                            }
                        },
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                                phoneNumber: true,
                                borrowerType: true,
                                bankName: true,
                                bankNumber: true
                            }
                        },
                        payment: {
                            select: {
                                id: true,
                                paymentStatus: true,
                                totalAmount: true,
                                paymentMethod: true,
                                paymentDate: true,
                                invoiceNumber: true,
                                paymentUrl: true,
                                refund: {
                                    select: {
                                        id: true,
                                        refundAmount: true,
                                        refundStatus: true,
                                        refundReason: true,
                                        refundDate: true
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
                prisma.booking.count({
                    where: whereClause
                })
            ]);

            const formattedBookings = bookings.map(booking => ({
                // Basic booking info
                bookingId: booking.id,
                activityName: booking.activityName,
                startDate: booking.startDate,
                endDate: booking.endDate,
                startTime: booking.startTime,
                endTime: booking.endTime,
                status: booking.bookingStatus,
                rejectionReason: booking.rejectionReason,
                proposalLetter: booking.proposalLetter,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt,

                // Detail object
                detail: {
                    borrower: {
                        id: booking.user?.id,
                        fullName: booking.user?.fullName || 'Unknown',
                        email: booking.user?.email,
                        phoneNumber: booking.user?.phoneNumber,
                        borrowerType: booking.user?.borrowerType,
                        bankInfo: {
                            bankName: booking.user?.bankName,
                            bankNumber: booking.user?.bankNumber
                        }
                    },
                    building: {
                        id: booking.building?.id,
                        buildingName: booking.building?.buildingName,
                        description: booking.building?.description,
                        location: booking.building?.location,
                        buildingType: booking.building?.buildingType,
                        capacity: booking.building?.capacity,
                        rentalPrice: booking.building?.rentalPrice,
                        buildingPhoto: booking.building?.buildingPhoto
                    },
                    payment: booking.payment ? {
                        id: booking.payment.id,
                        paymentStatus: booking.payment.paymentStatus,
                        totalAmount: booking.payment.totalAmount,
                        paymentMethod: booking.payment.paymentMethod,
                        paymentDate: booking.payment.paymentDate,
                        invoiceNumber: booking.payment.invoiceNumber,
                        paymentUrl: booking.payment.paymentUrl,
                        refund: booking.payment.refund ? {
                            id: booking.payment.refund.id,
                            refundAmount: booking.payment.refund.refundAmount,
                            refundStatus: booking.payment.refund.refundStatus,
                            refundReason: booking.payment.refund.refundReason,
                            refundDate: booking.payment.refund.refundDate
                        } : null
                    } : {
                        paymentStatus: 'UNPAID',
                        totalAmount: 0,
                        refund: null
                    },
                    documents: {
                        proposalLetter: booking.proposalLetter ? {
                            url: booking.proposalLetter,
                            previewUrl: booking.proposalLetter,
                            downloadUrl: booking.proposalLetter
                        } : null
                    }
                }
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
                    payment: {
                        include: {
                            refund: true
                        }
                    },
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

            // Check if refund already exists for this payment
            if (booking.payment.refund) {
                // If booking was already rejected and refund exists, inform user
                if (booking.bookingStatus === 'REJECTED') {
                    throw new Error(`Booking ini sudah ditolak dan refund sudah diproses otomatis. Refund sebesar Rp ${booking.payment.refund.refundAmount.toLocaleString('id-ID')} dengan alasan: "${booking.payment.refund.refundReason}"`);
                }

                // If booking was cancelled and refund exists
                if (booking.bookingStatus === 'CANCELLED') {
                    throw new Error(`Refund untuk booking ini sudah pernah diproses sebesar Rp ${booking.payment.refund.refundAmount.toLocaleString('id-ID')} dengan alasan: "${booking.payment.refund.refundReason}"`);
                }

                // Generic message for other cases
                throw new Error('Refund untuk booking ini sudah pernah diproses');
            }

            // Check if booking is in valid status for manual refund
            if (booking.bookingStatus === 'REJECTED') {
                throw new Error('Booking yang sudah ditolak tidak bisa direfund manual. Refund sudah diproses otomatis saat penolakan.');
            }

            logger.info(`Processing manual refund for booking: ${bookingId}, amount: ${booking.payment.totalAmount}`);

            // Create refund dengan Xendit API (REAL REFUND)
            let xenditRefundId = `manual-refund-${uuidv4()}`;
            let refundStatus = 'SUCCEEDED';

            try {
                // Call Xendit refund API untuk refund yang sebenarnya
                const refundData = {
                    invoiceId: booking.payment.xenditTransactionId,
                    reason: refundReason,
                    amount: booking.payment.totalAmount
                };

                const XenditHelper = require('../libs/xendit.lib');
                const xenditRefund = await XenditHelper.createRefund(refundData);

                if (xenditRefund && xenditRefund.id) {
                    xenditRefundId = xenditRefund.id;
                    refundStatus = xenditRefund.status || 'SUCCEEDED';
                    logger.info(`Xendit manual refund created successfully: ${xenditRefundId}`);
                } else {
                    logger.warn(`Xendit manual refund failed, using manual refund for booking: ${bookingId}`);
                }
            } catch (xenditError) {
                logger.error('Xendit manual refund API error:', xenditError);
                logger.warn(`Falling back to manual refund for booking: ${bookingId}`);
                // Continue with manual refund jika Xendit gagal
            }

            // Create refund record
            const refundId = uuidv4();
            await prisma.refund.create({
                data: {
                    id: refundId,
                    paymentId: booking.payment.id,
                    refundAmount: booking.payment.totalAmount,
                    refundStatus: refundStatus,
                    refundReason: refundReason,
                    xenditRefundTransactionId: xenditRefundId,
                    refundDate: moment().format('DD-MM-YYYY')
                }
            });

            // Update booking status (payment status tetap PAID, tapi ada refund record)
            await prisma.booking.update({
                where: { id: bookingId },
                data: {
                    bookingStatus: 'CANCELLED',
                    rejectionReason: refundReason
                }
            });

            // Send notifications dengan enhanced logging
            try {
                logger.info(`Sending manual refund notifications for booking: ${bookingId}`);

                // Notification for user
                await NotificationService.createRefundNotification(booking.userId, {
                    buildingName: booking.building.buildingName,
                    bookingId: bookingId,
                    refundAmount: booking.payment.totalAmount,
                    refundReason: refundReason
                });

                // Enhanced admin notification
                await PusherHelper.sendAdminNotification('REFUND_PROCESSED', {
                    bookingId: bookingId,
                    buildingName: booking.building.buildingName,
                    borrowerName: booking.user.fullName,
                    borrowerEmail: booking.user.email,
                    refundAmount: booking.payment.totalAmount,
                    refundReason: refundReason,
                    refundType: 'MANUAL_REFUND',
                    xenditRefundId: xenditRefundId,
                    timestamp: new Date().toISOString(),
                    action: 'MANUAL_REFUND'
                });

                logger.info(`Manual refund notifications sent successfully for booking: ${bookingId}`);
            } catch (notificationError) {
                logger.error('Failed to send manual refund notifications:', notificationError);
            }

            logger.info(`Manual refund processed successfully for booking: ${bookingId}, xendit ID: ${xenditRefundId}`);

            return {
                bookingId: bookingId,
                buildingName: booking.building.buildingName,
                refundAmount: booking.payment.totalAmount,
                refundReason: refundReason,
                xenditRefundId: xenditRefundId,
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
                    payment: {
                        include: {
                            refund: true
                        }
                    },
                    building: true,
                    user: true
                }
            });

            if (!booking || !booking.payment || booking.payment.paymentStatus !== 'PAID') {
                logger.info(`Skipping automatic refund for booking ${bookingId}: No payment or payment not PAID`);
                return;
            }

            // Check if refund already exists to prevent duplicate
            if (booking.payment.refund) {
                logger.info(`Skipping automatic refund for booking ${bookingId}: Refund already exists`);
                return;
            }

            logger.info(`Processing automatic refund for booking: ${bookingId}, amount: ${booking.payment.totalAmount}`);

            // Create refund dengan Xendit API (REAL REFUND)
            let xenditRefundId = `auto-refund-${uuidv4()}`;
            let refundStatus = 'SUCCEEDED';

            try {
                // Call Xendit refund API untuk refund yang sebenarnya
                const refundData = {
                    invoiceId: booking.payment.xenditTransactionId,
                    reason: reason,
                    amount: booking.payment.totalAmount
                };

                const XenditHelper = require('../libs/xendit.lib');
                const xenditRefund = await XenditHelper.createRefund(refundData);

                if (xenditRefund && xenditRefund.id) {
                    xenditRefundId = xenditRefund.id;
                    refundStatus = xenditRefund.status || 'SUCCEEDED';
                    logger.info(`Xendit refund created successfully: ${xenditRefundId}`);
                } else {
                    logger.warn(`Xendit refund failed, using manual refund for booking: ${bookingId}`);
                }
            } catch (xenditError) {
                logger.error('Xendit refund API error:', xenditError);
                logger.warn(`Falling back to manual refund for booking: ${bookingId}`);
                // Continue with manual refund jika Xendit gagal
            }

            // Create refund record
            const refundId = uuidv4();
            await prisma.refund.create({
                data: {
                    id: refundId,
                    paymentId: booking.payment.id,
                    refundAmount: booking.payment.totalAmount,
                    refundStatus: refundStatus,
                    refundReason: reason,
                    xenditRefundTransactionId: xenditRefundId,
                    refundDate: moment().format('DD-MM-YYYY')
                }
            });

            // Send notifications dengan enhanced logging
            try {
                logger.info(`Sending refund notifications for booking: ${bookingId}`);

                // Notification for user
                await NotificationService.createRefundNotification(booking.userId, {
                    buildingName: booking.building.buildingName,
                    bookingId: bookingId,
                    refundAmount: booking.payment.totalAmount,
                    refundReason: reason
                });

                // Enhanced admin notification
                await PusherHelper.sendAdminNotification('REFUND_PROCESSED', {
                    bookingId: bookingId,
                    buildingName: booking.building.buildingName,
                    borrowerName: booking.user.fullName,
                    borrowerEmail: booking.user.email,
                    refundAmount: booking.payment.totalAmount,
                    refundReason: reason,
                    refundType: 'AUTOMATIC_REFUND',
                    xenditRefundId: xenditRefundId,
                    timestamp: new Date().toISOString(),
                    action: 'AUTOMATIC_REFUND'
                });

                logger.info(`Refund notifications sent successfully for booking: ${bookingId}`);
            } catch (notificationError) {
                logger.error('Failed to send automatic refund notifications:', notificationError);
            }

            logger.info(`Automatic refund processed successfully for booking: ${bookingId}, xendit ID: ${xenditRefundId}`);
        } catch (error) {
            logger.error('Process automatic refund error:', error);
            // Don't throw error to prevent breaking the main flow
        }
    },

    // Get refund details
    async getRefundDetails(bookingId, userId = null, isAdmin = false) {
        try {
            const whereClause = { id: bookingId };

            // If not admin, ensure user can only see their own booking
            if (!isAdmin && userId) {
                whereClause.userId = userId;
            }

            const booking = await prisma.booking.findUnique({
                where: whereClause,
                include: {
                    payment: {
                        include: {
                            refund: true
                        }
                    },
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
            });

            if (!booking) {
                throw new Error('Booking tidak ditemukan');
            }

            if (!booking.payment) {
                throw new Error('Data payment tidak ditemukan');
            }

            if (!booking.payment.refund) {
                return {
                    bookingId: booking.id,
                    buildingName: booking.building.buildingName,
                    totalAmount: booking.payment.totalAmount,
                    paymentStatus: booking.payment.paymentStatus,
                    refundStatus: 'NO_REFUND',
                    message: 'Tidak ada refund untuk booking ini'
                };
            }

            return {
                bookingId: booking.id,
                buildingName: booking.building.buildingName,
                borrowerName: booking.user.fullName,
                borrowerEmail: booking.user.email,
                totalAmount: booking.payment.totalAmount,
                paymentStatus: booking.payment.paymentStatus,
                refund: {
                    id: booking.payment.refund.id,
                    refundAmount: booking.payment.refund.refundAmount,
                    refundStatus: booking.payment.refund.refundStatus,
                    refundReason: booking.payment.refund.refundReason,
                    refundDate: booking.payment.refund.refundDate,
                    xenditRefundId: booking.payment.refund.xenditRefundTransactionId
                }
            };
        } catch (error) {
            logger.error('Get refund details service error:', error);
            throw error;
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
                        in: ['APPROVED']
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
                    payment: {
                        include: {
                            refund: true
                        }
                    },
                    building: true,
                    user: true
                }
            });

            if (!booking) {
                logger.warn(`Booking not found for refund webhook: ${reference_id || payment_id}`);
                return false;
            }

            // Create or update refund record based on refund status
            if (status === 'SUCCEEDED') {
                // Check if refund already exists to prevent duplicate
                if (booking.payment.refund) {
                    logger.info(`Skipping webhook refund for booking ${booking.id}: Refund already exists`);
                    return true;
                }

                // Create refund record from webhook
                const refundId = uuidv4();
                await prisma.refund.create({
                    data: {
                        id: refundId,
                        paymentId: booking.payment.id,
                        refundAmount: amount,
                        refundStatus: 'SUCCEEDED',
                        refundReason: 'Refund berhasil diproses melalui webhook',
                        xenditRefundTransactionId: id,
                        refundDate: moment().format('DD-MM-YYYY')
                    }
                });

                // Update booking status
                await prisma.booking.update({
                    where: { id: booking.id },
                    data: {
                        bookingStatus: 'CANCELLED'
                    }
                });

                // Send notifications
                try {
                    // Notification for user
                    await NotificationService.createRefundNotification(booking.userId, {
                        buildingName: booking.building.buildingName,
                        bookingId: booking.id,
                        refundAmount: amount,
                        refundReason: 'Refund berhasil diproses melalui webhook'
                    });

                    // Notification for admin
                    await PusherHelper.sendAdminNotification('REFUND_PROCESSED', {
                        bookingId: booking.id,
                        buildingName: booking.building.buildingName,
                        borrowerName: booking.user.fullName,
                        borrowerEmail: booking.user.email,
                        refundAmount: amount,
                        refundReason: 'Refund berhasil diproses melalui webhook',
                        action: 'WEBHOOK_REFUND'
                    });
                } catch (notificationError) {
                    logger.warn('Failed to send refund webhook notifications:', notificationError);
                }
            }

            logger.info(`Refund webhook processed for booking: ${booking.id}, status: ${status}`);
            return true;
        } catch (error) {
            logger.error('Process refund webhook service error:', error);
            throw error;
        }
    },

    // Update expired bookings status (cronjob)
    async updateExpiredBookings() {
        try {
            const today = moment().startOf('day');

            // Get all bookings with PROCESSING or APPROVED status
            const allBookings = await prisma.booking.findMany({
                where: {
                    bookingStatus: {
                        in: ['PROCESSING', 'APPROVED']
                    }
                },
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
                        include: {
                            refund: true
                        }
                    }
                }
            });

            // Filter expired bookings using moment.js
            const expiredBookings = allBookings.filter(booking => {
                const startDate = moment(booking.startDate, 'DD-MM-YYYY');
                const endDate = booking.endDate ? moment(booking.endDate, 'DD-MM-YYYY') : startDate;

                if (!startDate.isValid()) {
                    return false; // Skip invalid dates
                }

                // Check if booking has passed (end date is before today)
                return endDate.isBefore(today, 'day');
            });

            // Only log when there are expired bookings to process
            if (expiredBookings.length > 0) {
                logger.info(`Found ${expiredBookings.length} expired bookings to process`);
            }

            let processedCount = 0;
            let rejectedCount = 0;
            let completedCount = 0;

            for (const booking of expiredBookings) {
                try {
                    let newStatus;
                    let shouldRefund = false;

                    // Determine new status based on current status
                    if (booking.bookingStatus === 'PROCESSING') {
                        newStatus = 'REJECTED';
                        rejectedCount++;

                        // Check if there's a paid payment that needs refund
                        if (booking.payment && booking.payment.paymentStatus === 'PAID') {
                            shouldRefund = true;
                        }
                    } else if (booking.bookingStatus === 'APPROVED') {
                        newStatus = 'COMPLETED';
                        completedCount++;
                    }

                    // Update booking status
                    await prisma.booking.update({
                        where: { id: booking.id },
                        data: {
                            bookingStatus: newStatus,
                            rejectionReason: newStatus === 'REJECTED' ? 'Booking expired - melewati tanggal peminjaman' : null
                        }
                    });

                    // Process refund if needed
                    if (shouldRefund) {
                        // Check if refund already exists to prevent duplicate
                        if (booking.payment.refund) {
                            logger.info(`Skipping expired refund for booking ${booking.id}: Refund already exists`);
                        } else {
                            const refundId = uuidv4();
                            await prisma.refund.create({
                                data: {
                                    id: refundId,
                                    paymentId: booking.payment.id,
                                    refundAmount: booking.payment.totalAmount,
                                    refundStatus: 'SUCCEEDED',
                                    refundReason: 'Booking expired - melewati tanggal peminjaman',
                                    xenditRefundTransactionId: `expired-refund-${refundId}`,
                                    refundDate: moment().format('DD-MM-YYYY')
                                }
                            });

                            // Send refund notification to admin
                            try {
                                await PusherHelper.sendAdminNotification('REFUND_PROCESSED', {
                                    bookingId: booking.id,
                                    buildingName: booking.building.buildingName,
                                    borrowerName: booking.user.fullName,
                                    refundAmount: booking.payment.totalAmount,
                                    refundReason: 'Booking expired - melewati tanggal peminjaman',
                                    action: 'EXPIRED_REFUND'
                                });
                            } catch (notificationError) {
                                logger.warn('Failed to send expired refund notification to admin:', notificationError);
                            }

                            logger.info(`Automatic refund processed for expired booking: ${booking.id}`);
                        }
                    }

                    // Send notifications to user and admin
                    try {
                        const NotificationService = require('./notification.service');

                        if (newStatus === 'REJECTED') {
                            // Notification for user
                            await NotificationService.createBookingNotification(booking.userId, 'REJECTED', {
                                buildingName: booking.building.buildingName,
                                bookingId: booking.id,
                                rejectionReason: 'Booking expired - melewati tanggal peminjaman',
                                startDate: booking.startDate,
                                endDate: booking.endDate
                            });

                            // Notification for admin
                            await PusherHelper.sendAdminNotification('BOOKING_EXPIRED', {
                                bookingId: booking.id,
                                buildingName: booking.building.buildingName,
                                borrowerName: booking.user.fullName,
                                rejectionReason: 'Booking expired - melewati tanggal peminjaman',
                                startDate: booking.startDate,
                                endDate: booking.endDate,
                                action: 'EXPIRED_REJECTED'
                            });

                        } else if (newStatus === 'COMPLETED') {
                            // Notification for user
                            await NotificationService.createNotification(
                                booking.userId,
                                'BOOKING',
                                'Booking Selesai',
                                `Booking Anda untuk ${booking.building.buildingName} telah selesai`
                            );

                            // Notification for admin
                            await PusherHelper.sendAdminNotification('BOOKING_COMPLETED', {
                                bookingId: booking.id,
                                buildingName: booking.building.buildingName,
                                borrowerName: booking.user.fullName,
                                startDate: booking.startDate,
                                endDate: booking.endDate,
                                action: 'AUTO_COMPLETED'
                            });
                        }
                    } catch (notificationError) {
                        logger.warn(`Failed to send notifications for booking ${booking.id}:`, notificationError);
                    }

                    processedCount++;

                    // Only log individual updates if there are processed bookings
                    if (processedCount === 1) {
                        logger.info(`Processing ${expiredBookings.length} expired bookings...`);
                    }

                } catch (bookingError) {
                    logger.error(`Error processing booking ${booking.id}:`, bookingError);
                }
            }

            const summary = {
                totalExpired: expiredBookings.length,
                totalProcessed: processedCount,
                rejected: rejectedCount,
                completed: completedCount,
                checkDate: today.format('DD-MM-YYYY')
            };

            return summary;

        } catch (error) {
            logger.error('Update expired bookings error:', error);
            throw error;
        }
    }
};

module.exports = BookingService; 