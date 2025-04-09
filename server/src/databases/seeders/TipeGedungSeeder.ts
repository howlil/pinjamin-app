import { Seeder } from './Seeder';
import { PrismaClient } from '@prisma/client';
import { TipeGedungFactory } from '../factories/TipeGedungFactory';

export class TipeGedungSeeder extends Seeder {
  private factory: TipeGedungFactory;
  
  constructor(prisma: PrismaClient) {
    super(prisma);
    this.factory = new TipeGedungFactory(prisma);
  }
  
  async run(): Promise<void> {
    console.log('Seeding tipe gedung...');
    
    const tipeGedungData = [
      { nama_tipe_gedung: 'Aula' },
      { nama_tipe_gedung: 'Ruang Pertemuan' },
      { nama_tipe_gedung: 'Lapangan' },
      { nama_tipe_gedung: 'Auditorium' },
      { nama_tipe_gedung: 'Laboratorium' },
    ];
    
    for (const tipe of tipeGedungData) {
      await this.prisma.tipeGedung.create({
        data: tipe
      });
    }
    
    console.log('Tipe gedung seeded successfully');
  }
}
