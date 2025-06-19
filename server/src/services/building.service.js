const { prisma } = require('../configs');
const { ErrorHandler, FileUtil, Logger } = require('../utils');
const moment = require('moment');

class BuildingService {
    static async create(buildingData, file) {
        try {
            const existingBuilding = await prisma.building.findFirst({
                where: { buildingName: buildingData.buildingName }
            });

            if (existingBuilding) {
                throw ErrorHandler.badRequest('Building name already exists');
            }

            let buildingPhoto = null;
            if (file) {
                buildingPhoto = FileUtil.generateFileUrl(file.path);
            }

            const result = await prisma.$transaction(async (tx) => {
                const building = await tx.building.create({
                    data: {
                        buildingName: buildingData.buildingName,
                        description: buildingData.description,
                        rentalPrice: buildingData.rentalPrice,
                        capacity: buildingData.capacity,
                        location: buildingData.location,
                        buildingPhoto,
                        buildingType: buildingData.buildingType
                    }
                });

                if (buildingData.facilities?.length > 0) {
                    const facilityData = buildingData.facilities.map(facility => ({
                        facilityName: facility.facilityName,
                        iconUrl: facility.iconUrl || null
                    }));

                    const facilities = await tx.facility.createMany({
                        data: facilityData
                    });

                    const createdFacilities = await tx.facility.findMany({
                        where: { facilityName: { in: buildingData.facilities.map(f => f.facilityName) } },
                        orderBy: { createdAt: 'desc' },
                        take: buildingData.facilities.length
                    });

                    await tx.facilityBuilding.createMany({
                        data: createdFacilities.map(facility => ({
                            facilityId: facility.id,
                            buildingId: building.id
                        }))
                    });
                }

                if (buildingData.buildingManagers?.length > 0) {
                    await tx.buildingManager.createMany({
                        data: buildingData.buildingManagers.map(manager => ({
                            buildingId: building.id,
                            managerName: manager.managerName,
                            phoneNumber: manager.phoneNumber
                        }))
                    });
                }

                return building;
            });

            return await this.getById(result.id);
        } catch (error) {
            Logger.error('Building creation failed:', error);
            throw error.statusCode ? error : ErrorHandler.internalServerError('Failed to create building');
        }
    }

    static async getAll(filters = {}) {
        try {
            const { search, buildingType, page = 1, limit = 10 } = filters;
            const skip = (page - 1) * limit;

            const where = {};

            if (search) {
                where.OR = [
                    { buildingName: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { location: { contains: search, mode: 'insensitive' } }
                ];
            }

            if (buildingType) {
                where.buildingType = buildingType;
            }

            const [buildings, totalItems] = await Promise.all([
                prisma.building.findMany({
                    where,
                    select: {
                        id: true,
                        buildingName: true,
                        description: true,
                        rentalPrice: true,
                        buildingPhoto: true,
                        buildingType: true
                    },
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' }
                }),
                prisma.building.count({ where })
            ]);

            const totalPages = Math.ceil(totalItems / limit);

            return {
                data: buildings,
                pagination: {
                    totalItems,
                    totalPages,
                    currentPage: page,
                    itemsPerPage: limit
                }
            };
        } catch (error) {
            Logger.error('Failed to get buildings:', error);
            throw ErrorHandler.internalServerError('Failed to retrieve buildings');
        }
    }

    static async getById(id) {
        try {
            const building = await prisma.building.findUnique({
                where: { id },
                include: {
                    facilityBuildings: {
                        include: {
                            facility: {
                                select: {
                                    id: true,
                                    facilityName: true,
                                    iconUrl: true
                                }
                            }
                        }
                    },
                    buildingManagers: {
                        select: {
                            id: true,
                            managerName: true,
                            phoneNumber: true
                        }
                    },
                    booking: {
                        where: {
                            bookingStatus: { in: ['APPROVED', 'PROCESSING'] }
                        },
                        select: {
                            id: true,
                            startDate: true,
                            endDate: true,
                            startTime: true,
                            endTime: true,
                            bookingStatus: true,
                            activityName: true,
                            user: {
                                select: {
                                    fullName: true
                                }
                            }
                        },
                        orderBy: { startDate: 'asc' }
                    }
                }
            });

            if (!building) {
                throw ErrorHandler.notFound('Building not found');
            }

            const result = {
                id: building.id,
                buildingName: building.buildingName,
                description: building.description,
                rentalPrice: building.rentalPrice,
                capacity: building.capacity,
                location: building.location,
                buildingPhoto: building.buildingPhoto,
                buildingType: building.buildingType,
                facilities: building.facilityBuildings.map(fb => fb.facility),
                buildingManagers: building.buildingManager,
                bookingSchedule: building.booking.map(booking => ({
                    id: booking.id,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    startTime: booking.startTime,
                    endTime: booking.endTime,
                    status: booking.bookingStatus,
                    borrowerDetail: {
                        borrowerName: booking.user.fullName,
                        activityName: booking.activityName
                    }
                }))
            };

            return result;
        } catch (error) {
            Logger.error('Failed to get building by ID:', error);
            throw error.statusCode ? error : ErrorHandler.internalServerError('Failed to retrieve building');
        }
    }

    static async update(id, updateData, file) {
        try {
            const existingBuilding = await prisma.building.findUnique({
                where: { id }
            });

            if (!existingBuilding) {
                throw ErrorHandler.notFound('Building not found');
            }

            if (updateData.buildingName && updateData.buildingName !== existingBuilding.buildingName) {
                const nameExists = await prisma.building.findFirst({
                    where: {
                        buildingName: updateData.buildingName,
                        NOT: { id }
                    }
                });

                if (nameExists) {
                    throw ErrorHandler.badRequest('Building name already exists');
                }
            }

            let buildingPhoto = existingBuilding.buildingPhoto;
            if (file) {
                buildingPhoto = FileUtil.generateFileUrl(file.path);
                if (existingBuilding.buildingPhoto) {
                    FileUtil.deleteFile(existingBuilding.buildingPhoto);
                }
            }

            const result = await prisma.$transaction(async (tx) => {
                const building = await tx.building.update({
                    where: { id },
                    data: {
                        ...updateData,
                        buildingPhoto
                    }
                });

                if (updateData.facilities) {
                    await tx.facilityBuilding.deleteMany({
                        where: { buildingId: id }
                    });

                    if (updateData.facilities.length > 0) {
                        for (const facility of updateData.facilities) {
                            let facilityRecord;

                            if (facility.id) {
                                facilityRecord = await tx.facility.update({
                                    where: { id: facility.id },
                                    data: {
                                        facilityName: facility.facilityName,
                                        iconUrl: facility.iconUrl || null
                                    }
                                });
                            } else {
                                facilityRecord = await tx.facility.create({
                                    data: {
                                        facilityName: facility.facilityName,
                                        iconUrl: facility.iconUrl || null
                                    }
                                });
                            }

                            await tx.facilityBuilding.create({
                                data: {
                                    facilityId: facilityRecord.id,
                                    buildingId: id
                                }
                            });
                        }
                    }
                }

                if (updateData.buildingManagers) {
                    await tx.buildingManager.deleteMany({
                        where: { buildingId: id }
                    });

                    if (updateData.buildingManagers.length > 0) {
                        await tx.buildingManager.createMany({
                            data: updateData.buildingManagers.map(manager => ({
                                buildingId: id,
                                managerName: manager.managerName,
                                phoneNumber: manager.phoneNumber
                            }))
                        });
                    }
                }

                return building;
            });

            return await this.getById(result.id);
        } catch (error) {
            Logger.error('Building update failed:', error);
            throw error.statusCode ? error : ErrorHandler.internalServerError('Failed to update building');
        }
    }

    static async delete(id) {
        try {
            const building = await prisma.building.findUnique({
                where: { id },
                include: {
                    booking: {
                        where: {
                            bookingStatus: { in: ['APPROVED', 'PROCESSING'] }
                        }
                    }
                }
            });

            if (!building) {
                throw ErrorHandler.notFound('Building not found');
            }

            if (building.booking.length > 0) {
                throw ErrorHandler.badRequest('Cannot delete building with active bookings');
            }

            await prisma.$transaction(async (tx) => {
                await tx.facilityBuilding.deleteMany({
                    where: { buildingId: id }
                });

                await tx.buildingManager.deleteMany({
                    where: { buildingId: id }
                });

                await tx.building.delete({
                    where: { id }
                });
            });

            if (building.buildingPhoto) {
                FileUtil.deleteFile(building.buildingPhoto);
            }

            return {
                id: building.id,
                buildingName: building.buildingName
            };
        } catch (error) {
            Logger.error('Building deletion failed:', error);
            throw error.statusCode ? error : ErrorHandler.internalServerError('Failed to delete building');
        }
    }

    static async checkAvailability(date, time) {
        try {
            const buildings = await prisma.building.findMany({
                select: {
                    id: true,
                    buildingName: true,
                    description: true,
                    rentalPrice: true,
                    buildingPhoto: true
                }
            });

            const availableBuildings = [];

            for (const building of buildings) {
                const conflictingBookings = await prisma.booking.findMany({
                    where: {
                        buildingId: building.id,
                        bookingStatus: { in: ['APPROVED', 'PROCESSING'] },
                        startDate: date,
                        AND: [
                            { startTime: { lte: time } },
                            { endTime: { gt: time } }
                        ]
                    }
                });

                if (conflictingBookings.length === 0) {
                    availableBuildings.push(building);
                }
            }

            return {
                buildings: availableBuildings,
                totalAvailable: availableBuildings.length
            };
        } catch (error) {
            Logger.error('Failed to check building availability:', error);
            throw ErrorHandler.internalServerError('Failed to check building availability');
        }
    }

    static async getBuildingSchedule(id, month, year) {
        try {
            const currentDate = moment();
            const targetMonth = month || currentDate.month() + 1;
            const targetYear = year || currentDate.year();

            const startDateStr = moment().year(targetYear).month(targetMonth - 1).startOf('month').format('DD-MM-YYYY');
            const endDateStr = moment().year(targetYear).month(targetMonth - 1).endOf('month').format('DD-MM-YYYY');

            const building = await prisma.building.findUnique({
                where: { id }
            });

            if (!building) {
                throw ErrorHandler.notFound('Building not found');
            }

            const bookings = await prisma.booking.findMany({
                where: {
                    buildingId: id,
                    bookingStatus: { in: ['APPROVED', 'PROCESSING', 'COMPLETED'] }
                },
                include: {
                    user: {
                        select: {
                            fullName: true
                        }
                    }
                },
                orderBy: { createdAt: 'asc' }
            });

            const schedule = bookings.map(booking => ({
                id: booking.id,
                startDate: booking.startDate,
                endDate: booking.endDate,
                activityName: booking.activityName,
                startTime: booking.startTime,
                endTime: booking.endTime,
                status: booking.bookingStatus,
                borrowerDetail: {
                    borrowerName: booking.user.fullName,
                    buildingName: building.buildingName,
                    buildingPhoto: building.buildingPhoto
                }
            }));

            return schedule;
        } catch (error) {
            Logger.error('Failed to get building schedule:', error);
            throw error.statusCode ? error : ErrorHandler.internalServerError('Failed to retrieve building schedule');
        }
    }
}

module.exports = BuildingService; 