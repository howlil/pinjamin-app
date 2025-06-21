const { faker } = require('@faker-js/faker/locale/id_ID');

class BuildingFactory {
    static create(overrides = {}) {
        const buildingTypes = ['CLASSROOM', 'PKM', 'LABORATORY', 'MULTIFUNCTION', 'SEMINAR'];
        const buildingNames = [
            'Gedung Kuliah Bersama', 'Aula Fakultas Teknik', 'Aula Fisipol',
            'Laboratorium Komputer', 'Gedung PKM', 'Auditorium Unand',
            'Ruang Sidang Rektorat', 'Convention Hall', 'Laboratorium Bahasa',
            'Gedung D Fakultas Ekonomi', 'Aula Pascasarjana', 'Auditorium FMIPA',
            'Gedung E Fakultas Pertanian', 'Aula Profesi Kedokteran', 'Gedung F Fakultas Hukum'
        ];

        const buildingType = faker.helpers.arrayElement(buildingTypes);
        let buildingName;

        if (overrides.buildingName) {
            buildingName = overrides.buildingName;
        } else {
            buildingName = faker.helpers.arrayElement(buildingNames);
            if (buildingType === 'CLASSROOM') {
                buildingName += ` ${faker.number.int({ min: 1, max: 12 })}`;
            } else if (buildingType === 'LABORATORY') {
                buildingName = `Laboratorium ${faker.science.chemicalElement().name}`;
            }
        }

        const defaultAttributes = {
            buildingName: buildingName,
            description: faker.lorem.paragraph(),
            rentalPrice: faker.number.int({ min: 500000, max: 5000000 }),
            buildingPhoto: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/800/600`,
            capacity: faker.number.int({ min: 30, max: 500 }),
            location: `Kampus ${faker.helpers.arrayElement(['Limau Manis', 'Jati', 'Gadut'])}, Universitas Andalas`,
            buildingType: buildingType,
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

module.exports = BuildingFactory; 