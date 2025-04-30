import { Factory } from './Factory';
import { PrismaClient, Prisma } from '@prisma/client';

export class GedungFactory extends Factory<Prisma.GedungUncheckedCreateInput> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  definition(): Omit<Prisma.GedungUncheckedCreateInput, 'tipe_gedung_id'> {
    return {
      nama_gedung: `Gedung ${this.fakerInstance.location.buildingNumber()} ${this.fakerInstance.company.name()}`,
      deskripsi: this.fakerInstance.lorem.paragraphs(3),
      harga_sewa: this.fakerInstance.number.int({ min: 500000, max: 10000000 }),
      foto_gedung: `building-${this.fakerInstance.number.int({ min: 1, max: 10 })}.jpg`,
      kapasitas: this.fakerInstance.number.int({ min: 50, max: 1000 }),
      lokasi: `${this.fakerInstance.location.streetAddress()}, ${this.fakerInstance.location.city()}`
    };
  }

  protected async store(data: Prisma.GedungUncheckedCreateInput): Promise<any> {
    return await this.prisma.gedung.create({ data });
  }
}