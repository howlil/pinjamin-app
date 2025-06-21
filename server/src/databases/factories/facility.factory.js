const { faker } = require('@faker-js/faker/locale/id_ID');

class FacilityFactory {
    static create(overrides = {}) {
        const facilities = [
            { name: 'AC', icon: 'AirConditioning' },
            { name: 'Proyektor', icon: 'Projector' },
            { name: 'Sound System', icon: 'SpeakerWave' },
            { name: 'Wi-Fi', icon: 'Wifi' },
            { name: 'Toilet', icon: 'Bath' },
            { name: 'Meja Konferensi', icon: 'TableMeetingBoard' },
            { name: 'Kursi', icon: 'Armchair' },
            { name: 'Podium', icon: 'PodiumLecture' },
            { name: 'Whiteboard', icon: 'PenTool' },
            { name: 'LCD Screen', icon: 'Monitor' },
            { name: 'Microphone', icon: 'Mic2' },
            { name: 'Dispenser Air Minum', icon: 'Droplets' },
            { name: 'CCTV', icon: 'Camera' },
            { name: 'Papan Tulis', icon: 'School2' },
            { name: 'Speaker', icon: 'Speaker' }
        ];

        const facility = overrides.facilityName
            ? facilities.find(f => f.name === overrides.facilityName) || facilities[0]
            : faker.helpers.arrayElement(facilities);

        const defaultAttributes = {
            facilityName: facility.name,
            iconUrl: facility.icon,
        };

        return {
            ...defaultAttributes,
            ...overrides,
        };
    }

    static createMany(count = 1, overrides = {}) {
        // Make sure we don't have duplicate facilities when generating many
        if (count > 15) count = 15; // Limit to available facilities

        const facilities = [];
        const usedNames = new Set();

        for (let i = 0; i < count; i++) {
            let facility;
            do {
                facility = this.create(overrides);
            } while (usedNames.has(facility.facilityName));

            usedNames.add(facility.facilityName);
            facilities.push(facility);
        }

        return facilities;
    }
}

module.exports = FacilityFactory; 