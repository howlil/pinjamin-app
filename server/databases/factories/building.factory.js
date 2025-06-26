const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');

const BuildingFactory = {
    buildingTypes: ['CLASSROOM', 'LABORATORY', 'SEMINAR', 'MULTIFUNCTION', 'PKM'],

    buildingNames: {
        CLASSROOM: ['Ruang Kelas A101', 'Ruang Kelas B202', 'Ruang Kuliah Utara'],
        LABORATORY: ['Lab Komputer 1', 'Lab Kimia', 'Lab Fisika'],
        SEMINAR: ['Ruang Seminar A', 'Aula Seminar', 'Ruang Sidang'],
        MULTIFUNCTION: ['Aula Utama', 'Gedung Serbaguna', 'Convention Hall'],
        PKM: ['Ruang PKM 1', 'Creative Space', 'Workshop PKM']
    },

    locations: [
        'Gedung A Lantai 1', 'Gedung B Lantai 2', 'Gedung C Lantai 3',
        'Gedung Rektorat', 'Student Center', 'Fakultas MIPA'
    ],

    generateBuilding(overrides = {}) {
        const buildingType = overrides.buildingType || faker.helpers.arrayElement(this.buildingTypes);
        const names = this.buildingNames[buildingType];

        return {
            id: uuidv4(),
            buildingName: faker.helpers.arrayElement(names),
            description: `${buildingType} dengan fasilitas lengkap dan modern`,
            rentalPrice: faker.number.int({ min: 100000, max: 1000000 }),
            capacity: faker.number.int({ min: 20, max: 300 }),
            location: faker.helpers.arrayElement(this.locations),
            buildingType,
            buildingPhoto: `https://picsum.photos/800/600?random=${faker.number.int({ min: 1, max: 100 })}`,
            ...overrides
        };
    },

    generateMultiple(count = 15) {
        const buildings = [];
        for (let i = 0; i < count; i++) {
            buildings.push(this.generateBuilding());
        }
        return buildings;
    },

    generateBalancedBuildings(total = 20) {
        const buildings = [];
        const types = this.buildingTypes;
        const perType = Math.floor(total / types.length);

        types.forEach(type => {
            for (let i = 0; i < perType; i++) {
                buildings.push(this.generateBuilding({ buildingType: type }));
            }
        });

        return buildings;
    }
};

module.exports = BuildingFactory; 