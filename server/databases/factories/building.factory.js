const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');

/**
 * Building Factory dengan tarif berdasarkan artikel Genta Andalas:
 * "Polemik Tarif Peminjaman Fasilitas Ruangan di UNAND Diluar Jam Kerja"
 * https://www.gentaandalas.com/2025/02/24/polemik-tarif-peminjaman-fasilitas-ruangan-di-unand-diluar-jam-kerja/
 * 
 * Tarif untuk organisasi mahasiswa (ormawa):
 * - Auditorium: Rp1.050.000 per hari
 * - Convention Hall: Rp500.000
 * - Ruang Seminar PKM, FE: Rp300.000
 * - Ruang Seminar Perpustakaan: Rp550.000
 * - Ruang Kelas: Rp50.000 per hari
 */
const BuildingFactory = {
    buildingTypes: ['CLASSROOM', 'LABORATORY', 'SEMINAR', 'MULTIFUNCTION', 'PKM'],

    buildingNames: {
        CLASSROOM: ['Ruang Kelas A101', 'Ruang Kelas B202', 'Ruang Kuliah Utara', 'Ruang Kelas C301', 'Ruang Belajar D401'],
        LABORATORY: ['Lab Komputer 1', 'Lab Kimia', 'Lab Fisika', 'Lab Biologi', 'Lab Bahasa'],
        SEMINAR: ['Ruang Seminar PKM', 'Ruang Seminar FE', 'Ruang Seminar Perpustakaan', 'Aula Seminar', 'Ruang Sidang'],
        MULTIFUNCTION: ['Auditorium', 'Convention Hall', 'Aula Utama', 'Gedung Serbaguna', 'Ruang Multifungsi'],
        PKM: ['Ruang PKM 1', 'Creative Space', 'Workshop PKM', 'Studio Kreatif', 'Innovation Hub']
    },

    // Tarif berdasarkan artikel Genta Andalas tentang UNAND
    rentalPrices: {
        CLASSROOM: 50000,      // Ruang Kelas: Rp50.000 per hari
        LABORATORY: 300000,    // Lab setara dengan ruang seminar
        SEMINAR: 300000,       // Ruang Seminar PKM/FE: Rp300.000 
        MULTIFUNCTION: 775000, // Rata-rata antara Convention Hall (500k) dan Auditorium (1.05jt)
        PKM: 300000           // Ruang PKM setara dengan seminar
    },

    // Harga khusus untuk gedung premium
    premiumPrices: {
        'Auditorium': 1050000,              // Auditorium: Rp1.050.000 per hari
        'Convention Hall': 500000,          // Convention Hall: Rp500.000
        'Ruang Seminar Perpustakaan': 550000, // Ruang Seminar Perpustakaan: Rp550.000
        'Ruang Seminar PKM': 300000,        // Ruang Seminar PKM: Rp300.000
        'Ruang Seminar FE': 300000          // Ruang Seminar FE: Rp300.000
    },

    locations: [
        'Gedung A Lantai 1', 'Gedung B Lantai 2', 'Gedung C Lantai 3',
        'Gedung Rektorat', 'Student Center', 'Fakultas MIPA',
        'Fakultas Ekonomi', 'Perpustakaan Pusat', 'Gedung PKM'
    ],

    generateBuilding(overrides = {}) {
        const buildingType = overrides.buildingType || faker.helpers.arrayElement(this.buildingTypes);
        const names = this.buildingNames[buildingType];
        const buildingName = faker.helpers.arrayElement(names);

        // Gunakan harga premium jika ada, kalau tidak gunakan harga default berdasarkan tipe
        let rentalPrice = this.premiumPrices[buildingName] || this.rentalPrices[buildingType];

        // Sedikit variasi harga untuk menambah realisme (±10%)
        const variation = faker.number.float({ min: 0.9, max: 1.1 });
        rentalPrice = Math.round(rentalPrice * variation);

        // Kapasitas disesuaikan dengan tipe gedung
        let capacity;
        switch (buildingType) {
            case 'CLASSROOM':
                capacity = faker.number.int({ min: 20, max: 50 });
                break;
            case 'LABORATORY':
                capacity = faker.number.int({ min: 15, max: 40 });
                break;
            case 'SEMINAR':
                capacity = faker.number.int({ min: 30, max: 100 });
                break;
            case 'MULTIFUNCTION':
                // Auditorium lebih besar dari Convention Hall
                capacity = buildingName === 'Auditorium' ?
                    faker.number.int({ min: 300, max: 500 }) :
                    faker.number.int({ min: 100, max: 300 });
                break;
            case 'PKM':
                capacity = faker.number.int({ min: 15, max: 50 });
                break;
            default:
                capacity = faker.number.int({ min: 20, max: 100 });
        }

        return {
            id: uuidv4(),
            buildingName,
            description: this.generateDescription(buildingType, buildingName),
            rentalPrice,
            capacity,
            location: faker.helpers.arrayElement(this.locations),
            buildingType,
            buildingPhoto: `https://picsum.photos/800/600?random=${faker.number.int({ min: 1, max: 100 })}`,
            ...overrides
        };
    },

    generateDescription(buildingType, buildingName) {
        const descriptions = {
            CLASSROOM: `Ruang kelas modern dengan fasilitas AC, proyektor, dan sound system yang nyaman untuk kegiatan pembelajaran.`,
            LABORATORY: `Laboratorium lengkap dengan peralatan modern dan standar keamanan tinggi untuk praktikum dan penelitian.`,
            SEMINAR: `Ruang seminar dengan fasilitas presentasi lengkap, AC, dan tata suara yang baik untuk acara akademik.`,
            MULTIFUNCTION: buildingName === 'Auditorium' ?
                `Auditorium besar dengan kapasitas ratusan orang, dilengkapi panggung, sistem audio visual canggih, dan AC sentral.` :
                buildingName === 'Convention Hall' ?
                    `Convention hall dengan desain modern, cocok untuk konferensi, seminar besar, dan acara resmi universitas.` :
                    `Ruang serbaguna yang dapat disesuaikan untuk berbagai keperluan acara kampus dengan fasilitas lengkap.`,
            PKM: `Ruang kreatif untuk kegiatan Program Kreativitas Mahasiswa dengan fasilitas workspace modern dan fleksibel.`
        };

        return descriptions[buildingType] || `Fasilitas ${buildingType.toLowerCase()} dengan standar universitas yang lengkap dan modern.`;
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

        // Pastikan ada gedung-gedung premium dari artikel UNAND
        const premiumBuildings = [
            { buildingName: 'Auditorium', buildingType: 'MULTIFUNCTION' },
            { buildingName: 'Convention Hall', buildingType: 'MULTIFUNCTION' },
            { buildingName: 'Ruang Seminar PKM', buildingType: 'SEMINAR' },
            { buildingName: 'Ruang Seminar FE', buildingType: 'SEMINAR' },
            { buildingName: 'Ruang Seminar Perpustakaan', buildingType: 'SEMINAR' }
        ];

        // Tambahkan gedung premium terlebih dahulu
        premiumBuildings.forEach(premium => {
            buildings.push(this.generateBuilding(premium));
        });

        // Sisa kuota dibagi rata untuk tipe lainnya
        const remaining = total - premiumBuildings.length;
        const types = this.buildingTypes;
        const perType = Math.floor(remaining / types.length);

        types.forEach(type => {
            for (let i = 0; i < perType; i++) {
                buildings.push(this.generateBuilding({ buildingType: type }));
            }
        });

        // Tambahkan sisa jika ada
        const extraCount = remaining - (perType * types.length);
        for (let i = 0; i < extraCount; i++) {
            const randomType = faker.helpers.arrayElement(types);
            buildings.push(this.generateBuilding({ buildingType: randomType }));
        }

        return buildings;
    }
};

module.exports = BuildingFactory; 