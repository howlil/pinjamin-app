const { BuildingManagerService } = require('../services');
const { Response, ErrorHandler } = require('../utils');

const BuildingManagerController = {
    // Get all building managers
    getAllBuildingManagers: ErrorHandler.asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const buildingId = req.query.buildingId;

        // Validate pagination parameters
        if (page < 1) {
            throw ErrorHandler.badRequest('Page must be greater than 0');
        }
        if (limit < 1 || limit > 100) {
            throw ErrorHandler.badRequest('Limit must be between 1 and 100');
        }

        const result = await BuildingManagerService.getAllBuildingManagers(page, limit, buildingId);

        return Response.success(res, result.data, 'All building managers retrieved successfully', 200, result.pagination);
    }),



    // Create new building manager
    createBuildingManager: ErrorHandler.asyncHandler(async (req, res) => {
        const { managerName, phoneNumber, buildingId } = req.body;

        if (!managerName) {
            throw ErrorHandler.badRequest('Manager name is required');
        }
        if (!phoneNumber) {
            throw ErrorHandler.badRequest('Phone number is required');
        }

        const newBuildingManager = await BuildingManagerService.createBuildingManager({
            managerName,
            phoneNumber,
            buildingId
        });

        return Response.success(res, newBuildingManager, 'Building manager created successfully', 201);
    }),

    // Update building manager
    updateBuildingManager: ErrorHandler.asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { managerName, phoneNumber, buildingId } = req.body;

        if (!id) {
            throw ErrorHandler.badRequest('Building manager ID is required');
        }

        const updateData = {};
        if (managerName !== undefined) updateData.managerName = managerName;
        if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
        if (buildingId !== undefined) updateData.buildingId = buildingId;

        const updatedBuildingManager = await BuildingManagerService.updateBuildingManager(id, updateData);

        return Response.success(res, updatedBuildingManager, 'Building manager updated successfully');
    }),

    // Delete building manager
    deleteBuildingManager: ErrorHandler.asyncHandler(async (req, res) => {
        const { id } = req.params;

        if (!id) {
            throw ErrorHandler.badRequest('Building manager ID is required');
        }

        await BuildingManagerService.deleteBuildingManager(id);

        return Response.success(res, { id }, 'Building manager deleted successfully');
    }),

    // Get available managers (not assigned to any building)
    getAvailableManagers: ErrorHandler.asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Validate pagination parameters
        if (page < 1) {
            throw ErrorHandler.badRequest('Page must be greater than 0');
        }
        if (limit < 1 || limit > 100) {
            throw ErrorHandler.badRequest('Limit must be between 1 and 100');
        }

        const result = await BuildingManagerService.getAvailableManagers(page, limit);

        return Response.success(res, result.data, 'Available managers retrieved successfully', 200, result.pagination);
    }),

    // Assign manager to building
    assignManagerToBuilding: ErrorHandler.asyncHandler(async (req, res) => {
        const { managerId, buildingId } = req.body;

        if (!managerId) {
            throw ErrorHandler.badRequest('Manager ID is required');
        }
        if (!buildingId) {
            throw ErrorHandler.badRequest('Building ID is required');
        }

        const assignedManager = await BuildingManagerService.assignManagerToBuilding(managerId, buildingId);

        return Response.success(res, assignedManager, 'Manager assigned to building successfully');
    })
};

module.exports = BuildingManagerController; 