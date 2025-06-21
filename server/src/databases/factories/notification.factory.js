const { faker } = require('@faker-js/faker/locale/id_ID');
const moment = require('moment');

class NotificationFactory {
    static create(overrides = {}) {
        const notificationType = faker.helpers.arrayElement(['PAYMENT', 'BOOKING']);

        // Generate notification titles based on type
        let title;
        if (notificationType === 'PAYMENT') {
            title = faker.helpers.arrayElement([
                'Pembayaran Berhasil',
                'Pembayaran Tertunda',
                'Pembayaran Gagal',
                'Tagihan Jatuh Tempo',
                'Pengembalian Dana'
            ]);
        } else { // BOOKING
            title = faker.helpers.arrayElement([
                'Peminjaman Disetujui',
                'Peminjaman Ditolak',
                'Peminjaman Perlu Review',
                'Perubahan Status Peminjaman',
                'Pengingat Jadwal Peminjaman'
            ]);
        }

        // Generate message based on title
        let message;
        switch (title) {
            case 'Pembayaran Berhasil':
                message = 'Pembayaran untuk peminjaman gedung berhasil dikonfirmasi.';
                break;
            case 'Pembayaran Tertunda':
                message = 'Pembayaran Anda masih dalam proses. Silakan tunggu konfirmasi selanjutnya.';
                break;
            case 'Pembayaran Gagal':
                message = 'Mohon maaf, pembayaran Anda tidak dapat diproses. Silakan coba metode pembayaran lain.';
                break;
            case 'Tagihan Jatuh Tempo':
                message = 'Pembayaran untuk peminjaman gedung akan segera jatuh tempo. Segera selesaikan pembayaran Anda.';
                break;
            case 'Pengembalian Dana':
                message = 'Permohonan pengembalian dana Anda telah diproses dan sedang dalam peninjauan.';
                break;
            case 'Peminjaman Disetujui':
                message = 'Selamat! Pengajuan peminjaman gedung Anda telah disetujui.';
                break;
            case 'Peminjaman Ditolak':
                message = 'Mohon maaf, pengajuan peminjaman gedung Anda tidak dapat disetujui.';
                break;
            case 'Peminjaman Perlu Review':
                message = 'Pengajuan peminjaman gedung Anda sedang dalam tahap peninjauan.';
                break;
            case 'Perubahan Status Peminjaman':
                message = 'Status peminjaman gedung Anda telah diperbarui. Silakan cek detail peminjaman.';
                break;
            case 'Pengingat Jadwal Peminjaman':
                message = 'Pengingat: Jadwal peminjaman gedung Anda akan segera berlangsung.';
                break;
            default:
                message = 'Anda memiliki pemberitahuan baru terkait peminjaman gedung.';
        }

        const defaultAttributes = {
            userId: overrides.userId || faker.string.uuid(),
            notificationType: notificationType,
            title: title,
            message: message,
            date: moment().format('DD-MM-YYYY'),
            readStatus: faker.helpers.arrayElement([0, 1]), // 0 = unread, 1 = read
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

module.exports = NotificationFactory; 