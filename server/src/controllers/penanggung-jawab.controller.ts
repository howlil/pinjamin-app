// server/src/controllers/penanggung-jawab.controller.ts
import { Request, Response, NextFunction } from "express";
import { PenanggungJawabGedungService } from "../services/penanggung-jawab.service";
import { ValidationUtil } from "../utils/validation.util";
import {
  penanggungJawabGedungSchema,
  penanggungJawabGedungUpdateSchema
} from "../validations/penanggung-jawab-gedung.validation";
import { UnauthorizedError } from "../configs/error.config";
import { BaseController } from "./base.controller";

export class PenanggungJawabGedungController extends BaseController {
  private penanggungJawabService: PenanggungJawabGedungService;

  constructor() {
    super('PenanggungJawabGedungController');
    this.penanggungJawabService = new PenanggungJawabGedungService();
  }

  index = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const penanggungJawab = await this.penanggungJawabService.getAllPenanggungJawab();
      this.sendSuccess(res, "Daftar penanggung jawab gedung berhasil diambil", penanggungJawab);
    } catch (error) {
      this.logError("Error fetching penanggung jawab", error);
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
        throw new UnauthorizedError("Hanya admin yang dapat menambahkan penanggung jawab gedung");
      }

      const validatedData = ValidationUtil.validateBody(req, penanggungJawabGedungSchema);
      const newPenanggungJawab = await this.penanggungJawabService.createPenanggungJawab(validatedData);

      this.sendSuccess(res, "Penanggung jawab gedung berhasil ditambahkan", newPenanggungJawab, 201);
    } catch (error) {
      this.logError("Error creating penanggung jawab", error);
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
        throw new UnauthorizedError("Hanya admin yang dapat mengubah penanggung jawab gedung");
      }

      const { id } = req.params;
      const validatedData = ValidationUtil.validateBody(req, penanggungJawabGedungUpdateSchema);
      const updatedPenanggungJawab = await this.penanggungJawabService.updatePenanggungJawab(id, validatedData);

      this.sendSuccess(res, "Penanggung jawab gedung berhasil diperbarui", updatedPenanggungJawab);
    } catch (error) {
      this.logError("Error updating penanggung jawab", error);
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
        throw new UnauthorizedError("Hanya admin yang dapat menghapus penanggung jawab gedung");
      }

      const { id } = req.params;
      await this.penanggungJawabService.deletePenanggungJawab(id);

      this.sendSuccess(res, "Penanggung jawab gedung berhasil dihapus", null);
    } catch (error) {
      this.logError("Error deleting penanggung jawab", error);
      next(error);
    }
  };
}

export default new PenanggungJawabGedungController();