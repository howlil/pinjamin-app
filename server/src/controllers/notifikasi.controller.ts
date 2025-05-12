// server/src/controllers/notifikasi.controller.ts
import { Request, Response, NextFunction } from 'express';
import { NotifikasiService } from '../services/notifikasi.service';
import { UnauthorizedError } from '../configs/error.config';
import { BaseController } from './base.controller';

export class NotifikasiController extends BaseController {
  private notifikasiService: NotifikasiService;

  constructor() {
    super('NotifikasiController');
    this.notifikasiService = new NotifikasiService();
  }

  index = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User tidak ditemukan dalam request');
      }
      
      const notifikasis = await this.notifikasiService.getNotifikasiByPengguna(req.user.id);
      this.sendSuccess(res, 'Notifikasi berhasil diambil', notifikasis);
    } catch (error) {
      this.logError('Error fetching notifications', error);
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
      
      this.sendSuccess(res, 'Notifikasi berhasil ditandai sebagai dibaca', null);
    } catch (error) {
      this.logError('Error marking notification as read', error);
      next(error);
    }
  };

  markAllAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User tidak ditemukan dalam request');
      }
      
      const count = await this.notifikasiService.markAllAsRead(req.user.id);
      
      this.sendSuccess(res, `${count} notifikasi berhasil ditandai sebagai dibaca`, { count });
    } catch (error) {
      this.logError('Error marking all notifications as read', error);
      next(error);
    }
  };

  getUnreadCount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User tidak ditemukan dalam request');
      }
      
      const count = await this.notifikasiService.getUnreadCount(req.user.id);
      
      this.sendSuccess(res, 'Jumlah notifikasi yang belum dibaca berhasil diambil', { count });
    } catch (error) {
      this.logError('Error fetching unread count', error);
      next(error);
    }
  };
}

export default new NotifikasiController();