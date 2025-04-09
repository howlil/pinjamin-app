import { Factory } from './Factory';
import { PrismaClient, Pembayaran, STATUSTRANSAKSI } from '@prisma/client';

export class PembayaranFactory extends Factory<Pembayaran> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  definition(): Partial<Pembayaran> {
    const amount = this.fakerInstance.number.int({ min: 500000, max: 10000000 });
    const fee = Math.round(amount * 0.03);
    const total = amount + fee;
    const paymentMethods = ['BCA VA', 'Mandiri VA', 'BRI VA', 'BNI VA', 'GOPAY', 'SHOPEEPAY', 'OVO', 'DANA'];
    
    return {
      transaksi_midtrans_id: `order-${this.fakerInstance.string.alphanumeric(16)}`,
      no_invoice: `INV/${this.fakerInstance.date.recent().getFullYear()}/${this.fakerInstance.string.numeric(6)}`,
      tanggal_bayar: this.fakerInstance.date.recent().toISOString().split('T')[0],
      jumlah_bayar: amount,
      biaya_midtrans: fee,
      total_bayar: total,
      metode_pembayaran: this.fakerInstance.helpers.arrayElement(paymentMethods),
      url_pembayaran: `https://app.midtrans.com/snap/v2/vtweb/${this.fakerInstance.string.alphanumeric(40)}`,
      snap_token: this.fakerInstance.string.alphanumeric(36),
      status_pembayaran: this.fakerInstance.helpers.arrayElement(Object.values(STATUSTRANSAKSI)),
    };
  }

  protected async store(data: Pembayaran): Promise<Pembayaran> {
    return await this.prisma.pembayaran.create({ data });
  }
}