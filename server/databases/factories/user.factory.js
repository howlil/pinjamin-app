const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const UserFactory = {
    // Generate single user
    async generateUser(overrides = {}) {
        const hashedPassword = await bcrypt.hash('password123', 12);

        return {
            id: uuidv4(),
            fullName: faker.person.fullName(),
            email: faker.internet.email().toLowerCase(),
            password: hashedPassword,
            phoneNumber: faker.phone.number('08##########'),
            borrowerType: faker.helpers.arrayElement(['INTERNAL_UNAND', 'EXTERNAL_UNAND']),
            role: 'BORROWER',
            bankName: faker.helpers.arrayElement([
                'Bank Mandiri', 'Bank BCA', 'Bank BRI', 'Bank BNI',
                'Bank BTN', 'Bank Danamon', 'Bank CIMB Niaga'
            ]),
            bankNumber: faker.finance.accountNumber(12),
            ...overrides
        };
    },

    // Generate admin user
    async generateAdmin(overrides = {}) {
        return await this.generateUser({
            role: 'ADMIN',
            borrowerType: 'INTERNAL_UNAND',
            email: 'admin@unand.ac.id',
            fullName: 'Administrator',
            ...overrides
        });
    },

    // Generate multiple users
    async generateMultiple(count = 10) {
        const users = [];
        for (let i = 0; i < count; i++) {
            users.push(await this.generateUser());
        }
        return users;
    },

    // Generate users with specific roles
    async generateUsersWithRoles(borrowerCount = 20, adminCount = 3) {
        const users = [];

        // Generate admin users
        for (let i = 0; i < adminCount; i++) {
            users.push(await this.generateAdmin({
                email: i === 0 ? 'admin@unand.ac.id' : `admin${i + 1}@unand.ac.id`,
                fullName: i === 0 ? 'Super Admin' : `Admin ${i + 1}`
            }));
        }

        // Generate borrower users
        for (let i = 0; i < borrowerCount; i++) {
            const borrowerType = i % 3 === 0 ? 'EXTERNAL_UNAND' : 'INTERNAL_UNAND';
            users.push(await this.generateUser({
                borrowerType,
                email: `user${i + 1}@${borrowerType === 'INTERNAL_UNAND' ? 'student.unand.ac.id' : 'gmail.com'}`
            }));
        }

        return users;
    }
};

module.exports = UserFactory; 