const { prisma } = require('../configs');
const { ErrorHandler, Logger } = require('../utils');

const BuildingManagerService = {
    async getAllBuildingManagers(page = 1, limit = 10, buildingId = null) {
        try {
            // Calculate offset
            const offset = (page - 1) * limit;

            // Prepare filter condition
            const whereCondition = buildingId ? { buildingId } : {};

            // Get total count
            const totalItems = await prisma.buildingManager.count({
                where: whereCondition
            });

            // Get building managers
            const buildingManagers = await prisma.buildingManager.findMany({
                where: whereCondition,
                include: {
                    building: {
                        select: {
                            buildingName: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: offset,
                take: limit
            });

            // Format building managers data
            const formattedBuildingManagers = buildingManagers.map(manager => ({
                id: manager.id,
                managerName: manager.managerName,
                phoneNumber: manager.phoneNumber,
                buildingId: manager.buildingId,
                buildingName: manager.building?.buildingName || 'Not Assigned',
                createdAt: manager.createdAt,
                updatedAt: manager.updatedAt
            }));

            // Calculate pagination data
            const totalPages = Math.ceil(totalItems / limit);

            return {
                data: formattedBuildingManagers,
                pagination: {
                    totalItems,
                    totalPages,
                    currentPage: page,
                    itemsPerPage: limit
                }
            };
        } catch (error) {
            Logger.error('Error getting all building managers:', error);
            if (error.status) throw error;
            throw ErrorHandler.internalServerError('Failed to get building managers');
        }
    },



    async createBuildingManager(managerData) {
        try {
            const { managerName, phoneNumber, buildingId } = managerData;

            // Check if building exists (optional)
            if (buildingId) {
                const building = await prisma.building.findUnique({
                    where: { id: buildingId }
                });

                if (!building) {
                    throw ErrorHandler.notFound(`Building with ID ${buildingId} not found`);
                }
            }

            // Create building manager
            const newBuildingManager = await prisma.buildingManager.create({
                data: {
                    managerName,
                    phoneNumber,
                    buildingId: buildingId || null
                },
                include: {
                    building: {
                        select: {
                            buildingName: true
                        }
                    }
                }
            });

            // Format building manager data
            const formattedBuildingManager = {
                id: newBuildingManager.id,
                managerName: newBuildingManager.managerName,
                phoneNumber: newBuildingManager.phoneNumber,
                buildingId: newBuildingManager.buildingId,
                buildingName: newBuildingManager.building?.buildingName || 'Not Assigned',
                createdAt: newBuildingManager.createdAt,
                updatedAt: newBuildingManager.updatedAt
            };

            return formattedBuildingManager;
        } catch (error) {
            Logger.error('Error creating building manager:', error);
            if (error.status) throw error;
            throw ErrorHandler.internalServerError('Failed to create building manager');
        }
    },

    async updateBuildingManager(id, updateData) {
        try {
            // Check if building manager exists
            const existingBuildingManager = await prisma.buildingManager.findUnique({
                where: { id }
            });

            if (!existingBuildingManager) {
                throw ErrorHandler.notFound(`Building manager with ID ${id} not found`);
            }

            // Check if building exists if buildingId is being updated (but not null)
            if (updateData.buildingId !== undefined && updateData.buildingId !== null) {
                const building = await prisma.building.findUnique({
                    where: { id: updateData.buildingId }
                });

                if (!building) {
                    throw ErrorHandler.notFound(`Building with ID ${updateData.buildingId} not found`);
                }
            }

            // Update building manager (handles both assign and unassign cases)
            const updatedBuildingManager = await prisma.buildingManager.update({
                where: { id },
                data: updateData,
                include: {
                    building: {
                        select: {
                            buildingName: true
                        }
                    }
                }
            });

            // Format building manager data
            const formattedBuildingManager = {
                id: updatedBuildingManager.id,
                managerName: updatedBuildingManager.managerName,
                phoneNumber: updatedBuildingManager.phoneNumber,
                buildingId: updatedBuildingManager.buildingId,
                buildingName: updatedBuildingManager.building?.buildingName || 'Not Assigned',
                createdAt: updatedBuildingManager.createdAt,
                updatedAt: updatedBuildingManager.updatedAt
            };

            return formattedBuildingManager;
        } catch (error) {
            Logger.error(`Error updating building manager with ID ${id}:`, error);
            if (error.status) throw error;
            throw ErrorHandler.internalServerError('Failed to update building manager');
        }
    },

    async deleteBuildingManager(id) {
        try {
            // Check if building manager exists
            const existingBuildingManager = await prisma.buildingManager.findUnique({
                where: { id }
            });

            if (!existingBuildingManager) {
                throw ErrorHandler.notFound(`Building manager with ID ${id} not found`);
            }

            // Delete building manager
            await prisma.buildingManager.delete({
                where: { id }
            });

            return { success: true };
        } catch (error) {
            Logger.error(`Error deleting building manager with ID ${id}:`, error);
            if (error.status) throw error;
            throw ErrorHandler.internalServerError('Failed to delete building manager');
        }
    },

    async getAvailableManagers(page = 1, limit = 10) {
        try {
            // Calculate offset
            const offset = (page - 1) * limit;

            // Get total count of unassigned managers
            const totalItems = await prisma.buildingManager.count({
                where: {
                    buildingId: null
                }
            });

            // Get unassigned building managers
            const availableManagers = await prisma.buildingManager.findMany({
                where: {
                    buildingId: null
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: offset,
                take: limit
            });

            // Format managers data
            const formattedManagers = availableManagers.map(manager => ({
                id: manager.id,
                managerName: manager.managerName,
                phoneNumber: manager.phoneNumber,
                createdAt: manager.createdAt,
                updatedAt: manager.updatedAt
            }));

            // Calculate pagination data
            const totalPages = Math.ceil(totalItems / limit);

            return {
                data: formattedManagers,
                pagination: {
                    totalItems,
                    totalPages,
                    currentPage: page,
                    itemsPerPage: limit
                }
            };
        } catch (error) {
            Logger.error('Error getting available managers:', error);
            if (error.status) throw error;
            throw ErrorHandler.internalServerError('Failed to get available managers');
        }
    },

    async assignManagerToBuilding(managerId, buildingId) {
        try {
            // Check if manager exists
            const manager = await prisma.buildingManager.findUnique({
                where: { id: managerId }
            });

            if (!manager) {
                throw ErrorHandler.notFound(`Building manager with ID ${managerId} not found`);
            }

            // Check if manager is already assigned
            if (manager.buildingId) {
                throw ErrorHandler.badRequest('Building manager is already assigned to a building');
            }

            // Check if building exists
            const building = await prisma.building.findUnique({
                where: { id: buildingId }
            });

            if (!building) {
                throw ErrorHandler.notFound(`Building with ID ${buildingId} not found`);
            }

            // Assign manager to building
            const updatedManager = await prisma.buildingManager.update({
                where: { id: managerId },
                data: { buildingId },
                include: {
                    building: {
                        select: {
                            buildingName: true
                        }
                    }
                }
            });

            // Format response
            const formattedManager = {
                id: updatedManager.id,
                managerName: updatedManager.managerName,
                phoneNumber: updatedManager.phoneNumber,
                buildingId: updatedManager.buildingId,
                buildingName: updatedManager.building?.buildingName || 'Not Assigned',
                createdAt: updatedManager.createdAt,
                updatedAt: updatedManager.updatedAt
            };

            return formattedManager;
        } catch (error) {
            Logger.error(`Error assigning manager ${managerId} to building ${buildingId}:`, error);
            if (error.status) throw error;
            throw ErrorHandler.internalServerError('Failed to assign manager to building');
        }
    }
};

module.exports = BuildingManagerService; 