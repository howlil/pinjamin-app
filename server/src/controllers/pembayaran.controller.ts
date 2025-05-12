// server/src/controllers/pembayaran.controller.ts
import { Request, Response, NextFunction } from "express";
import { PembayaranService } from "../services/pembayaran.service";
import { UnauthorizedError, BadRequestError } from "../configs/error.config";
import { refundSchema } from "../validations/refund.validation";
import { ValidationUtil } from "../utils/validation.util";
import { BaseController } from "./base.controller";
import { MIDTRANS_CONFIG } from "../configs/midtrans.config";

export class PembayaranController extends BaseController {
  private pembayaranService: PembayaranService;

  constructor() {
    super('PembayaranController');
    this.pembayaranService = new PembayaranService();
  }

  index = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user || req.user.role !== "ADMIN") {
        throw new UnauthorizedError("Hanya admin yang dapat melihat semua pembayaran");
      }

      const response = await this.pembayaranService.getAllPembayaran();
      this.sendSuccess(res, "Data pembayaran berhasil diambil", response);
    } catch (error) {
      this.logError("Error fetching all payments", error);
      next(error);
    }
  };

  createPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Autentikasi diperlukan");
      }

      const { peminjaman_id } = req.params;
      if (!peminjaman_id) {
        throw new BadRequestError("ID peminjaman diperlukan");
      }

      const result = await this.pembayaranService.createSnapToken(
        peminjaman_id,
        req.user.id
      );

      this.sendSuccess(res, "Token pembayaran berhasil dibuat", {
        snap_token: result.snapToken,
        redirect_url: result.redirectUrl,
        order_id: result.orderId,
        client_key: MIDTRANS_CONFIG.clientKey,
      });
    } catch (error) {
      this.logError("Error creating payment", error);
      next(error);
    }
  };

  getPaymentStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Autentikasi diperlukan");
      }

      const { peminjaman_id } = req.params;
      if (!peminjaman_id) {
        throw new BadRequestError("ID peminjaman diperlukan");
      }

      const payment = await this.pembayaranService.getPembayaranByPeminjamanId(
        peminjaman_id
      );

      if (!payment) {
        this.sendError(res, "Pembayaran tidak ditemukan", 404);
        return;
      }

      this.sendSuccess(res, "Status pembayaran berhasil diambil", payment);
    } catch (error) {
      this.logError("Error fetching payment status", error);
      next(error);
    }
  };

  handleNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      this.logInfo("Received Midtrans notification", req.body);
      
      const result = await this.pembayaranService.processNotification(req.body);
      
      this.sendSuccess(res, "Notifikasi berhasil diproses");
    } catch (error) {
      this.logError("Error processing Midtrans notification", {
        error,
        body: req.body,
      });
      
      // Always return 200 to Midtrans even if there's an error
      this.sendSuccess(res, "Terjadi kesalahan saat memproses notifikasi");
    }
  };

  processRefund = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user || req.user.role !== "ADMIN") {
        throw new UnauthorizedError("Hanya admin yang dapat memproses refund");
      }

      const { peminjaman_id } = req.params;
      if (!peminjaman_id) {
        throw new BadRequestError("ID peminjaman diperlukan");
      }

      const validatedData = ValidationUtil.validateBody(req, refundSchema);
      
      await this.pembayaranService.processRefund(
        peminjaman_id,
        validatedData.alasan_refund
      );

      this.sendSuccess(res, "Refund berhasil diproses");
    } catch (error) {
      this.logError("Error processing refund", error);
      next(error);
    }
  };

  checkRefundStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user || req.user.role !== "ADMIN") {
        throw new UnauthorizedError("Hanya admin yang dapat memeriksa status refund");
      }

      const { refund_id } = req.params;
      if (!refund_id) {
        throw new BadRequestError("ID refund diperlukan");
      }

      const status = await this.pembayaranService.checkRefundStatus(refund_id);
      
      this.sendSuccess(res, "Status refund berhasil diambil", status);
    } catch (error) {
      this.logError("Error checking refund status", error);
      next(error);
    }
  };
}

export default new PembayaranController();