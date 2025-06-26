const express = require('express');
const BuildingManagerController = require('../controllers/building-manager.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const ValidationMiddleware = require('../middlewares/validation.middleware');
const BuildingManagerValidation = require('../validations/building-manager.validation');

const router = express.Router();

// ===== PUBLIC ROUTES =====

// Get all building managers
router.get('/building-managers',
    ValidationMiddleware.validateQuery(BuildingManagerValidation.buildingManagerQuerySchema),
    BuildingManagerController.getBuildingManagers
);

// Get available building managers (not assigned to any building)
router.get('/building-managers/available',
    BuildingManagerController.getAvailableBuildingManagers
);

// ===== ADMIN ROUTES (Admin authentication required) =====

// Create building manager
router.post('/building-managers',
    AuthMiddleware.authenticate,
    AuthMiddleware.requireAdmin,
    ValidationMiddleware.validate(BuildingManagerValidation.createBuildingManagerSchema),
    BuildingManagerController.createBuildingManager
);

// Assign building manager to building
router.post('/building-managers/assign',
    AuthMiddleware.authenticate,
    AuthMiddleware.requireAdmin,
    ValidationMiddleware.validate(BuildingManagerValidation.assignBuildingManagerSchema),
    BuildingManagerController.assignBuildingManager
);

// Update building manager
router.patch('/building-managers/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.requireAdmin,
    ValidationMiddleware.validateParams(BuildingManagerValidation.buildingManagerParamsSchema),
    ValidationMiddleware.validate(BuildingManagerValidation.updateBuildingManagerSchema),
    BuildingManagerController.updateBuildingManager
);

// Delete building manager
router.delete('/building-managers/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.requireAdmin,
    ValidationMiddleware.validateParams(BuildingManagerValidation.buildingManagerParamsSchema),
    BuildingManagerController.deleteBuildingManager
);

module.exports = router; 