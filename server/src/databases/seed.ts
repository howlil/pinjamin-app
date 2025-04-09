import { DatabaseSeeder } from './seeders/DatabaseSeeder';

const seedDatabase = async () => {
  const seeder = new DatabaseSeeder();
  await seeder.run();
  process.exit(0);
};

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

seedDatabase();