const prisma = require('../../src/libs/database.lib');
const logger = require('../../src/libs/logger.lib');

// Import all factories
const UserFactory = require('../factories/user.factory');
const FacilityFactory = require('../factories/facility.factory');
const BuildingManagerFactory = require('../factories/building-manager.factory');
const BuildingFactory = require('../factories/building.factory');
const BookingFactory = require('../factories/booking.factory');
const PaymentFactory = require('../factories/payment.factory');
const NotificationFactory = require('../factories/notification.factory');

class MainSeeder {
    async run() {
        try {
            console.log('🌱 Starting database seeding...');

            // Clear existing data (optional - comment out if you want to keep existing data)
            await this.clearDatabase();

            // Seed in correct order due to foreign key constraints
            const users = await this.seedUsers();
            const facilities = await this.seedFacilities();
            const buildings = await this.seedBuildings();
            const buildingManagers = await this.seedBuildingManagers(buildings);
            const facilityBuildings = await this.seedFacilityBuildings(facilities, buildings);
            const bookings = await this.seedBookings(users, buildings);
            const payments = await this.seedPayments(bookings);
            const notifications = await this.seedNotifications(users);

            console.log('✅ Database seeding completed successfully!');
            console.log(`📊 Summary:`);
            console.log(`   - Users: ${users.length}`);
            console.log(`   - Facilities: ${facilities.length}`);
            console.log(`   - Buildings: ${buildings.length}`);
            console.log(`   - Building Managers: ${buildingManagers.length}`);
            console.log(`   - Facility-Building Relations: ${facilityBuildings.length}`);
            console.log(`   - Bookings: ${bookings.length}`);
            console.log(`   - Payments: ${payments.length}`);
            console.log(`   - Notifications: ${notifications.length}`);

        } catch (error) {
            console.error('❌ Error during seeding:', error);
            throw error;
        } finally {
            await prisma.$disconnect();
        }
    }

    async clearDatabase() {
        console.log('🧹 Clearing existing data...');

        // Delete in reverse order of dependencies
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

        console.log('✅ Database cleared');
    }

    async seedUsers() {
        console.log('👥 Seeding users...');

        const users = await UserFactory.generateUsersWithRoles(25, 3);

        for (const user of users) {
            await prisma.user.create({ data: user });
        }

        console.log(`✅ Created ${users.length} users`);
        return users;
    }

    async seedFacilities() {
        console.log('🏢 Seeding facilities...');

        const facilities = FacilityFactory.generatePredefinedFacilities();

        for (const facility of facilities) {
            await prisma.facility.create({ data: facility });
        }

        console.log(`✅ Created ${facilities.length} facilities`);
        return facilities;
    }

    async seedBuildings() {
        console.log('🏛️ Seeding buildings...');

        const buildings = BuildingFactory.generateBalancedBuildings(20);

        for (const building of buildings) {
            await prisma.building.create({ data: building });
        }

        console.log(`✅ Created ${buildings.length} buildings`);

        // Tampilkan info gedung premium dengan tarif UNAND dari artikel Genta Andalas
        const premiumBuildings = buildings.filter(b =>
            ['Auditorium', 'Convention Hall', 'Ruang Seminar PKM', 'Ruang Seminar FE', 'Ruang Seminar Perpustakaan'].includes(b.buildingName)
        );
        if (premiumBuildings.length > 0) {
            console.log(`🏛️  Premium buildings with UNAND tariff (source: Genta Andalas):`);
            premiumBuildings.forEach(building => {
                console.log(`   - ${building.buildingName}: Rp${building.rentalPrice.toLocaleString('id-ID')}`);
            });
        }

        return buildings;
    }

    async seedBuildingManagers(buildings) {
        console.log('👨‍💼 Seeding building managers...');

        const managers = [];

        for (const building of buildings) {
            const buildingManagers = BuildingManagerFactory.generateForBuilding(building.id, 2);

            for (const manager of buildingManagers) {
                await prisma.buildingManager.create({ data: manager });
                managers.push(manager);
            }
        }

        console.log(`✅ Created ${managers.length} building managers`);
        return managers;
    }

    async seedFacilityBuildings(facilities, buildings) {
        console.log('🔗 Seeding facility-building relations...');

        const facilityBuildings = [];

        for (const building of buildings) {
            // Get facilities appropriate for this building type
            const buildingFacilities = FacilityFactory.generateForBuildingType(building.buildingType);

            for (const facilityData of buildingFacilities) {
                // Find the actual facility in the database
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
        return facilityBuildings;
    }

    async seedBookings(users, buildings) {
        console.log('📅 Seeding bookings...');

        const borrowers = users.filter(user => user.role === 'BORROWER');
        const bookings = [];

        // Generate 50 bookings
        for (let i = 0; i < 50; i++) {
            const user = borrowers[Math.floor(Math.random() * borrowers.length)];
            const building = buildings[Math.floor(Math.random() * buildings.length)];

            const booking = BookingFactory.generateBookingForUser(user.id, building.id);

            await prisma.booking.create({ data: booking });
            bookings.push(booking);
        }

        console.log(`✅ Created ${bookings.length} bookings`);
        return bookings;
    }

    async seedPayments(bookings) {
        console.log('💳 Seeding payments...');

        const payments = [];

        // Create payments for approved and completed bookings
        const paidBookings = bookings.filter(booking =>
            ['APPROVED', 'COMPLETED'].includes(booking.bookingStatus)
        );

        for (const booking of paidBookings) {
            const payment = PaymentFactory.generatePaymentForBooking(booking.id, {
                paymentStatus: 'PAID'
            });

            await prisma.payment.create({ data: payment });
            payments.push(payment);
        }

        // Create some pending/unpaid payments for processing bookings
        const processingBookings = bookings.filter(booking => booking.bookingStatus === 'PROCESSING');

        for (let i = 0; i < Math.min(10, processingBookings.length); i++) {
            const booking = processingBookings[i];
            const payment = PaymentFactory.generatePaymentForBooking(booking.id, {
                paymentStatus: Math.random() > 0.5 ? 'PENDING' : 'UNPAID'
            });

            await prisma.payment.create({ data: payment });
            payments.push(payment);
        }

        console.log(`✅ Created ${payments.length} payments`);
        return payments;
    }

    async seedNotifications(users) {
        console.log('🔔 Seeding notifications...');

        const borrowers = users.filter(user => user.role === 'BORROWER');
        const notifications = [];

        // Generate notifications for each borrower
        for (const user of borrowers) {
            const userNotifications = NotificationFactory.generateBalancedNotifications(5);

            for (const notification of userNotifications) {
                notification.userId = user.id;
                await prisma.notification.create({ data: notification });
                notifications.push(notification);
            }
        }

        console.log(`✅ Created ${notifications.length} notifications`);
        return notifications;
    }
}

module.exports = MainSeeder; 