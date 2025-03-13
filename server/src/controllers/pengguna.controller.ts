// src/controllers/pengguna.controller.ts
import { Request, Response, NextFunction } from 'express';
import { PenggunaService } from '../services/pengguna.service';
import { UnauthorizedError } from '../configs/error.config';
import { 
  penggunaLoginSchema, 
  penggunaSchema, 
  penggunaUpdateSchema 
} from '../validations/pengguna.validation';
import { ValidationUtil } from '../utils/validation.util';
import { IPenggunaService } from '../interfaces/pengguna.service.interface';

export class PenggunaController {
  private penggunaService: IPenggunaService;

  constructor() {
    this.penggunaService = new PenggunaService();
  }

  /**
   * Register pengguna baru
   */
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validasi dengan utility
      const validatedData = ValidationUtil.validateBody(req, penggunaSchema);
      
      const result = await this.penggunaService.register(validatedData);
      
      res.status(201).json({
        success: true,
        message: 'Pengguna berhasil terdaftar',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login pengguna
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validasi dengan utility
      const validatedData = ValidationUtil.validateBody(req, penggunaLoginSchema);
      
      const result = await this.penggunaService.login(validatedData);
      
      res.status(200).json({
        success: true,
        message: 'Login berhasil',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Mendapatkan profil pengguna
   */
  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User tidak ditemukan dalam request');
      }
      
      const result = await this.penggunaService.getProfile(req.user.id);
      
      res.status(200).json({
        success: true,
        message: 'Profil berhasil diambil',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update profil pengguna
   */
  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User tidak ditemukan dalam request');
      }
      
      // Validasi dengan utility
      const validatedData = ValidationUtil.validateBody(req, penggunaUpdateSchema);
      
      const result = await this.penggunaService.updateProfile(req.user.id, validatedData);
      
      res.status(200).json({
        success: true,
        message: 'Profil berhasil diperbarui',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Logout pengguna
   */
  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User tidak ditemukan dalam request');
      }
      
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Token tidak ditemukan');
      }
      
      const token = authHeader.split(' ')[1];
      await this.penggunaService.logout(token);
      
      res.status(200).json({
        success: true,
        message: 'Logout berhasil',
        data: null
      });
    } catch (error) {
      next(error);
    }
  };
}