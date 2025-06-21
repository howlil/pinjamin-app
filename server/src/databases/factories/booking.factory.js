const { faker } = require('@faker-js/faker/locale/id_ID');
const moment = require('moment');

class BookingFactory {
  static create(overrides = {}) {
    const activityNames = [
      'Seminar Nasional Informatika',
      'Workshop Kewirausahaan',
      'Kuliah Umum Teknologi Informasi',
      'Rapat Senat Fakultas',
      'Diskusi Panel Akademisi',
      'Konferensi Tahunan Mahasiswa',
      'Pelatihan Kepemimpinan',
      'Musyawarah Besar Organisasi',
      'Seminar Kesehatan Mental',
      'Kuliah Tamu Pakar Internasional',
      'Workshop Design Thinking',
      'Presentasi Tugas Akhir',
      'Sidang Skripsi',
      'Kompetisi Debat Akademik',
      'Festival Budaya Kampus'
    ];

    // Generate dates with proper format
    const startDate = moment().add(faker.number.int({ min: 1, max: 30 }), 'days').format('DD-MM-YYYY');
    // Maybe end date is the same day or a few days later
    const endDate = faker.helpers.maybe(() => {
      return moment(startDate, 'DD-MM-YYYY')
        .add(faker.number.int({ min: 1, max: 3 }), 'days')
        .format('DD-MM-YYYY');
    });

    // Generate start and end times
    const startHour = faker.number.int({ min: 8, max: 16 });
    const endHour = faker.number.int({ min: startHour + 1, max: startHour + 4 });
    const startTime = `${startHour.toString().padStart(2, '0')}:00`;
    const endTime = `${endHour.toString().padStart(2, '0')}:00`;

    const bookingStatus = faker.helpers.arrayElement(['PROCESSING', 'APPROVED', 'REJECTED', 'COMPLETED']);

    const defaultAttributes = {
      userId: overrides.userId || faker.string.uuid(),
      buildingId: overrides.buildingId || faker.string.uuid(),
      activityName: faker.helpers.arrayElement(activityNames),
      startDate: startDate,
      endDate: endDate,
      startTime: startTime,
      endTime: endTime,
      proposalLetter: `uploads/proposals/proposal_${faker.string.alphanumeric(10)}.pdf`,
      bookingStatus: bookingStatus,
      rejectionReason: bookingStatus === 'REJECTED' ? faker.helpers.arrayElement([
        'Jadwal bentrok dengan kegiatan lain',
        'Dokumen proposal tidak lengkap',
        'Kegiatan tidak sesuai dengan fungsi gedung',
        'Kapasitas melebihi batas maksimum'
      ]) : null,
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

module.exports = BookingFactory; 