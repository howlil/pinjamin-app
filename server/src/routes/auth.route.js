const express = require('express');
const { AuthController } = require('../controllers');
const { AuthValidation } = require('../validations');
const { ValidationMiddleware, AuthMiddleware } = require('../middlewares');

class AuthRoute {
    #router = express.Router();

    constructor() {
        this.#initializeRoutes();
    }

    #initializeRoutes() {
        // Register endpoint
        this.#router.post(
            '/register',
            ValidationMiddleware.validate(AuthValidation.register),
            AuthController.register
        );

        // Login endpoint
        this.#router.post(
            '/login',
            ValidationMiddleware.validate(AuthValidation.login),
            AuthController.login
        );

        // Get profile endpoint
        this.#router.get(
            '/profile',
            AuthMiddleware.authenticate,
            AuthController.getProfile
        );

        // Update profile endpoint
        this.#router.patch(
            '/profile',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validate(AuthValidation.updateProfile),
            AuthController.updateProfile
        );

        // Logout endpoint
        this.#router.post(
            '/logout',
            AuthMiddleware.authenticate,
            AuthController.logout
        );

        // Change password endpoint
        this.#router.post(
            '/change-password',
            AuthMiddleware.authenticate,
            ValidationMiddleware.validate(AuthValidation.changePassword),
            AuthController.changePassword
        );

        // Forgot password endpoint
        this.#router.post(
            '/forgot-password',
            ValidationMiddleware.validate(AuthValidation.forgotPassword),
            AuthController.forgotPassword
        );

        // Reset password endpoint
        this.#router.post(
            '/reset-password',
            ValidationMiddleware.validate(AuthValidation.resetPassword),
            AuthController.resetPassword
        );
    }

    getRouter() {
        return this.#router;
    }
}

module.exports = new AuthRoute().getRouter(); 