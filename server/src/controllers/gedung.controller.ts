// src/controllers/gedung.controller.ts
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
import { IController } from "../interfaces/controller.interface";
import fs from 'fs';
import path from 'path';

export class GedungController implements IController {
  private gedungService: GedungService;

  constructor() {
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

      res.status(200).json({
        success: true,
        message: "Daftar gedung berhasil diambil",
        data: gedung,
      });
    } catch (error) {
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
        throw new UnauthorizedError(
          "Hanya admin yang dapat menambahkan gedung"
        );
      }

      const validatedData = ValidationUtil.validateBody(req, gedungSchema);

      const gedung = await this.gedungService.createGedung(validatedData);

      res.status(201).json({
        success: true,
        message: "Gedung berhasil ditambahkan",
        data: gedung,
      });
    } catch (error) {
      if (req.file) {
        const filePath = path.join(process.cwd(), 'public', req.body.foto_gedung);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
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
      
      // Get existing gedung to check for previous foto_gedung
      const existingGedung = await this.gedungService.getGedungById(id);
      let oldImagePath = '';
      
      if (existingGedung.foto_gedung) {
        oldImagePath = path.join(process.cwd(), 'public', existingGedung.foto_gedung);
      }

      // Update the gedung
      const gedung = await this.gedungService.updateGedung(id, validatedData);

      // If a new image was uploaded and there was an old one, delete the old one
      if (req.file && oldImagePath && fs.existsSync(oldImagePath) && 
          existingGedung.foto_gedung !== validatedData.foto_gedung) {
        fs.unlinkSync(oldImagePath);
      }

      res.status(200).json({
        success: true,
        message: "Gedung berhasil diperbarui",
        data: gedung,
      });
    } catch (error) {
      // If there was an error and a new file was uploaded, clean it up
      if (req.file) {
        const filePath = path.join(process.cwd(), 'public', req.body.foto_gedung);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
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

      res.status(200).json({
        success: true,
        message: "Gedung berhasil dihapus",
        data: null,
      });
    } catch (error) {
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

      res.status(200).json({
        success: true,
        message: "Gedung berhasil diambil",
        data: gedung,
      });
    } catch (error) {
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

      res.status(200).json({
        success: true,
        message: availableGedungs.length > 0 
          ? "Daftar gedung yang tersedia pada waktu yang ditentukan" 
          : "Tidak ada gedung yang tersedia pada waktu yang ditentukan",
        data: availableGedungs,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new GedungController();