import { Request, Response, NextFunction } from "express";
import { FasilitasService } from "../services/fasilitas.service";
import { ValidationUtil } from "../utils/validation.util";
import {
  fasilitasSchema,
  fasilitasUpdateSchema,
} from "../validations/fasilitas.validation";
import { UnauthorizedError } from "../configs/error.config";
import { IController } from "../interfaces/controller.interface";

export class FasilitasController implements IController {
  private fasilitasService: FasilitasService;

  constructor() {
    this.fasilitasService = new FasilitasService();
  }

  index = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {

      const fasilitas = await this.fasilitasService.getAllFasilitas();

      res.status(200).json({
        success: true,
        message: "Daftar fasilitas berhasil diambil",
        data: fasilitas,
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
          "Hanya admin yang dapat menambahkan fasilitas"
        );
      }

      const validatedData = ValidationUtil.validateBody(req, fasilitasSchema);
      const newFasilitas = await this.fasilitasService.createFasilitas(
        validatedData
      );

      res.status(201).json({
        success: true,
        message: "Fasilitas berhasil ditambahkan",
        data: newFasilitas,
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
        throw new UnauthorizedError(
          "Hanya admin yang dapat mengubah fasilitas"
        );
      }

      const { id } = req.params;
      const validatedData = ValidationUtil.validateBody(
        req,
        fasilitasUpdateSchema
      );
      const updatedFasilitas = await this.fasilitasService.updateFasilitas(
        id,
        validatedData
      );

      res.status(200).json({
        success: true,
        message: "Fasilitas berhasil diperbarui",
        data: updatedFasilitas,
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
        throw new UnauthorizedError(
          "Hanya admin yang dapat menghapus fasilitas"
        );
      }

      const { id } = req.params;
      await this.fasilitasService.deleteFasilitas(id);

      res.status(200).json({
        success: true,
        message: "Fasilitas berhasil dihapus",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };

  
}

export default new FasilitasController();
