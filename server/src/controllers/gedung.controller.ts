import { Request, Response, NextFunction } from "express";
import { GedungService } from "../services/gedung.service";
import { ValidationUtil } from "../utils/validation.util";
import {
  gedungSchema,
  gedungUpdateSchema,
  gedungFilterSchema,
} from "../validations/gedung.validation";
import { IGedungService } from "../interfaces/services/gedung.interface";
import { UnauthorizedError } from "../configs/error.config";
import { IController } from "../interfaces/controller.interface";

export class GedungController implements IController {
  private gedungService: IGedungService;

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
      const validatedData = ValidationUtil.validateBody(
        req,
        gedungUpdateSchema
      );

      const gedung = await this.gedungService.updateGedung(id, validatedData);

      res.status(200).json({
        success: true,
        message: "Gedung berhasil diperbarui",
        data: gedung,
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
        throw new UnauthorizedError("Hanya admin yang dapat menghapus gedung");
      }

      const { id } = req.params;

      await this.gedungService.deleteGedung(id);

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
      const { gedungId, tanggalMulai, tanggalSelesai } = req.query as {
        gedungId: string;
        tanggalMulai: string;
        tanggalSelesai: string;
      };

      if (!gedungId || !tanggalMulai || !tanggalSelesai) {
        res.status(400).json({
          success: false,
          message:
            "Parameter gedungId, tanggalMulai, dan tanggalSelesai diperlukan",
          data: null,
        });
        return;
      }

      const isAvailable = await this.gedungService.checkGedungAvailability(
        gedungId,
        tanggalMulai,
        tanggalSelesai
      );

      res.status(200).json({
        success: true,
        message: isAvailable
          ? "Gedung tersedia pada tanggal yang ditentukan"
          : "Gedung tidak tersedia pada tanggal yang ditentukan",
        data: { isAvailable },
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new GedungController();
