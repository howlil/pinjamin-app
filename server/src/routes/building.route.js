const express = require('express');
const { BuildingController } = require('../controllers');
const { BuildingValidation } = require('../validations');
const { ValidationMiddleware, AuthMiddleware, UploadMiddleware } = require('../middlewares');

class BuildingRoute {
    #router = express.Router();

    constructor() {
        this.#initializeRoutes();
    }

    #initializeRoutes() {
        // ===================
        // PUBLIC ENDPOINTS
        // ===================

        // Get all buildings (public)
        this.#router.get(
            '/',
            ValidationMiddleware.validateQuery(BuildingValidation.getBuildings),
            BuildingController.getAll
        );

        // Get all buildings schedule
        this.#router.get(
            '/schedule',
            ValidationMiddleware.validateQuery(BuildingValidation.getBuildingSchedule),
            BuildingController.getAllBuildingsSchedule
        );

        // Check availability
        this.#router.post(
            '/check-availability',
            ValidationMiddleware.validate(BuildingValidation.checkAvailability),
            BuildingController.checkAvailability
        );

        // ===================
        // ADMIN ENDPOINTS
        // ===================

        // Get all buildings (admin view)
        this.#router.get(
            '/admin',
            AuthMiddleware.authenticate,
            AuthMiddleware.authorize('ADMIN'),
            ValidationMiddleware.validateQuery(BuildingValidation.getBuildings),
            BuildingController.getAllAdmin
        );

        // Create building
        this.#router.post(
            '/admin',
            AuthMiddleware.authenticate,
            AuthMiddleware.authorize('ADMIN'),
            UploadMiddleware.handleImageUpload,
            ValidationMiddleware.validate(BuildingValidation.create),
            BuildingController.create
        );

        // Update building
        this.#router.patch(
            '/admin/:id',
            AuthMiddleware.authenticate,
            AuthMiddleware.authorize('ADMIN'),
            ValidationMiddleware.validateParams(BuildingValidation.params),
            UploadMiddleware.optionalImageUpload,
            ValidationMiddleware.validate(BuildingValidation.update),
            BuildingController.update
        );

        // Delete building
        this.#router.delete(
            '/admin/:id',
            AuthMiddleware.authenticate,
            AuthMiddleware.authorize('ADMIN'),
            ValidationMiddleware.validateParams(BuildingValidation.params),
            BuildingController.delete
        );

        // Get building by ID (moved to end after admin routes)
        this.#router.get(
            '/:id',
            ValidationMiddleware.validateParams(BuildingValidation.params),
            BuildingController.getById
        );
    }

    getRouter() {
        return this.#router;
    }
}

module.exports = new BuildingRoute().getRouter(); 