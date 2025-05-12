// server/src/controllers/tipe-gedung.controller.ts
import { Request, Response, NextFunction } from "express";
import { TipeGedungService } from "../services/tipe-gedung.service";
import { ValidationUtil } from "../utils/validation.util";
import {
  tipeGedungSchema,
  tipeGedungUpdateSchema,
} from "../validations/tipe-gedung.validation";
import { UnauthorizedError } from "../configs/error.config";
import { BaseController } from "./base.controller";

export class TipeGedungController extends BaseController {
  private tipeGedungService: TipeGedungService;

  constructor() {
    super('TipeGedungController');
    this.tipeGedungService = new TipeGedungService();
  }

  index = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tipeGedung = await this.tipeGedungService.getAllTipeGedung();
      this.sendSuccess(res, "Daftar tipe gedung berhasil diambil", tipeGedung);
    } catch (error) {
      this.logError("Error fetching building types", error);
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
        throw new UnauthorizedError("Hanya admin yang dapat menambahkan tipe gedung");
      }

      const validatedData = ValidationUtil.validateBody(req, tipeGedungSchema);
      const newTipeGedung = await this.tipeGedungService.createTipeGedung(validatedData);

      this.sendSuccess(res, "Tipe gedung berhasil ditambahkan", newTipeGedung, 201);
    } catch (error) {
      this.logError("Error creating building type", error);
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
        throw new UnauthorizedError("Hanya admin yang dapat mengubah tipe gedung");
      }

      const { id } = req.params;
      const validatedData = ValidationUtil.validateBody(req, tipeGedungUpdateSchema);
      const updatedTipeGedung = await this.tipeGedungService.updateTipeGedung(id, validatedData);

      this.sendSuccess(res, "Tipe gedung berhasil diperbarui", updatedTipeGedung);
    } catch (error) {
      this.logError("Error updating building type", error);
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
        throw new UnauthorizedError("Hanya admin yang dapat menghapus tipe gedung");
      }

      const { id } = req.params;
      await this.tipeGedungService.deleteTipeGedung(id);

      this.sendSuccess(res, "Tipe gedung berhasil dihapus", null);
    } catch (error) {
      this.logError("Error deleting building type", error);
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
      const tipeGedung = await this.tipeGedungService.getTipeGedungById(id);
      
      this.sendSuccess(res, "Tipe gedung berhasil diambil", tipeGedung);
    } catch (error) {
      this.logError("Error fetching building type detail", error);
      next(error);
    }
  };
}

export default new TipeGedungController();