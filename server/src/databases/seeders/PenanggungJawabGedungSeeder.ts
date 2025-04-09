import { Seeder } from './Seeder';
import { PrismaClient } from '@prisma/client';
import { PenanggungJawabGedungFactory } from '../factories/PenanggungJawabGedungFactory';

export class PenanggungJawabGedungSeeder extends Seeder {
  private factory: PenanggungJawabGedungFactory;
  
  constructor(prisma: PrismaClient) {
    super(prisma);
    this.factory = new PenanggungJawabGedungFactory(prisma);
  }
  
  async run(): Promise<void> {
    console.log('Seeding penanggung jawab gedung...');
    
    const gedungList = await this.prisma.gedung.findMany();
    
    if (gedungList.length === 0) {
      throw new Error('No gedung found. Please run GedungSeeder first.');
    }
    
    for (const gedung of gedungList) {
      // Add 1-2 responsible people per building
      const count = Math.floor(Math.random() * 2) + 1;
      
      for (let i = 0; i < count; i++) {
        await this.factory.create({
          gedung_id: gedung.id
        });
      }
    }
    
    console.log('Penanggung jawab gedung seeded successfully');
  }
}
