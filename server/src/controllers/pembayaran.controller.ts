// src/controllers/pembayaran.controller.ts
import { Request, Response, NextFunction } from 'express';
import { PembayaranService } from '../services/pembayaran.service';
import { UnauthorizedError, BadRequestError } from '../configs/error.config';
import { pembayaranCreateSchema } from '../validations/pembayaran.validation';
import { ValidationUtil } from '../utils/validation.util';
import { logger } from '../configs/logger.config';
import { MIDTRANS_CONFIG } from '../configs/midtrans.config';

export class PembayaranController {
  private pembayaranService: PembayaranService;

  constructor() {
    this.pembayaranService = new PembayaranService();
  }

  /**
   * Create a payment for a booking
   */
  createPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Autentikasi diperlukan');
      }

      const { peminjaman_id } = req.params;
      
      if (!peminjaman_id) {
        throw new BadRequestError('ID peminjaman diperlukan');
      }

      // Create a Snap token for this booking
      const result = await this.pembayaranService.createSnapToken(
        peminjaman_id,
        req.user.id
      );

      res.status(200).json({
        success: true,
        message: 'Token pembayaran berhasil dibuat',
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

  /**
   * Get payment status for a booking
   */
  getPaymentStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Autentikasi diperlukan');
      }

      const { peminjaman_id } = req.params;
      
      if (!peminjaman_id) {
        throw new BadRequestError('ID peminjaman diperlukan');
      }

      const payment = await this.pembayaranService.getPembayaranByPeminjamanId(peminjaman_id);

      if (!payment) {
        res.status(404).json({
          success: false,
          message: 'Pembayaran tidak ditemukan',
          data: null,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Status pembayaran berhasil diambil',
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handle webhook notifications from Midtrans
   */
  handleNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Log the notification
      logger.info('Received Midtrans notification', { 
        notification: req.body 
      });

      // Process the notification
      const result = await this.pembayaranService.processNotification(req.body);

      res.status(200).json({
        success: true,
        message: 'Notifikasi berhasil diproses',
      });
    } catch (error) {
      logger.error('Error processing Midtrans notification', { 
        error, 
        body: req.body 
      });
      
      // Always return 200 to Midtrans even if there's an error
      // This is to prevent Midtrans from retrying the notification
      res.status(200).json({
        success: false,
        message: 'Terjadi kesalahan saat memproses notifikasi',
      });
    }
  };
}

export default new PembayaranController();