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
    }

    getRouter() {
        return this.#router;
    }
}

module.exports = new BookingRoute().getRouter(); 