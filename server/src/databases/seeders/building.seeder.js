const { PrismaClient } = require('@prisma/client');
const { BuildingFactory, BuildingManagerFactory, FacilityFactory } = require('../factories');
const Logger = require('../../utils/logger.util');

const prisma = new PrismaClient();

class BuildingSeeder {
    static async run() {
        Logger.info('Seeding buildings...');

        try {
            // Create facilities first
            const facilities = FacilityFactory.createMany(15); // Create all available facilities

            const savedFacilities = [];
            for (const facility of facilities) {
                const savedFacility = await prisma.facility.create({
                    data: facility
                });
                savedFacilities.push(savedFacility);
            }

            Logger.info('Facilities created successfully');

            // Create buildings with managers and facilities
            const buildings = BuildingFactory.createMany(8); // Create 8 different buildings

            for (const building of buildings) {
                // Save the building
                const savedBuilding = await prisma.building.create({
                    data: {
                        ...building
                    }
                });

                // Create 1-2 building managers for each building
                const managerCount = Math.floor(Math.random() * 2) + 1; // 1 or 2
                const managers = BuildingManagerFactory.createMany(managerCount, { buildingId: savedBuilding.id });

                for (const manager of managers) {
                    await prisma.buildingManager.create({
                        data: manager
                    });
                }

                // Add 3-6 random facilities to each building
                const facilityCount = Math.floor(Math.random() * 4) + 3; // 3 to 6
                const shuffled = [...savedFacilities].sort(() => 0.5 - Math.random());
                const selectedFacilities = shuffled.slice(0, facilityCount);

                for (const facility of selectedFacilities) {
                    await prisma.facilityBuilding.create({
                        data: {
                            buildingId: savedBuilding.id,
                            facilityId: facility.id
                        }
                    });
                }
            }

            Logger.info('Buildings with managers and facilities created successfully');
            return true;
        } catch (error) {
            Logger.error('Error seeding buildings:', { error });
            return false;
        }
    }
}

module.exports = BuildingSeeder; 