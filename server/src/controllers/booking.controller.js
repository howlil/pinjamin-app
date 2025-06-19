const { BookingService } = require('../services');
const { Response, ErrorHandler } = require('../utils');

const BookingController = {
    async create(req, res, next) {
        try {
            // Check if file is uploaded
            if (!req.file) {
                throw new ErrorHandler(400, 'Proposal letter file is required');
            }

            // Get user ID from authenticated user
            const userId = req.user.id;

            // Prepare booking data
            const bookingData = {
                buildingId: req.body.buildingId,
                activityName: req.body.activityName,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                startTime: req.body.startTime,
                endTime: req.body.endTime
            };

            // File path for proposal letter
            const proposalLetterPath = req.file.path;

            // Create booking
            const result = await BookingService.createBooking(userId, bookingData, proposalLetterPath);

            return Response.success(res, result, 'Booking created successfully', 201);
        } catch (error) {
            next(error);
        }
    },

    async getHistory(req, res, next) {
        try {
            // Get user ID from authenticated user
            const userId = req.user.id;

            // Get pagination parameters
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            // Validate pagination parameters
            if (page < 1) {
                throw new ErrorHandler(400, 'Page must be greater than 0');
            }
            if (limit < 1 || limit > 100) {
                throw new ErrorHandler(400, 'Limit must be between 1 and 100');
            }

            // Get booking history
            const result = await BookingService.getBookingHistory(userId, page, limit);

            return Response.success(res, result.data, 'Booking history retrieved successfully', 200, result.pagination);
        } catch (error) {
            next(error);
        }
    },

    async getAdminBookings(req, res, next) {
        try {
            // Get query parameters
            const status = req.query.status || 'PROCESSING';
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            // Validate status
            const validStatuses = ['PROCESSING', 'APPROVED', 'REJECTED', 'COMPLETED'];
            if (status && !validStatuses.includes(status)) {
                throw new ErrorHandler(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
            }

            // Validate pagination parameters
            if (page < 1) {
                throw new ErrorHandler(400, 'Page must be greater than 0');
            }
            if (limit < 1 || limit > 100) {
                throw new ErrorHandler(400, 'Limit must be between 1 and 100');
            }

            // Get bookings
            const result = await BookingService.getAdminBookings(status, page, limit);

            return Response.success(res, result.data, 'Admin bookings retrieved successfully', 200, result.pagination);
        } catch (error) {
            next(error);
        }
    },

    async approveRejectBooking(req, res, next) {
        try {
            // Get booking ID from params
            const { id } = req.params;

            // Get data from request body
            const { bookingStatus, rejectionReason } = req.body;

            // Validate required fields
            if (!bookingStatus) {
                throw new ErrorHandler(400, 'Booking status is required');
            }

            // Approve or reject booking
            const result = await BookingService.approveRejectBooking(id, bookingStatus, rejectionReason);

            const message = bookingStatus === 'APPROVED'
                ? 'Booking approved successfully'
                : 'Booking rejected successfully';

            return Response.success(res, result, message);
        } catch (error) {
            next(error);
        }
    },

    async getBookingHistoryWithFilters(req, res, next) {
        try {
            // Get query parameters
            const { buildingId, startDate, endDate } = req.query;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            // Validate buildingId if provided
            if (buildingId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(buildingId)) {
                throw new ErrorHandler(400, 'Invalid building ID format');
            }

            // Validate date formats if provided
            if (startDate && !/^\d{2}-\d{2}-\d{4}$/.test(startDate)) {
                throw new ErrorHandler(400, 'Start date must be in DD-MM-YYYY format');
            }
            if (endDate && !/^\d{2}-\d{2}-\d{4}$/.test(endDate)) {
                throw new ErrorHandler(400, 'End date must be in DD-MM-YYYY format');
            }

            // Validate pagination parameters
            if (page < 1) {
                throw new ErrorHandler(400, 'Page must be greater than 0');
            }
            if (limit < 1 || limit > 100) {
                throw new ErrorHandler(400, 'Limit must be between 1 and 100');
            }

            // Get booking history
            const result = await BookingService.getBookingHistoryWithFilters(buildingId, startDate, endDate, page, limit);

            return Response.success(res, result.data, 'Booking history retrieved successfully', 200, result.pagination);
        } catch (error) {
            next(error);
        }
    },

    async processRefund(req, res, next) {
        try {
            // Get booking ID from params
            const { id } = req.params;

            // Get refund reason from request body
            const { refundReason } = req.body;

            // Validate required fields
            if (!refundReason) {
                throw new ErrorHandler(400, 'Refund reason is required');
            }

            // Process refund
            const result = await BookingService.processRefund(id, refundReason);

            return Response.success(res, result, 'Refund processed successfully');
        } catch (error) {
            next(error);
        }
    }
};

module.exports = BookingController; 