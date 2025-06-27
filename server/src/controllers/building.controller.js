const BuildingService = require('../services/building.service');
const ResponseHelper = require('../libs/response.lib');
const logger = require('../libs/logger.lib');

const BuildingController = {
    // Check building availability
    async checkAvailability(req, res) {
        try {
            const { date, time } = req.body;
            const result = await BuildingService.checkAvailability(date, time);

            return ResponseHelper.success(res,
                `Ditemukan ${result.availableBuildings.length} gedung yang tersedia pada ${date} pukul ${time}`,
                result
            );
        } catch (error) {
            logger.error('Check availability controller error:', error);
            return ResponseHelper.error(res, 'Terjadi kesalahan saat mengecek ketersediaan', 500);
        }
    },

    // Get buildings with filters
    async getBuildings(req, res) {
        try {
            const { search, buildingType, page, limit } = req.query;

            const filters = { search, buildingType };
            const pagination = { page, limit };

            const result = await BuildingService.getBuildings(filters, pagination);

            return ResponseHelper.successWithPagination(
                res,
                'Data building berhasil diambil',
                result.buildings,
                {
                    totalItems: result.totalItems,
                    totalPages: result.totalPages,
                    currentPage: result.currentPage,
                    itemsPerPage: result.itemsPerPage
                }
            );
        } catch (error) {
            logger.error('Get buildings controller error:', error);
            return ResponseHelper.error(res, 'Terjadi kesalahan saat mengambil data building', 500);
        }
    },

    // Get building detail
    async getBuildingDetail(req, res) {
        try {
            const { id } = req.params;
            const building = await BuildingService.getBuildingDetail(id);
            return ResponseHelper.success(res, 'Detail building berhasil diambil', building);
        } catch (error) {
            logger.error('Get building detail controller error:', error);

            if (error.message === 'Building tidak ditemukan') {
                return ResponseHelper.notFound(res, error.message);
            }

            return ResponseHelper.error(res, 'Terjadi kesalahan saat mengambil detail building', 500);
        }
    },

    // Get building schedule
    async getBuildingSchedule(req, res) {
        try {
            const { month, year } = req.query;

            const schedule = await BuildingService.getBuildingSchedule(month, year);
            return ResponseHelper.success(res, 'Jadwal building berhasil diambil', schedule);
        } catch (error) {
            logger.error('Get building schedule controller error:', error);
            return ResponseHelper.error(res, 'Terjadi kesalahan saat mengambil jadwal building', 500);
        }
    },

    // ===== ADMIN FUNCTIONS =====

    // Get all buildings (admin)
    async adminGetBuildings(req, res) {
        try {
            const { search, buildingType, page, limit } = req.query;

            const filters = { search, buildingType };
            const pagination = { page, limit };

            const result = await BuildingService.adminGetBuildings(filters, pagination);

            return ResponseHelper.successWithPagination(
                res,
                'Data building berhasil diambil',
                result.buildings,
                {
                    totalItems: result.totalItems,
                    totalPages: result.totalPages,
                    currentPage: result.currentPage,
                    itemsPerPage: result.itemsPerPage
                }
            );
        } catch (error) {
            logger.error('Admin get buildings controller error:', error);
            return ResponseHelper.error(res, 'Terjadi kesalahan saat mengambil data building', 500);
        }
    },

    // Create building
    async createBuilding(req, res) {
        try {
            const buildingData = req.body;
            const buildingPhoto = req.file;

            // Debug logging untuk melihat format data yang diterima
            logger.info('Create building request data:', {
                buildingName: buildingData.buildingName,
                facilities: {
                    type: typeof buildingData.facilities,
                    value: buildingData.facilities,
                    length: buildingData.facilities?.length
                },
                buildingManagers: {
                    type: typeof buildingData.buildingManagers,
                    value: buildingData.buildingManagers,
                    length: buildingData.buildingManagers?.length
                },
                hasPhoto: !!buildingPhoto
            });

            const result = await BuildingService.createBuilding(buildingData, buildingPhoto);
            return ResponseHelper.success(res, 'Building berhasil dibuat', result, 201);
        } catch (error) {
            logger.error('Admin create building controller error:', error);

            // Handle specific validation errors
            if (error.message.includes('field wajib')) {
                return ResponseHelper.badRequest(res, error.message);
            }

            if (error.message.includes('tidak valid')) {
                return ResponseHelper.badRequest(res, error.message);
            }

            return ResponseHelper.error(res, 'Terjadi kesalahan saat membuat building', 500);
        }
    },

    // Update building
    async updateBuilding(req, res) {
        try {
            const { id } = req.params;
            const buildingData = req.body;
            const buildingPhoto = req.file;

            const result = await BuildingService.updateBuilding(id, buildingData, buildingPhoto);
            return ResponseHelper.success(res, 'Building berhasil diperbarui', result);
        } catch (error) {
            logger.error('Admin update building controller error:', error);

            if (error.message === 'Building tidak ditemukan') {
                return ResponseHelper.notFound(res, error.message);
            }

            return ResponseHelper.error(res, 'Terjadi kesalahan saat memperbarui building', 500);
        }
    },

    // Delete building
    async deleteBuilding(req, res) {
        try {
            const { id } = req.params;

            const result = await BuildingService.deleteBuilding(id);
            return ResponseHelper.success(res, 'Building berhasil dihapus', result);
        } catch (error) {
            logger.error('Admin delete building controller error:', error);

            if (error.message === 'Building tidak ditemukan') {
                return ResponseHelper.notFound(res, error.message);
            }

            if (error.message.includes('tidak bisa dihapus')) {
                return ResponseHelper.conflict(res, error.message);
            }

            return ResponseHelper.error(res, 'Terjadi kesalahan saat menghapus building', 500);
        }
    }
};

module.exports = BuildingController; 