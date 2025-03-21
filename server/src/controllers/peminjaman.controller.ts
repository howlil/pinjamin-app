import { Request, Response, NextFunction } from 'express';
import { PeminjamanService } from '../services/peminjaman.service';
import { ValidationUtil } from '../utils/validation.util';
import { 
  peminjamanSchema, 
  peminjamanUpdateSchema,
  peminjamanApprovalSchema
} from '../validations/peminjaman.validation';
import { IPeminjamanService } from '../interfaces/services/peminjaman.interface';
import { UnauthorizedError, ForbiddenError } from '../configs/error.config';
import { IController } from '../interfaces/controller.interface';
import { ROLE } from '@prisma/client';

export class PeminjamanController implements IController {
  private peminjamanService: IPeminjamanService;

  constructor() {
    this.peminjamanService = new PeminjamanService();
  }

  index = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User tidak ditemukan dalam request');
      }
      
      // Hanya admin yang bisa melihat semua peminjaman
      if (req.user.role !== ROLE.ADMIN) {
        throw new ForbiddenError('Tidak memiliki akses untuk melihat semua peminjaman');
      }
      
      const peminjamans = await this.peminjamanService.getAllPeminjaman();
      
      res.status(200).json({
        success: true,
        message: 'Daftar peminjaman berhasil diambil',
        data: peminjamans
      });
    } catch (error) {
      next(error);
    }
  };

  // Membuat peminjaman baru
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User tidak ditemukan dalam request');
      }
      
      const validatedData = ValidationUtil.validateBody(req, peminjamanSchema);
      
      // Otomatis set pengguna_id jika tidak diberikan
      const peminjamanData = {
        ...validatedData,
        pengguna_id: validatedData.pengguna_id || req.user.id
      };
      
      const peminjaman = await this.peminjamanService.createPeminjaman(peminjamanData);
      
      res.status(201).json({
        success: true,
        message: 'Peminjaman berhasil dibuat',
        data: peminjaman
      });
    } catch (error) {
      next(error);
    }
  };

  // Mengupdate peminjaman
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User tidak ditemukan dalam request');
      }
      
      const { id } = req.params;
      const validatedData = ValidationUtil.validateBody(req, peminjamanUpdateSchema);
      
      // Verifikasi pemilik atau admin
      const existingPeminjaman = await this.peminjamanService.getPeminjamanById(id);
      
      if (req.user.role !== ROLE.ADMIN && existingPeminjaman.pengguna_id !== req.user.id) {
        throw new ForbiddenError('Anda tidak memiliki akses untuk memperbarui peminjaman ini');
      }
      
      const peminjaman = await this.peminjamanService.updatePeminjaman(id, validatedData);
      
      res.status(200).json({
        success: true,
        message: 'Peminjaman berhasil diperbarui',
        data: peminjaman
      });
    } catch (error) {
      next(error);
    }
  };

  // Menghapus peminjaman
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User tidak ditemukan dalam request');
      }
      
      const { id } = req.params;
      
      // Verifikasi pemilik atau admin
      const existingPeminjaman = await this.peminjamanService.getPeminjamanById(id);
      
      if (req.user.role !== ROLE.ADMIN && existingPeminjaman.pengguna_id !== req.user.id) {
        throw new ForbiddenError('Anda tidak memiliki akses untuk menghapus peminjaman ini');
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

  // Melihat detail peminjaman
  show = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User tidak ditemukan dalam request');
      }
      
      const { id } = req.params;
      const peminjaman = await this.peminjamanService.getPeminjamanById(id);
      
      // Verifikasi pemilik atau admin untuk non-admin
      if (req.user.role !== ROLE.ADMIN && peminjaman.pengguna_id !== req.user.id) {
        throw new ForbiddenError('Anda tidak memiliki akses untuk melihat peminjaman ini');
      }
      
      res.status(200).json({
        success: true,
        message: 'Peminjaman berhasil diambil',
        data: peminjaman
      });
    } catch (error) {
      next(error);
    }
  };

  // Menyetujui atau menolak peminjaman (Admin only)
  approvePeminjaman = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User tidak ditemukan dalam request');
      }
      
      // Hanya admin yang dapat menyetujui/menolak peminjaman
      if (req.user.role !== ROLE.ADMIN) {
        throw new ForbiddenError('Hanya admin yang dapat menyetujui/menolak peminjaman');
      }
      
      const { id } = req.params;
      const validatedData = ValidationUtil.validateBody(req, peminjamanApprovalSchema);
      
      const peminjaman = await this.peminjamanService.approvePeminjaman(id, validatedData);
      
      res.status(200).json({
        success: true,
        message: `Peminjaman berhasil ${validatedData.status_peminjaman === 'DISETUJUI' ? 'disetujui' : 'diperbarui'}`,
        data: peminjaman
      });
    } catch (error) {
      next(error);
    }
  };

  // Mendapatkan riwayat peminjaman user
  getUserPeminjaman = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User tidak ditemukan dalam request');
      }
      
      const peminjamans = await this.peminjamanService.getPeminjamanByPengguna(req.user.id);
      
      res.status(200).json({
        success: true,
        message: 'Riwayat peminjaman berhasil diambil',
        data: peminjamans
      });
    } catch (error) {
      next(error);
    }
  };

  // Mendapatkan statistik peminjaman (Admin only)
  getStatistics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || req.user.role !== ROLE.ADMIN) {
        throw new ForbiddenError('Hanya admin yang dapat melihat statistik peminjaman');
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

export default new PeminjamanController();