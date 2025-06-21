const express = require('express');
const { BookingController } = require('../controllers');
const { BookingValidation } = require('../validations');
const { ValidationMiddleware, AuthMiddleware, UploadMiddleware } = require('../middlewares');

class BookingRoute {
    #router = express.Router();

    constructor() {
        this.#initializeRoutes();
    }

    #initializeRoutes() {
        // Get today's bookings endpoint (public)
        this.#router.get(
            '/today',
            BookingController.getTodayBookings
        );

        // Create booking endpoint (authenticated)
        this.#router.post(
            '/',
            AuthMiddleware.authenticate,
            UploadMiddleware.handleProposalUpload,
            ValidationMiddleware.validate(BookingValidation.create),
            BookingController.create
        );

        // Get booking history endpoint (authenticated)
        this.#router.get(
            '/history',
            AuthMiddleware.authenticate,
            BookingController.getHistory
        );

        // Process payment for a booking endpoint (authenticated)
        this.#router.post(
            '/:id/payment',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateParams(BookingValidation.params),
            BookingController.processPayment
        );

        // Generate invoice endpoint (authenticated)
        this.#router.get(
            '/:id/invoice',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validateParams(BookingValidation.params),
            BookingController.generateInvoice
        );

        // Admin endpoints
        // Get admin bookings endpoint (admin only)
        this.#router.get(
            '/admin',
            AuthMiddleware.authenticate,
            AuthMiddleware.authorize('ADMIN'),
            BookingController.getAdminBookings
        );

        // Get admin booking history with filters endpoint (admin only)
        this.#router.get(
            '/admin/history',
            AuthMiddleware.authenticate,
            AuthMiddleware.authorize('ADMIN'),
            BookingController.getAdminBookingHistory
        );

        // Approve/reject booking endpoint (admin only)
        this.#router.patch(
            '/admin/:id/approval',
            AuthMiddleware.authenticate,
            AuthMiddleware.authorize('ADMIN'),
            ValidationMiddleware.validate(BookingValidation.approveReject),
            BookingController.approveRejectBooking
        );

        // Process refund for a booking endpoint (admin only)
        this.#router.post(
            '/:id/refund',
            AuthMiddleware.authenticate,
            AuthMiddleware.authorize('ADMIN'),
            ValidationMiddleware.validateParams(BookingValidation.params),
            ValidationMiddleware.validate(BookingValidation.refund),
            BookingController.processRefund
        );
    }

    getRouter() {
        return this.#router;
    }
}

module.exports = new BookingRoute().getRouter(); 