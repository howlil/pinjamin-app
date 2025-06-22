const { prisma } = require('../configs');
const { ErrorHandler } = require('../utils');
const { Xendit } = require('xendit-node');
const moment = require('moment');
const axios = require('axios');

if (!process.env.XENDIT_SECRET_KEY) {
    console.error('XENDIT_SECRET_KEY is not set in environment variables');
    throw new Error('XENDIT_SECRET_KEY is required for payment processing');
}

console.log('Xendit SDK initialized with key:', process.env.XENDIT_SECRET_KEY?.slice(0, 15) + '...');

// Initialize Xendit with proper configuration
const xendit = new Xendit({
    secretKey: process.env.XENDIT_SECRET_KEY
});

const BookingService = {
    async createBooking(userId, bookingData, proposalLetterPath) {
        try {
            // ===== VALIDASI INPUT =====

            // 1. Validasi format tanggal DD-MM-YYYY
            const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
            if (!dateRegex.test(bookingData.startDate)) {
                throw ErrorHandler.badRequest('Start date must be in DD-MM-YYYY format');
            }
            if (bookingData.endDate && !dateRegex.test(bookingData.endDate)) {
                throw ErrorHandler.badRequest('End date must be in DD-MM-YYYY format');
            }

            // 2. Validasi format waktu HH:MM
            const timeRegex = /^\d{2}:\d{2}$/;
            if (!timeRegex.test(bookingData.startTime)) {
                throw ErrorHandler.badRequest('Start time must be in HH:MM format');
            }
            if (!timeRegex.test(bookingData.endTime)) {
                throw ErrorHandler.badRequest('End time must be in HH:MM format');
            }

            // Parse tanggal dan waktu
            const startDate = moment(bookingData.startDate, 'DD-MM-YYYY');
            const endDate = moment(bookingData.endDate || bookingData.startDate, 'DD-MM-YYYY');
            const startTime = moment(bookingData.startTime, 'HH:mm');
            const endTime = moment(bookingData.endTime, 'HH:mm');
            const now = moment();
            const today = moment().startOf('day');

            // Validasi tanggal valid
            if (!startDate.isValid()) {
                throw ErrorHandler.badRequest('Invalid start date');
            }
            if (!endDate.isValid()) {
                throw ErrorHandler.badRequest('Invalid end date');
            }
            if (!startTime.isValid()) {
                throw ErrorHandler.badRequest('Invalid start time');
            }
            if (!endTime.isValid()) {
                throw ErrorHandler.badRequest('Invalid end time');
            }

            // 3. Validasi startDate < endDate
            if (startDate.isAfter(endDate)) {
                throw ErrorHandler.badRequest('Start date must be before or equal to end date');
            }

            // 4. Validasi startTime < endTime (untuk hari yang sama)
            if (startDate.isSame(endDate, 'day')) {
                if (startTime.isSameOrAfter(endTime)) {
                    throw ErrorHandler.badRequest('Start time must be before end time');
                }
            }

            // 5. Validasi startDate tidak boleh < hari ini
            if (startDate.isBefore(today)) {
                throw ErrorHandler.badRequest('Start date cannot be in the past');
            }

            // 6. Validasi endDate tidak boleh > 6 bulan dari sekarang
            const sixMonthsFromNow = moment().add(6, 'months');
            if (endDate.isAfter(sixMonthsFromNow)) {
                throw ErrorHandler.badRequest('End date cannot be more than 6 months from now');
            }

            // 7. Validasi jika startDate = hari ini, startTime tidak boleh < 9 jam dari sekarang
            if (startDate.isSame(today, 'day')) {
                const currentTime = moment();
                const nineHoursFromNow = moment().add(9, 'hours');
                const startDateTime = moment(`${bookingData.startDate} ${bookingData.startTime}`, 'DD-MM-YYYY HH:mm');

                if (startDateTime.isBefore(nineHoursFromNow)) {
                    throw ErrorHandler.badRequest('For today\'s booking, start time must be at least 9 hours from now');
                }
            }

            console.log('✅ Basic validation passed');

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
                throw ErrorHandler.notFound('Building not found');
            }

            // ===== VALIDASI KONFLIK BOOKING =====
            // 8. Event tidak bisa dipinjam jika ada event lain pada rentang tanggal dan waktu yang sama
            console.log('🔍 Checking for booking conflicts...');

            const existingBookings = await prisma.booking.findMany({
                where: {
                    buildingId: bookingData.buildingId,
                    bookingStatus: {
                        in: ['APPROVED', 'PROCESSING']
                    },
                    OR: [
                        // Case 1: Overlap pada tanggal
                        {
                            AND: [
                                { startDate: { lte: bookingData.endDate || bookingData.startDate } },
                                {
                                    OR: [
                                        { endDate: { gte: bookingData.startDate } },
                                        { endDate: null, startDate: { gte: bookingData.startDate } }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            });

            if (existingBookings.length > 0) {
                // Check untuk overlap waktu pada tanggal yang sama
                for (const existing of existingBookings) {
                    const existingStartDate = moment(existing.startDate, 'DD-MM-YYYY');
                    const existingEndDate = moment(existing.endDate || existing.startDate, 'DD-MM-YYYY');

                    // Check apakah ada overlap tanggal
                    const hasDateOverlap = (
                        startDate.isSameOrBefore(existingEndDate) &&
                        endDate.isSameOrAfter(existingStartDate)
                    );

                    if (hasDateOverlap) {
                        // Jika ada overlap tanggal, check waktu
                        const existingStartTime = moment(existing.startTime, 'HH:mm');
                        const existingEndTime = moment(existing.endTime, 'HH:mm');

                        // Check overlap waktu
                        const hasTimeOverlap = (
                            startTime.isBefore(existingEndTime) &&
                            endTime.isAfter(existingStartTime)
                        );

                        if (hasTimeOverlap) {
                            const conflictDetails = {
                                existingBookingId: existing.id,
                                conflictDate: `${existing.startDate}${existing.endDate ? ` - ${existing.endDate}` : ''}`,
                                conflictTime: `${existing.startTime} - ${existing.endTime}`,
                                status: existing.bookingStatus
                            };

                            console.log('❌ Booking conflict found:', conflictDetails);

                            throw ErrorHandler.badRequest(
                                `Building is not available. Conflict with existing booking on ${conflictDetails.conflictDate} at ${conflictDetails.conflictTime}`
                            );
                        }
                    }
                }
            }

            console.log('✅ No booking conflicts found');

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

            // Calculate rental days (menggunakan variable yang sudah ada dari validation)
            const rentalDays = endDate.diff(startDate, 'days') + 1;

            // Debug logging for calculation
            console.log('Calculation debug:', {
                startDate: startDate.format('DD-MM-YYYY'),
                endDate: endDate.format('DD-MM-YYYY'),
                rentalDays: rentalDays,
                rentalPrice: building.rentalPrice,
                rentalPriceType: typeof building.rentalPrice
            });

            // Validate rental days
            if (rentalDays <= 0) {
                throw ErrorHandler.badRequest('Invalid date range. End date must be after or equal to start date');
            }

            // Validate rental price
            if (!building.rentalPrice || building.rentalPrice <= 0) {
                throw ErrorHandler.badRequest('Invalid building rental price');
            }

            const totalAmount = building.rentalPrice * rentalDays;

            // Validate total amount
            if (totalAmount <= 0) {
                throw ErrorHandler.badRequest('Invalid total amount calculated');
            }

            console.log('Total amount calculated:', totalAmount);

            // Create Xendit invoice
            let invoice;
            try {
                console.log('Creating Xendit invoice for booking:', booking.id);

                // Prepare clean phone number
                const cleanPhoneNumber = booking.user.phoneNumber ?
                    booking.user.phoneNumber.replace(/\D/g, '') : '';
                const formattedPhone = cleanPhoneNumber.startsWith('62') ?
                    `+${cleanPhoneNumber}` :
                    cleanPhoneNumber.startsWith('0') ?
                        `+62${cleanPhoneNumber.substring(1)}` :
                        cleanPhoneNumber ? `+62${cleanPhoneNumber}` : '';

                const invoiceData = {
                    external_id: `booking-${booking.id}`,
                    amount: Math.round(totalAmount), // Ensure integer
                    description: `Booking for ${building.buildingName} - ${booking.activityName}`,
                    invoice_duration: 86400,
                    currency: 'IDR'
                };

                // Add customer info if valid
                if (booking.user.email) {
                    invoiceData.customer = {
                        given_names: booking.user.fullName || 'Customer',
                        email: booking.user.email
                    };

                    // Add phone number only if valid
                    if (formattedPhone && formattedPhone.length >= 10) {
                        invoiceData.customer.mobile_number = formattedPhone;
                    }
                }

                // Add notification preference only if customer email exists
                if (booking.user.email) {
                    invoiceData.customer_notification_preference = {
                        invoice_created: ['email'],
                        invoice_paid: ['email']
                    };
                }

                // Add items array
                invoiceData.items = [
                    {
                        name: `${building.buildingName} Rental`,
                        quantity: rentalDays,
                        price: Math.round(building.rentalPrice),
                        category: 'Building Rental'
                    }
                ];

                // Add admin fee
                invoiceData.fees = [
                    {
                        type: 'ADMIN',
                        value: 5000
                    }
                ];

                console.log('Invoice data to send:', JSON.stringify(invoiceData, null, 2));

                // Try SDK first, fallback to HTTP request
                try {
                    invoice = await xendit.Invoice.createInvoice(invoiceData);
                } catch (sdkError) {
                    console.log('SDK failed, trying HTTP request:', sdkError.message);

                    // Fallback to direct HTTP request
                    const response = await axios.post('https://api.xendit.co/v2/invoices', invoiceData, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${Buffer.from(process.env.XENDIT_SECRET_KEY + ':').toString('base64')}`
                        }
                    });

                    invoice = response.data;
                }

                console.log('Xendit invoice created successfully:', {
                    invoiceId: invoice.id,
                    invoiceNumber: invoice.invoice_number,
                    invoiceUrl: invoice.invoice_url,
                    amount: totalAmount,
                    bookingId: booking.id
                });
            } catch (paymentError) {
                console.error('Xendit invoice creation failed:', paymentError);
                console.error('Xendit error details:', {
                    message: paymentError.message,
                    response: paymentError.response?.data || 'No response data',
                    status: paymentError.response?.status || 'No status',
                    bookingId: booking.id,
                    amount: totalAmount
                });

                // Clean up the booking if Xendit fails
                await prisma.booking.delete({
                    where: { id: booking.id }
                });

                throw ErrorHandler.internalServerError(`Xendit invoice creation failed: ${paymentError.message}`);
            }

            // Create payment record
            let payment;
            try {
                console.log('Creating payment record for booking:', booking.id);
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
                console.log('Payment record created successfully:', payment.id);
            } catch (paymentError) {
                console.error('Payment record creation error:', paymentError);

                // Clean up booking if payment record creation fails
                await prisma.booking.delete({
                    where: { id: booking.id }
                });

                throw ErrorHandler.internalServerError(`Payment record creation failed: ${paymentError.message}`);
            }

            // Create notification
            try {
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
                console.log('Notification created successfully for user:', userId);
            } catch (notificationError) {
                console.error('Notification creation error (non-critical):', notificationError);
                // Don't throw error for notification - it's not critical
            }

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
            console.error('Booking creation failed with error:', error);
            console.error('Error stack:', error.stack);
            console.error('Error details:', {
                message: error.message,
                status: error.status,
                name: error.name,
                code: error.code
            });

            if (error.status) throw error;
            throw ErrorHandler.internalServerError(error.message || 'Failed to create booking');
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
            throw ErrorHandler.internalServerError(error.message || 'Failed to get admin bookings');
        }
    },

    async approveRejectBooking(bookingId, bookingStatus, rejectionReason = null) {
        try {
            // Validate booking status
            if (!['APPROVED', 'REJECTED'].includes(bookingStatus)) {
                throw ErrorHandler.badRequest('Invalid booking status. Must be APPROVED or REJECTED');
            }

            // If rejected, rejection reason is required
            if (bookingStatus === 'REJECTED' && !rejectionReason) {
                throw ErrorHandler.badRequest('Rejection reason is required when rejecting a booking');
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
                throw ErrorHandler.notFound('Booking not found');
            }

            // Check if booking is in PROCESSING status
            if (booking.bookingStatus !== 'PROCESSING') {
                throw ErrorHandler.badRequest(`Cannot ${bookingStatus.toLowerCase()} booking. Current status: ${booking.bookingStatus}`);
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
            throw ErrorHandler.internalServerError(error.message || 'Failed to update booking status');
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

            // Validate rental days and price
            if (rentalDays <= 0) {
                throw new ErrorHandler(400, 'Invalid date range');
            }

            if (!booking.building.rentalPrice || booking.building.rentalPrice <= 0) {
                throw new ErrorHandler(400, 'Invalid building rental price');
            }

            const totalAmount = booking.building.rentalPrice * rentalDays;

            if (totalAmount <= 0) {
                throw new ErrorHandler(400, 'Invalid total amount calculated');
            }

            // Prepare clean phone number
            const cleanPhoneNumber = booking.user.phoneNumber ?
                booking.user.phoneNumber.replace(/\D/g, '') : '';
            const formattedPhone = cleanPhoneNumber.startsWith('62') ?
                `+${cleanPhoneNumber}` :
                cleanPhoneNumber.startsWith('0') ?
                    `+62${cleanPhoneNumber.substring(1)}` :
                    cleanPhoneNumber ? `+62${cleanPhoneNumber}` : '';

            // Create Xendit invoice data
            const invoiceData = {
                external_id: `booking-${booking.id}`,
                amount: Math.round(totalAmount),
                description: `Booking for ${booking.building.buildingName} - ${booking.activityName}`,
                invoice_duration: 86400,
                currency: 'IDR'
            };

            // Add customer info if valid
            if (booking.user.email) {
                invoiceData.customer = {
                    given_names: booking.user.fullName || 'Customer',
                    email: booking.user.email
                };

                // Add phone number only if valid
                if (formattedPhone && formattedPhone.length >= 10) {
                    invoiceData.customer.mobile_number = formattedPhone;
                }
            }

            // Add notification preference only if customer email exists
            if (booking.user.email) {
                invoiceData.customer_notification_preference = {
                    invoice_created: ['email'],
                    invoice_paid: ['email']
                };
            }

            // Add items array
            invoiceData.items = [
                {
                    name: `${booking.building.buildingName} Rental`,
                    quantity: rentalDays,
                    price: Math.round(booking.building.rentalPrice),
                    category: 'Building Rental'
                }
            ];

            // Add admin fee
            invoiceData.fees = [
                {
                    type: 'ADMIN',
                    value: 5000
                }
            ];

            // Try SDK first, fallback to HTTP request
            let invoice;
            try {
                invoice = await xendit.Invoice.createInvoice(invoiceData);
            } catch (sdkError) {
                console.log('SDK failed, trying HTTP request:', sdkError.message);

                // Fallback to direct HTTP request
                const response = await axios.post('https://api.xendit.co/v2/invoices', invoiceData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${Buffer.from(process.env.XENDIT_SECRET_KEY + ':').toString('base64')}`
                    }
                });

                invoice = response.data;
            }

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