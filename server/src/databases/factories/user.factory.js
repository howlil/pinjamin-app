const { faker } = require('@faker-js/faker/locale/id_ID');
const bcryptUtil = require('../../utils/bcrypt.util');

class UserFactory {
    static async create(overrides = {}) {
        const defaultAttributes = {
            fullName: faker.person.fullName(),
            email: faker.internet.email().toLowerCase(),
            password: await bcryptUtil.hash('password123'),
            phoneNumber: faker.phone.number('08##########'),
            borrowerType: faker.helpers.arrayElement(['INTERNAL_UNAND', 'EXTERNAL_UNAND']),
            role: overrides.role || 'BORROWER',
            bankName: faker.helpers.arrayElement(['BRI', 'BNI', 'BCA', 'Mandiri', 'BSI', 'Bank Nagari']),
            bankNumber: faker.finance.accountNumber(),
        };

        return {
            ...defaultAttributes,
            ...overrides,
        };
    }

    static async createMany(count = 1, overrides = {}) {
        return Promise.all(
            Array.from({ length: count }, () => this.create(overrides))
        );
    }

    static async createAdmin(overrides = {}) {
        return this.create({
            ...overrides,
            role: 'ADMIN',
            email: 'admin@unand.ac.id',
        });
    }

    static async createBorrower(overrides = {}) {
        return this.create({
            ...overrides,
            role: 'BORROWER',
            email: 'borrower@unand.ac.id',
        });
    }
}

module.exports = UserFactory; 