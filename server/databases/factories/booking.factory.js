const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

const BookingFactory = {
    bookingStatuses: ['PROCESSING', 'APPROVED', 'REJECTED', 'COMPLETED'],

    activityNames: [
        'Seminar Nasional IT', 'Workshop Design Thinking', 'Pelatihan Leadership',
        'Rapat Koordinasi BEM', 'Kuliah Tamu Kewirausahaan', 'Diskusi Ilmiah',
        'Presentasi Tugas Akhir', 'Ujian Sidang Skripsi', 'Meeting Project',
        'Training Soft Skills', 'Lomba Debat', 'Kompetisi Programming',
        'Sosialisasi Beasiswa', 'Expo Karya Mahasiswa', 'Forum Diskusi'
    ],

    generateBooking(overrides = {}) {
        const startDate = faker.date.future({ years: 1 });
        const endDate = faker.datatype.boolean(0.3) ?
            moment(startDate).add(faker.number.int({ min: 1, max: 3 }), 'days').toDate() :
            startDate;

        const startHour = faker.number.int({ min: 8, max: 16 });
        const duration = faker.number.int({ min: 2, max: 6 });
        const endHour = Math.min(startHour + duration, 22);

        return {
            id: uuidv4(),
            activityName: faker.helpers.arrayElement(this.activityNames),
            startDate: moment(startDate).format('DD-MM-YYYY'),
            endDate: moment(endDate).format('DD-MM-YYYY'),
            startTime: `${startHour.toString().padStart(2, '0')}:00`,
            endTime: `${endHour.toString().padStart(2, '0')}:00`,
            proposalLetter: `https://example.com/proposals/${uuidv4()}.pdf`,
            bookingStatus: faker.helpers.arrayElement(this.bookingStatuses),
            rejectionReason: null,
            ...overrides
        };
    },

    generateBookingForUser(userId, buildingId, overrides = {}) {
        return this.generateBooking({
            userId,
            buildingId,
            ...overrides
        });
    },

    generateMultiple(count = 30) {
        const bookings = [];
        for (let i = 0; i < count; i++) {
            bookings.push(this.generateBooking());
        }
        return bookings;
    },

    generateWithDifferentStatuses(total = 40) {
        const bookings = [];
        const statusDistribution = {
            'PROCESSING': 0.3,
            'APPROVED': 0.4,
            'COMPLETED': 0.2,
            'REJECTED': 0.1
        };

        Object.entries(statusDistribution).forEach(([status, percentage]) => {
            const count = Math.floor(total * percentage);
            for (let i = 0; i < count; i++) {
                const booking = this.generateBooking({ bookingStatus: status });

                // Add rejection reason for rejected bookings
                if (status === 'REJECTED') {
                    booking.rejectionReason = faker.helpers.arrayElement([
                        'Dokumen proposal tidak lengkap',
                        'Bentrok dengan acara lain',
                        'Kapasitas ruangan tidak sesuai',
                        'Waktu penggunaan di luar ketentuan',
                        'Kegiatan tidak sesuai dengan fungsi ruangan'
                    ]);
                }

                bookings.push(booking);
            }
        });

        return bookings;
    },

    generatePastBookings(count = 20) {
        const bookings = [];
        for (let i = 0; i < count; i++) {
            const pastDate = faker.date.past({ years: 1 });
            bookings.push(this.generateBooking({
                startDate: moment(pastDate).format('DD-MM-YYYY'),
                endDate: moment(pastDate).format('DD-MM-YYYY'),
                bookingStatus: faker.helpers.arrayElement(['COMPLETED', 'APPROVED'])
            }));
        }
        return bookings;
    }
};

module.exports = BookingFactory; 