const prisma = require('../../src/libs/database.lib');
const UserFactory = require('../factories/user.factory');
const FacilityFactory = require('../factories/facility.factory');
const BuildingFactory = require('../factories/building.factory');
const BuildingManagerFactory = require('../factories/building-manager.factory');

class TestSeeder {
    async run() {
        try {
            console.log('🧪 Starting Test Data Seeding...\n');

            // Clear existing data
            await this.clearDatabase();

            // Create minimal test data
            const users = await this.seedTestUsers();
            const facilities = await this.seedTestFacilities();
            const buildings = await this.seedTestBuildings();
            const buildingManagers = await this.seedTestBuildingManagers(buildings);
            const facilityBuildings = await this.seedTestFacilityBuildings(facilities, buildings);

            console.log('\n✅ Test data seeding completed!');
            console.log('📊 Test Data Summary:');
            console.log(`   - Users: ${users.length} (1 admin + 4 borrowers)`);
            console.log(`   - Facilities: ${facilities.length}`);
            console.log(`   - Buildings: ${buildings.length} (one per type)`);
            console.log(`   - Building Managers: ${buildingManagers.length}`);
            console.log(`   - Facility Relations: ${facilityBuildings.length}`);

            console.log('\n🔑 Test Credentials:');
            console.log('Admin: admin@unand.ac.id / password123');
            console.log('User 1: user1@student.unand.ac.id / password123');
            console.log('User 2: user2@gmail.com / password123');

        } catch (error) {
            console.error('❌ Test seeding failed:', error);
            throw error;
        } finally {
            await prisma.$disconnect();
        }
    }

    async clearDatabase() {
        console.log('🧹 Clearing database for test data...');

        await prisma.notification.deleteMany();
        await prisma.refund.deleteMany();
        await prisma.payment.deleteMany();
        await prisma.booking.deleteMany();
        await prisma.token.deleteMany();
        await prisma.facilityBuilding.deleteMany();
        await prisma.buildingManager.deleteMany();
        await prisma.building.deleteMany();
        await prisma.facility.deleteMany();
        await prisma.user.deleteMany();
    }

    async seedTestUsers() {
        console.log('👥 Creating test users...');

        const users = [
            // Admin user
            await UserFactory.generateAdmin({
                email: 'admin@unand.ac.id',
                fullName: 'Test Admin'
            }),

            // Test borrowers
            await UserFactory.generateUser({
                email: 'user1@student.unand.ac.id',
                fullName: 'Test User 1',
                borrowerType: 'INTERNAL_UNAND'
            }),
            await UserFactory.generateUser({
                email: 'user2@gmail.com',
                fullName: 'Test User 2',
                borrowerType: 'EXTERNAL_UNAND'
            }),
            await UserFactory.generateUser({
                email: 'user3@student.unand.ac.id',
                fullName: 'Test User 3',
                borrowerType: 'INTERNAL_UNAND'
            }),
            await UserFactory.generateUser({
                email: 'user4@gmail.com',
                fullName: 'Test User 4',
                borrowerType: 'EXTERNAL_UNAND'
            })
        ];

        for (const user of users) {
            await prisma.user.create({ data: user });
        }

        return users;
    }

    async seedTestFacilities() {
        console.log('🏢 Creating test facilities...');

        // Create only essential facilities for testing
        const facilities = [
            { id: require('uuid').v4(), facilityName: 'WiFi', iconUrl: '📶' },
            { id: require('uuid').v4(), facilityName: 'Proyektor', iconUrl: '📽️' },
            { id: require('uuid').v4(), facilityName: 'AC', iconUrl: '❄️' },
            { id: require('uuid').v4(), facilityName: 'Sound System', iconUrl: '🔊' },
            { id: require('uuid').v4(), facilityName: 'Whiteboard', iconUrl: '📋' }
        ];

        for (const facility of facilities) {
            await prisma.facility.create({ data: facility });
        }

        return facilities;
    }

    async seedTestBuildings() {
        console.log('🏛️ Creating test buildings...');

        // One building per type for comprehensive testing
        const buildings = [
            BuildingFactory.generateBuilding({
                buildingName: 'Test Classroom A101',
                buildingType: 'CLASSROOM',
                capacity: 40,
                rentalPrice: 200000,
                location: 'Gedung A Lantai 1'
            }),
            BuildingFactory.generateBuilding({
                buildingName: 'Test Lab Komputer',
                buildingType: 'LABORATORY',
                capacity: 30,
                rentalPrice: 300000,
                location: 'Gedung B Lantai 2'
            }),
            BuildingFactory.generateBuilding({
                buildingName: 'Test Ruang Seminar',
                buildingType: 'SEMINAR',
                capacity: 80,
                rentalPrice: 500000,
                location: 'Gedung C Lantai 1'
            }),
            BuildingFactory.generateBuilding({
                buildingName: 'Test Aula Utama',
                buildingType: 'MULTIFUNCTION',
                capacity: 200,
                rentalPrice: 800000,
                location: 'Student Center'
            }),
            BuildingFactory.generateBuilding({
                buildingName: 'Test Ruang PKM',
                buildingType: 'PKM',
                capacity: 25,
                rentalPrice: 150000,
                location: 'Gedung PKM'
            })
        ];

        for (const building of buildings) {
            await prisma.building.create({ data: building });
        }

        return buildings;
    }

    async seedTestBuildingManagers(buildings) {
        console.log('👨‍💼 Creating test building managers...');

        const managers = [];

        for (const building of buildings) {
            const manager = BuildingManagerFactory.generateBuildingManager({
                buildingId: building.id,
                managerName: `Manager ${building.buildingName}`,
                phoneNumber: '081234567890'
            });

            await prisma.buildingManager.create({ data: manager });
            managers.push(manager);
        }

        return managers;
    }

    async seedTestFacilityBuildings(facilities, buildings) {
        console.log('🔗 Creating test facility-building relations...');

        const facilityBuildings = [];

        // Assign basic facilities to all buildings
        const basicFacilities = facilities.filter(f =>
            ['WiFi', 'AC'].includes(f.facilityName)
        );

        for (const building of buildings) {
            for (const facility of basicFacilities) {
                const facilityBuilding = {
                    facilityId: facility.id,
                    buildingId: building.id
                };

                await prisma.facilityBuilding.create({ data: facilityBuilding });
                facilityBuildings.push(facilityBuilding);
            }

            // Add specific facilities based on building type
            if (building.buildingType === 'CLASSROOM' || building.buildingType === 'SEMINAR') {
                const proyektor = facilities.find(f => f.facilityName === 'Proyektor');
                if (proyektor) {
                    const facilityBuilding = {
                        facilityId: proyektor.id,
                        buildingId: building.id
                    };
                    await prisma.facilityBuilding.create({ data: facilityBuilding });
                    facilityBuildings.push(facilityBuilding);
                }
            }
        }

        return facilityBuildings;
    }
}

module.exports = TestSeeder; 