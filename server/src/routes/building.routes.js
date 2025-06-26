const express = require('express');
const BuildingController = require('../controllers/building.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const ValidationMiddleware = require('../middlewares/validation.middleware');
const BuildingValidation = require('../validations/building.validation');
const { uploadImage } = require('../libs/multer.lib');

const router = express.Router();

// ===== PUBLIC ROUTES (No authentication required) =====

// Get all buildings with optional filters
router.get('/buildings',
    ValidationMiddleware.validateQuery(BuildingValidation.getBuildingsQuerySchema),
    BuildingController.getBuildings
);

// Get monthly booking schedule for all buildings - HARUS SEBELUM /buildings/:id
router.get('/buildings/schedule',
    ValidationMiddleware.validateQuery(BuildingValidation.scheduleQuerySchema),
    BuildingController.getBuildingSchedule
);

// Check building availability for specific date and time - HARUS SEBELUM /buildings/:id  
router.post('/buildings/check-availability',
    ValidationMiddleware.validate(BuildingValidation.checkAvailabilitySchema),
    BuildingController.checkAvailability
);

// Get building detail by ID - HARUS TERAKHIR karena menggunakan parameter dinamis
router.get('/buildings/:id',
    ValidationMiddleware.validateParams(BuildingValidation.buildingParamsSchema),
    BuildingController.getBuildingDetail
);

// ===== ADMIN ROUTES (Admin authentication required) =====

// Get all buildings (admin view with more details)
router.get('/buildings/admin/list',
    AuthMiddleware.authenticate,
    AuthMiddleware.requireAdmin,
    ValidationMiddleware.validateQuery(BuildingValidation.adminPaginationQuerySchema),
    BuildingController.adminGetBuildings
);

// Create building
router.post('/buildings/admin',
    AuthMiddleware.authenticate,
    AuthMiddleware.requireAdmin,
    uploadImage.single('buildingPhoto'),
    ValidationMiddleware.validate(BuildingValidation.createBuildingSchema),
    BuildingController.createBuilding
);

// Update building
router.patch('/buildings/admin/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.requireAdmin,
    ValidationMiddleware.validateParams(BuildingValidation.buildingParamsSchema),
    uploadImage.single('buildingPhoto'),
    ValidationMiddleware.validate(BuildingValidation.updateBuildingSchema),
    BuildingController.updateBuilding
);

// Delete building
router.delete('/buildings/admin/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.requireAdmin,
    ValidationMiddleware.validateParams(BuildingValidation.buildingParamsSchema),
    BuildingController.deleteBuilding
);

module.exports = router; 