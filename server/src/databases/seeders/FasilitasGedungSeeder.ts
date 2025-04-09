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
    console.log('Seeding fasilitas gedung...');
    
    const gedungList = await this.prisma.gedung.findMany();
    
    if (gedungList.length === 0) {
      throw new Error('No gedung found. Please run GedungSeeder first.');
    }
    
    const facilityOptions = [
      { nama: 'Wi-Fi', icon: 'wifi.svg' },
      { nama: 'Parkir', icon: 'parking.svg' },
      { nama: 'AC', icon: 'ac.svg' },
      { nama: 'Proyektor', icon: 'projector.svg' },
      { nama: 'Sound System', icon: 'sound.svg' },
      { nama: 'Toilet', icon: 'toilet.svg' },
      { nama: 'Kursi', icon: 'chair.svg' },
      { nama: 'Meja', icon: 'table.svg' },
      { nama: 'Lift', icon: 'elevator.svg' },
      { nama: 'CCTV', icon: 'cctv.svg' },
    ];
    
    for (const gedung of gedungList) {
      // Add 3-5 random facilities to each building
      const facilitiesCount = Math.floor(Math.random() * 3) + 3;
      
      // Shuffle and take random facilities
      const shuffled = [...facilityOptions].sort(() => 0.5 - Math.random());
      const selectedFacilities = shuffled.slice(0, facilitiesCount);
      
      for (const facility of selectedFacilities) {
        await this.prisma.fasilitasGedung.create({
          data: {
            nama_fasilitas: facility.nama,
            icon_url: facility.icon,
            gedung_id: gedung.id
          }
        });
      }
    }
    
    console.log('Fasilitas gedung seeded successfully');
  }
}
