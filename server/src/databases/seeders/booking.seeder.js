const { PrismaClient } = require('@prisma/client');
const { BookingFactory, PaymentFactory } = require('../factories');
const Logger = require('../../utils/logger.util');

const prisma = new PrismaClient();

class BookingSeeder {
    static async run() {
        Logger.info('Seeding bookings...');

        try {
            // Get all users with BORROWER role
            const borrowers = await prisma.user.findMany({
                where: {
                    role: 'BORROWER'
                }
            });

            if (borrowers.length === 0) {
                throw new Error('No borrower users found. Run user seeder first.');
            }

            // Get all buildings
            const buildings = await prisma.building.findMany();

            if (buildings.length === 0) {
                throw new Error('No buildings found. Run building seeder first.');
            }

            // Create 15-20 bookings
            const bookingCount = Math.floor(Math.random() * 6) + 15; // 15-20 bookings

            for (let i = 0; i < bookingCount; i++) {
                // Select a random borrower and building
                const randomBorrower = borrowers[Math.floor(Math.random() * borrowers.length)];
                const randomBuilding = buildings[Math.floor(Math.random() * buildings.length)];

                // Create booking with a specific user and building
                const booking = BookingFactory.create({
                    userId: randomBorrower.id,
                    buildingId: randomBuilding.id
                });

                // Save the booking
                const savedBooking = await prisma.booking.create({
                    data: booking
                });

                // Only create payment for bookings that are not rejected
                if (savedBooking.bookingStatus !== 'REJECTED') {
                    // Create payment for this booking
                    const paymentStatus = savedBooking.bookingStatus === 'APPROVED' ? 'PAID' : 'PENDING';
                    const payment = PaymentFactory.create({
                        bookingId: savedBooking.id,
                        paymentStatus: paymentStatus,
                        paymentAmount: randomBuilding.rentalPrice,
                        totalAmount: randomBuilding.rentalPrice
                    });

                    await prisma.payment.create({
                        data: payment
                    });
                }
            }

            Logger.info('Bookings and payments created successfully');
            return true;
        } catch (error) {
            Logger.error('Error seeding bookings:', { error });
            return false;
        }
    }
}

module.exports = BookingSeeder; 