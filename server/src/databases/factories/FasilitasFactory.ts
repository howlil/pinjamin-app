import { Factory } from './Factory';
import { PrismaClient, Prisma } from '@prisma/client';

export class FasilitasFactory extends Factory<Prisma.FasilitasCreateInput> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  definition(): Prisma.FasilitasCreateInput {
    const fasilitasOptions = [
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
    
    const fasilitas = this.fakerInstance.helpers.arrayElement(fasilitasOptions);
    
    return {
      nama_fasilitas: fasilitas.nama,
      icon_url: fasilitas.icon,
    };
  }

  protected async store(data: Prisma.FasilitasCreateInput) {
    return await this.prisma.fasilitas.create({ data });
  }
}