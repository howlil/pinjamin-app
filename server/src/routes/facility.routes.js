const express = require('express');
const FacilityController = require('../controllers/facility.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const ValidationMiddleware = require('../middlewares/validation.middleware');
const FacilityValidation = require('../validations/facility.validation');

const router = express.Router();

// ===== PUBLIC ROUTES =====

// Get all facilities
router.get('/facilities',
    ValidationMiddleware.validateQuery(FacilityValidation.paginationQuerySchema),
    FacilityController.getFacilities
);

// ===== ADMIN ROUTES (Admin authentication required) =====

// Create facility
router.post('/facilities',
    AuthMiddleware.authenticate,
    AuthMiddleware.requireAdmin,
    ValidationMiddleware.validate(FacilityValidation.createFacilitySchema),
    FacilityController.createFacility
);

// Update facility
router.patch('/facilities/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.requireAdmin,
    ValidationMiddleware.validateParams(FacilityValidation.facilityParamsSchema),
    ValidationMiddleware.validate(FacilityValidation.updateFacilitySchema),
    FacilityController.updateFacility
);

// Delete facility
router.delete('/facilities/:id',
    AuthMiddleware.authenticate,
    AuthMiddleware.requireAdmin,
    ValidationMiddleware.validateParams(FacilityValidation.facilityParamsSchema),
    FacilityController.deleteFacility
);

module.exports = router; 