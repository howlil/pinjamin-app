const FacilityService = require('../services/facility.service');
const ResponseHelper = require('../libs/response.lib');
const logger = require('../libs/logger.lib');

const FacilityController = {
    // Get all facilities
    async getFacilities(req, res) {
        try {
            const { page, limit } = req.query;

            const result = await FacilityService.getFacilities({ page, limit });

            return ResponseHelper.successWithPagination(
                res,
                'Data fasilitas berhasil diambil',
                result.facilities,
                {
                    totalItems: result.totalItems,
                    totalPages: result.totalPages,
                    currentPage: result.currentPage,
                    itemsPerPage: result.itemsPerPage
                }
            );
        } catch (error) {
            logger.error('Get facilities controller error:', error);
            return ResponseHelper.error(res, 'Terjadi kesalahan saat mengambil data fasilitas', 500);
        }
    },

    // Create facility
    async createFacility(req, res) {
        try {
            const facilityData = req.body;

            const result = await FacilityService.createFacility(facilityData);
            return ResponseHelper.success(res, 'Fasilitas berhasil dibuat', result, 201);
        } catch (error) {
            logger.error('Create facility controller error:', error);
            return ResponseHelper.error(res, 'Terjadi kesalahan saat membuat fasilitas', 500);
        }
    },

    // Update facility
    async updateFacility(req, res) {
        try {
            const { id } = req.params;
            const facilityData = req.body;

            const result = await FacilityService.updateFacility(id, facilityData);
            return ResponseHelper.success(res, 'Fasilitas berhasil diperbarui', result);
        } catch (error) {
            logger.error('Update facility controller error:', error);

            if (error.message === 'Fasilitas tidak ditemukan') {
                return ResponseHelper.notFound(res, error.message);
            }

            return ResponseHelper.error(res, 'Terjadi kesalahan saat memperbarui fasilitas', 500);
        }
    },

    // Delete facility
    async deleteFacility(req, res) {
        try {
            const { id } = req.params;

            const result = await FacilityService.deleteFacility(id);
            return ResponseHelper.success(res, 'Fasilitas berhasil dihapus', result);
        } catch (error) {
            logger.error('Delete facility controller error:', error);

            if (error.message === 'Fasilitas tidak ditemukan') {
                return ResponseHelper.notFound(res, error.message);
            }

            if (error.message.includes('tidak bisa dihapus')) {
                return ResponseHelper.conflict(res, error.message);
            }

            return ResponseHelper.error(res, 'Terjadi kesalahan saat menghapus fasilitas', 500);
        }
    }
};

module.exports = FacilityController; 