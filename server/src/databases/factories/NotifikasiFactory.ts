import { Factory } from "./Factory";
import { PrismaClient, Notifikasi, Notif } from "@prisma/client";

export class NotifikasiFactory extends Factory<Notifikasi> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  definition(): Partial<Notifikasi> {
    return {
      jenis_notifikasi: this.fakerInstance.helpers.arrayElement([
        Notif.PEMBAYARAN,
        Notif.PEMINJAMAN,
      ]),
      judul: this.fakerInstance.lorem.sentence(),
      pesan: this.fakerInstance.lorem.paragraph(),
      tanggal: this.fakerInstance.date.recent().toISOString().split("T")[0],
      status_baca: 0,
    };
  }

  protected async store(data: Notifikasi): Promise<Notifikasi> {
    return await this.prisma.notifikasi.create({ data });
  }
}
