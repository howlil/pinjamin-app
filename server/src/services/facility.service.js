const { prisma } = require('../configs');
const { ErrorHandler, Logger } = require('../utils');

const FacilityService = {
    async getAllFacilities(page = 1, limit = 10) {
        try {
            // Calculate offset
            const offset = (page - 1) * limit;

            // Get total count
            const totalItems = await prisma.facility.count();

            // Get facilities
            const facilities = await prisma.facility.findMany({
                orderBy: {
                    createdAt: 'desc'
                },
                skip: offset,
                take: limit
            });

            // Calculate pagination data
            const totalPages = Math.ceil(totalItems / limit);

            return {
                data: facilities,
                pagination: {
                    totalItems,
                    totalPages,
                    currentPage: page,
                    itemsPerPage: limit
                }
            };
        } catch (error) {
            Logger.error('Error getting all facilities:', error);
            if (error.status) throw error;
            throw ErrorHandler.internalServerError('Failed to get facilities');
        }
    },



    async createFacility(facilityData) {
        try {
            const { facilityName, iconUrl } = facilityData;

            // Create the facility
            const newFacility = await prisma.facility.create({
                data: {
                    facilityName,
                    iconUrl
                }
            });

            return newFacility;
        } catch (error) {
            Logger.error('Error creating facility:', error);
            if (error.status) throw error;
            throw ErrorHandler.internalServerError('Failed to create facility');
        }
    },

    async updateFacility(id, updateData) {
        try {
            // Check if facility exists
            const existingFacility = await prisma.facility.findUnique({
                where: { id }
            });

            if (!existingFacility) {
                throw ErrorHandler.notFound(`Facility with ID ${id} not found`);
            }

            // Update the facility
            const updatedFacility = await prisma.facility.update({
                where: { id },
                data: updateData
            });

            return updatedFacility;
        } catch (error) {
            Logger.error(`Error updating facility with ID ${id}:`, error);
            if (error.status) throw error;
            throw ErrorHandler.internalServerError('Failed to update facility');
        }
    },

    async deleteFacility(id) {
        try {
            // Check if facility exists and get its data
            const existingFacility = await prisma.facility.findUnique({
                where: { id },
                include: {
                    facilityBuilding: true
                }
            });

            if (!existingFacility) {
                throw ErrorHandler.notFound(`Facility with ID ${id} not found`);
            }

            // Check if facility is associated with any buildings
            if (existingFacility.facilityBuilding.length > 0) {
                throw ErrorHandler.badRequest(`Cannot delete facility as it is associated with ${existingFacility.facilityBuilding.length} building(s)`);
            }

            // Delete the facility
            await prisma.facility.delete({
                where: { id }
            });

            return { success: true };
        } catch (error) {
            Logger.error(`Error deleting facility with ID ${id}:`, error);
            if (error.status) throw error;
            throw ErrorHandler.internalServerError('Failed to delete facility');
        }
    }
};

module.exports = FacilityService; 