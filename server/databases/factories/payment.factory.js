const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

const PaymentFactory = {
    paymentStatuses: ['UNPAID', 'PAID', 'PENDING', 'SETTLED', 'EXPIRED'],
    paymentMethods: ['CREDIT_CARD', 'BANK_TRANSFER', 'E_WALLET', 'QRIS'],

    generatePayment(overrides = {}) {
        const paymentDate = faker.date.past({ years: 1 });
        const amount = faker.number.int({ min: 100000, max: 1000000 });

        return {
            id: uuidv4(),
            xenditTransactionId: `xendit_${faker.string.alphanumeric(20)}`,
            invoiceNumber: this.generateInvoiceNumber(),
            paymentDate: moment(paymentDate).format('DD-MM-YYYY'),
            paymentAmount: amount,
            totalAmount: amount,
            paymentMethod: faker.helpers.arrayElement(this.paymentMethods),
            paymentUrl: `https://checkout.xendit.co/web/${faker.string.alphanumeric(30)}`,
            snapToken: faker.string.alphanumeric(50),
            paymentStatus: faker.helpers.arrayElement(this.paymentStatuses),
            ...overrides
        };
    },

    generateInvoiceNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = faker.string.numeric(4);

        return `INV-${year}${month}${day}-${random}`;
    },

    generatePaymentForBooking(bookingId, overrides = {}) {
        return this.generatePayment({
            bookingId,
            ...overrides
        });
    },

    generateMultiple(count = 25) {
        const payments = [];
        for (let i = 0; i < count; i++) {
            payments.push(this.generatePayment());
        }
        return payments;
    },

    generateSuccessfulPayments(count = 15) {
        const payments = [];
        for (let i = 0; i < count; i++) {
            payments.push(this.generatePayment({
                paymentStatus: 'PAID',
                paymentMethod: faker.helpers.arrayElement(this.paymentMethods)
            }));
        }
        return payments;
    },

    generateWithDifferentStatuses(total = 30) {
        const payments = [];
        const statusDistribution = {
            'PAID': 0.6,
            'PENDING': 0.2,
            'UNPAID': 0.1,
            'EXPIRED': 0.1
        };

        Object.entries(statusDistribution).forEach(([status, percentage]) => {
            const count = Math.floor(total * percentage);
            for (let i = 0; i < count; i++) {
                payments.push(this.generatePayment({ paymentStatus: status }));
            }
        });

        return payments;
    }
};

module.exports = PaymentFactory; 