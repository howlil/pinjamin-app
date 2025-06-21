const express = require('express');
const { FacilityController } = require('../controllers');
const { AuthMiddleware } = require('../middlewares');

function createFacilityRoutes() {
    const router = express.Router();

    // Public endpoints - Get all facilities
    router.get(
        '/',
        FacilityController.getAllFacilities
    );

    // Admin endpoints - Create, update, delete facilities
    router.post(
        '/',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('ADMIN'),
        FacilityController.createFacility
    );

    router.patch(
        '/:id',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('ADMIN'),
        FacilityController.updateFacility
    );

    router.delete(
        '/:id',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('ADMIN'),
        FacilityController.deleteFacility
    );

    return router;
}

module.exports = createFacilityRoutes(); 