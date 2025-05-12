// server/src/services/pembayaran.service.ts
import { Pembayaran } from "../interfaces/types/pembayaran.types";
import { NotFoundError, BadRequestError } from "../configs/error.config";
import { MIDTRANS_CONFIG } from "../configs/midtrans.config";
import { STATUSPEMINJAMAN, STATUSTRANSAKSI } from "@prisma/client";
import axios from "axios";
import * as crypto from "crypto";
import { BaseService } from "./base.service";

export class PembayaranService extends BaseService {
  private midtransBaseUrl: string;
  private midtransServerKey: string;
  private midtransClientKey: string;

  constructor() {
    super('PembayaranService');
    this.midtransBaseUrl = MIDTRANS_CONFIG.isProduction
      ? "https://api.midtrans.com"
      : "https://api.sandbox.midtrans.com";
    this.midtransServerKey = MIDTRANS_CONFIG.serverKey;
    this.midtransClientKey = MIDTRANS_CONFIG.clientKey;
  }

  async getAllPembayaran(): Promise<Pembayaran[]> {
    try {
      this.logInfo('Fetching all payments');
      
      const pembayaranList = await this.prisma.pembayaran.findMany({
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

      this.logInfo(`Found ${result.length} payments`);
      return result;
    } catch (error) {
      this.handleError(error, 'getAllPembayaran');
      throw error;
    }
  }

  async getPembayaranById(id: string): Promise<Pembayaran | null> {
    try {
      this.logInfo('Fetching payment by ID', { id });
      
      const pembayaran = await this.prisma.pembayaran.findUnique({
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
    } catch (error) {
      this.handleError(error, 'getPembayaranById');
      throw error;
    }
  }

  async getPembayaranByPeminjamanId(peminjamanId: string): Promise<Pembayaran | null> {
    try {
      this.logInfo('Fetching payment by peminjaman ID', { peminjamanId });
      
      const pembayaran = await this.prisma.pembayaran.findUnique({
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
    } catch (error) {
      this.handleError(error, 'getPembayaranByPeminjamanId');
      throw error;
    }
  }

  async createSnapToken(peminjamanId: string, penggunaId: string): Promise<{
    snapToken: string;
    redirectUrl: string;
    orderId: string;
  }> {
    try {
      this.logInfo('Creating snap token', { peminjamanId, penggunaId });
      
      const peminjaman = await this.prisma.peminjaman.findUnique({
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

      if (peminjaman.pengguna_id !== penggunaId) {
        throw new BadRequestError("Peminjaman ini bukan milik anda");
      }

      if (peminjaman.pembayaran) {
        if (peminjaman.pembayaran.status_pembayaran !== STATUSTRANSAKSI.PAID) {
          return {
            snapToken: peminjaman.pembayaran.snap_token,
            redirectUrl: peminjaman.pembayaran.url_pembayaran,
            orderId: peminjaman.pembayaran.transaksi_midtrans_id
          };
        }
        
        throw new BadRequestError("Pembayaran untuk peminjaman ini sudah selesai");
      }

      const grossAmount = peminjaman.gedung.harga_sewa;
      const today = new Date();
      const orderId = `ORDER-${peminjaman.id}-${today.getTime()}`;

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
      const midtransFee = Math.round(grossAmount * 0.02);
      
      await this.prisma.pembayaran.create({
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

      this.logInfo('Snap token created successfully', { orderId });
      return {
        snapToken: token,
        redirectUrl: redirect_url,
        orderId
      };
    } catch (error) {
      this.handleError(error, 'createSnapToken');
      throw new BadRequestError("Gagal membuat token pembayaran");
    }
  }

  async processNotification(notification: any): Promise<boolean> {
    try {
      this.logInfo('Processing Midtrans notification', { orderId: notification.order_id });
      
      const {
        transaction_status,
        order_id,
        transaction_id,
        signature_key,
        payment_type,
        fraud_status
      } = notification;

      const expectedSignature = this.generateSignature(notification);
      if (signature_key !== expectedSignature) {
        this.logWarn("Invalid signature for Midtrans notification", { notification });
        return false;
      }

      const pembayaran = await this.prisma.pembayaran.findFirst({
        where: { transaksi_midtrans_id: order_id },
        include: {
          peminjaman: true
        }
      });

      if (!pembayaran) {
        this.logWarn("Payment not found for Midtrans notification", { order_id });
        return false;
      }

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

      await this.prisma.pembayaran.update({
        where: { id: pembayaran.id },
        data: {
          status_pembayaran: newStatus,
          metode_pembayaran: payment_type || pembayaran.metode_pembayaran,
          no_invoice: transaction_id || pembayaran.no_invoice
        }
      });

      if (newStatus === STATUSTRANSAKSI.PAID) {
        await this.prisma.peminjaman.update({
          where: { id: pembayaran.peminjaman_id },
          data: {
            status_peminjaman: STATUSPEMINJAMAN.DIPROSES
          }
        });
      }

      this.logInfo('Notification processed successfully', { orderId: order_id, status: newStatus });
      return true;
    } catch (error) {
      this.handleError(error, 'processNotification');
      return false;
    }
  }

  private generateSignature(data: any): string {
    const { order_id, status_code, gross_amount } = data;
    const dataString = `${order_id}${status_code}${gross_amount}${this.midtransServerKey}`;
    return crypto.createHash("sha512").update(dataString).digest("hex");
  }

  async processRefund(peminjamanId: string, alasanRefund: string): Promise<boolean> {
    try {
      this.logInfo('Processing refund', { peminjamanId });
      
      const pembayaran = await this.prisma.pembayaran.findUnique({
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

      if (pembayaran.refund) {
        throw new BadRequestError("Refund untuk pembayaran ini sudah ada");
      }

      try {
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

        if (response.data && response.data.status_code === "200") {
          await this.prisma.refund.create({
            data: {
              pembayaran_id: pembayaran.id,
              jumlah_refund: pembayaran.jumlah_bayar,
              status_redund: "PROCESSED",
              alasan_refund: alasanRefund,
              transaski_refund_midtrans_id: response.data.transaction_id || `refund-${pembayaran.id}`,
              tanggal_refund: new Date().toISOString().split("T")[0],
            }
          });

          await this.prisma.pembayaran.update({
            where: { id: pembayaran.id },
            data: {
              status_pembayaran: STATUSTRANSAKSI.REFUNDED
            }
          });

          this.logInfo('Refund processed successfully', { pembayaranId: pembayaran.id });
          return true;
        } else {
          throw new Error(`Midtrans refund failed: ${JSON.stringify(response.data)}`);
        }
      } catch (apiError: any) {
        this.logError("Error processing refund with Midtrans", apiError, { pembayaranId: pembayaran.id });

        await this.prisma.refund.create({
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
      this.handleError(error, 'processRefund');
      throw error;
    }
  }

  async checkRefundStatus(refundId: string): Promise<any> {
    try {
      this.logInfo('Checking refund status', { refundId });
      
      const refund = await this.prisma.refund.findUnique({
        where: { id: refundId },
        include: {
          pembayaran: true
        }
      });

      if (!refund) {
        throw new NotFoundError("Refund tidak ditemukan");
      }

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

      if (response.data && response.data.status_code === "200") {
        await this.prisma.refund.update({
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
      this.handleError(error, 'checkRefundStatus');
      throw new BadRequestError("Gagal memeriksa status refund");
    }
  }

  async autoProcessRefundForRejectedBooking(
    peminjamanId: string, 
    alasanPenolakan: string
  ): Promise<boolean> {
    try {
      const alasanRefund = `Refund otomatis: Peminjaman ditolak. ${alasanPenolakan}`;
      return await this.processRefund(peminjamanId, alasanRefund);
    } catch (error) {
      this.logError("Auto refund processing failed", error, { peminjamanId });
      return false;
    }
  }
}

export default new PembayaranService();