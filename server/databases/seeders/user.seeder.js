const prisma = require('../../src/libs/database.lib');
const UserFactory = require('../factories/user.factory');

class UserSeeder {
    async run(options = {}) {
        const { borrowerCount = 20, adminCount = 3, clearFirst = false } = options;

        console.log('👥 Starting User seeding...');

        if (clearFirst) {
            console.log('🧹 Clearing existing users...');
            await prisma.token.deleteMany();
            await prisma.user.deleteMany();
        }

        const users = await UserFactory.generateUsersWithRoles(borrowerCount, adminCount);

        for (const user of users) {
            await prisma.user.create({ data: user });
        }

        console.log(`✅ Created ${users.length} users`);
        console.log(`   - Admins: ${adminCount}`);
        console.log(`   - Borrowers: ${borrowerCount}`);
        console.log('\nDefault admin credentials:');
        console.log('📧 Email: admin@unand.ac.id');
        console.log('🔑 Password: password123');

        return users;
    }
}

module.exports = UserSeeder; 