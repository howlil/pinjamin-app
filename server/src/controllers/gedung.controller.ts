import { Request, Response, NextFunction } from 'express';
import { GedungService } from '../services/gedung.service';
import { gedungSchema, gedungUpdateSchema, gedungFilterSchema } from '../validations/gedung.validation';
import { ValidationUtil } from '../utils/validation.util';
import { BadRequestError, UnauthorizedError } from '../configs/error.config';
import { ROLE } from '@prisma/client';

export class GedungController {
  private gedungService: GedungService;
  
  constructor() {
    this.gedungService = new GedungService();
  }
  
  getAllGedung = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filter = req.query ? ValidationUtil.validateQuery(req, gedungFilterSchema) : undefined;
      const gedungList = await this.gedungService.getAllGedung(filter);
      
      res.status(200).json({
        success: true,
        message: 'Daftar gedung berhasil diambil',
        data: gedungList
      });
    } catch (error) {
      next(error);
    }
  };
  
  getGedungById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const gedung = await this.gedungService.getGedungById(id);
      
      res.status(200).json({
        success: true,
        message: 'Detail gedung berhasil diambil',
        data: gedung
      });
    } catch (error) {
      next(error);
    }
  };
  
  createGedung = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || req.user.role !== ROLE.ADMIN) {
        throw new UnauthorizedError('Hanya admin yang dapat membuat gedung');
      }
      
      const validatedData = ValidationUtil.validateBody(req, gedungSchema);
      const gedung = await this.gedungService.createGedung(validatedData);
      
      res.status(201).json({
        success: true,
        message: 'Gedung berhasil dibuat',
        data: gedung
      });
    } catch (error) {
      next(error);
    }
  };
  
  updateGedung = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || req.user.role !== ROLE.ADMIN) {
        throw new UnauthorizedError('Hanya admin yang dapat mengubah gedung');
      }
      
      const { id } = req.params;
      const validatedData = ValidationUtil.validateBody(req, gedungUpdateSchema);
      const gedung = await this.gedungService.updateGedung(id, validatedData);
      
      res.status(200).json({
        success: true,
        message: 'Gedung berhasil diperbarui',
        data: gedung
      });
    } catch (error) {
      next(error);
    }
  };
  
  deleteGedung = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || req.user.role !== ROLE.ADMIN) {
        throw new UnauthorizedError('Hanya admin yang dapat menghapus gedung');
      }
      
      const { id } = req.params;
      await this.gedungService.deleteGedung(id);
      
      res.status(200).json({
        success: true,
        message: 'Gedung berhasil dihapus',
        data: null
      });
    } catch (error) {
      next(error);
    }
  };
  
  checkGedungAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { gedungId, tanggalMulai, tanggalSelesai } = req.query as { 
        gedungId: string; 
        tanggalMulai: string;
        tanggalSelesai: string;
      };
      
      if (!gedungId || !tanggalMulai || !tanggalSelesai) {
        throw new BadRequestError('ID gedung, tanggal mulai, dan tanggal selesai diperlukan');
      }
      
      const isAvailable = await this.gedungService.checkGedungAvailability(
        gedungId,
        tanggalMulai,
        tanggalSelesai
      );
      
      res.status(200).json({
        success: true,
        message: 'Ketersediaan gedung berhasil diperiksa',
        data: { 
          gedungId, 
          tanggalMulai, 
          tanggalSelesai, 
          isAvailable 
        }
      });
    } catch (error) {
      next(error);
    }
  };
  
  getAvailableGedung = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tanggalMulai, tanggalSelesai } = req.query as {
        tanggalMulai: string;
        tanggalSelesai: string;
      };
      
      if (!tanggalMulai || !tanggalSelesai) {
        throw new BadRequestError('Tanggal mulai dan tanggal selesai diperlukan');
      }
      
      const filter = req.query ? ValidationUtil.validateQuery(req, gedungFilterSchema) : undefined;
      
      const availableGedung = await this.gedungService.getAvailableGedung(
        tanggalMulai,
        tanggalSelesai,
        filter
      );
      
      res.status(200).json({
        success: true,
        message: 'Daftar gedung tersedia berhasil diambil',
        data: availableGedung
      });
    } catch (error) {
      next(error);
    }
  };
}