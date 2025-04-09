import { Seeder } from './Seeder';
import { PrismaClient, STATUSPEMINJAMAN } from '@prisma/client';
import { PeminjamanFactory } from '../factories/PeminjamanFactory';

export class PeminjamanSeeder extends Seeder {
  private factory: PeminjamanFactory;
  
  constructor(prisma: PrismaClient) {
    super(prisma);
    this.factory = new PeminjamanFactory(prisma);
  }
  
  async run(): Promise<void> {
    console.log('Seeding peminjaman...');
    
    const gedungList = await this.prisma.gedung.findMany();
    const penggunaList = await this.prisma.pengguna.findMany({
      where: { role: 'PEMINJAM' }
    });
    
    if (gedungList.length === 0) {
      throw new Error('No gedung found. Please run GedungSeeder first.');
    }
    
    if (penggunaList.length === 0) {
      throw new Error('No peminjam found. Please run PenggunaSeeder first.');
    }
    
    // Create peminjaman for each peminjam
    for (const pengguna of penggunaList) {
      // Each user borrows 1-3 buildings randomly
      const borrowCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < borrowCount; i++) {
        const randomGedung = gedungList[Math.floor(Math.random() * gedungList.length)];
        
        await this.factory.create({
          pengguna_id: pengguna.id,
          gedung_id: randomGedung.id
        });
      }
    }
    
    // Create some approved/completed peminjaman to use for payment seeding
    for (let i = 0; i < 5; i++) {
      const randomGedung = gedungList[Math.floor(Math.random() * gedungList.length)];
      const randomPengguna = penggunaList[Math.floor(Math.random() * penggunaList.length)];
      
      await this.factory.create({
        pengguna_id: randomPengguna.id,
        gedung_id: randomGedung.id,
        status_peminjaman: STATUSPEMINJAMAN.DISETUJUI
      });
    }
    
    console.log('Peminjaman seeded successfully');
  }
}
