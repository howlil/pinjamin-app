// src/database/reset.ts
import { PrismaClient } from '@prisma/client';

const resetDatabase = async () => {
  const prisma = new PrismaClient();
  
  try {
    console.log('Resetting database...');
    

    await prisma.refund.deleteMany();
    await prisma.pembayaran.deleteMany();
    await prisma.peminjaman.deleteMany();
    await prisma.penanggungJawabGedung.deleteMany();
    await prisma.fasilitasGedung.deleteMany();
    await prisma.fasilitas.deleteMany();
    await prisma.gedung.deleteMany();
    await prisma.tipeGedung.deleteMany();
    await prisma.notifikasi.deleteMany();
    await prisma.token.deleteMany();
    await prisma.pengguna.deleteMany();
    
    console.log('Database reset completed successfully!');
  } catch (error) {
    console.error('Error resetting database:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
};

// Handle any uncaught errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

resetDatabase();