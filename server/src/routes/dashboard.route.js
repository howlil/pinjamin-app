const express = require('express');
const { DashboardController } = require('../controllers');
const { AuthMiddleware } = require('../middlewares');

class DashboardRoute {
    #router = express.Router();

    constructor() {
        this.#initializeRoutes();
    }

    #initializeRoutes() {
        // Booking statistics endpoint (admin only)
        this.#router.get(
            '/statistics/bookings',
            AuthMiddleware.authenticate,
            AuthMiddleware.authorize('ADMIN'),
            DashboardController.getBookingStatistics
        );

        // Transaction statistics endpoint (admin only)
        this.#router.get(
            '/statistics/transactions',
            AuthMiddleware.authenticate,
            AuthMiddleware.authorize('ADMIN'),
            DashboardController.getTransactionStatistics
        );
    }

    getRouter() {
        return this.#router;
    }
}

module.exports = new DashboardRoute().getRouter(); 