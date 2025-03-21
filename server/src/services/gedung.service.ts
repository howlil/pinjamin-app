import { prisma } from "../configs/db.config";
import { BadRequestError, NotFoundError } from "../configs/error.config";
import {
  Gedung,
  GedungCreate,
  GedungUpdate,
  GedungFilter,
} from "../interfaces/types/gedung.types";
import { IGedungService } from "../interfaces/services/gedung.interface";
import { STATUSPEMINJAMAN } from "@prisma/client";

export class GedungService implements IGedungService {
  async getAllGedung(filter?: GedungFilter): Promise<Gedung[]> {
    const whereClause: any = {};

    if (filter) {
      if (filter.nama_gedung) {
        whereClause.nama_gedung = {
          contains: filter.nama_gedung,
          mode: "insensitive",
        };
      }

      if (filter.lokasi) {
        whereClause.lokasi = {
          contains: filter.lokasi,
          mode: "insensitive",
        };
      }

      if (filter.tipe_gedung_id) {
        whereClause.tipe_gedung_id = filter.tipe_gedung_id;
      }

      if (filter.kapasitas_min) {
        whereClause.kapasitas = {
          ...whereClause.kapasitas,
          gte: filter.kapasitas_min,
        };
      }

      if (filter.kapasitas_max) {
        whereClause.kapasitas = {
          ...whereClause.kapasitas,
          lte: filter.kapasitas_max,
        };
      }

      if (filter.harga_min) {
        whereClause.harga_sewa = {
          ...whereClause.harga_sewa,
          gte: filter.harga_min,
        };
      }

      if (filter.harga_max) {
        whereClause.harga_sewa = {
          ...whereClause.harga_sewa,
          lte: filter.harga_max,
        };
      }
    }

    const gedung = await prisma.gedung.findMany({
      where: whereClause,
      include: {
        TipeGedung: true,
        FasilitasGedung: true,
        penganggung_jawab_gedung: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return gedung;
  }

  async getGedungById(id: string): Promise<Gedung> {
    const gedung = await prisma.gedung.findUnique({
      where: { id },
      include: {
        TipeGedung: true,
        FasilitasGedung: true,
        penganggung_jawab_gedung: true,
      },
    });

    if (!gedung) {
      throw new NotFoundError("Gedung tidak ditemukan");
    }

    return gedung;
  }

  async createGedung(gedungData: GedungCreate): Promise<Gedung> {
    const tipeGedung = await prisma.tipeGedung.findUnique({
      where: { id: gedungData.tipe_gedung_id },
    });

    if (!tipeGedung) {
      throw new BadRequestError("Tipe gedung tidak ditemukan");
    }

    const gedung = await prisma.gedung.create({
      data: gedungData,
      include: {
        TipeGedung: true,
      },
    });

    return gedung;
  }

  async updateGedung(id: string, gedungData: GedungUpdate): Promise<Gedung> {
    const existingGedung = await prisma.gedung.findUnique({
      where: { id },
    });

    if (!existingGedung) {
      throw new NotFoundError("Gedung tidak ditemukan");
    }

    if (gedungData.tipe_gedung_id) {
      const tipeGedung = await prisma.tipeGedung.findUnique({
        where: { id: gedungData.tipe_gedung_id },
      });

      if (!tipeGedung) {
        throw new BadRequestError("Tipe gedung tidak ditemukan");
      }
    }

    const updatedGedung = await prisma.gedung.update({
      where: { id },
      data: gedungData,
      include: {
        TipeGedung: true,
        FasilitasGedung: true,
        penganggung_jawab_gedung: true,
      },
    });

    return updatedGedung;
  }

  async deleteGedung(id: string): Promise<boolean> {
    const existingGedung = await prisma.gedung.findUnique({
      where: { id },
      include: {
        Peminjaman: true,
        FasilitasGedung: true,
        penganggung_jawab_gedung: true,
      },
    });

    if (!existingGedung) {
      throw new NotFoundError("Gedung tidak ditemukan");
    }

    if (existingGedung.Peminjaman && existingGedung.Peminjaman.length > 0) {
      throw new BadRequestError(
        "Gedung tidak dapat dihapus karena masih memiliki peminjaman aktif"
      );
    }

    // Delete associated facilities
    if (
      existingGedung.FasilitasGedung &&
      existingGedung.FasilitasGedung.length > 0
    ) {
      await prisma.fasilitasGedung.deleteMany({
        where: { gedung_id: id },
      });
    }

    // Delete associated person in charge
    if (
      existingGedung.penganggung_jawab_gedung &&
      existingGedung.penganggung_jawab_gedung.length > 0
    ) {
      await prisma.penanggungJawabGedung.deleteMany({
        where: { gedung_id: id },
      });
    }

    await prisma.gedung.delete({
      where: { id },
    });

    return true;
  }

  async checkGedungAvailability(
    gedungId: string,
    tanggalMulai: string,
    tanggalSelesai: string
  ): Promise<boolean> {
    const check_gedung = await prisma.gedung.findUnique({
      where: { id: gedungId },
    });

    if (!check_gedung) {
      throw new NotFoundError(`Gedung tidak ditemukan`);
    }

    const overlappingReservations = await prisma.peminjaman.findMany({
      where: {
        gedung_id: gedungId,
        status_peminjaman: {
          in: [STATUSPEMINJAMAN.DISETUJUI, STATUSPEMINJAMAN.DIPROSES],
        },
        OR: [
          {
            // Case 1: Start date is between existing reservation dates
            AND: [
              { tanggal_mulai: { lte: tanggalMulai } },
              { tanggal_selesai: { gte: tanggalMulai } },
            ],
          },
          {
            // Case 2: End date is between existing reservation dates
            AND: [
              { tanggal_mulai: { lte: tanggalSelesai } },
              { tanggal_selesai: { gte: tanggalSelesai } },
            ],
          },
          {
            // Case 3: Reservation encompasses existing reservation
            AND: [
              { tanggal_mulai: { gte: tanggalMulai } },
              { tanggal_selesai: { lte: tanggalSelesai } },
            ],
          },
        ],
      },
    });

    return overlappingReservations.length === 0;
  }
}
