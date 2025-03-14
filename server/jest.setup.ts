import { prisma } from "./src/configs/db.config";
import { beforeEach, beforeAll,afterEach, afterAll } from "@jest/globals";
import { TestLogger } from './src/utils/test-logger.util';


TestLogger.log('Jest test suite started');


beforeEach(async () => {
  
  try {
    await prisma.refund.deleteMany({});
    await prisma.pembayaran.deleteMany({});
    await prisma.peminjaman.deleteMany({});
    await prisma.token.deleteMany({});
    await prisma.notifikasi.deleteMany({});
    await prisma.fasilitasGedung.deleteMany({});
    await prisma.penanggungJawabGedung.deleteMany({});
    await prisma.gedung.deleteMany({});
    await prisma.tipeGedung.deleteMany({});
    await prisma.pengguna.deleteMany({});
    
  } catch (error) {
    
    throw error;
  }
});


afterAll(async () => {
  await prisma.$disconnect();
  TestLogger.log('Jest test suite completed');
});