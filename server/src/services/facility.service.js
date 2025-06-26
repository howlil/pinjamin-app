const { v4: uuidv4 } = require('uuid');
const prisma = require('../libs/database.lib');
const logger = require('../libs/logger.lib');

const FacilityService = {
    // Get all facilities with pagination
    async getFacilities(pagination) {
        try {
            const { page = 1, limit = 10 } = pagination;
            const skip = (page - 1) * limit;

            const [facilities, totalItems] = await Promise.all([
                prisma.facility.findMany({
                    select: {
                        id: true,
                        facilityName: true,
                        iconUrl: true,
                        createdAt: true,
                        updatedAt: true
                    },
                    orderBy: {
                        facilityName: 'asc'
                    },
                    skip,
                    take: limit
                }),
                prisma.facility.count()
            ]);

            return {
                facilities,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: parseInt(page),
                itemsPerPage: parseInt(limit)
            };
        } catch (error) {
            logger.error('Get facilities service error:', error);
            throw error;
        }
    },

    // Create facility
    async createFacility(facilityData) {
        try {
            const { facilityName, iconUrl } = facilityData;

            // Check if facility with same name already exists
            const existingFacility = await prisma.facility.findFirst({
                where: { facilityName }
            });

            if (existingFacility) {
                throw new Error('Fasilitas dengan nama tersebut sudah ada');
            }

            const facilityId = uuidv4();

            const facility = await prisma.facility.create({
                data: {
                    id: facilityId,
                    facilityName,
                    iconUrl: iconUrl || null
                }
            });

            logger.info(`Facility created: ${facilityId}`);

            return {
                id: facility.id,
                facilityName: facility.facilityName,
                iconUrl: facility.iconUrl,
                createdAt: facility.createdAt,
                updatedAt: facility.updatedAt
            };
        } catch (error) {
            logger.error('Create facility service error:', error);
            throw error;
        }
    },

    // Update facility
    async updateFacility(facilityId, facilityData) {
        try {
            const existingFacility = await prisma.facility.findUnique({
                where: { id: facilityId }
            });

            if (!existingFacility) {
                throw new Error('Fasilitas tidak ditemukan');
            }

            const { facilityName, iconUrl } = facilityData;

            // Check if another facility with same name exists
            if (facilityName && facilityName !== existingFacility.facilityName) {
                const duplicateFacility = await prisma.facility.findFirst({
                    where: {
                        facilityName,
                        id: { not: facilityId }
                    }
                });

                if (duplicateFacility) {
                    throw new Error('Fasilitas dengan nama tersebut sudah ada');
                }
            }

            const updateData = {};
            if (facilityName) updateData.facilityName = facilityName;
            if (iconUrl !== undefined) updateData.iconUrl = iconUrl;

            const updatedFacility = await prisma.facility.update({
                where: { id: facilityId },
                data: updateData
            });

            logger.info(`Facility updated: ${facilityId}`);

            return {
                id: updatedFacility.id,
                facilityName: updatedFacility.facilityName,
                iconUrl: updatedFacility.iconUrl,
                createdAt: updatedFacility.createdAt,
                updatedAt: updatedFacility.updatedAt
            };
        } catch (error) {
            logger.error('Update facility service error:', error);
            throw error;
        }
    },

    // Delete facility
    async deleteFacility(facilityId) {
        try {
            const existingFacility = await prisma.facility.findUnique({
                where: { id: facilityId },
                include: {
                    facilityBuilding: true
                }
            });

            if (!existingFacility) {
                throw new Error('Fasilitas tidak ditemukan');
            }

            // Check if facility is being used by any building
            if (existingFacility.facilityBuilding.length > 0) {
                throw new Error('Fasilitas tidak bisa dihapus karena masih digunakan oleh building');
            }

            await prisma.facility.delete({
                where: { id: facilityId }
            });

            logger.info(`Facility deleted: ${facilityId}`);

            return {
                id: facilityId,
                facilityName: existingFacility.facilityName
            };
        } catch (error) {
            logger.error('Delete facility service error:', error);
            throw error;
        }
    }
};

module.exports = FacilityService; 