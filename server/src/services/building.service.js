const { v4: uuidv4 } = require('uuid');
const prisma = require('../libs/database.lib');
const logger = require('../libs/logger.lib');
const moment = require('moment');
const { getFileUrl, deleteFile } = require('../libs/multer.lib');

const BuildingService = {
    async checkAvailability(date, time) {
        try {
            // Debug logging untuk tracking request
            logger.info('Check availability request received:', {
                date,
                time,
                timestamp: new Date().toISOString()
            });

            // Validasi jam operasional di service level sebagai safety net
            const timeCheck = moment(time, 'HH:mm');
            if (!timeCheck.isValid()) {
                logger.warn('Invalid time format:', { time });
                throw new Error('Format waktu tidak valid');
            }

            const hour = timeCheck.hour();
            // Jam operasional: 07:00 - 21:00
            if (hour < 7 || hour >= 21) {
                logger.warn('Time outside business hours:', { time, hour });
                throw new Error('Waktu harus dalam jam operasional (07:00 - 21:00)');
            }

            // Validasi tanggal tidak boleh di masa lalu
            const dateCheck = moment(date, 'DD-MM-YYYY');
            const today = moment().startOf('day');

            if (!dateCheck.isValid()) {
                logger.warn('Invalid date format:', { date });
                throw new Error('Format tanggal tidak valid');
            }

            if (dateCheck.isBefore(today)) {
                logger.warn('Date in the past:', { date, today: today.format('DD-MM-YYYY') });
                throw new Error('Tanggal tidak boleh di masa lalu');
            }

            logger.info('Time and date validation passed, proceeding to check buildings');

            // Get all buildings with more complete data
            const allBuildings = await prisma.building.findMany({
                select: {
                    id: true,
                    buildingName: true,
                    description: true,
                    rentalPrice: true,
                    capacity: true,
                    location: true,
                    buildingType: true,
                    buildingPhoto: true
                }
            });

            // Check each building availability
            const availableBuildings = [];

            for (const building of allBuildings) {
                const isAvailable = await this.checkSingleBuildingAvailability(
                    building.id, date, date, time, time
                );

                if (isAvailable) {
                    availableBuildings.push({
                        id: building.id,
                        buildingName: building.buildingName,
                        description: building.description,
                        rentalPrice: building.rentalPrice,
                        capacity: building.capacity,
                        location: building.location,
                        buildingType: building.buildingType,
                        buildingPhoto: building.buildingPhoto
                    });
                }
            }

            // Debug logging untuk hasil
            logger.info('Check availability completed:', {
                availableCount: availableBuildings.length,
                date,
                time,
                buildingNames: availableBuildings.map(b => b.buildingName)
            });

            return {
                availableBuildings,
                requestedDateTime: {
                    date: date,
                    time: time
                }
            };
        } catch (error) {
            logger.error('Check availability service error:', error);
            throw error;
        }
    },

    // Check single building availability (same logic as booking)
    async checkSingleBuildingAvailability(buildingId, startDate, endDate, startTime, endTime) {
        try {
            const targetEndDate = endDate || startDate;

            // Get existing bookings for this building with date overlap
            const existingBookings = await prisma.booking.findMany({
                where: {
                    buildingId,
                    bookingStatus: {
                        in: ['APPROVED', 'PROCESSING']
                    },
                    OR: [
                        // Check date overlap using same logic as booking
                        {
                            AND: [
                                { startDate: { lte: targetEndDate } },
                                {
                                    OR: [
                                        { endDate: { gte: startDate } },
                                        { endDate: null, startDate: { gte: startDate } }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                select: {
                    startTime: true,
                    endTime: true,
                    startDate: true,
                    endDate: true
                }
            });

            // Check time conflicts on overlapping dates using same logic as booking
            for (const booking of existingBookings) {
                const hasTimeConflict = this.checkTimeConflict(
                    startTime, endTime, booking.startTime, booking.endTime
                );

                if (hasTimeConflict) {
                    return false;
                }
            }

            return true;
        } catch (error) {
            logger.error('Check single building availability error:', error);
            throw error;
        }
    },

    // Check time conflict (same logic as booking service)
    checkTimeConflict(startTime1, endTime1, startTime2, endTime2) {
        const start1 = moment(startTime1, 'HH:mm');
        const end1 = moment(endTime1, 'HH:mm');
        const start2 = moment(startTime2, 'HH:mm');
        const end2 = moment(endTime2, 'HH:mm');

        // Check if times overlap: start1 < end2 AND end1 > start2
        return start1.isBefore(end2) && end1.isAfter(start2);
    },

    // Get buildings with filters and pagination
    async getBuildings(filters, pagination) {
        try {
            const { search, buildingType } = filters;
            const { page, limit } = pagination;

            const whereClause = {};

            if (search) {
                whereClause.OR = [
                    { buildingName: { contains: search } },
                    { description: { contains: search } },
                    { location: { contains: search } }
                ];
            }

            if (buildingType) {
                whereClause.buildingType = buildingType;
            }

            const [buildings, totalItems] = await Promise.all([
                prisma.building.findMany({
                    where: whereClause,
                    select: {
                        id: true,
                        buildingName: true,
                        description: true,
                        rentalPrice: true,
                        buildingPhoto: true,
                        buildingType: true,
                        location: true,
                        capacity: true
                    },
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: {
                        buildingName: 'asc'
                    }
                }),
                prisma.building.count({
                    where: whereClause
                })
            ]);

            return {
                buildings,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                itemsPerPage: limit
            };
        } catch (error) {
            logger.error('Get buildings service error:', error);
            throw error;
        }
    },

    // Get building detail
    async getBuildingDetail(buildingId) {
        try {
            const building = await prisma.building.findUnique({
                where: { id: buildingId },
                include: {
                    facilityBuilding: {
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
                    buildingManager: {
                        select: {
                            id: true,
                            managerName: true,
                            phoneNumber: true
                        }
                    },
                    booking: {
                        where: {
                            bookingStatus: {
                                in: ['APPROVED', 'PROCESSING']
                            }
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
                        }
                    }
                }
            });

            if (!building) {
                throw new Error('Building tidak ditemukan');
            }

            return {
                id: building.id,
                buildingName: building.buildingName,
                description: building.description,
                rentalPrice: building.rentalPrice,
                capacity: building.capacity,
                location: building.location,
                buildingPhoto: building.buildingPhoto,
                buildingType: building.buildingType,
                facilities: building.facilityBuilding.map(fb => fb.facility),
                buildingManagers: building.buildingManager,
                bookingSchedule: building.booking.map(booking => ({
                    id: booking.id,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    startTime: booking.startTime,
                    endTime: booking.endTime,
                    status: booking.bookingStatus,
                    borrowerDetail: {
                        borrowerName: booking.user?.fullName || 'Unknown',
                        activityName: booking.activityName
                    }
                }))
            };
        } catch (error) {
            logger.error('Get building detail service error:', error);
            throw error;
        }
    },

    // Get building schedule by month
    async getBuildingSchedule(month, year) {
        try {
            const currentDate = new Date();
            const targetMonth = month || (currentDate.getMonth() + 1);
            const targetYear = year || currentDate.getFullYear();

            // Create date range for the month
            const startDate = moment(`01-${targetMonth.toString().padStart(2, '0')}-${targetYear}`, 'DD-MM-YYYY');
            const endDate = startDate.clone().endOf('month');

            const bookings = await prisma.booking.findMany({
                where: {
                    bookingStatus: {
                        in: ['APPROVED', 'PROCESSING', 'COMPLETED']
                    },
                    OR: [
                        {
                            startDate: {
                                gte: startDate.format('DD-MM-YYYY'),
                                lte: endDate.format('DD-MM-YYYY')
                            }
                        },
                        {
                            endDate: {
                                gte: startDate.format('DD-MM-YYYY'),
                                lte: endDate.format('DD-MM-YYYY')
                            }
                        }
                    ]
                },
                include: {
                    user: {
                        select: {
                            fullName: true
                        }
                    },
                    building: {
                        select: {
                            id: true,
                            buildingName: true,
                            buildingPhoto: true,
                            location: true,
                            buildingType: true
                        }
                    }
                },
                orderBy: {
                    startDate: 'asc'
                }
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
                    borrowerName: booking.user?.fullName || 'Unknown'
                },
                buildingDetail: {
                    buildingId: booking.building.id,
                    buildingName: booking.building.buildingName,
                    buildingPhoto: booking.building.buildingPhoto,
                    location: booking.building.location,
                    buildingType: booking.building.buildingType
                }
            }));

            return {
                month: targetMonth,
                year: targetYear,
                totalBookings: schedule.length,
                schedule
            };
        } catch (error) {
            logger.error('Get building schedule service error:', error);
            throw error;
        }
    },

    // ===== ADMIN FUNCTIONS =====

    // Get all buildings for admin
    async adminGetBuildings(pagination) {
        try {
            const { page = 1, limit = 10 } = pagination;
            const skip = (page - 1) * limit;

            const [buildings, totalItems] = await Promise.all([
                prisma.building.findMany({
                    include: {
                        facilityBuilding: {
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
                        buildingManager: {
                            select: {
                                id: true,
                                managerName: true,
                                phoneNumber: true
                            }
                        }
                    },
                    orderBy: {
                        buildingName: 'asc'
                    },
                    skip,
                    take: limit
                }),
                prisma.building.count()
            ]);

            // Format buildings with detail object
            const formattedBuildings = buildings.map(building => ({
                // Semua field gedung
                id: building.id,
                buildingName: building.buildingName,
                description: building.description,
                rentalPrice: building.rentalPrice,
                capacity: building.capacity,
                location: building.location,
                buildingType: building.buildingType,
                buildingPhoto: building.buildingPhoto,
                createdAt: building.createdAt,
                updatedAt: building.updatedAt,

                // Detail object berisi array
                detail: {
                    facilities: building.facilityBuilding.map(fb => fb.facility),
                    buildingManagers: building.buildingManager
                }
            }));

            return {
                buildings: formattedBuildings,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: parseInt(page),
                itemsPerPage: parseInt(limit)
            };
        } catch (error) {
            logger.error('Admin get buildings service error:', error);
            throw error;
        }
    },

    // Create building
    async createBuilding(buildingData, buildingPhoto) {
        try {
            const {
                buildingName,
                description,
                rentalPrice,
                capacity,
                location,
                buildingType,
                facilities = [],
                buildingManagers = []
            } = buildingData;

            // Safe JSON parsing function with ID reference handling
            const safeJsonParse = (data, fieldName) => {
                if (!data) {
                    return [];
                }

                if (typeof data === 'object') {
                    return Array.isArray(data) ? data : [];
                }

                if (typeof data === 'string') {
                    const trimmedData = data.trim();

                    // Handle empty cases
                    if (trimmedData === '' || trimmedData === '[]') {
                        return [];
                    }

                    // Check if it's a single UUID (ID reference)
                    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                    if (uuidRegex.test(trimmedData)) {
                        logger.info(`Received single UUID for ${fieldName}: ${trimmedData}`);
                        return [{ id: trimmedData }]; // Treat as ID reference
                    }

                    // Check if it's comma-separated UUIDs
                    if (trimmedData.includes(',')) {
                        const ids = trimmedData.split(',').map(id => id.trim()).filter(id => uuidRegex.test(id));
                        if (ids.length > 0) {
                            logger.info(`Received comma-separated UUIDs for ${fieldName}: ${ids.join(', ')}`);
                            return ids.map(id => ({ id }));
                        }
                    }

                    // Check if it's just a number (numeric ID)
                    if (/^\d+$/.test(trimmedData)) {
                        logger.info(`Received numeric ID for ${fieldName}: ${trimmedData}`);
                        return [{ id: trimmedData }];
                    }

                    // Try to parse as JSON array
                    try {
                        const parsed = JSON.parse(trimmedData);
                        return Array.isArray(parsed) ? parsed : [];
                    } catch (parseError) {
                        logger.error(`Invalid JSON format for ${fieldName}:`, {
                            data: trimmedData,
                            error: parseError.message,
                            suggestion: `Expected format: [{"facilityName":"WiFi"}] or single UUID: "03101f54-de76-42b0-8ccf-7bcbfc81a7d4"`
                        });

                        logger.warn(`Skipping ${fieldName} due to invalid format, continuing with empty array`);
                        return [];
                    }
                }

                return [];
            };

            // Parse JSON strings safely
            const parsedFacilities = safeJsonParse(facilities, 'facilities');
            const parsedManagers = safeJsonParse(buildingManagers, 'buildingManagers');

            // Validate required fields
            if (!buildingName || !description || !rentalPrice || !capacity || !location || !buildingType) {
                throw new Error('Semua field wajib harus diisi');
            }

            const buildingId = uuidv4();
            let buildingPhotoUrl = null;

            if (buildingPhoto) {
                buildingPhotoUrl = getFileUrl(buildingPhoto.filename, 'images');
            }

            // Create building
            const building = await prisma.building.create({
                data: {
                    id: buildingId,
                    buildingName,
                    description,
                    rentalPrice: parseInt(rentalPrice),
                    capacity: parseInt(capacity),
                    location,
                    buildingType,
                    buildingPhoto: buildingPhotoUrl
                }
            });

            // Create facilities if provided
            if (parsedFacilities && parsedFacilities.length > 0) {
                for (const facility of parsedFacilities) {
                    let facilityRecord = null;

                    // Check if it's an ID reference to existing facility
                    if (facility.id) {
                        facilityRecord = await prisma.facility.findUnique({
                            where: { id: facility.id }
                        });

                        if (!facilityRecord) {
                            logger.warn('Facility with ID not found, skipping:', facility.id);
                            continue;
                        }
                    }
                    // Check if it's new facility data
                    else if (facility.facilityName) {
                        // Look for existing facility with same name
                        facilityRecord = await prisma.facility.findFirst({
                            where: { facilityName: facility.facilityName }
                        });

                        // Create new if not exists
                        if (!facilityRecord) {
                            facilityRecord = await prisma.facility.create({
                                data: {
                                    id: uuidv4(),
                                    facilityName: facility.facilityName,
                                    iconUrl: facility.iconUrl || null
                                }
                            });
                        }
                    } else {
                        logger.warn('Facility without ID or facilityName skipped:', facility);
                        continue;
                    }

                    // Create facility-building relationship
                    if (facilityRecord) {
                        await prisma.facilityBuilding.create({
                            data: {
                                facilityId: facilityRecord.id,
                                buildingId: buildingId
                            }
                        });
                    }
                }
            }

            // Create building managers if provided
            if (parsedManagers && parsedManagers.length > 0) {
                for (const manager of parsedManagers) {
                    // Check if it's an ID reference to existing manager
                    if (manager.id) {
                        const existingManager = await prisma.buildingManager.findUnique({
                            where: { id: manager.id }
                        });

                        if (existingManager) {
                            // Update the manager to be associated with this building
                            await prisma.buildingManager.update({
                                where: { id: manager.id },
                                data: { buildingId: buildingId }
                            });
                        } else {
                            logger.warn('Building manager with ID not found, skipping:', manager.id);
                            continue;
                        }
                    }
                    // Check if it's new manager data
                    else if (manager.managerName && manager.phoneNumber) {
                        await prisma.buildingManager.create({
                            data: {
                                id: uuidv4(),
                                managerName: manager.managerName,
                                phoneNumber: manager.phoneNumber,
                                buildingId: buildingId
                            }
                        });
                    } else {
                        logger.warn('Manager without ID or required fields skipped:', manager);
                        continue;
                    }
                }
            }

            // Get complete building data
            const completeBuilding = await this.getBuildingWithRelations(buildingId);

            // Send notification to admin
            try {
                const PusherHelper = require('../libs/pusher.lib');
                await PusherHelper.sendAdminNotification('BUILDING_CREATED', {
                    buildingId: building.id,
                    buildingName: building.buildingName,
                    location: building.location,
                    buildingType: building.buildingType,
                    rentalPrice: building.rentalPrice,
                    capacity: building.capacity,
                    action: 'CREATED'
                });
            } catch (notificationError) {
                logger.warn('Failed to send building creation notification:', notificationError);
            }

            logger.info(`Building created: ${buildingId}`);
            return completeBuilding;
        } catch (error) {
            logger.error('Admin create building service error:', error);
            throw error;
        }
    },

    // Update building
    async updateBuilding(buildingId, buildingData, buildingPhoto) {
        try {
            const existingBuilding = await prisma.building.findUnique({
                where: { id: buildingId },
                include: {
                    facilityBuilding: {
                        include: { facility: true }
                    },
                    buildingManager: true
                }
            });

            if (!existingBuilding) {
                throw new Error('Building tidak ditemukan');
            }

            const {
                buildingName,
                description,
                rentalPrice,
                capacity,
                location,
                buildingType,
                facilities = [],
                buildingManagers = []
            } = buildingData;

            // Safe JSON parsing function with ID reference handling
            const safeJsonParse = (data, fieldName) => {
                if (!data) {
                    return [];
                }

                if (typeof data === 'object') {
                    return Array.isArray(data) ? data : [];
                }

                if (typeof data === 'string') {
                    const trimmedData = data.trim();

                    // Handle empty cases
                    if (trimmedData === '' || trimmedData === '[]') {
                        return [];
                    }

                    // Check if it's a single UUID (ID reference)
                    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                    if (uuidRegex.test(trimmedData)) {
                        logger.info(`Received single UUID for ${fieldName}: ${trimmedData}`);
                        return [{ id: trimmedData }]; // Treat as ID reference
                    }

                    // Check if it's comma-separated UUIDs
                    if (trimmedData.includes(',')) {
                        const ids = trimmedData.split(',').map(id => id.trim()).filter(id => uuidRegex.test(id));
                        if (ids.length > 0) {
                            logger.info(`Received comma-separated UUIDs for ${fieldName}: ${ids.join(', ')}`);
                            return ids.map(id => ({ id }));
                        }
                    }

                    // Check if it's just a number (numeric ID)
                    if (/^\d+$/.test(trimmedData)) {
                        logger.info(`Received numeric ID for ${fieldName}: ${trimmedData}`);
                        return [{ id: trimmedData }];
                    }

                    // Try to parse as JSON array
                    try {
                        const parsed = JSON.parse(trimmedData);
                        if (Array.isArray(parsed)) {
                            // Check if it's array of UUID strings like ["uuid1", "uuid2"]
                            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                            if (parsed.every(item => typeof item === 'string' && uuidRegex.test(item))) {
                                logger.info(`Received JSON array of UUIDs for ${fieldName}:`, parsed);
                                return parsed.map(id => ({ id }));
                            }
                            return parsed;
                        }
                        return [];
                    } catch (parseError) {
                        logger.error(`Invalid JSON format for ${fieldName}:`, {
                            data: trimmedData,
                            error: parseError.message,
                            suggestion: `Expected format: [{"facilityName":"WiFi"}] or single UUID: "03101f54-de76-42b0-8ccf-7bcbfc81a7d4"`
                        });

                        logger.warn(`Skipping ${fieldName} due to invalid format, continuing with empty array`);
                        return [];
                    }
                }

                return [];
            };

            // Parse JSON strings safely
            const parsedFacilities = safeJsonParse(facilities, 'facilities');
            const parsedManagers = safeJsonParse(buildingManagers, 'buildingManagers');

            // Debug logging untuk update building
            logger.info('Update building - input received:', {
                buildingId,
                facilitiesInput: facilities,
                facilitiesType: typeof facilities,
                facilitiesParsed: parsedFacilities,
                managersInput: buildingManagers,
                managersType: typeof buildingManagers,
                managersParsed: parsedManagers
            });

            let buildingPhotoUrl = existingBuilding.buildingPhoto;

            // Handle photo update
            if (buildingPhoto) {
                // Delete old photo if exists
                if (existingBuilding.buildingPhoto) {
                    const oldPhotoPath = existingBuilding.buildingPhoto.replace(process.env.BASE_URL || 'http://localhost:3000', '');
                    deleteFile(`./uploads${oldPhotoPath}`);
                }
                buildingPhotoUrl = getFileUrl(buildingPhoto.filename, 'images');
            }

            // Update building basic info
            const updateData = {};
            if (buildingName) updateData.buildingName = buildingName;
            if (description) updateData.description = description;
            if (rentalPrice) updateData.rentalPrice = parseInt(rentalPrice);
            if (capacity) updateData.capacity = parseInt(capacity);
            if (location) updateData.location = location;
            if (buildingType) updateData.buildingType = buildingType;
            if (buildingPhotoUrl) updateData.buildingPhoto = buildingPhotoUrl;

            await prisma.building.update({
                where: { id: buildingId },
                data: updateData
            });

            // Update facilities (run only when facilities field is explicitly provided in request)
            if (facilities !== undefined) {
                logger.info(`Starting facilities update for building ${buildingId}`, {
                    parsedFacilities,
                    isArray: Array.isArray(parsedFacilities),
                    length: parsedFacilities?.length
                });
                // Delete existing facility relationships
                await prisma.facilityBuilding.deleteMany({
                    where: { buildingId }
                });

                // Create new facility relationships
                for (const facility of parsedFacilities) {
                    let facilityRecord = null;

                    // Check if it's an ID reference to existing facility
                    if (facility.id) {
                        facilityRecord = await prisma.facility.findUnique({
                            where: { id: facility.id }
                        });

                        if (!facilityRecord) {
                            logger.warn('Facility with ID not found, skipping:', facility.id);
                            continue;
                        }
                    }
                    // Check if it's new facility data
                    else if (facility.facilityName) {
                        // Look for existing facility with same name
                        facilityRecord = await prisma.facility.findFirst({
                            where: { facilityName: facility.facilityName }
                        });

                        // Create new if not exists
                        if (!facilityRecord) {
                            facilityRecord = await prisma.facility.create({
                                data: {
                                    id: uuidv4(),
                                    facilityName: facility.facilityName,
                                    iconUrl: facility.iconUrl || null
                                }
                            });
                        }
                    } else {
                        logger.warn('Facility without ID or facilityName skipped:', facility);
                        continue;
                    }

                    // Create facility-building relationship
                    if (facilityRecord) {
                        await prisma.facilityBuilding.create({
                            data: {
                                facilityId: facilityRecord.id,
                                buildingId
                            }
                        });
                    }
                }
            }

            // Update building managers (run only when buildingManagers field is explicitly provided in request)
            if (buildingManagers !== undefined) {
                logger.info(`Starting building managers update for building ${buildingId}`, {
                    parsedManagers,
                    isArray: Array.isArray(parsedManagers),
                    length: parsedManagers?.length
                });

                // Get current building managers for comparison
                const currentManagers = await prisma.buildingManager.findMany({
                    where: { buildingId }
                });

                const currentManagerIds = currentManagers.map(m => m.id);
                const updateManagerIds = [];

                // Process managers in request
                for (const manager of parsedManagers) {
                    // Check if it's an ID reference to existing manager
                    if (manager.id) {
                        const existingManager = await prisma.buildingManager.findUnique({
                            where: { id: manager.id }
                        });

                        if (existingManager) {
                            // Update existing manager (keep track of updated IDs)
                            updateManagerIds.push(manager.id);

                            // Update manager data if there are changes
                            const updateData = {};
                            if (manager.managerName) updateData.managerName = manager.managerName;
                            if (manager.phoneNumber) updateData.phoneNumber = manager.phoneNumber;
                            updateData.buildingId = buildingId;

                            if (Object.keys(updateData).length > 1) { // more than just buildingId
                                await prisma.buildingManager.update({
                                    where: { id: manager.id },
                                    data: updateData
                                });
                                logger.info(`Updated building manager: ${manager.id}`);
                            } else {
                                // Just reassign to building if no other changes
                                await prisma.buildingManager.update({
                                    where: { id: manager.id },
                                    data: { buildingId: buildingId }
                                });
                            }
                        } else {
                            logger.warn('Building manager with ID not found, skipping:', manager.id);
                            continue;
                        }
                    }
                    // Check if it's new manager data
                    else if (manager.managerName && manager.phoneNumber) {
                        const newManager = await prisma.buildingManager.create({
                            data: {
                                id: uuidv4(),
                                managerName: manager.managerName,
                                phoneNumber: manager.phoneNumber,
                                buildingId: buildingId
                            }
                        });
                        updateManagerIds.push(newManager.id);
                        logger.info(`Created new building manager: ${newManager.id}`);
                    } else {
                        logger.warn('Manager without ID or required fields skipped:', manager);
                        continue;
                    }
                }

                // Keep existing managers that weren't included in the update
                // This prevents data loss when user only wants to add/update specific managers
                logger.info(`Keeping ${currentManagerIds.length - updateManagerIds.filter(id => currentManagerIds.includes(id)).length} existing managers`);
            }

            // Get updated building data
            const updatedBuilding = await this.getBuildingWithRelations(buildingId);

            // Send notification to admin
            try {
                const PusherHelper = require('../libs/pusher.lib');
                await PusherHelper.sendAdminNotification('BUILDING_UPDATED', {
                    buildingId: building.id,
                    buildingName: building.buildingName,
                    location: building.location,
                    buildingType: building.buildingType,
                    rentalPrice: building.rentalPrice,
                    capacity: building.capacity,
                    action: 'UPDATED'
                });
            } catch (notificationError) {
                logger.warn('Failed to send building update notification:', notificationError);
            }

            logger.info(`Building updated: ${buildingId}`);
            return updatedBuilding;
        } catch (error) {
            logger.error('Admin update building service error:', error);
            throw error;
        }
    },

    // Delete building
    async deleteBuilding(buildingId) {
        try {
            const building = await prisma.building.findUnique({
                where: { id: buildingId },
                include: {
                    booking: {
                        where: {
                            bookingStatus: {
                                in: ['APPROVED', 'PROCESSING']
                            }
                        }
                    }
                }
            });

            if (!building) {
                throw new Error('Building tidak ditemukan');
            }

            // Check if building has active bookings
            if (building.booking && building.booking.length > 0) {
                throw new Error('Building tidak bisa dihapus karena masih memiliki booking aktif');
            }

            // Delete related data
            await prisma.facilityBuilding.deleteMany({
                where: { buildingId }
            });

            await prisma.buildingManager.deleteMany({
                where: { buildingId }
            });

            // Delete building photo if exists
            if (building.buildingPhoto) {
                const photoPath = building.buildingPhoto.replace(process.env.BASE_URL || 'http://localhost:3000', '');
                deleteFile(`./uploads${photoPath}`);
            }

            // Delete building
            await prisma.building.delete({
                where: { id: buildingId }
            });

            // Send notification to admin
            try {
                const PusherHelper = require('../libs/pusher.lib');
                await PusherHelper.sendAdminNotification('BUILDING_DELETED', {
                    buildingId: buildingId,
                    buildingName: buildingToDelete.buildingName,
                    location: buildingToDelete.location,
                    buildingType: buildingToDelete.buildingType,
                    action: 'DELETED'
                });
            } catch (notificationError) {
                logger.warn('Failed to send building deletion notification:', notificationError);
            }

            logger.info(`Building deleted: ${buildingId}`);
            return {
                id: buildingId,
                buildingName: building.buildingName
            };
        } catch (error) {
            logger.error('Admin delete building service error:', error);
            throw error;
        }
    },

    // Get building with all relations
    async getBuildingWithRelations(buildingId) {
        const building = await prisma.building.findUnique({
            where: { id: buildingId },
            include: {
                facilityBuilding: {
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
                buildingManager: {
                    select: {
                        id: true,
                        managerName: true,
                        phoneNumber: true
                    }
                }
            }
        });

        return {
            id: building.id,
            buildingName: building.buildingName,
            description: building.description,
            rentalPrice: building.rentalPrice,
            capacity: building.capacity,
            location: building.location,
            buildingPhoto: building.buildingPhoto,
            buildingType: building.buildingType,
            facilities: building.facilityBuilding.map(fb => fb.facility),
            buildingManagers: building.buildingManager
        };
    }
};

module.exports = BuildingService; 