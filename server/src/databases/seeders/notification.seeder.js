const { PrismaClient } = require('@prisma/client');
const { NotificationFactory } = require('../factories');
const Logger = require('../../utils/logger.util');

const prisma = new PrismaClient();

class NotificationSeeder {
    static async run() {
        Logger.info('Seeding notifications...');

        try {
            // Get all users
            const users = await prisma.user.findMany();

            if (users.length === 0) {
                throw new Error('No users found. Run user seeder first.');
            }

            // Create 3-8 notifications for each user
            for (const user of users) {
                const notificationCount = Math.floor(Math.random() * 6) + 3; // 3-8 notifications

                const notifications = NotificationFactory.createMany(notificationCount, {
                    userId: user.id
                });

                for (const notification of notifications) {
                    await prisma.notification.create({
                        data: notification
                    });
                }
            }

            Logger.info('Notifications created successfully');
            return true;
        } catch (error) {
            Logger.error('Error seeding notifications:', { error });
            return false;
        }
    }
}

module.exports = NotificationSeeder;