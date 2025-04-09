import { Factory } from './Factory';
import { PrismaClient, TipeGedung } from '@prisma/client';

export class TipeGedungFactory extends Factory<TipeGedung> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  definition(): Partial<TipeGedung> {
    const tipeOptions = [
      'Aula', 'Ruang Pertemuan', 'Lapangan', 'Laboratorium', 
      'Perpustakaan', 'Ruang Kelas', 'Auditorium', 'Gedung Olahraga'
    ];
    
    return {
      nama_tipe_gedung: this.fakerInstance.helpers.arrayElement(tipeOptions),
    };
  }

  protected async store(data: TipeGedung): Promise<TipeGedung> {
    return await this.prisma.tipeGedung.create({ data });
  }
}