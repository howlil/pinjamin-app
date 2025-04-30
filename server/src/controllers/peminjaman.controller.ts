import { Request, Response, NextFunction } from "express";
import { PeminjamanService } from "../services/peminjaman.service";
import { ValidationUtil } from "../utils/validation.util";
import {
  peminjamanSchema,
  peminjamanUpdateSchema,
  peminjamanApprovalSchema,
} from "../validations/peminjaman.validation";
import { UnauthorizedError, BadRequestError } from "../configs/error.config";
import { IController } from "../interfaces/controller.interface";
import { logger } from "../configs/logger.config";
import fs from "fs";
import path from "path";

export class PeminjamanController implements IController {
  private peminjamanService: PeminjamanService;

  constructor() {
    this.peminjamanService = new PeminjamanService();
  }


  index = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const peminjamans = await this.peminjamanService.getAllPeminjaman();
      res.status(200).json({
        success: true,
        message: "Daftar peminjaman berhasil diambil",
        data: peminjamans,
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
      const peminjaman = await this.peminjamanService.getPeminjamanById(id);
      res.status(200).json({
        success: true,
        message: "Peminjaman berhasil diambil",
        data: peminjaman,
      });
    } catch (error) {
      next(error);
    }
  };


  getByUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Autentikasi diperlukan");
      }

      const peminjamans = await this.peminjamanService.getPeminjamanByPengguna(
        req.user.id
      );
      res.status(200).json({
        success: true,
        message: "Daftar peminjaman pengguna berhasil diambil",
        data: peminjamans,
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
      if (!req.user) {
        throw new UnauthorizedError("Autentikasi diperlukan");
      }

      const validatedData = ValidationUtil.validateBody(req, peminjamanSchema);

      // If file is uploaded, get the path
      if (req.file) {
        validatedData.surat_pengajuan = `/uploads/surat_pengajuan/${req.file.filename}`;
      }

      // Set the user ID
      validatedData.pengguna_id = req.user.id;

      // Format dates from DD-MM-YYYY to YYYY-MM-DD for database
      if (validatedData.tanggal_mulai) {
        const [day, month, year] = validatedData.tanggal_mulai.split("-");
        validatedData.tanggal_mulai = `${year}-${month}-${day}`;
      }

      if (validatedData.tanggal_selesai) {
        const [day, month, year] = validatedData.tanggal_selesai.split("-");
        validatedData.tanggal_selesai = `${year}-${month}-${day}`;
      }

      const peminjaman = await this.peminjamanService.createPeminjaman(
        validatedData
      );

      res.status(201).json({
        success: true,
        message: "Peminjaman berhasil dibuat",
        data: peminjaman,
      });
    } catch (error) {
      // If error occurs, delete the uploaded file if exists
      if (req.file) {
        const filePath = path.join(
          process.cwd(),
          "public/uploads/surat_pengajuan",
          req.file.filename
        );
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
      if (!req.user) {
        throw new UnauthorizedError("Autentikasi diperlukan");
      }

      const { id } = req.params;
      const validatedData = ValidationUtil.validateBody(
        req,
        peminjamanUpdateSchema
      );

      // Get the existing peminjaman
      const existingPeminjaman = await this.peminjamanService.getPeminjamanById(
        id
      );

      // Check if user is authorized
      if (
        existingPeminjaman.pengguna_id !== req.user.id &&
        req.user.role !== "ADMIN"
      ) {
        throw new UnauthorizedError(
          "Anda tidak memiliki akses untuk mengubah peminjaman ini"
        );
      }

      // If file is uploaded, get the path and delete old file
      if (req.file) {
        validatedData.surat_pengajuan = `/uploads/surat_pengajuan/${req.file.filename}`;

        // Delete old file if exists
        if (existingPeminjaman.surat_pengajuan) {
          const oldFilePath = path.join(
            process.cwd(),
            "public",
            existingPeminjaman.surat_pengajuan
          );
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
      }

      // Format dates from DD-MM-YYYY to YYYY-MM-DD for database
      if (validatedData.tanggal_mulai) {
        const [day, month, year] = validatedData.tanggal_mulai.split("-");
        validatedData.tanggal_mulai = `${year}-${month}-${day}`;
      }

      if (validatedData.tanggal_selesai) {
        const [day, month, year] = validatedData.tanggal_selesai.split("-");
        validatedData.tanggal_selesai = `${year}-${month}-${day}`;
      }

      const peminjaman = await this.peminjamanService.updatePeminjaman(
        id,
        validatedData
      );

      res.status(200).json({
        success: true,
        message: "Peminjaman berhasil diperbarui",
        data: peminjaman,
      });
    } catch (error) {
      if (req.file) {
        const filePath = path.join(
          process.cwd(),
          "public/uploads/surat_pengajuan",
          req.file.filename
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      next(error);
    }
  };

  approve = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user || req.user.role !== "ADMIN") {
        throw new UnauthorizedError(
          "Hanya admin yang dapat menyetujui/menolak peminjaman"
        );
      }

      const { id } = req.params;
      const validatedData = ValidationUtil.validateBody(
        req,
        peminjamanApprovalSchema
      );

      const peminjaman = await this.peminjamanService.approvePeminjaman(
        id,
        validatedData
      );

      if (
        validatedData.status_peminjaman === "DITOLAK" &&
        peminjaman.pembayaran &&
        peminjaman.pembayaran.refund
      ) {
        logger.info("Peminjaman ditolak dan refund diproses", {
          peminjamanId: id,
          refundId: peminjaman.pembayaran.refund.id,
          status: peminjaman.pembayaran.refund.status_redund,
        });
      }

      res.status(200).json({
        success: true,
        message: "Status peminjaman berhasil diperbarui",
        data: peminjaman,
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
      if (!req.user) {
        throw new UnauthorizedError("Autentikasi diperlukan");
      }

      const { id } = req.params;

      const existingPeminjaman = await this.peminjamanService.getPeminjamanById(
        id
      );

      if (
        existingPeminjaman.pengguna_id !== req.user.id &&
        req.user.role !== "ADMIN"
      ) {
        throw new UnauthorizedError(
          "Anda tidak memiliki akses untuk menghapus peminjaman ini"
        );
      }

      if (existingPeminjaman.surat_pengajuan) {
        const filePath = path.join(
          process.cwd(),
          "public",
          existingPeminjaman.surat_pengajuan
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await this.peminjamanService.deletePeminjaman(id);

      res.status(200).json({
        success: true,
        message: "Peminjaman berhasil dihapus",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };

  getStatistics = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user || req.user.role !== "ADMIN") {
        throw new UnauthorizedError(
          "Hanya admin yang dapat melihat statistik peminjaman"
        );
      }

      const statistics = await this.peminjamanService.getPeminjamanStatistics();

      res.status(200).json({
        success: true,
        message: "Statistik peminjaman berhasil diambil",
        data: statistics,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new PeminjamanController();
