const { prisma } = require('../configs');
const { ErrorHandler } = require('../utils');
const { Xendit } = require('xendit-node');
const moment = require('moment');

const xendit = new Xendit({
    secretKey: process.env.XENDIT_SECRET_KEY || 'xnd_development_OoqNqFIvmhV0Hfv5TmMZ2LdFJ2k9WfFhZj2Yh6hN3MbCTMdYgh8U4aI5F2MlPO'
});

const BookingService = {
    async createBooking(userId, bookingData, proposalLetterPath) {
        try {
            // Validate building exists
            const building = await prisma.building.findUnique({
                where: { id: bookingData.buildingId },
                include: {
                    facilityBuilding: {
                        include: {
                            facility: true
                        }
                    }
                }
            });

            if (!building) {
                throw new ErrorHandler(404, 'Building not found');
            }

            // Check if building is available for the requested date and time
            const existingBookings = await prisma.booking.findMany({
                where: {
                    buildingId: bookingData.buildingId,
                    bookingStatus: {
                        in: ['APPROVED', 'PROCESSING']
                    },
                    OR: [
                        {
                            // Single day bookings
                            startDate: bookingData.startDate,
                            OR: [
                                {
                                    // New booking starts during existing booking
                                    AND: [
                                        { startTime: { lte: bookingData.startTime } },
                                        { endTime: { gt: bookingData.startTime } }
                                    ]
                                },
                                {
                                    // New booking ends during existing booking
                                    AND: [
                                        { startTime: { lt: bookingData.endTime } },
                                        { endTime: { gte: bookingData.endTime } }
                                    ]
                                },
                                {
                                    // New booking encompasses existing booking
                                    AND: [
                                        { startTime: { gte: bookingData.startTime } },
                                        { endTime: { lte: bookingData.endTime } }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            });

            if (existingBookings.length > 0) {
                throw new ErrorHandler(400, 'Building is not available for the selected date and time');
            }

            // Create booking
            const booking = await prisma.booking.create({
                data: {
                    userId,
                    buildingId: bookingData.buildingId,
                    activityName: bookingData.activityName,
                    startDate: bookingData.startDate,
                    endDate: bookingData.endDate || bookingData.startDate,
                    startTime: bookingData.startTime,
                    endTime: bookingData.endTime,
                    proposalLetter: proposalLetterPath,
                    bookingStatus: 'PROCESSING'
                },
                include: {
                    building: true,
                    user: true
                }
            });

            // Calculate rental days
            const startDate = moment(booking.startDate, 'DD-MM-YYYY');
            const endDate = moment(booking.endDate || booking.startDate, 'DD-MM-YYYY');
            const rentalDays = endDate.diff(startDate, 'days') + 1;
            const totalAmount = building.rentalPrice * rentalDays;

            // Create Xendit invoice
            const invoice = await xendit.Invoice.createInvoice({
                externalId: `booking-${booking.id}`,
                amount: totalAmount,
                payerEmail: booking.user.email,
                description: `Booking for ${building.buildingName} - ${booking.activityName}`,
                customer: {
                    given_names: booking.user.fullName,
                    email: booking.user.email,
                    mobile_number: booking.user.phoneNumber
                },
                customerNotificationPreference: {
                    invoice_created: ['email'],
                    invoice_reminder: ['email'],
                    invoice_paid: ['email']
                },
                invoiceDuration: 86400, // 24 hours
                currency: 'IDR',
                items: [
                    {
                        name: `${building.buildingName} Rental`,
                        quantity: rentalDays,
                        price: building.rentalPrice,
                        category: 'Building Rental'
                    }
                ],
                fees: [
                    {
                        type: 'Admin Fee',
                        value: 5000
                    }
                ]
            });

            // Create payment record
            const payment = await prisma.payment.create({
                data: {
                    xenditTransactionId: invoice.id,
                    bookingId: booking.id,
                    invoiceNumber: invoice.invoice_number,
                    paymentDate: moment().format('DD-MM-YYYY'),
                    paymentAmount: totalAmount,
                    totalAmount: totalAmount + 5000, // Include admin fee
                    paymentMethod: 'PENDING',
                    paymentUrl: invoice.invoice_url,
                    snapToken: invoice.id,
                    paymentStatus: 'UNPAID'
                }
            });

            // Create notification
            await prisma.notification.create({
                data: {
                    userId,
                    notificationType: 'BOOKING',
                    title: 'Booking Created',
                    message: `Your booking for ${building.buildingName} has been created and is awaiting payment`,
                    date: moment().format('DD-MM-YYYY'),
                    readStatus: 0
                }
            });

            return {
                bookingId: booking.id,
                buildingName: building.buildingName,
                startDate: booking.startDate,
                endDate: booking.endDate,
                startTime: booking.startTime,
                endTime: booking.endTime,
                status: booking.bookingStatus,
                payment: {
                    paymentUrl: payment.paymentUrl
                }
            };
        } catch (error) {
            if (error.status) throw error;
            throw new ErrorHandler(500, error.message || 'Failed to create booking');
        }
    },

    async getBookingHistory(userId, page = 1, limit = 10) {
        try {
            // Calculate offset
            const offset = (page - 1) * limit;

            // Get total count
            const totalItems = await prisma.booking.count({
                where: {
                    userId
                }
            });

            // Get bookings
            const bookings = await prisma.booking.findMany({
                where: {
                    userId
                },
                include: {
                    building: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: offset,
                take: limit
            });

            // Format bookings data
            const formattedBookings = bookings.map(booking => ({
                bookingId: booking.id,
                buildingName: booking.building.buildingName,
                startDate: booking.startDate,
                endDate: booking.endDate,
                startTime: booking.startTime,
                endTime: booking.endTime,
                status: booking.bookingStatus
            }));

            // Calculate pagination data
            const totalPages = Math.ceil(totalItems / limit);

            return {
                data: formattedBookings,
                pagination: {
                    totalItems,
                    totalPages,
                    currentPage: page,
                    itemsPerPage: limit
                }
            };
        } catch (error) {
            if (error.status) throw error;
            throw new ErrorHandler(500, error.message || 'Failed to get booking history');
        }
    },

    async getAdminBookings(status = 'PROCESSING', page = 1, limit = 10) {
        try {
            // Calculate offset
            const offset = (page - 1) * limit;

            // Build where clause
            const whereClause = {};
            if (status) {
                whereClause.bookingStatus = status;
            }

            // Get total count
            const totalItems = await prisma.booking.count({
                where: whereClause
            });

            // Get bookings
            const bookings = await prisma.booking.findMany({
                where: whereClause,
                include: {
                    building: true,
                    user: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: offset,
                take: limit
            });

            // Format bookings data
            const formattedBookings = bookings.map(booking => ({
                bookingId: booking.id,
                buildingName: booking.building.buildingName,
                activityName: booking.activityName,
                startDate: booking.startDate,
                endDate: booking.endDate,
                startTime: booking.startTime,
                endTime: booking.endTime,
                status: booking.bookingStatus,
                borrowerName: booking.user ? booking.user.fullName : 'Unknown'
            }));

            // Calculate pagination data
            const totalPages = Math.ceil(totalItems / limit);

            return {
                data: formattedBookings,
                pagination: {
                    totalItems,
                    totalPages,
                    currentPage: page,
                    itemsPerPage: limit
                }
            };
        } catch (error) {
            if (error.status) throw error;
            throw new ErrorHandler(500, error.message || 'Failed to get admin bookings');
        }
    },

    async approveRejectBooking(bookingId, bookingStatus, rejectionReason = null) {
        try {
            // Validate booking status
            if (!['APPROVED', 'REJECTED'].includes(bookingStatus)) {
                throw new ErrorHandler(400, 'Invalid booking status. Must be APPROVED or REJECTED');
            }

            // If rejected, rejection reason is required
            if (bookingStatus === 'REJECTED' && !rejectionReason) {
                throw new ErrorHandler(400, 'Rejection reason is required when rejecting a booking');
            }

            // Get booking
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: {
                    building: true,
                    user: true,
                    payment: true
                }
            });

            if (!booking) {
                throw new ErrorHandler(404, 'Booking not found');
            }

            // Check if booking is in PROCESSING status
            if (booking.bookingStatus !== 'PROCESSING') {
                throw new ErrorHandler(400, `Cannot ${bookingStatus.toLowerCase()} booking. Current status: ${booking.bookingStatus}`);
            }

            // Update booking status
            const updatedBooking = await prisma.booking.update({
                where: { id: bookingId },
                data: {
                    bookingStatus: bookingStatus,
                    rejectionReason: bookingStatus === 'REJECTED' ? rejectionReason : null
                },
                include: {
                    building: true
                }
            });

            // Create notification for user
            if (booking.userId) {
                const notificationTitle = bookingStatus === 'APPROVED'
                    ? 'Booking Approved'
                    : 'Booking Rejected';

                const notificationMessage = bookingStatus === 'APPROVED'
                    ? `Your booking for ${booking.building.buildingName} has been approved`
                    : `Your booking for ${booking.building.buildingName} has been rejected. Reason: ${rejectionReason}`;

                await prisma.notification.create({
                    data: {
                        userId: booking.userId,
                        notificationType: 'BOOKING',
                        title: notificationTitle,
                        message: notificationMessage,
                        date: moment().format('DD-MM-YYYY'),
                        readStatus: 0
                    }
                });
            }

            // If rejected and payment exists, update payment status
            if (bookingStatus === 'REJECTED' && booking.payment) {
                await prisma.payment.update({
                    where: { id: booking.payment.id },
                    data: {
                        paymentStatus: 'EXPIRED'
                    }
                });
            }

            return {
                bookingId: updatedBooking.id,
                buildingName: updatedBooking.building.buildingName,
                startDate: updatedBooking.startDate,
                endDate: updatedBooking.endDate,
                startTime: updatedBooking.startTime,
                endTime: updatedBooking.endTime,
                status: updatedBooking.bookingStatus
            };
        } catch (error) {
            if (error.status) throw error;
            throw new ErrorHandler(500, error.message || 'Failed to update booking status');
        }
    },

    async getBookingHistoryWithFilters(buildingId, startDate, endDate, page = 1, limit = 10) {
        try {
            // Calculate offset
            const offset = (page - 1) * limit;

            // Build where clause
            const whereClause = {};

            if (buildingId) {
                whereClause.buildingId = buildingId;
            }

            if (startDate || endDate) {
                whereClause.AND = [];

                if (startDate) {
                    whereClause.AND.push({
                        startDate: {
                            gte: startDate
                        }
                    });
                }

                if (endDate) {
                    whereClause.AND.push({
                        endDate: {
                            lte: endDate
                        }
                    });
                }
            }

            // Get total count
            const totalItems = await prisma.booking.count({
                where: whereClause
            });

            // Get bookings
            const bookings = await prisma.booking.findMany({
                where: whereClause,
                include: {
                    building: true,
                    user: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: offset,
                take: limit
            });

            // Format bookings data
            const formattedBookings = bookings.map(booking => ({
                bookingId: booking.id,
                buildingName: booking.building.buildingName,
                activityName: booking.activityName,
                startDate: booking.startDate,
                endDate: booking.endDate,
                startTime: booking.startTime,
                endTime: booking.endTime,
                status: booking.bookingStatus,
                borrowerName: booking.user ? booking.user.fullName : 'Unknown'
            }));

            // Calculate pagination data
            const totalPages = Math.ceil(totalItems / limit);

            return {
                data: formattedBookings,
                pagination: {
                    totalItems,
                    totalPages,
                    currentPage: page,
                    itemsPerPage: limit
                }
            };
        } catch (error) {
            if (error.status) throw error;
            throw new ErrorHandler(500, error.message || 'Failed to get booking history');
        }
    },

    async processRefund(bookingId, refundReason) {
        try {
            // Get booking with payment
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: {
                    payment: true,
                    building: true,
                    user: true
                }
            });

            if (!booking) {
                throw new ErrorHandler(404, 'Booking not found');
            }

            if (!booking.payment) {
                throw new ErrorHandler(400, 'No payment found for this booking');
            }

            // Check if payment is eligible for refund
            if (!['PAID', 'SETTLED'].includes(booking.payment.paymentStatus)) {
                throw new ErrorHandler(400, 'Payment is not eligible for refund');
            }

            // Check if refund already exists
            const existingRefund = await prisma.refund.findUnique({
                where: { paymentId: booking.payment.id }
            });

            if (existingRefund) {
                throw new ErrorHandler(400, 'Refund already processed for this payment');
            }

            // Create refund using Xendit
            const refundAmount = booking.payment.totalAmount;

            try {
                const xenditRefund = await xendit.Refund.createRefund({
                    invoice_id: booking.payment.xenditTransactionId,
                    reason: refundReason,
                    amount: refundAmount
                });

                // Create refund record
                const refund = await prisma.refund.create({
                    data: {
                        paymentId: booking.payment.id,
                        refundAmount: refundAmount,
                        refundStatus: 'PENDING',
                        refundReason: refundReason,
                        xenditRefundTransactionId: xenditRefund.id,
                        refundDate: moment().format('DD-MM-YYYY')
                    }
                });

                // Update booking status to rejected if not already
                if (booking.bookingStatus !== 'REJECTED') {
                    await prisma.booking.update({
                        where: { id: bookingId },
                        data: {
                            bookingStatus: 'REJECTED',
                            rejectionReason: `Refund processed: ${refundReason}`
                        }
                    });
                }

                // Create notification for user
                if (booking.userId) {
                    await prisma.notification.create({
                        data: {
                            userId: booking.userId,
                            notificationType: 'PAYMENT',
                            title: 'Refund Processed',
                            message: `Refund has been processed for your booking of ${booking.building.buildingName}. Amount: Rp ${refundAmount.toLocaleString('id-ID')}`,
                            date: moment().format('DD-MM-YYYY'),
                            readStatus: 0
                        }
                    });
                }

                return {
                    refundId: refund.id,
                    paymentId: booking.payment.id,
                    refundAmount: refundAmount,
                    refundStatus: refund.refundStatus,
                    refundDate: refund.refundDate
                };

            } catch (xenditError) {
                // Handle Xendit API errors
                throw new ErrorHandler(400, `Refund failed: ${xenditError.message}`);
            }

        } catch (error) {
            if (error.status) throw error;
            throw new ErrorHandler(500, error.message || 'Failed to process refund');
        }
    },

    async generateInvoice(bookingId, userId) {
        try {
            // Get booking with related data
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: {
                    building: true,
                    user: true,
                    payment: true
                }
            });

            if (!booking) {
                throw new ErrorHandler(404, 'Booking not found');
            }

            // Check if user owns this booking
            if (booking.userId !== userId) {
                throw new ErrorHandler(403, 'You can only generate invoice for your own bookings');
            }

            // Check if booking has payment
            if (!booking.payment) {
                throw new ErrorHandler(400, 'No payment found for this booking');
            }

            // Check if payment is completed
            if (!['PAID', 'SETTLED'].includes(booking.payment.paymentStatus)) {
                throw new ErrorHandler(400, 'Invoice can only be generated for paid bookings');
            }

            // Calculate rental days
            const startDate = moment(booking.startDate, 'DD-MM-YYYY');
            const endDate = moment(booking.endDate || booking.startDate, 'DD-MM-YYYY');
            const rentalDays = endDate.diff(startDate, 'days') + 1;

            // Return invoice data
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
                    rentalDays: rentalDays,
                    pricePerDay: booking.building.rentalPrice,
                    subtotal: booking.payment.paymentAmount,
                    adminFee: booking.payment.totalAmount - booking.payment.paymentAmount,
                    totalAmount: booking.payment.totalAmount
                }
            };
        } catch (error) {
            if (error.status) throw error;
            throw new ErrorHandler(500, error.message || 'Failed to generate invoice');
        }
    },

    async getTodayBookings() {
        try {
            const today = moment().format('DD-MM-YYYY');

            // Get today's bookings with status APPROVED
            const bookings = await prisma.booking.findMany({
                where: {
                    startDate: today,
                    bookingStatus: 'APPROVED'
                },
                include: {
                    building: true,
                    user: {
                        select: {
                            fullName: true
                        }
                    }
                },
                orderBy: {
                    startTime: 'asc'
                }
            });

            // Format bookings data
            const formattedBookings = bookings.map(booking => ({
                bookingId: booking.id,
                buildingName: booking.building.buildingName,
                activityName: booking.activityName,
                startTime: booking.startTime,
                endTime: booking.endTime,
                borrowerName: booking.user.fullName
            }));

            return formattedBookings;
        } catch (error) {
            if (error.status) throw error;
            throw new ErrorHandler(500, error.message || 'Failed to get today\'s bookings');
        }
    },

    async processPayment(bookingId, userId) {
        try {
            // Get booking with payment
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: {
                    payment: true,
                    building: true,
                    user: true
                }
            });

            if (!booking) {
                throw new ErrorHandler(404, 'Booking not found');
            }

            // Check if user owns this booking
            if (booking.userId !== userId) {
                throw new ErrorHandler(403, 'You can only process payment for your own bookings');
            }

            // Check if booking is approved
            if (booking.bookingStatus !== 'APPROVED') {
                throw new ErrorHandler(400, 'Booking must be approved before payment can be processed');
            }

            // Check if payment already exists and is not expired
            if (booking.payment) {
                if (['PAID', 'SETTLED'].includes(booking.payment.paymentStatus)) {
                    throw new ErrorHandler(400, 'Payment has already been completed');
                }

                // If payment exists but is UNPAID or PENDING, return existing payment URL
                if (['UNPAID', 'PENDING'].includes(booking.payment.paymentStatus)) {
                    return {
                        paymentUrl: booking.payment.paymentUrl
                    };
                }
            }

            // Create new payment if doesn't exist or is expired
            const rentalDays = moment(booking.endDate || booking.startDate, 'DD-MM-YYYY')
                .diff(moment(booking.startDate, 'DD-MM-YYYY'), 'days') + 1;
            const totalAmount = booking.building.rentalPrice * rentalDays;

            // Create Xendit invoice
            const invoice = await xendit.Invoice.createInvoice({
                externalId: `booking-${booking.id}`,
                amount: totalAmount,
                payerEmail: booking.user.email,
                description: `Booking for ${booking.building.buildingName} - ${booking.activityName}`,
                customer: {
                    given_names: booking.user.fullName,
                    email: booking.user.email,
                    mobile_number: booking.user.phoneNumber
                },
                customerNotificationPreference: {
                    invoice_created: ['email'],
                    invoice_reminder: ['email'],
                    invoice_paid: ['email']
                },
                invoiceDuration: 86400, // 24 hours
                currency: 'IDR',
                items: [
                    {
                        name: `${booking.building.buildingName} Rental`,
                        quantity: rentalDays,
                        price: booking.building.rentalPrice,
                        category: 'Building Rental'
                    }
                ],
                fees: [
                    {
                        type: 'Admin Fee',
                        value: 5000
                    }
                ]
            });

            // Create or update payment record
            let payment;
            if (booking.payment) {
                payment = await prisma.payment.update({
                    where: { id: booking.payment.id },
                    data: {
                        xenditTransactionId: invoice.id,
                        invoiceNumber: invoice.invoice_number,
                        paymentDate: moment().format('DD-MM-YYYY'),
                        paymentAmount: totalAmount,
                        totalAmount: totalAmount + 5000, // Include admin fee
                        paymentMethod: 'PENDING',
                        paymentUrl: invoice.invoice_url,
                        snapToken: invoice.id,
                        paymentStatus: 'UNPAID'
                    }
                });
            } else {
                payment = await prisma.payment.create({
                    data: {
                        xenditTransactionId: invoice.id,
                        bookingId: booking.id,
                        invoiceNumber: invoice.invoice_number,
                        paymentDate: moment().format('DD-MM-YYYY'),
                        paymentAmount: totalAmount,
                        totalAmount: totalAmount + 5000, // Include admin fee
                        paymentMethod: 'PENDING',
                        paymentUrl: invoice.invoice_url,
                        snapToken: invoice.id,
                        paymentStatus: 'UNPAID'
                    }
                });
            }

            return {
                paymentUrl: payment.paymentUrl
            };
        } catch (error) {
            if (error.status) throw error;
            throw new ErrorHandler(500, error.message || 'Failed to process payment');
        }
    }
};

module.exports = BookingService; 