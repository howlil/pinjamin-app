const { faker } = require('@faker-js/faker/locale/id_ID');

class BuildingManagerFactory {
    static create(overrides = {}) {
        const defaultAttributes = {
            managerName: faker.person.fullName(),
            phoneNumber: faker.phone.number('08##########'),
            buildingId: overrides.buildingId || faker.string.uuid(),
        };

        return {
            ...defaultAttributes,
            ...overrides,
        };
    }

    static createMany(count = 1, overrides = {}) {
        return Array.from({ length: count }, () => this.create(overrides));
    }
}

module.exports = BuildingManagerFactory; 