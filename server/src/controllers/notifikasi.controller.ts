// src/controllers/notifikasi.controller.ts
import { Request, Response, NextFunction } from 'express';
import { NotifikasiService } from '../services/notifikasi.service';
import { notifikasiSchema, notifikasiUpdateSchema } from '../validations/notifikasi.validation';
import { ValidationUtil } from '../utils/validation.util';
import { UnauthorizedError, ForbiddenError } from '../configs/error.config';
import { ROLE } from '@prisma/client';

export class NotifikasiController {
  private notifikasiService: NotifikasiService;
  
  constructor() {
    this.notifikasiService = new NotifikasiService();
  }
  
  getAllNotifikasi = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || req.user.role !== ROLE.ADMIN) {
        throw new UnauthorizedError('Hanya admin yang dapat melihat semua notifikasi');
      }
      
      const notifikasiList = await this.notifikasiService.getAllNotifikasi();
      
      res.status(200).json({
        success: true,
        message: 'Daftar notifikasi berhasil diambil',
        data: notifikasiList
      });
    } catch (error) {
      next(error);
    }
  };
  
  getNotifikasiById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User tidak ditemukan dalam request');
      }
      
      const { id } = req.params;
      const notifikasi = await this.notifikasiService.getNotifikasiById(id);
      
      // Check if user is authorized to view this notifikasi
      if (
        req.user.role !== ROLE.ADMIN && 
        req.user.id !== notifikasi.pengguna_id
      ) {
        throw new ForbiddenError('Tidak memiliki akses untuk melihat notifikasi ini');
      }
      
      res.status(200).json({
        success: true,
        message: 'Detail notifikasi berhasil diambil',
        data: notifikasi
      });
    } catch (error) {
      next(error);
    }
  };
  
  getUserNotifikasi = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User tidak ditemukan dalam request');
      }
      
      const notifikasiList = await this.notifikasiService.getNotifikasiByUserId(req.user.id);
      
      res.status(200).json({
        success: true,
        message: 'Daftar notifikasi pengguna berhasil diambil',
        data: notifikasiList
      });
    } catch (error) {
      next(error);
    }
  };
  
  getUnreadNotifikasiCount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User tidak ditemukan dalam request');
      }
      
      const count = await this.notifikasiService.getUnreadNotifikasiCount(req.user.id);
      
      res.status(200).json({
        success: true,
        message: 'Jumlah notifikasi belum dibaca berhasil diambil',
        data: { count }
      });
    } catch (error) {
      next(error);
    }
  };
  
  createNotifikasi = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || req.user.role !== ROLE.ADMIN) {
        throw new UnauthorizedError('Hanya admin yang dapat membuat notifikasi');
      }
      
      const validatedData = ValidationUtil.validateBody(req, notifikasiSchema);
      const notifikasi = await this.notifikasiService.createNotifikasi(validatedData);
      
      res.status(201).json({
        success: true,
        message: 'Notifikasi berhasil dibuat',
        data: notifikasi
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
      const notifikasi = await this.notifikasiService.getNotifikasiById(id);
      
      // Check if user is authorized to mark this notifikasi as read
      if (req.user.id !== notifikasi.pengguna_id && req.user.role !== ROLE.ADMIN) {
        throw new ForbiddenError('Tidak memiliki akses untuk mengubah notifikasi ini');
      }
      
      const updatedNotifikasi = await this.notifikasiService.markAsRead(id);
      
      res.status(200).json({
        success: true,
        message: 'Notifikasi berhasil ditandai telah dibaca',
        data: updatedNotifikasi
      });
    } catch (error) {
      next(error);
    }
  };
  
  markAllAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User tidak ditemukan dalam request');
      }
      
      const count = await this.notifikasiService.markAllAsRead(req.user.id);
      
      res.status(200).json({
        success: true,
        message: `${count} notifikasi berhasil ditandai telah dibaca`,
        data: { count }
      });
    } catch (error) {
      next(error);
    }
  };
  
  deleteNotifikasi = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User tidak ditemukan dalam request');
      }
      
      const { id } = req.params;
      const notifikasi = await this.notifikasiService.getNotifikasiById(id);
      
      // Check if user is authorized to delete this notifikasi
      if (
        req.user.role !== ROLE.ADMIN && 
        req.user.id !== notifikasi.pengguna_id
      ) {
        throw new ForbiddenError('Tidak memiliki akses untuk menghapus notifikasi ini');
      }
      
      await this.notifikasiService.deleteNotifikasi(id);
      
      res.status(200).json({
        success: true,
        message: 'Notifikasi berhasil dihapus',
        data: null
      });
    } catch (error) {
      next(error);
    }
  };
}