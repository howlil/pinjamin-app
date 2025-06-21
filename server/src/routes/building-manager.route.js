const express = require('express');
const { BuildingManagerController } = require('../controllers');
const { AuthMiddleware } = require('../middlewares');

function createBuildingManagerRoutes() {
    const router = express.Router();

    // Public endpoints - Get all building managers and get building manager by ID
    router.get(
        '/',
        BuildingManagerController.getAllBuildingManagers
    );

    // Get available managers (not assigned to any building)
    router.get(
        '/available',
        BuildingManagerController.getAvailableManagers
    );

    // Admin endpoints - Create, update, delete building managers
    router.post(
        '/',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('ADMIN'),
        BuildingManagerController.createBuildingManager
    );

    // Assign manager to building
    router.post(
        '/assign',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('ADMIN'),
        BuildingManagerController.assignManagerToBuilding
    );

    router.patch(
        '/:id',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('ADMIN'),
        BuildingManagerController.updateBuildingManager
    );

    router.delete(
        '/:id',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('ADMIN'),
        BuildingManagerController.deleteBuildingManager
    );

    return router;
}

module.exports = createBuildingManagerRoutes(); 