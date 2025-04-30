import { prisma } from "../configs/db.config";
import { Pembayaran } from "../interfaces/types/pembayaran.types";
import { NotFoundError, BadRequestError } from "../configs/error.config";
import { MIDTRANS_CONFIG } from "../configs/midtrans.config";
import { STATUSPEMINJAMAN, STATUSTRANSAKSI } from "@prisma/client";
import { logger } from "../configs/logger.config";
import axios from "axios";
import * as crypto from "crypto";

export class PembayaranService {
  private midtransBaseUrl: string;
  private midtransServerKey: string;
  private midtransClientKey: string;

  constructor() {
    this.midtransBaseUrl = MIDTRANS_CONFIG.isProduction
      ? "https://api.midtrans.com"
      : "https://api.sandbox.midtrans.com";
    this.midtransServerKey = MIDTRANS_CONFIG.serverKey;
    this.midtransClientKey = MIDTRANS_CONFIG.clientKey;
  }

  async getAllPembayaran(): Promise<Pembayaran[]> {
    const pembayaranList = await prisma.pembayaran.findMany({
      include: {
        peminjaman: {
          include: {
            pengguna: true,
            gedung: true
          }
        },
        refund: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    
    if (!pembayaranList.length) return [];
    
    // Map each payment record to the expected format
    const result = pembayaranList.map(pembayaran => ({
      ...pembayaran,
      no_invoice: pembayaran.no_invoice || undefined,
      peminjaman: pembayaran.peminjaman
        ? {
            ...pembayaran.peminjaman,
            pengguna: pembayaran.peminjaman.pengguna || undefined,
          }
        : undefined,
    }));

    return result;
  }

  async getPembayaranById(id: string): Promise<Pembayaran | null> {
    const pembayaran = await prisma.pembayaran.findUnique({
      where: { id },
      include: {
        peminjaman: {
          include: {
            pengguna: true,
            gedung: true
          }
        },
        refund: true
      }
    });

    if (!pembayaran) return null;

    return {
      ...pembayaran,
      no_invoice: pembayaran.no_invoice || undefined,
      peminjaman: pembayaran.peminjaman
        ? {
            ...pembayaran.peminjaman,
            pengguna: pembayaran.peminjaman.pengguna || undefined,
          }
        : undefined,
    } as Pembayaran;
  }

  async getPembayaranByPeminjamanId(peminjamanId: string): Promise<Pembayaran | null> {
    const pembayaran = await prisma.pembayaran.findUnique({
      where: { peminjaman_id: peminjamanId },
      include: {
        peminjaman: {
          include: {
            pengguna: true,
            gedung: true
          }
        },
        refund: true
      }
    });

    if (!pembayaran) return null;

    return {
      ...pembayaran,
      no_invoice: pembayaran.no_invoice || undefined,
      peminjaman: pembayaran.peminjaman
        ? {
            ...pembayaran.peminjaman,
            pengguna: pembayaran.peminjaman.pengguna || undefined,
          }
        : undefined,
    } as Pembayaran;
  }

  async createSnapToken(peminjamanId: string, penggunaId: string): Promise<{
    snapToken: string;
    redirectUrl: string;
    orderId: string;
  }> {
    // Get the peminjaman details
    const peminjaman = await prisma.peminjaman.findUnique({
      where: { id: peminjamanId },
      include: {
        gedung: true,
        pengguna: true,
        pembayaran: true
      }
    });

    if (!peminjaman) {
      throw new NotFoundError("Peminjaman tidak ditemukan");
    }

    // Check if the peminjaman belongs to the user
    if (peminjaman.pengguna_id !== penggunaId) {
      throw new BadRequestError("Peminjaman ini bukan milik anda");
    }

    // Check if payment already exists
    if (peminjaman.pembayaran) {
      // If payment exists and is not completed, return the existing snap token
      if (peminjaman.pembayaran.status_pembayaran !== STATUSTRANSAKSI.PAID) {
        return {
          snapToken: peminjaman.pembayaran.snap_token,
          redirectUrl: peminjaman.pembayaran.url_pembayaran,
          orderId: peminjaman.pembayaran.transaksi_midtrans_id
        };
      }
      
      // If payment is already completed, throw error
      throw new BadRequestError("Pembayaran untuk peminjaman ini sudah selesai");
    }

    // Calculate the total price
    const grossAmount = peminjaman.gedung.harga_sewa;
    
    // Generate a unique order ID
    const today = new Date();
    const orderId = `ORDER-${peminjaman.id}-${today.getTime()}`;

    // Create the transaction data
    const transactionData = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount
      },
      credit_card: {
        secure: true
      },
      customer_details: {
        first_name: peminjaman.pengguna?.nama_lengkap || "Guest",
        email: peminjaman.pengguna?.email || "guest@example.com",
        phone: peminjaman.pengguna?.no_hp || "08123456789"
      },
      item_details: [
        {
          id: peminjaman.gedung.id,
          price: grossAmount,
          quantity: 1,
          name: `Sewa ${peminjaman.gedung.nama_gedung} - ${peminjaman.nama_kegiatan}`,
          category: "Sewa Gedung"
        }
      ],
      callbacks: {
        finish: `${MIDTRANS_CONFIG.finishUrl}/${peminjaman.id}`,
        error: `${MIDTRANS_CONFIG.errorUrl}/${peminjaman.id}`,
        pending: `${MIDTRANS_CONFIG.pendingUrl}/${peminjaman.id}`
      }
    };

    try {
      // Create Snap transaction token
      const response = await axios.post(
        `${this.midtransBaseUrl}/snap/v1/transactions`,
        transactionData,
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Basic ${Buffer.from(this.midtransServerKey + ":").toString("base64")}`
          }
        }
      );

      const { token, redirect_url } = response.data;

      // Calculate Midtrans fee (estimate)
      // This is a simplified example - actual fee calculation may vary
      const midtransFee = Math.round(grossAmount * 0.02); // 2% fee example
      
      // Create the payment record
      await prisma.pembayaran.create({
        data: {
          peminjaman_id: peminjamanId,
          transaksi_midtrans_id: orderId,
          tanggal_bayar: today.toISOString().split("T")[0],
          jumlah_bayar: grossAmount,
          biaya_midtrans: midtransFee,
          total_bayar: grossAmount + midtransFee,
          metode_pembayaran: "Midtrans",
          url_pembayaran: redirect_url,
          snap_token: token,
          status_pembayaran: STATUSTRANSAKSI.CHECKOUT
        }
      });

      return {
        snapToken: token,
        redirectUrl: redirect_url,
        orderId
      };
    } catch (error) {
      logger.error("Error creating Midtrans snap token", { error });
      throw new BadRequestError("Gagal membuat token pembayaran");
    }
  }

  async processNotification(notification: any): Promise<boolean> {
    try {
      const {
        transaction_status,
        order_id,
        transaction_id,
        signature_key,
        payment_type,
        fraud_status
      } = notification;

      // Validate signature
      const expectedSignature = this.generateSignature(notification);
      if (signature_key !== expectedSignature) {
        logger.warn("Invalid signature for Midtrans notification", { notification });
        return false;
      }

      // Find the payment by transaction ID
      const pembayaran = await prisma.pembayaran.findFirst({
        where: { transaksi_midtrans_id: order_id },
        include: {
          peminjaman: true
        }
      });

      if (!pembayaran) {
        logger.warn("Payment not found for Midtrans notification", { order_id });
        return false;
      }

      // Update payment status based on transaction status
      let newStatus: STATUSTRANSAKSI;
      switch (transaction_status) {
        case "capture":
        case "settlement":
          newStatus = STATUSTRANSAKSI.PAID;
          break;
        case "pending":
          newStatus = STATUSTRANSAKSI.PENDING;
          break;
        case "deny":
        case "cancel":
        case "expire":
          newStatus = STATUSTRANSAKSI.CANCELED;
          break;
        case "refund":
          newStatus = STATUSTRANSAKSI.REFUNDED;
          break;
        default:
          newStatus = pembayaran.status_pembayaran;
      }

      // Update the payment
      await prisma.pembayaran.update({
        where: { id: pembayaran.id },
        data: {
          status_pembayaran: newStatus,
          metode_pembayaran: payment_type || pembayaran.metode_pembayaran,
          no_invoice: transaction_id || pembayaran.no_invoice
        }
      });

      // If payment is successful, update peminjaman status
      if (newStatus === STATUSTRANSAKSI.PAID) {
        await prisma.peminjaman.update({
          where: { id: pembayaran.peminjaman_id },
          data: {
            status_peminjaman: STATUSPEMINJAMAN.DIPROSES
          }
        });
      }

      return true;
    } catch (error) {
      logger.error("Error processing Midtrans notification", { error });
      return false;
    }
  }

  private generateSignature(data: any): string {
    const { order_id, status_code, gross_amount } = data;
    const dataString = `${order_id}${status_code}${gross_amount}${this.midtransServerKey}`;
    return crypto.createHash("sha512").update(dataString).digest("hex");
  }

  /**
   * Process refund for a rejected booking
   */
  async processRefund(peminjamanId: string, alasanRefund: string): Promise<boolean> {
    try {
      // Get the payment for this booking
      const pembayaran = await prisma.pembayaran.findUnique({
        where: { peminjaman_id: peminjamanId },
        include: {
          peminjaman: true,
          refund: true
        }
      });

      if (!pembayaran) {
        throw new NotFoundError("Pembayaran tidak ditemukan");
      }

      if (pembayaran.status_pembayaran !== STATUSTRANSAKSI.PAID) {
        throw new BadRequestError("Pembayaran belum selesai atau sudah direfund");
      }

      // Check if refund already exists
      if (pembayaran.refund) {
        throw new BadRequestError("Refund untuk pembayaran ini sudah ada");
      }

      // Call Midtrans API to process refund
      try {
        // Create refund request to Midtrans
        const response = await axios.post(
          `${this.midtransBaseUrl}/v2/${pembayaran.transaksi_midtrans_id}/refund`,
          {
            refund_key: `refund-${pembayaran.id}-${Date.now()}`,
            amount: pembayaran.jumlah_bayar,
            reason: alasanRefund
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Basic ${Buffer.from(this.midtransServerKey + ":").toString("base64")}`
            }
          }
        );

        // Check if refund is successful
        if (response.data && response.data.status_code === "200") {
          // Create refund record
          await prisma.refund.create({
            data: {
              pembayaran_id: pembayaran.id,
              jumlah_refund: pembayaran.jumlah_bayar,
              status_redund: "PROCESSED",
              alasan_refund: alasanRefund,
              transaski_refund_midtrans_id: response.data.transaction_id || `refund-${pembayaran.id}`,
              tanggal_refund: new Date().toISOString().split("T")[0],
            }
          });

          // Update payment status
          await prisma.pembayaran.update({
            where: { id: pembayaran.id },
            data: {
              status_pembayaran: STATUSTRANSAKSI.REFUNDED
            }
          });

          return true;
        } else {
          throw new Error(`Midtrans refund failed: ${JSON.stringify(response.data)}`);
        }
      } catch (apiError: any) {
        // Handle API errors
        logger.error("Error processing refund with Midtrans", { 
          error: apiError.response?.data || apiError.message,
          pembayaranId: pembayaran.id 
        });

        // If there's a specific error from Midtrans, we can create a pending refund
        // that will need manual intervention
        await prisma.refund.create({
          data: {
            pembayaran_id: pembayaran.id,
            jumlah_refund: pembayaran.jumlah_bayar,
            status_redund: "FAILED",
            alasan_refund: alasanRefund,
            transaski_refund_midtrans_id: `manual-refund-${pembayaran.id}`,
            tanggal_refund: new Date().toISOString().split("T")[0],
          }
        });

        throw new BadRequestError("Gagal melakukan refund: " + (apiError.response?.data?.status_message || apiError.message));
      }
    } catch (error) {
      logger.error("Error processing refund", { error, peminjamanId });
      throw error;
    }
  }

  /**
   * Check refund status from Midtrans
   */
  async checkRefundStatus(refundId: string): Promise<any> {
    try {
      // Get the refund record
      const refund = await prisma.refund.findUnique({
        where: { id: refundId },
        include: {
          pembayaran: true
        }
      });

      if (!refund) {
        throw new NotFoundError("Refund tidak ditemukan");
      }

      // Call Midtrans API to check refund status
      const response = await axios.get(
        `${this.midtransBaseUrl}/v2/${refund.pembayaran.transaksi_midtrans_id}/refund/${refund.transaski_refund_midtrans_id}/status`,
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Basic ${Buffer.from(this.midtransServerKey + ":").toString("base64")}`
          }
        }
      );

      // Update refund status based on Midtrans response
      if (response.data && response.data.status_code === "200") {
        await prisma.refund.update({
          where: { id: refundId },
          data: {
            status_redund: response.data.refund_status || "PROCESSED"
          }
        });

        return response.data;
      } else {
        throw new Error(`Failed to check refund status: ${JSON.stringify(response.data)}`);
      }
    } catch (error) {
      logger.error("Error checking refund status", { error, refundId });
      throw new BadRequestError("Gagal memeriksa status refund");
    }
  }

  /**
   * Helper method to automatically process refunds for rejected bookings
   * This can be called from the PeminjamanService when a booking is rejected
   */
  async autoProcessRefundForRejectedBooking(
    peminjamanId: string, 
    alasanPenolakan: string
  ): Promise<boolean> {
    try {
      const alasanRefund = `Refund otomatis: Peminjaman ditolak. ${alasanPenolakan}`;
      return await this.processRefund(peminjamanId, alasanRefund);
    } catch (error) {
      // Log the error but don't throw, so booking rejection can still proceed
      // even if refund processing fails
      logger.error("Auto refund processing failed", { error, peminjamanId });
      return false;
    }
  }
}

export default new PembayaranService();