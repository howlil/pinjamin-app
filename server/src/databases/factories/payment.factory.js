const { faker } = require('@faker-js/faker/locale/id_ID');
const moment = require('moment');

class PaymentFactory {
    static create(overrides = {}) {
        const paymentMethods = ['CREDIT_CARD', 'BANK_TRANSFER', 'VIRTUAL_ACCOUNT', 'E_WALLET'];
        const paymentAmount = faker.number.int({ min: 500000, max: 5000000 });
        const totalAmount = paymentAmount;

        // Generate current date in DD-MM-YYYY format
        const paymentDate = moment().format('DD-MM-YYYY');

        // Generate invoice number
        const getInvoiceNumber = () => {
            const prefix = 'INV';
            const date = moment().format('YYYYMMDD');
            const randomDigits = faker.string.numeric(4);
            return `${prefix}/${date}/${randomDigits}`;
        };

        const paymentStatuses = ['UNPAID', 'PAID', 'PENDING', 'SETTLED', 'EXPIRED', 'ACTIVE', 'STOPPED'];
        const paymentStatus = overrides.paymentStatus || faker.helpers.arrayElement(paymentStatuses);

        const defaultAttributes = {
            xenditTransactionId: `xnd_${faker.string.alphanumeric(16)}`,
            bookingId: overrides.bookingId || faker.string.uuid(),
            invoiceNumber: getInvoiceNumber(),
            paymentDate: paymentDate,
            paymentAmount: paymentAmount,
            totalAmount: totalAmount,
            paymentMethod: faker.helpers.arrayElement(paymentMethods),
            paymentUrl: `https://checkout-staging.xendit.co/v2/${faker.string.alphanumeric(24)}`,
            snapToken: faker.string.alphanumeric(32),
            paymentStatus: paymentStatus,
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

module.exports = PaymentFactory; 