const { v4: uuidv4 } = require('uuid');
const prisma = require('../libs/database.lib');
const logger = require('../libs/logger.lib');

const BuildingManagerService = {
    // Get all building managers with optional filters
    async getBuildingManagers(filters) {
        try {
            const { buildingId, page = 1, limit = 10 } = filters;
            const skip = (page - 1) * limit;

            const whereClause = {};
            if (buildingId) {
                whereClause.buildingId = buildingId;
            }

            const [buildingManagers, totalItems] = await Promise.all([
                prisma.buildingManager.findMany({
                    where: whereClause,
                    include: {
                        building: {
                            select: {
                                id: true,
                                buildingName: true
                            }
                        }
                    },
                    orderBy: {
                        managerName: 'asc'
                    },
                    skip,
                    take: limit
                }),
                prisma.buildingManager.count({
                    where: whereClause
                })
            ]);

            const formattedBuildingManagers = buildingManagers.map(manager => ({
                id: manager.id,
                managerName: manager.managerName,
                phoneNumber: manager.phoneNumber,
                buildingId: manager.buildingId,
                buildingName: manager.building?.buildingName || null,
                createdAt: manager.createdAt,
                updatedAt: manager.updatedAt
            }));

            return {
                buildingManagers: formattedBuildingManagers,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: parseInt(page),
                itemsPerPage: parseInt(limit)
            };
        } catch (error) {
            logger.error('Get building managers service error:', error);
            throw error;
        }
    },

    // Get available building managers (not assigned to any building)
    async getAvailableBuildingManagers() {
        try {
            const availableManagers = await prisma.buildingManager.findMany({
                where: {
                    buildingId: null
                },
                select: {
                    id: true,
                    managerName: true,
                    phoneNumber: true,
                    createdAt: true,
                    updatedAt: true
                },
                orderBy: {
                    managerName: 'asc'
                }
            });

            return availableManagers;
        } catch (error) {
            logger.error('Get available building managers service error:', error);
            throw error;
        }
    },

    // Create building manager
    async createBuildingManager(buildingManagerData) {
        try {
            const { managerName, phoneNumber, buildingId } = buildingManagerData;

            // If buildingId is provided, check if building exists
            if (buildingId) {
                const building = await prisma.building.findUnique({
                    where: { id: buildingId }
                });

                if (!building) {
                    throw new Error('Building tidak ditemukan');
                }
            }

            const managerId = uuidv4();

            const buildingManager = await prisma.buildingManager.create({
                data: {
                    id: managerId,
                    managerName,
                    phoneNumber,
                    buildingId: buildingId || null
                },
                include: {
                    building: {
                        select: {
                            id: true,
                            buildingName: true
                        }
                    }
                }
            });

            logger.info(`Building manager created: ${managerId}`);

            return {
                id: buildingManager.id,
                managerName: buildingManager.managerName,
                phoneNumber: buildingManager.phoneNumber,
                buildingId: buildingManager.buildingId,
                buildingName: buildingManager.building?.buildingName || null,
                createdAt: buildingManager.createdAt,
                updatedAt: buildingManager.updatedAt
            };
        } catch (error) {
            logger.error('Create building manager service error:', error);
            throw error;
        }
    },

    // Assign building manager to building
    async assignBuildingManager(managerId, buildingId) {
        try {
            // Check if building manager exists
            const buildingManager = await prisma.buildingManager.findUnique({
                where: { id: managerId }
            });

            if (!buildingManager) {
                throw new Error('Building manager tidak ditemukan');
            }

            // Check if building exists
            const building = await prisma.building.findUnique({
                where: { id: buildingId }
            });

            if (!building) {
                throw new Error('Building tidak ditemukan');
            }

            // Check if manager is already assigned to a building
            if (buildingManager.buildingId) {
                throw new Error('Building manager sudah ditugaskan ke building lain');
            }

            const updatedManager = await prisma.buildingManager.update({
                where: { id: managerId },
                data: { buildingId },
                include: {
                    building: {
                        select: {
                            id: true,
                            buildingName: true
                        }
                    }
                }
            });

            logger.info(`Building manager assigned: ${managerId} to building: ${buildingId}`);

            return {
                id: updatedManager.id,
                managerName: updatedManager.managerName,
                phoneNumber: updatedManager.phoneNumber,
                buildingId: updatedManager.buildingId,
                buildingName: updatedManager.building.buildingName,
                createdAt: updatedManager.createdAt,
                updatedAt: updatedManager.updatedAt
            };
        } catch (error) {
            logger.error('Assign building manager service error:', error);
            throw error;
        }
    },

    // Update building manager
    async updateBuildingManager(managerId, buildingManagerData) {
        try {
            const existingManager = await prisma.buildingManager.findUnique({
                where: { id: managerId }
            });

            if (!existingManager) {
                throw new Error('Building manager tidak ditemukan');
            }

            const { managerName, phoneNumber, buildingId } = buildingManagerData;

            // If buildingId is provided (including null), validate it
            if (buildingId !== undefined) {
                if (buildingId !== null) {
                    const building = await prisma.building.findUnique({
                        where: { id: buildingId }
                    });

                    if (!building) {
                        throw new Error('Building tidak ditemukan');
                    }
                }
            }

            const updateData = {};
            if (managerName) updateData.managerName = managerName;
            if (phoneNumber) updateData.phoneNumber = phoneNumber;
            if (buildingId !== undefined) updateData.buildingId = buildingId;

            const updatedManager = await prisma.buildingManager.update({
                where: { id: managerId },
                data: updateData,
                include: {
                    building: {
                        select: {
                            id: true,
                            buildingName: true
                        }
                    }
                }
            });

            logger.info(`Building manager updated: ${managerId}`);

            return {
                id: updatedManager.id,
                managerName: updatedManager.managerName,
                phoneNumber: updatedManager.phoneNumber,
                buildingId: updatedManager.buildingId,
                buildingName: updatedManager.building?.buildingName || null,
                createdAt: updatedManager.createdAt,
                updatedAt: updatedManager.updatedAt
            };
        } catch (error) {
            logger.error('Update building manager service error:', error);
            throw error;
        }
    },

    // Delete building manager
    async deleteBuildingManager(managerId) {
        try {
            const existingManager = await prisma.buildingManager.findUnique({
                where: { id: managerId }
            });

            if (!existingManager) {
                throw new Error('Building manager tidak ditemukan');
            }

            await prisma.buildingManager.delete({
                where: { id: managerId }
            });

            logger.info(`Building manager deleted: ${managerId}`);

            return {
                id: managerId,
                managerName: existingManager.managerName
            };
        } catch (error) {
            logger.error('Delete building manager service error:', error);
            throw error;
        }
    }
};

module.exports = BuildingManagerService; 