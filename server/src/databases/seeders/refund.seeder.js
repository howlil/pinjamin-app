const { PrismaClient } = require('@prisma/client');
const { RefundFactory } = require('../factories');
const Logger = require('../../utils/logger.util');

const prisma = new PrismaClient();

class RefundSeeder {
    static async run() {
        Logger.info('Seeding refunds...');

        try {
            // Get some payments to create refunds for
            const payments = await prisma.payment.findMany({
                where: {
                    paymentStatus: 'PAID',
                    refund: null // No refund already associated
                }
            });

            if (payments.length === 0) {
                Logger.info('No eligible payments found for refunds.');
                return true;
            }

            // Create refunds for 20% of paid payments
            const refundCount = Math.ceil(payments.length * 0.2);
            const selectedPayments = payments
                .sort(() => 0.5 - Math.random()) // shuffle payments
                .slice(0, refundCount);

            for (const payment of selectedPayments) {
                const refund = RefundFactory.create({
                    paymentId: payment.id,
                    refundAmount: payment.totalAmount
                });

                await prisma.refund.create({
                    data: refund
                });

                // Update payment status to reflect refund
                await prisma.payment.update({
                    where: { id: payment.id },
                    data: { paymentStatus: 'STOPPED' }
                });
            }

            Logger.info(`${selectedPayments.length} refunds created successfully`);
            return true;
        } catch (error) {
            Logger.error('Error seeding refunds:', { error });
            return false;
        }
    }
}

module.exports = RefundSeeder; 