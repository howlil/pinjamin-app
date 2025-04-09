import { Seeder } from './Seeder';
import { PrismaClient, STATUSTRANSAKSI } from '@prisma/client';
import { RefundFactory } from '../factories/RefundFactory';

export class RefundSeeder extends Seeder {
  private factory: RefundFactory;
  
  constructor(prisma: PrismaClient) {
    super(prisma);
    this.factory = new RefundFactory(prisma);
  }
  
  async run(): Promise<void> {
    console.log('Seeding refund...');
    
    const paidPembayaran = await this.prisma.pembayaran.findMany({
      where: { status_pembayaran: STATUSTRANSAKSI.PAID },
      take: 2 // Only create refunds for some payments
    });
    
    if (paidPembayaran.length === 0) {
      throw new Error('No paid pembayaran found. Please run PembayaranSeeder first.');
    }
    
    for (const pembayaran of paidPembayaran) {
      const refundAmount = Math.round(pembayaran.jumlah_bayar * 0.7); // 70% refund
      
      await this.factory.create({
        pembayaran_id: pembayaran.id,
        jumlah_refund: refundAmount
      });
      
      // Update the payment status to REFUNDED
      await this.prisma.pembayaran.update({
        where: { id: pembayaran.id },
        data: { status_pembayaran: STATUSTRANSAKSI.REFUNDED }
      });
    }
    
    console.log('Refund seeded successfully');
  }
}