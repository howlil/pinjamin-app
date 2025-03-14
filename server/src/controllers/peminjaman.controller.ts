// src/controllers/peminjaman.controller.ts
import { Request, Response, NextFunction } from 'express';
import { PeminjamanService } from '../services/peminjaman.service';
import { peminjamanSchema, peminjamanUpdateSchema, peminjamanApprovalSchema } from '../validations/peminjaman.validation';
import { ValidationUtil } from '../utils/validation.util';
import { UnauthorizedError, ForbiddenError } from '../configs/error.config';
import { ROLE } from '@prisma/client';

export class PeminjamanController {
  private peminjamanService: PeminjamanService;
  
  constructor() {
    this.peminjamanService = new PeminjamanService();
  }
  
  getAllPeminjaman = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || req.user.role !== ROLE.ADMIN) {
        throw new UnauthorizedError('Hanya admin yang dapat melihat semua peminjaman');
      }
      
      const peminjamanList = await this.peminjamanService.getAllPeminjaman();
      
      res.status(200).json({
        success: true,
        message: 'Daftar peminjaman berhasil diambil',
        data: peminjamanList
      });
    } catch (error) {
      next(error);
    }
  };
  
  getPeminjamanById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const peminjaman = await this.peminjamanService.getPeminjamanById(id);
      
      // Check if user is authorized to view this peminjaman
      if (
        !req.user || 
        (req.user.role !== ROLE.ADMIN && req.user.id !== peminjaman.pengguna_id)
      ) {
        throw new ForbiddenError('Tidak memiliki akses untuk melihat peminjaman ini');
      }
      
      res.status(200).json({
        success: true,
        message: 'Detail peminjaman berhasil diambil',
        data: peminjaman
      });
    } catch (error) {
      next(error);
    }
  };
  
  getUserPeminjaman = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User tidak ditemukan dalam request');
      }
      
      const userId = req.user.id;
      const peminjamanList = await this.peminjamanService.getPeminjamanByUserId(userId);
      
      res.status(200).json({
        success: true,
        message: 'Daftar peminjaman pengguna berhasil diambil',
        data: peminjamanList
      });
    } catch (error) {
      next(error);
    }
  };
  
  createPeminjaman = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User tidak ditemukan dalam request');
      }
      
      const validatedData = ValidationUtil.validateBody(req, peminjamanSchema);
      const peminjaman = await this.peminjamanService.createPeminjaman(validatedData, req.user.id);
      
      res.status(201).json({
        success: true,
        message: 'Peminjaman berhasil dibuat',
        data: peminjaman
      });
    } catch (error) {
      next(error);
    }
  };
  
  updatePeminjaman = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User tidak ditemukan dalam request');
      }
      
      const { id } = req.params;
      const peminjaman = await this.peminjamanService.getPeminjamanById(id);
      
      // Check if user is authorized to update this peminjaman
      if (
        req.user.role !== ROLE.ADMIN && 
        req.user.id !== peminjaman.pengguna_id
      ) {
        throw new ForbiddenError('Tidak memiliki akses untuk mengubah peminjaman ini');
      }
      
      const validatedData = ValidationUtil.validateBody(req, peminjamanUpdateSchema);
      const updatedPeminjaman = await this.peminjamanService.updatePeminjaman(id, validatedData);
      
      res.status(200).json({
        success: true,
        message: 'Peminjaman berhasil diperbarui',
        data: updatedPeminjaman
      });
    } catch (error) {
      next(error);
    }
  };
  
  deletePeminjaman = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User tidak ditemukan dalam request');
      }
      
      const { id } = req.params;
      const peminjaman = await this.peminjamanService.getPeminjamanById(id);
      
      // Check if user is authorized to delete this peminjaman
      if (
        req.user.role !== ROLE.ADMIN && 
        req.user.id !== peminjaman.pengguna_id
      ) {
        throw new ForbiddenError('Tidak memiliki akses untuk menghapus peminjaman ini');
      }
      
      await this.peminjamanService.deletePeminjaman(id);
      
      res.status(200).json({
        success: true,
        message: 'Peminjaman berhasil dihapus',
        data: null
      });
    } catch (error) {
      next(error);
    }
  };
  
  approvePeminjaman = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || req.user.role !== ROLE.ADMIN) {
        throw new UnauthorizedError('Hanya admin yang dapat menyetujui atau menolak peminjaman');
      }
      
      const { id } = req.params;
      const validatedData = ValidationUtil.validateBody(req, peminjamanApprovalSchema);
      const peminjaman = await this.peminjamanService.approvePeminjaman(id, validatedData);
      
      res.status(200).json({
        success: true,
        message: `Peminjaman berhasil ${validatedData.status_peminjaman === 'DISETUJUI' ? 'disetujui' : 'ditolak'}`,
        data: peminjaman
      });
    } catch (error) {
      next(error);
    }
  };
  
  getPeminjamanStatistics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || req.user.role !== ROLE.ADMIN) {
        throw new UnauthorizedError('Hanya admin yang dapat melihat statistik peminjaman');
      }
      
      const statistics = await this.peminjamanService.getPeminjamanStatistics();
      
      res.status(200).json({
        success: true,
        message: 'Statistik peminjaman berhasil diambil',
        data: statistics
      });
    } catch (error) {
      next(error);
    }
  };
}