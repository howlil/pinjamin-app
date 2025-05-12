// server/src/controllers/pengguna.controller.ts
import { Request, Response, NextFunction } from "express";
import { PenggunaService } from "../services/pengguna.service";
import { UnauthorizedError } from "../configs/error.config";
import {
  penggunaLoginSchema,
  penggunaSchema,
  penggunaUpdateSchema,
} from "../validations/pengguna.validation";
import { ValidationUtil } from "../utils/validation.util";
import { BaseController } from "./base.controller";

export class PenggunaController extends BaseController {
  private penggunaService: PenggunaService;

  constructor() {
    super('PenggunaController');
    this.penggunaService = new PenggunaService();
  }

  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validatedData = ValidationUtil.validateBody(req, penggunaSchema);
      const result = await this.penggunaService.register(validatedData);
      
      this.sendSuccess(res, "Pengguna berhasil terdaftar", result, 201);
    } catch (error) {
      this.logError("Error registering user", error);
      next(error);
    }
  };

  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("User tidak ditemukan dalam request");
      }

      const validatedData = ValidationUtil.validateBody(
        req,
        penggunaUpdateSchema
      );

      const result = await this.penggunaService.updateProfile(
        req.user.id,
        validatedData
      );

      this.sendSuccess(res, "Profil berhasil diperbarui", result);
    } catch (error) {
      this.logError("Error updating profile", error);
      next(error);
    }
  };

  show = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("User tidak ditemukan dalam request");
      }

      const result = await this.penggunaService.getProfile(req.user.id);
      
      this.sendSuccess(res, "Profil berhasil diambil", result);
    } catch (error) {
      this.logError("Error fetching profile", error);
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validatedData = ValidationUtil.validateBody(
        req,
        penggunaLoginSchema
      );

      const result = await this.penggunaService.login(validatedData);
      
      this.sendSuccess(res, "Login berhasil", result);
    } catch (error) {
      this.logError("Error during login", error);
      next(error);
    }
  };

  logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("User tidak ditemukan dalam request");
      }

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("Token tidak ditemukan");
      }

      const token = authHeader.split(" ")[1];
      await this.penggunaService.logout(token);

      this.sendSuccess(res, "Logout berhasil", null);
    } catch (error) {
      this.logError("Error during logout", error);
      next(error);
    }
  };
}

export default new PenggunaController();