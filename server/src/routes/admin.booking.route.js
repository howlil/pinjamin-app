const express = require('express');
const { BookingController } = require('../controllers');
const { BookingValidation } = require('../validations');
const { AuthMiddleware, ValidationMiddleware } = require('../middlewares');

class AdminBookingRoute {
    #router = express.Router();

    constructor() {
        this.#initializeRoutes();
    }

    #initializeRoutes() {
        // Get admin bookings endpoint (admin only)
        this.#router.get(
            '/',
            AuthMiddleware.authenticate,
            AuthMiddleware.authorize('ADMIN'),
            BookingController.getAdminBookings
        );

        // Approve/reject booking endpoint (admin only)
        this.#router.patch(
            '/:id/approval',
            AuthMiddleware.authenticate,
            AuthMiddleware.authorize('ADMIN'),
            ValidationMiddleware.validate(BookingValidation.approveReject),
            BookingController.approveRejectBooking
        );
    }

    getRouter() {
        return this.#router;
    }
}

module.exports = new AdminBookingRoute().getRouter(); 