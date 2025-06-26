const BuildingManagerService = require('../services/building-manager.service');
const ResponseHelper = require('../libs/response.lib');
const logger = require('../libs/logger.lib');

const BuildingManagerController = {
    // Get all building managers
    async getBuildingManagers(req, res) {
        try {
            const { buildingId, page, limit } = req.query;

            const result = await BuildingManagerService.getBuildingManagers({ buildingId, page, limit });

            return ResponseHelper.successWithPagination(
                res,
                'Data building manager berhasil diambil',
                result.buildingManagers,
                {
                    totalItems: result.totalItems,
                    totalPages: result.totalPages,
                    currentPage: result.currentPage,
                    itemsPerPage: result.itemsPerPage
                }
            );
        } catch (error) {
            logger.error('Get building managers controller error:', error);
            return ResponseHelper.error(res, 'Terjadi kesalahan saat mengambil data building manager', 500);
        }
    },

    // Get available building managers (not assigned to any building)
    async getAvailableBuildingManagers(req, res) {
        try {
            const result = await BuildingManagerService.getAvailableBuildingManagers();
            return ResponseHelper.success(res, 'Data building manager tersedia berhasil diambil', result);
        } catch (error) {
            logger.error('Get available building managers controller error:', error);
            return ResponseHelper.error(res, 'Terjadi kesalahan saat mengambil data building manager tersedia', 500);
        }
    },

    // Create building manager
    async createBuildingManager(req, res) {
        try {
            const buildingManagerData = req.body;

            const result = await BuildingManagerService.createBuildingManager(buildingManagerData);
            return ResponseHelper.success(res, 'Building manager berhasil dibuat', result, 201);
        } catch (error) {
            logger.error('Create building manager controller error:', error);

            if (error.message === 'Building tidak ditemukan') {
                return ResponseHelper.notFound(res, error.message);
            }

            return ResponseHelper.error(res, 'Terjadi kesalahan saat membuat building manager', 500);
        }
    },

    // Assign building manager to building
    async assignBuildingManager(req, res) {
        try {
            const { managerId, buildingId } = req.body;

            const result = await BuildingManagerService.assignBuildingManager(managerId, buildingId);
            return ResponseHelper.success(res, 'Building manager berhasil ditugaskan', result);
        } catch (error) {
            logger.error('Assign building manager controller error:', error);

            if (error.message === 'Building manager tidak ditemukan' || error.message === 'Building tidak ditemukan') {
                return ResponseHelper.notFound(res, error.message);
            }

            if (error.message.includes('sudah ditugaskan')) {
                return ResponseHelper.conflict(res, error.message);
            }

            return ResponseHelper.error(res, 'Terjadi kesalahan saat menugaskan building manager', 500);
        }
    },

    // Update building manager
    async updateBuildingManager(req, res) {
        try {
            const { id } = req.params;
            const buildingManagerData = req.body;

            const result = await BuildingManagerService.updateBuildingManager(id, buildingManagerData);
            return ResponseHelper.success(res, 'Building manager berhasil diperbarui', result);
        } catch (error) {
            logger.error('Update building manager controller error:', error);

            if (error.message === 'Building manager tidak ditemukan' || error.message === 'Building tidak ditemukan') {
                return ResponseHelper.notFound(res, error.message);
            }

            return ResponseHelper.error(res, 'Terjadi kesalahan saat memperbarui building manager', 500);
        }
    },

    // Delete building manager
    async deleteBuildingManager(req, res) {
        try {
            const { id } = req.params;

            const result = await BuildingManagerService.deleteBuildingManager(id);
            return ResponseHelper.success(res, 'Building manager berhasil dihapus', result);
        } catch (error) {
            logger.error('Delete building manager controller error:', error);

            if (error.message === 'Building manager tidak ditemukan') {
                return ResponseHelper.notFound(res, error.message);
            }

            return ResponseHelper.error(res, 'Terjadi kesalahan saat menghapus building manager', 500);
        }
    }
};

module.exports = BuildingManagerController; 