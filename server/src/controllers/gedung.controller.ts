// server/src/controllers/gedung.controller.ts
import { Request, Response, NextFunction } from "express";
import { GedungService } from "../services/gedung.service";
import { ValidationUtil } from "../utils/validation.util";
import {
  gedungSchema,
  gedungUpdateSchema,
  gedungFilterSchema,
  availabilityCheckSchema,
} from "../validations/gedung.validation";
import { UnauthorizedError } from "../configs/error.config";
import { BaseController } from "./base.controller";
import fs from 'fs';
import path from 'path';

export class GedungController extends BaseController {
  private gedungService: GedungService;

  constructor() {
    super('GedungController');
    this.gedungService = new GedungService();
  }

  index = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const filter = req.query
        ? ValidationUtil.validateQuery(req, gedungFilterSchema)
        : undefined;

      const gedung = await this.gedungService.getAllGedung(filter);
      
      this.sendSuccess(res, "Daftar gedung berhasil diambil", gedung);
    } catch (error) {
      this.logError("Error fetching gedung list", error);
      next(error);
    }
  };

  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user || req.user.role !== "ADMIN") {
        throw new UnauthorizedError("Hanya admin yang dapat menambahkan gedung");
      }

      const validatedData = ValidationUtil.validateBody(req, gedungSchema);
      const gedung = await this.gedungService.createGedung(validatedData);
      
      this.sendSuccess(res, "Gedung berhasil ditambahkan", gedung, 201);
    } catch (error) {
      if (req.file) {
        const filePath = path.join(process.cwd(), 'public', req.body.foto_gedung);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      this.logError("Error creating gedung", error);
      next(error);
    }
  };

  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user || req.user.role !== "ADMIN") {
        throw new UnauthorizedError("Hanya admin yang dapat mengubah gedung");
      }

      const { id } = req.params;
      const validatedData = ValidationUtil.validateBody(req, gedungUpdateSchema);
      
      const existingGedung = await this.gedungService.getGedungById(id);
      let oldImagePath = '';
      
      if (existingGedung.foto_gedung) {
        oldImagePath = path.join(process.cwd(), 'public', existingGedung.foto_gedung);
      }

      const gedung = await this.gedungService.updateGedung(id, validatedData);

      if (req.file && oldImagePath && fs.existsSync(oldImagePath) && 
          existingGedung.foto_gedung !== validatedData.foto_gedung) {
        fs.unlinkSync(oldImagePath);
      }

      this.sendSuccess(res, "Gedung berhasil diperbarui", gedung);
    } catch (error) {
      if (req.file) {
        const filePath = path.join(process.cwd(), 'public', req.body.foto_gedung);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      this.logError("Error updating gedung", error);
      next(error);
    }
  };

  delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user || req.user.role !== "ADMIN") {
        throw new UnauthorizedError("Hanya admin yang dapat menghapus gedung");
      }

      const { id } = req.params;
      const existingGedung = await this.gedungService.getGedungById(id);
      
      await this.gedungService.deleteGedung(id);
      
      if (existingGedung.foto_gedung) {
        const imagePath = path.join(process.cwd(), 'public', existingGedung.foto_gedung);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      this.sendSuccess(res, "Gedung berhasil dihapus", null);
    } catch (error) {
      this.logError("Error deleting gedung", error);
      next(error);
    }
  };

  show = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const gedung = await this.gedungService.getGedungById(id);
      
      this.sendSuccess(res, "Gedung berhasil diambil", gedung);
    } catch (error) {
      this.logError("Error fetching gedung detail", error);
      next(error);
    }
  };

  checkGedungAvailability = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validatedData = ValidationUtil.validateBody(req, availabilityCheckSchema);
      const availableGedungs = await this.gedungService.checkGedungAvailability(validatedData);

      const message = availableGedungs.length > 0 
        ? "Daftar gedung yang tersedia pada waktu yang ditentukan" 
        : "Tidak ada gedung yang tersedia pada waktu yang ditentukan";
        
      this.sendSuccess(res, message, availableGedungs);
    } catch (error) {
      this.logError("Error checking gedung availability", error);
      next(error);
    }
  };
}

export default new GedungController();