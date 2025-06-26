const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');

const BuildingManagerFactory = {
    // Generate single building manager
    generateBuildingManager(overrides = {}) {
        return {
            id: uuidv4(),
            managerName: faker.person.fullName(),
            phoneNumber: faker.phone.number('08##########'),
            ...overrides
        };
    },

    // Generate multiple building managers
    generateMultiple(count = 3) {
        const managers = [];
        for (let i = 0; i < count; i++) {
            managers.push(this.generateBuildingManager());
        }
        return managers;
    },

    // Generate managers with specific names (for realism)
    generateRealisticManagers() {
        const managerNames = [
            'Pak Budi Santoso',
            'Ibu Sari Dewi',
            'Pak Ahmad Rahman',
            'Ibu Fitri Handayani',
            'Pak Eko Prasetyo',
            'Ibu Rina Sartika',
            'Pak Dedi Kurniawan',
            'Ibu Maya Sari'
        ];

        return managerNames.map(name => ({
            id: uuidv4(),
            managerName: name,
            phoneNumber: faker.phone.number('08##########')
        }));
    },

    // Generate managers for specific building
    generateForBuilding(buildingId, count = faker.number.int({ min: 1, max: 3 })) {
        const managers = [];
        for (let i = 0; i < count; i++) {
            managers.push({
                ...this.generateBuildingManager(),
                buildingId
            });
        }
        return managers;
    }
};

module.exports = BuildingManagerFactory; 