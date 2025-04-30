import { Request, Response, NextFunction } from "express";
import { PembayaranService } from "../services/pembayaran.service";
import { UnauthorizedError, BadRequestError } from "../configs/error.config";
import { refundSchema } from "../validations/pembayaran.validation";
import { ValidationUtil } from "../utils/validation.util";
import { logger } from "../configs/logger.config";
import { MIDTRANS_CONFIG } from "../configs/midtrans.config";

export class PembayaranController {
  private pembayaranService: PembayaranService;

  constructor() {
    this.pembayaranService = new PembayaranService();
  }

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

      // Create a Snap token for this booking
      const result = await this.pembayaranService.createSnapToken(
        peminjaman_id,
        req.user.id
      );

      res.status(200).json({
        success: true,
        message: "Token pembayaran berhasil dibuat",
        data: {
          snap_token: result.snapToken,
          redirect_url: result.redirectUrl,
          order_id: result.orderId,
          client_key: MIDTRANS_CONFIG.clientKey,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getAllPembayaran = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user || req.user.role !== "ADMIN") {
        throw new UnauthorizedError(
          "Hanya admin yang dapat melihat semua pembayaran"
        );
      }

      const response = await this.pembayaranService.getAllPembayaran();

      res.status(200).json({
        success: true,
        message: "Data pembayaran berhasil diambil",
        data: response,
      });
    } catch (error) {
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
        res.status(404).json({
          success: false,
          message: "Pembayaran tidak ditemukan",
          data: null,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Status pembayaran berhasil diambil",
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  };

  handleNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Log the notification
      logger.info("Received Midtrans notification", {
        notification: req.body,
      });

      // Process the notification
      const result = await this.pembayaranService.processNotification(req.body);

      res.status(200).json({
        success: true,
        message: "Notifikasi berhasil diproses",
      });
    } catch (error) {
      logger.error("Error processing Midtrans notification", {
        error,
        body: req.body,
      });

      // Always return 200 to Midtrans even if there's an error
      // This is to prevent Midtrans from retrying the notification
      res.status(200).json({
        success: false,
        message: "Terjadi kesalahan saat memproses notifikasi",
      });
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

      // Process the refund
      await this.pembayaranService.processRefund(
        peminjaman_id,
        validatedData.alasan_refund
      );

      res.status(200).json({
        success: true,
        message: "Refund berhasil diproses",
      });
    } catch (error) {
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
        throw new UnauthorizedError(
          "Hanya admin yang dapat memeriksa status refund"
        );
      }

      const { refund_id } = req.params;

      if (!refund_id) {
        throw new BadRequestError("ID refund diperlukan");
      }

      // Check the refund status
      const status = await this.pembayaranService.checkRefundStatus(refund_id);

      res.status(200).json({
        success: true,
        message: "Status refund berhasil diambil",
        data: status,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new PembayaranController();
