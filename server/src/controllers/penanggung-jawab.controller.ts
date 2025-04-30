import { Request, Response, NextFunction } from "express";
import { PenanggungJawabGedungService } from "../services/penanggung-jawab.service";
import { ValidationUtil } from "../utils/validation.util";
import {
  penanggungJawabGedungSchema,
  penanggungJawabGedungUpdateSchema
} from "../validations/penanggung-jawab-gedung.validation";
import { UnauthorizedError } from "../configs/error.config";
import { IController } from "../interfaces/controller.interface";

export class PenanggungJawabGedungController implements IController {
  private penanggungJawabService: PenanggungJawabGedungService;

  constructor() {
    this.penanggungJawabService = new PenanggungJawabGedungService();
  }


  index = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      
      const penanggungJawab = await this.penanggungJawabService.getAllPenanggungJawab();

      res.status(200).json({
        success: true,
        message: "Daftar penanggung jawab gedung berhasil diambil",
        data: penanggungJawab,
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
        throw new UnauthorizedError("Hanya admin yang dapat menambahkan penanggung jawab gedung");
      }

      const validatedData = ValidationUtil.validateBody(req, penanggungJawabGedungSchema);
      const newPenanggungJawab = await this.penanggungJawabService.createPenanggungJawab(validatedData);

      res.status(201).json({
        success: true,
        message: "Penanggung jawab gedung berhasil ditambahkan",
        data: newPenanggungJawab,
      });
    } catch (error) {
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

      res.status(200).json({
        success: true,
        message: "Penanggung jawab gedung berhasil diperbarui",
        data: updatedPenanggungJawab,
      });
    } catch (error) {
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

      res.status(200).json({
        success: true,
        message: "Penanggung jawab gedung berhasil dihapus",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new PenanggungJawabGedungController();