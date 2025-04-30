import { Seeder } from './Seeder';
import { PrismaClient } from '@prisma/client';
import { FasilitasGedungFactory } from '../factories/FasilitasGedungFactory';

export class FasilitasGedungSeeder extends Seeder {
  private factory: FasilitasGedungFactory;

  constructor(prisma: PrismaClient) {
    super(prisma);
    this.factory = new FasilitasGedungFactory(prisma);
  }

  async run(): Promise<void> {
    console.log('Seeding fasilitas gedung connections...');

    // Get all buildings
    const gedungList = await this.prisma.gedung.findMany();
    if (gedungList.length === 0) {
      throw new Error('No buildings found. Please run GedungSeeder first.');
    }

    // Get all facilities
    const fasilitasList = await this.prisma.fasilitas.findMany();
    if (fasilitasList.length === 0) {
      throw new Error('No facilities found. Please run FasilitasSeeder first.');
    }

    // Create connections for each building
    for (const gedung of gedungList) {
      // Randomly assign 3-5 facilities to each building
      const facilitiesCount = Math.floor(Math.random() * 3) + 3;
      
      // Shuffle the facilities and take a random subset
      const shuffledFacilities = [...fasilitasList]
        .sort(() => 0.5 - Math.random())
        .slice(0, facilitiesCount);
      
      // Create the connections in a transaction
      await this.prisma.$transaction(async (tx) => {
        for (const facility of shuffledFacilities) {
          try {
            // Check if connection already exists to avoid unique constraint errors
            const existingConnection = await tx.fasilitasGedung.findUnique({
              where: {
                fasilitas_id_gedung_id: {
                  fasilitas_id: facility.id,
                  gedung_id: gedung.id
                }
              }
            });
            
            if (!existingConnection) {
              await tx.fasilitasGedung.create({
                data: {
                  fasilitas_id: facility.id,
                  gedung_id: gedung.id
                }
              });
            }
          } catch (error) {
            console.error(`Error connecting facility ${facility.id} to building ${gedung.id}:`, error);
          }
        }
      });
    }

    const connectionCount = await this.prisma.fasilitasGedung.count();
    console.log(`Created ${connectionCount} facility-building connections successfully`);
  }
}