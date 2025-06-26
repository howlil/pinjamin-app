const express = require('express');
const BookingController = require('../controllers/booking.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const ValidationMiddleware = require('../middlewares/validation.middleware');
const BookingValidation = require('../validations/booking.validation');
const { uploadDocument } = require('../libs/multer.lib');

const router = express.Router();

// ===== PUBLIC ROUTES (No authentication required) =====

// Get today's bookings (public access)
router.get('/bookings/today',
    BookingController.getTodayBookings
);

// ===== USER ROUTES (Authentication required) =====

// Create new booking (only borrowers, not admin)
router.post('/bookings',
    AuthMiddleware.authenticate,
    AuthMiddleware.preventAdmin,
    uploadDocument.single('proposalLetter'),
    ValidationMiddleware.validateMultipart(BookingValidation.createBookingSchema),
    BookingController.createBooking
);

// Get booking history for authenticated user
router.get('/bookings/history',
    AuthMiddleware.authenticate,
    ValidationMiddleware.validateQuery(BookingValidation.historyQuerySchema),
    BookingController.getBookingHistory
);

// Process payment for a specific booking
router.post('/bookings/:id/payment',
    AuthMiddleware.authenticate,
    ValidationMiddleware.validateParams(BookingValidation.bookingParamsSchema),
    BookingController.processPayment
);

// Generate invoice for a booking
router.get('/bookings/:id/invoice',
    AuthMiddleware.authenticate,
    ValidationMiddleware.validateParams(BookingValidation.bookingParamsSchema),
    BookingController.generateInvoice
);

// ===== ADMIN ROUTES (Admin authentication required) =====

// Get bookings with filters (admin)
router.get('/bookings/admin/list',
    AuthMiddleware.authenticate,
    AuthMiddleware.requireAdmin,
    ValidationMiddleware.validateQuery(BookingValidation.adminGetBookingsQuerySchema),
    BookingController.adminGetBookings
);

// Approve/Reject booking
router.patch('/bookings/admin/:id/approval',
    AuthMiddleware.authenticate,
    AuthMiddleware.requireAdmin,
    ValidationMiddleware.validateParams(BookingValidation.bookingParamsSchema),
    ValidationMiddleware.validate(BookingValidation.bookingApprovalSchema),
    BookingController.approveRejectBooking
);

// Get booking history with filters (admin)
router.get('/bookings/admin/history',
    AuthMiddleware.authenticate,
    AuthMiddleware.requireAdmin,
    ValidationMiddleware.validateQuery(BookingValidation.adminBookingHistoryQuerySchema),
    BookingController.adminGetBookingHistory
);

// Process refund
router.post('/bookings/admin/:id/refund',
    AuthMiddleware.authenticate,
    AuthMiddleware.requireAdmin,
    ValidationMiddleware.validateParams(BookingValidation.bookingParamsSchema),
    ValidationMiddleware.validate(BookingValidation.processRefundSchema),
    BookingController.processRefund
);

module.exports = router; 