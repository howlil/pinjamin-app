const { FacilityService } = require('../services');
const { Response, ErrorHandler } = require('../utils');

const FacilityController = {
    // Get all facilities
    getAllFacilities: ErrorHandler.asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Validate pagination parameters
        if (page < 1) {
            throw ErrorHandler.badRequest('Page must be greater than 0');
        }
        if (limit < 1 || limit > 100) {
            throw ErrorHandler.badRequest('Limit must be between 1 and 100');
        }

        const result = await FacilityService.getAllFacilities(page, limit);

        return Response.success(res, result.data, 'All facilities retrieved successfully', 200, result.pagination);
    }),



    // Create new facility
    createFacility: ErrorHandler.asyncHandler(async (req, res) => {
        const { facilityName, iconUrl } = req.body;

        if (!facilityName) {
            throw ErrorHandler.badRequest('Facility name is required');
        }

        const newFacility = await FacilityService.createFacility({
            facilityName,
            iconUrl
        });

        return Response.success(res, newFacility, 'Facility created successfully', 201);
    }),

    // Update facility
    updateFacility: ErrorHandler.asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { facilityName, iconUrl } = req.body;

        if (!id) {
            throw ErrorHandler.badRequest('Facility ID is required');
        }

        const updateData = {};
        if (facilityName !== undefined) updateData.facilityName = facilityName;
        if (iconUrl !== undefined) updateData.iconUrl = iconUrl;

        const updatedFacility = await FacilityService.updateFacility(id, updateData);

        return Response.success(res, updatedFacility, 'Facility updated successfully');
    }),

    // Delete facility
    deleteFacility: ErrorHandler.asyncHandler(async (req, res) => {
        const { id } = req.params;

        if (!id) {
            throw ErrorHandler.badRequest('Facility ID is required');
        }

        await FacilityService.deleteFacility(id);

        return Response.success(res, { id }, 'Facility deleted successfully');
    })
};

module.exports = FacilityController; 