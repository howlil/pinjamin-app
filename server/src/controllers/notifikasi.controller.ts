import { Request, Response, NextFunction } from 'express';
import { NotifikasiService } from '../services/notifikasi.service';
import { UnauthorizedError } from '../configs/error.config';

export class NotifikasiController {
  private notifikasiService: NotifikasiService;

  constructor() {
    this.notifikasiService = new NotifikasiService();
  }

  getUserNotifikasi = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User tidak ditemukan dalam request');
      }
      
      const notifikasis = await this.notifikasiService.getNotifikasiByPengguna(req.user.id);
      
      res.status(200).json({
        success: true,
        message: 'Notifikasi berhasil diambil',
        data: notifikasis
      });
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User tidak ditemukan dalam request');
      }
      
      const { id } = req.params;
      await this.notifikasiService.markAsRead(id);
      
      res.status(200).json({
        success: true,
        message: 'Notifikasi berhasil ditandai sebagai dibaca',
        data: null
      });
    } catch (error) {
      next(error);
    }
  };

  // Menandai semua notifikasi sebagai dibaca
  markAllAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User tidak ditemukan dalam request');
      }
      
      const count = await this.notifikasiService.markAllAsRead(req.user.id);
      
      res.status(200).json({
        success: true,
        message: `${count} notifikasi berhasil ditandai sebagai dibaca`,
        data: { count }
      });
    } catch (error) {
      next(error);
    }
  };

  // Mendapatkan jumlah notifikasi yang belum dibaca
  getUnreadCount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User tidak ditemukan dalam request');
      }
      
      const count = await this.notifikasiService.getUnreadCount(req.user.id);
      
      res.status(200).json({
        success: true,
        message: 'Jumlah notifikasi yang belum dibaca berhasil diambil',
        data: { count }
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new NotifikasiController();