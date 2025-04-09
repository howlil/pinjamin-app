import { Factory } from './Factory';
import { PrismaClient, Peminjaman, STATUSPEMINJAMAN } from '@prisma/client';

export class PeminjamanFactory extends Factory<Peminjaman> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  definition(): Partial<Peminjaman> {
    const startDate = this.fakerInstance.date.future();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + this.fakerInstance.number.int({ min: 1, max: 7 }));
    
    return {
      nama_kegiatan: `${this.fakerInstance.company.buzzVerb()} ${this.fakerInstance.company.buzzNoun()}`,
      tanggal_mulai: startDate.toISOString().split('T')[0],
      tanggal_selesai: endDate.toISOString().split('T')[0],
      jam_mulai: `${this.fakerInstance.number.int({ min: 8, max: 17 })}:00`,
      jam_selesai: `${this.fakerInstance.number.int({ min: 18, max: 22 })}:00`,
      surat_pengajuan: `surat_${this.fakerInstance.string.alphanumeric(10)}.pdf`,
      status_peminjaman: this.fakerInstance.helpers.arrayElement(Object.values(STATUSPEMINJAMAN)),
    };
  }

  protected async store(data: Peminjaman): Promise<Peminjaman> {
    return await this.prisma.peminjaman.create({ data });
  }
}