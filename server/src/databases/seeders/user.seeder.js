const { PrismaClient } = require('@prisma/client');
const { UserFactory } = require('../factories');
const Logger = require('../../utils/logger.util');

const prisma = new PrismaClient();

class UserSeeder {
    static async run() {
        Logger.info('Seeding users...');

        try {
            // Create admin user
            const adminUser = await UserFactory.createAdmin({
                fullName: 'Admin Unand',
                email: 'admin@unand.ac.id',
            });

            const defaultUser = await UserFactory.createBorrower({
                fullName: 'Default User',
                email: 'user@unand.ac.id',
            });

            await prisma.user.create({
                data: adminUser
            });

            await prisma.user.create({
                data: defaultUser
            });

            Logger.info('Admin user created successfully');

            // Create regular users
            const users = await UserFactory.createMany(10);

            for (const user of users) {
                await prisma.user.create({
                    data: user
                });
            }

            Logger.info('Regular users created successfully');
            return true;
        } catch (error) {
            Logger.error('Error seeding users:', { error });
            return false;
        }
    }
}

module.exports = UserSeeder; 