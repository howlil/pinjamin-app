const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');

const FacilityFactory = {
    // Predefined facilities list
    facilitiesList: [
        { name: 'WiFi', icon: '📶' },
        { name: 'Proyektor', icon: '📽️' },
        { name: 'AC', icon: '❄️' },
        { name: 'Sound System', icon: '🔊' },
        { name: 'Whiteboard', icon: '📋' },
        { name: 'TV LED', icon: '📺' },
        { name: 'Mikrofon', icon: '🎤' },
        { name: 'Kursi', icon: '🪑' },
        { name: 'Meja', icon: '🪑' },
        { name: 'Laptop', icon: '💻' },
        { name: 'Printer', icon: '🖨️' },
        { name: 'Scanner', icon: '📄' },
        { name: 'CCTV', icon: '📹' },
        { name: 'Parkir', icon: '🚗' },
        { name: 'Toilet', icon: '🚻' },
        { name: 'Mushola', icon: '🕌' },
        { name: 'Kantin', icon: '🍽️' },
        { name: 'Lift', icon: '🛗' }
    ],

    // Generate single facility
    generateFacility(overrides = {}) {
        const facility = faker.helpers.arrayElement(this.facilitiesList);

        return {
            id: uuidv4(),
            facilityName: facility.name,
            iconUrl: facility.icon,
            ...overrides
        };
    },

    // Generate predefined facilities
    generatePredefinedFacilities() {
        return this.facilitiesList.map(facility => ({
            id: uuidv4(),
            facilityName: facility.name,
            iconUrl: facility.icon
        }));
    },

    // Generate random facilities
    generateMultiple(count = 10) {
        const facilities = [];
        for (let i = 0; i < count; i++) {
            facilities.push(this.generateFacility());
        }
        return facilities;
    },

    // Generate facilities for specific building types
    generateForBuildingType(buildingType) {
        let facilitiesForType = [];

        switch (buildingType) {
            case 'CLASSROOM':
                facilitiesForType = ['WiFi', 'Proyektor', 'AC', 'Whiteboard', 'Kursi', 'Meja'];
                break;
            case 'LABORATORY':
                facilitiesForType = ['WiFi', 'AC', 'Laptop', 'Printer', 'Meja', 'Kursi', 'CCTV'];
                break;
            case 'SEMINAR':
                facilitiesForType = ['WiFi', 'Proyektor', 'Sound System', 'Mikrofon', 'AC', 'Kursi'];
                break;
            case 'MULTIFUNCTION':
                facilitiesForType = ['WiFi', 'Proyektor', 'AC', 'Sound System', 'Mikrofon', 'TV LED', 'Kursi', 'Meja'];
                break;
            case 'PKM':
                facilitiesForType = ['WiFi', 'AC', 'Kursi', 'Meja', 'Whiteboard'];
                break;
            default:
                facilitiesForType = ['WiFi', 'AC', 'Kursi'];
        }

        return facilitiesForType.map(facilityName => {
            const facility = this.facilitiesList.find(f => f.name === facilityName);
            return {
                id: uuidv4(),
                facilityName: facility.name,
                iconUrl: facility.icon
            };
        });
    }
};

module.exports = FacilityFactory; 