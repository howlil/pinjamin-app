const { faker } = require('@faker-js/faker/locale/id_ID');
const moment = require('moment');

class RefundFactory {
    static create(overrides = {}) {
        const refundAmount = faker.number.int({ min: 50000, max: 5000000 });

        const refundStatuses = ['SUCCEEDED', 'FAILED', 'PENDING'];
        const refundStatus = overrides.refundStatus || faker.helpers.arrayElement(refundStatuses);

        const refundReasons = [
            'Pembatalan acara oleh pemohon',
            'Gedung tidak tersedia pada jadwal yang diminta',
            'Pembayaran ganda yang perlu dikembalikan',
            'Keadaan force majeure (cuaca ekstrem, bencana alam)',
            'Pembatalan oleh pihak pengelola gedung',
            'Kesalahan administratif',
            'Perubahan jadwal yang tidak dapat diakomodasi'
        ];

        const defaultAttributes = {
            paymentId: overrides.paymentId || faker.string.uuid(),
            refundAmount: refundAmount,
            refundStatus: refundStatus,
            refundReason: faker.helpers.arrayElement(refundReasons),
            xenditRefundTransactionId: `xnd_rf_${faker.string.alphanumeric(16)}`,
            refundDate: moment().format('DD-MM-YYYY'),
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

module.exports = RefundFactory; 