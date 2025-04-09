import { Seeder } from './Seeder';
import { PrismaClient } from '@prisma/client';
import { GedungFactory } from '../factories/GedungFactory';

export class GedungSeeder extends Seeder {
  private factory: GedungFactory;
  
  constructor(prisma: PrismaClient) {
    super(prisma);
    this.factory = new GedungFactory(prisma);
  }
  
  async run(): Promise<void> {
    console.log('Seeding gedung...');
    
    const tipeGedungList = await this.prisma.tipeGedung.findMany();
    
    if (tipeGedungList.length === 0) {
      throw new Error('No tipe gedung found. Please run TipeGedungSeeder first.');
    }
    
    for (const tipeGedung of tipeGedungList) {
      // Create 2 buildings for each building type
      for (let i = 0; i < 2; i++) {
        await this.factory.create({
          tipe_gedung_id: tipeGedung.id
        });
      }
    }
    
    console.log('Gedung seeded successfully');
  }
}