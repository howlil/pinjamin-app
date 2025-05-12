// server/src/controllers/peminjaman.controller.ts
import { Request, Response, NextFunction } from "express";
import { PeminjamanService } from "../services/peminjaman.service";
import { ValidationUtil } from "../utils/validation.util";
import {
  peminjamanSchema,
  peminjamanUpdateSchema,
  peminjamanApprovalSchema,
} from "../validations/peminjaman.validation";
import { UnauthorizedError, BadRequestError } from "../configs/error.config";
import { BaseController } from "./base.controller";
import fs from "fs";
import path from "path";

export class PeminjamanController extends BaseController {
  private peminjamanService: PeminjamanService;

  constructor() {
    super('PeminjamanController');
    this.peminjamanService = new PeminjamanService();
  }

  index = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const peminjamans = await this.peminjamanService.getAllPeminjaman();
      this.sendSuccess(res, "Daftar peminjaman berhasil diambil", peminjamans);
    } catch (error) {
      this.logError("Error fetching all peminjaman", error);
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
      this.sendSuccess(res, "Peminjaman berhasil diambil", peminjaman);
    } catch (error) {
      this.logError("Error fetching peminjaman detail", error);
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
      this.sendSuccess(res, "Daftar peminjaman pengguna berhasil diambil", peminjamans);
    } catch (error) {
      this.logError("Error fetching user peminjaman", error);
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

      if (req.file) {
        validatedData.surat_pengajuan = `/uploads/surat_pengajuan/${req.file.filename}`;
      }

      validatedData.pengguna_id = req.user.id;

      // Format dates
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

      this.sendSuccess(res, "Peminjaman berhasil dibuat", peminjaman, 201);
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
      this.logError("Error creating peminjaman", error);
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

      const existingPeminjaman = await this.peminjamanService.getPeminjamanById(
        id
      );

      if (
        existingPeminjaman.pengguna_id !== req.user.id &&
        req.user.role !== "ADMIN"
      ) {
        throw new UnauthorizedError(
          "Anda tidak memiliki akses untuk mengubah peminjaman ini"
        );
      }

      if (req.file) {
        validatedData.surat_pengajuan = `/uploads/surat_pengajuan/${req.file.filename}`;

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

      // Format dates
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

      this.sendSuccess(res, "Peminjaman berhasil diperbarui", peminjaman);
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
      this.logError("Error updating peminjaman", error);
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
        this.logInfo("Peminjaman ditolak dan refund diproses", {
          peminjamanId: id,
          refundId: peminjaman.pembayaran.refund.id,
          status: peminjaman.pembayaran.refund.status_redund,
        });
      }

      this.sendSuccess(res, "Status peminjaman berhasil diperbarui", peminjaman);
    } catch (error) {
      this.logError("Error approving peminjaman", error);
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

      this.sendSuccess(res, "Peminjaman berhasil dihapus", null);
    } catch (error) {
      this.logError("Error deleting peminjaman", error);
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

      this.sendSuccess(res, "Statistik peminjaman berhasil diambil", statistics);
    } catch (error) {
      this.logError("Error fetching statistics", error);
      next(error);
    }
  };
}

export default new PeminjamanController();