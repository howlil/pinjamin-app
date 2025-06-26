const prisma = require('../../src/libs/database.lib');
const FacilityFactory = require('../factories/facility.factory');
const BuildingFactory = require('../factories/building.factory');
const BuildingManagerFactory = require('../factories/building-manager.factory');

class BuildingSeeder {
    async run(options = {}) {
        const { buildingCount = 20, clearFirst = false } = options;

        console.log('🏛️ Starting Building seeding...');

        if (clearFirst) {
            console.log('🧹 Clearing existing buildings data...');
            await prisma.facilityBuilding.deleteMany();
            await prisma.buildingManager.deleteMany();
            await prisma.building.deleteMany();
            await prisma.facility.deleteMany();
        }

        // Seed facilities first
        const facilities = FacilityFactory.generatePredefinedFacilities();
        for (const facility of facilities) {
            await prisma.facility.create({ data: facility });
        }
        console.log(`✅ Created ${facilities.length} facilities`);

        // Seed buildings
        const buildings = BuildingFactory.generateBalancedBuildings(buildingCount);
        for (const building of buildings) {
            await prisma.building.create({ data: building });
        }
        console.log(`✅ Created ${buildings.length} buildings`);

        // Seed building managers
        const managers = [];
        for (const building of buildings) {
            const buildingManagers = BuildingManagerFactory.generateForBuilding(building.id, 2);
            for (const manager of buildingManagers) {
                await prisma.buildingManager.create({ data: manager });
                managers.push(manager);
            }
        }
        console.log(`✅ Created ${managers.length} building managers`);

        // Seed facility-building relations
        const facilityBuildings = [];
        for (const building of buildings) {
            const buildingFacilities = FacilityFactory.generateForBuildingType(building.buildingType);

            for (const facilityData of buildingFacilities) {
                const facility = facilities.find(f => f.facilityName === facilityData.facilityName);

                if (facility) {
                    const facilityBuilding = {
                        facilityId: facility.id,
                        buildingId: building.id
                    };

                    await prisma.facilityBuilding.create({ data: facilityBuilding });
                    facilityBuildings.push(facilityBuilding);
                }
            }
        }
        console.log(`✅ Created ${facilityBuildings.length} facility-building relations`);

        return { buildings, facilities, managers, facilityBuildings };
    }
}

module.exports = BuildingSeeder; 