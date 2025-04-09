import { Seeder } from './Seeder';
import { PrismaClient, STATUSPEMINJAMAN, STATUSTRANSAKSI } from '@prisma/client';
import { PembayaranFactory } from '../factories/PembayaranFactory';

export class PembayaranSeeder extends Seeder {
  private factory: PembayaranFactory;
  
  constructor(prisma: PrismaClient) {
    super(prisma);
    this.factory = new PembayaranFactory(prisma);
  }
  
  async run(): Promise<void> {
    console.log('Seeding pembayaran...');
    
    const approvedPeminjaman = await this.prisma.peminjaman.findMany({
      where: { status_peminjaman: STATUSPEMINJAMAN.DISETUJUI },
      include: { gedung: true }
    });
    
    if (approvedPeminjaman.length === 0) {
      throw new Error('No approved peminjaman found. Please run PeminjamanSeeder first.');
    }
    
    for (const peminjaman of approvedPeminjaman) {
      const amount = peminjaman.gedung.harga_sewa;
      const fee = Math.round(amount * 0.03);
      const total = amount + fee;
      
      await this.factory.create({
        peminjaman_id: peminjaman.id,
        jumlah_bayar: amount,
        biaya_midtrans: fee,
        total_bayar: total,
        status_pembayaran: STATUSTRANSAKSI.PAID
      });
    }
    
    console.log('Pembayaran seeded successfully');
  }
}