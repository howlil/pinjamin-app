// server/src/controllers/fasilitas.controller.ts
import { Request, Response, NextFunction } from "express";
import { FasilitasService } from "../services/fasilitas.service";
import { ValidationUtil } from "../utils/validation.util";
import {
  fasilitasSchema,
  fasilitasUpdateSchema,
} from "../validations/fasilitas.validation";
import { UnauthorizedError } from "../configs/error.config";
import { BaseController } from "./base.controller";

export class FasilitasController extends BaseController {
  private fasilitasService: FasilitasService;

  constructor() {
    super('FasilitasController');
    this.fasilitasService = new FasilitasService();
  }

  index = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const fasilitas = await this.fasilitasService.getAllFasilitas();
      this.sendSuccess(res, "Daftar fasilitas berhasil diambil", fasilitas);
    } catch (error) {
      this.logError("Error fetching facilities", error);
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
        throw new UnauthorizedError("Hanya admin yang dapat menambahkan fasilitas");
      }

      const validatedData = ValidationUtil.validateBody(req, fasilitasSchema);
      const newFasilitas = await this.fasilitasService.createFasilitas(validatedData);

      this.sendSuccess(res, "Fasilitas berhasil ditambahkan", newFasilitas, 201);
    } catch (error) {
      this.logError("Error creating facility", error);
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
        throw new UnauthorizedError("Hanya admin yang dapat mengubah fasilitas");
      }

      const { id } = req.params;
      const validatedData = ValidationUtil.validateBody(req, fasilitasUpdateSchema);
      const updatedFasilitas = await this.fasilitasService.updateFasilitas(id, validatedData);

      this.sendSuccess(res, "Fasilitas berhasil diperbarui", updatedFasilitas);
    } catch (error) {
      this.logError("Error updating facility", error);
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
        throw new UnauthorizedError("Hanya admin yang dapat menghapus fasilitas");
      }

      const { id } = req.params;
      await this.fasilitasService.deleteFasilitas(id);

      this.sendSuccess(res, "Fasilitas berhasil dihapus", null);
    } catch (error) {
      this.logError("Error deleting facility", error);
      next(error);
    }
  };
}

export default new FasilitasController();