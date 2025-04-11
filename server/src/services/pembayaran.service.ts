// src/services/pembayaran.service.ts
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { STATUSTRANSAKSI } from '@prisma/client';
import { prisma } from '../configs/db.config';
import { MIDTRANS_CONFIG } from '../configs/midtrans.config';
import { logger } from '../configs/logger.config';
import { 
  BadRequestError, 
  NotFoundError, 
  InternalServerError 
} from '../configs/error.config';
import { 
  Pembayaran, 
  PembayaranCreate, 
  MidtransNotification 
} from '../interfaces/types/pembayaran.types';
import { IPembayaranService } from '../interfaces/services/pembayaran.intercase';

export class PembayaranService implements IPembayaranService {
  
  /**
   * Create a Snap token through Midtrans API
   */
  async createSnapToken(peminjaman_id: string, userId: string): Promise<{
    snapToken: string;
    redirectUrl: string;
    orderId: string;
  }> {
    try {
      // Get the peminjaman details
      const peminjaman = await prisma.peminjaman.findUnique({
        where: { id: peminjaman_id },
        include: {
          gedung: true,
          pengguna: true,
        },
      });

      if (!peminjaman) {
        throw new NotFoundError('Peminjaman tidak ditemukan');
      }

      // Check if there's already a payment for this peminjaman
      const existingPayment = await prisma.pembayaran.findUnique({
        where: { peminjaman_id },
      });

      if (existingPayment) {
        // If the payment is still valid and not cancelled, return the existing token
        if (
          existingPayment.status_pembayaran !== STATUSTRANSAKSI.CANCELED &&
          existingPayment.status_pembayaran !== STATUSTRANSAKSI.REFUNDED
        ) {
          return {
            snapToken: existingPayment.snap_token,
            redirectUrl: existingPayment.url_pembayaran,
            orderId: existingPayment.transaksi_midtrans_id,
          };
        }
      }

      // Check if peminjaman belongs to the requesting user
      if (peminjaman.pengguna_id !== userId) {
        throw new BadRequestError('Peminjaman tidak dimiliki oleh pengguna ini');
      }

      // Generate a unique order ID
      const orderId = `PG-${format(new Date(), 'yyyyMMdd')}-${uuidv4().slice(0, 8)}`;
      
      // Get the building information for the item details
      const gedung = peminjaman.gedung;
      if (!gedung) {
        throw new BadRequestError('Informasi gedung tidak ditemukan');
      }

      // Prepare fee and tax calculations (you can adjust these as needed)
      const basePriceInRupiah = gedung.harga_sewa;
      const platformFeeInRupiah = Math.ceil(basePriceInRupiah * 0.05); // 5% platform fee
      const totalPriceInRupiah = basePriceInRupiah + platformFeeInRupiah;

      // Create the payment data for Midtrans
      const paymentData = {
        transaction_details: {
          order_id: orderId,
          gross_amount: totalPriceInRupiah,
        },
        item_details: [
          {
            id: gedung.id,
            name: `Sewa gedung ${gedung.nama_gedung}`,
            price: gedung.harga_sewa,
            quantity: 1,
          },
          {
            id: 'platform-fee',
            name: 'Biaya layanan',
            price: platformFeeInRupiah,
            quantity: 1,
          },
        ],
        customer_details: {
          first_name: peminjaman.pengguna?.nama_lengkap?.split(' ')[0] || 'Pengguna',
          last_name: 
            peminjaman.pengguna?.nama_lengkap?.split(' ').slice(1).join(' ') || 
            'Aplikasi',
          email: peminjaman.pengguna?.email || 'noemail@example.com',
          phone: peminjaman.pengguna?.no_hp || '08000000000',
        },
        enabled_payments: [
          'credit_card', 'gopay', 'shopeepay', 'bank_transfer', 'echannel',
          'bca_va', 'bni_va', 'bri_va', 'permata_va',
        ],
        callbacks: {
          finish: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pembayaran/success`,
          error: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pembayaran/error`,
          pending: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pembayaran/pending`,
        },
      };

      // Encode credentials for Basic Auth
      const auth = Buffer.from(`${MIDTRANS_CONFIG.serverKey}:`).toString('base64');

      // Make request to Midtrans Snap API
      const response = await axios.post(
        MIDTRANS_CONFIG.snapUrl,
        paymentData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Basic ${auth}`,
          },
        }
      );

      if (!response.data || !response.data.token) {
        logger.error('Failed to create Midtrans Snap token', {
          response: response.data,
          peminjaman_id,
        });
        throw new InternalServerError('Gagal membuat token pembayaran');
      }

      const snapToken = response.data.token;
      const redirectUrl = response.data.redirect_url;

      // Create or update the payment record in the database
      const currentDate = format(new Date(), 'yyyy-MM-dd');
      
      const paymentRecord: PembayaranCreate = {
        transaksi_midtrans_id: orderId,
        peminjaman_id: peminjaman_id,
        tanggal_bayar: currentDate,
        jumlah_bayar: basePriceInRupiah,
        biaya_midtrans: platformFeeInRupiah,
        total_bayar: totalPriceInRupiah,
        metode_pembayaran: 'pending', // Will be updated after payment
        url_pembayaran: redirectUrl,
        snap_token: snapToken,
        status_pembayaran: STATUSTRANSAKSI.CHECKOUT,
      };

      // If a payment record already exists, update it
      if (existingPayment) {
        await prisma.pembayaran.update({
          where: { id: existingPayment.id },
          data: paymentRecord,
        });
      } else {
        // Otherwise, create a new payment record
        await prisma.pembayaran.create({
          data: paymentRecord,
        });
      }

      return {
        snapToken,
        redirectUrl,
        orderId,
      };
    } catch (error) {
      logger.error('Error creating Snap token', { error, peminjaman_id });
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Gagal membuat token pembayaran: ' + (error as Error).message);
    }
  }

  /**
   * Create a payment record in the database
   */
  async createPembayaran(pembayaranData: PembayaranCreate): Promise<Pembayaran> {
    try {
      const peminjaman = await prisma.peminjaman.findUnique({
        where: { id: pembayaranData.peminjaman_id },
      });

      if (!peminjaman) {
        throw new NotFoundError('Peminjaman tidak ditemukan');
      }

      const pembayaran = await prisma.pembayaran.create({
        data: pembayaranData,
        include: {
          peminjaman: true,
        },
      });

      return pembayaran;
    } catch (error) {
      logger.error('Error creating payment record', { error, data: pembayaranData });
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Gagal membuat data pembayaran');
    }
  }

  /**
   * Get payment by peminjaman ID
   */
  async getPembayaranByPeminjamanId(peminjaman_id: string): Promise<Pembayaran | null> {
    try {
      const pembayaran = await prisma.pembayaran.findUnique({
        where: { peminjaman_id },
        include: {
          peminjaman: {
            include: {
              gedung: true,
              pengguna: true,
            },
          },
        },
      });
  
      if (!pembayaran) return null;
      
      const result: Pembayaran = {
        ...pembayaran,
        no_invoice: pembayaran.no_invoice || undefined,
        peminjaman: pembayaran.peminjaman ? {
          ...pembayaran.peminjaman,
          pengguna: pembayaran.peminjaman.pengguna || undefined,
        } : undefined,
      };
      
      return result;
    } catch (error) {
      logger.error('Error getting payment by peminjaman ID', { error, peminjaman_id });
      throw new InternalServerError('Gagal mendapatkan data pembayaran');
    }
  }

  /**
   * Update payment status based on notification from Midtrans
   */
  async updateStatusPembayaran(
    transaction_id: string,
    status: string
  ): Promise<Pembayaran> {
    try {
      const pembayaran = await prisma.pembayaran.findFirst({
        where: { transaksi_midtrans_id: transaction_id },
      });

      if (!pembayaran) {
        throw new NotFoundError('Pembayaran tidak ditemukan');
      }

      // Map Midtrans transaction status to our STATUSTRANSAKSI enum
      let paymentStatus: STATUSTRANSAKSI;
      let paymentMethod = pembayaran.metode_pembayaran;

      switch (status) {
        case 'capture':
        case 'settlement':
          paymentStatus = STATUSTRANSAKSI.PAID;
          break;
        case 'pending':
          paymentStatus = STATUSTRANSAKSI.PENDING;
          break;
        case 'deny':
        case 'expire':
        case 'cancel':
          paymentStatus = STATUSTRANSAKSI.CANCELED;
          break;
        case 'refund':
        case 'partial_refund':
          paymentStatus = STATUSTRANSAKSI.REFUNDED;
          break;
        default:
          paymentStatus = STATUSTRANSAKSI.CHECKOUT;
      }

      // Update the payment record
      const updatedPembayaran = await prisma.pembayaran.update({
        where: { id: pembayaran.id },
        data: {
          status_pembayaran: paymentStatus,
          metode_pembayaran: paymentMethod !== 'pending' ? paymentMethod : 'midtrans',
        },
        include: {
          peminjaman: true,
        },
      });

      // If payment is successful, update the peminjaman status if needed
      if (paymentStatus === STATUSTRANSAKSI.PAID) {
        await prisma.peminjaman.update({
          where: { id: pembayaran.peminjaman_id },
          data: {
            status_peminjaman: 'DIPROSES',
          },
        });
      }

      return updatedPembayaran;
    } catch (error) {
      logger.error('Error updating payment status', { error, transaction_id, status });
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Gagal memperbarui status pembayaran');
    }
  }

  /**
   * Check transaction status directly with Midtrans
   */
  async checkTransactionStatus(order_id: string): Promise<any> {
    try {
      const auth = Buffer.from(`${MIDTRANS_CONFIG.serverKey}:`).toString('base64');
      
      const response = await axios.get(
        `${MIDTRANS_CONFIG.apiUrl}/v2/${order_id}/status`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Error checking transaction status', { error, order_id });
      throw new InternalServerError('Gagal memeriksa status transaksi');
    }
  }

  /**
   * Process notification from Midtrans webhook
   */
  async processNotification(notification: MidtransNotification): Promise<Pembayaran> {
    try {
      // First verify the notification with Midtrans
      const transactionStatus = await this.checkTransactionStatus(notification.order_id);
      
      // Verify the transaction status matches what Midtrans sent
      if (
        transactionStatus.transaction_id !== notification.transaction_id ||
        transactionStatus.order_id !== notification.order_id
      ) {
        throw new BadRequestError('Invalid notification data');
      }

      // Update payment record
      return this.updateStatusPembayaran(
        notification.order_id,
        notification.transaction_status
      );
    } catch (error) {
      logger.error('Error processing Midtrans notification', { 
        error, 
        notification 
      });
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Gagal memproses notifikasi pembayaran');
    }
  }
}


export default new PembayaranService()