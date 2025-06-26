#!/usr/bin/env node

/**
 * Database Seeder Runner
 * 
 * Usage:
 *   node databases/run-seeder.js
 *   npm run db:seed
 */

require('dotenv').config();
const MainSeeder = require('./seeders/main.seeder');

async function runSeeder() {
    console.log('🚀 Starting Database Seeder...\n');

    const seeder = new MainSeeder();

    try {
        await seeder.run();
        console.log('\n🎉 Seeding completed successfully!');
        console.log('\nYou can now test your API with the generated dummy data.');
        console.log('\nDefault admin credentials:');
        console.log('📧 Email: admin@unand.ac.id');
        console.log('🔑 Password: password123');

        process.exit(0);
    } catch (error) {
        console.error('\n💥 Seeding failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    runSeeder();
}

module.exports = runSeeder; 