import { Factory } from './Factory';
import { PrismaClient, Refund } from '@prisma/client';

export class RefundFactory extends Factory<Refund> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  definition(): Partial<Refund> {
    const refundAmount = this.fakerInstance.number.int({ min: 100000, max: 1000000 });
    const statusOptions = ['PROCESSED', 'COMPLETED', 'REJECTED'];
    
    return {
      jumlah_refund: refundAmount,
      status_redund: this.fakerInstance.helpers.arrayElement(statusOptions),
      alasan_refund: this.fakerInstance.helpers.arrayElement([
        'Kegiatan dibatalkan',
        'Pembayaran duplikat',
        'Kesalahan sistem',
        'Permintaan pelanggan',
        'Force majeure'
      ]),
      transaski_refund_midtrans_id: `refund-${this.fakerInstance.string.alphanumeric(16)}`,
      tanggal_refund: this.fakerInstance.date.recent().toISOString().split('T')[0],
    };
  }

  protected async store(data: Refund): Promise<Refund> {
    return await this.prisma.refund.create({ data });
  }
}