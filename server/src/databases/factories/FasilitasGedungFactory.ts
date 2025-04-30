import { Factory } from './Factory';
import { PrismaClient, Prisma } from '@prisma/client';

export class FasilitasGedungFactory extends Factory<Prisma.FasilitasGedungUncheckedCreateInput> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }


  definition(): Partial<Prisma.FasilitasGedungUncheckedCreateInput> {
    return {};
  }

  
  async createConnection(fasilitasId: string, gedungId: string) {
    return await this.prisma.fasilitasGedung.create({
      data: {
        fasilitas_id: fasilitasId,
        gedung_id: gedungId
      }
    });
  }

  protected async store(data: Prisma.FasilitasGedungUncheckedCreateInput): Promise<any> {
    return await this.prisma.fasilitasGedung.create({ data });
  }
}