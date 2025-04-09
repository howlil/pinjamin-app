import { Factory } from './Factory';
import { PrismaClient, PenanggungJawabGedung } from '@prisma/client';

export class PenanggungJawabGedungFactory extends Factory<PenanggungJawabGedung> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  definition(): Partial<PenanggungJawabGedung> {
    return {
      nama_penangguang_jawab: this.fakerInstance.person.fullName(),
      no_hp: this.fakerInstance.phone.number({style:"national"}),
    };
  }

  protected async store(data: PenanggungJawabGedung): Promise<PenanggungJawabGedung> {
    return await this.prisma.penanggungJawabGedung.create({ data });
  }
}