const { UserSeeder, BuildingSeeder, BuildingManagerSeeder, BookingSeeder, NotificationSeeder, RefundSeeder } = require('./index');
const { prisma } = require('../../configs');
const { Logger } = require('../../utils');


class MainSeeder {
    static async run() {
        Logger.info('Starting database seeding...');

        try {
            // Clean database in reverse order to avoid foreign key constraints
            Logger.info('Cleaning up existing data...');
            await prisma.refund.deleteMany();
            await prisma.payment.deleteMany();
            await prisma.booking.deleteMany();
            await prisma.facilityBuilding.deleteMany();
            await prisma.buildingManager.deleteMany();
            await prisma.building.deleteMany();
            await prisma.facility.deleteMany();
            await prisma.notification.deleteMany();
            await prisma.token.deleteMany();
            await prisma.user.deleteMany();
            Logger.info('Database cleaned successfully');

            // Run seeders in order
            await UserSeeder.run();
            await BuildingSeeder.run();
            await BuildingManagerSeeder.run();
            await BookingSeeder.run();

            try {
                await NotificationSeeder.run();
            } catch (notificationError) {
                Logger.error('Error in notification seeder, continuing...', { error: notificationError.message });
            }

            try {
                await RefundSeeder.run();
            } catch (refundError) {
                Logger.error('Error in refund seeder, continuing...', { error: refundError.message });
            }

            Logger.info('All data seeded successfully');
            return true;
        } catch (error) {
            Logger.error('Error seeding database:', { error: error.message });
            return false;
        } finally {
            await prisma.$disconnect();
        }
    }
}

// If this script is run directly (not imported)
if (require.main === module) {
    MainSeeder.run()
        .then((success) => {
            Logger.info('Seeder execution completed');
            process.exit(success ? 0 : 1);
        })
        .catch((err) => {
            Logger.error('Seeder execution failed:', { error: err.message || err });
            process.exit(1);
        });
}

module.exports = MainSeeder; 