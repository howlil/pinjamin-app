/**
 * Database Factories & Seeders Index
 * 
 * Centralized export untuk semua factory dan seeder
 */

// ======== FACTORIES ========
const UserFactory = require('./factories/user.factory');
const FacilityFactory = require('./factories/facility.factory');
const BuildingFactory = require('./factories/building.factory');
const BuildingManagerFactory = require('./factories/building-manager.factory');
const BookingFactory = require('./factories/booking.factory');
const PaymentFactory = require('./factories/payment.factory');
const NotificationFactory = require('./factories/notification.factory');

// ======== SEEDERS ========
const MainSeeder = require('./seeders/main.seeder');
const UserSeeder = require('./seeders/user.seeder');
const BuildingSeeder = require('./seeders/building.seeder');
const TestSeeder = require('./seeders/test.seeder');

// ======== EXPORTS ========
module.exports = {
    // Factories
    factories: {
        UserFactory,
        FacilityFactory,
        BuildingFactory,
        BuildingManagerFactory,
        BookingFactory,
        PaymentFactory,
        NotificationFactory
    },

    // Seeders
    seeders: {
        MainSeeder,
        UserSeeder,
        BuildingSeeder,
        TestSeeder
    },

    // Quick access
    UserFactory,
    FacilityFactory,
    BuildingFactory,
    BookingFactory,
    PaymentFactory,
    NotificationFactory,
    MainSeeder,
    TestSeeder
};

