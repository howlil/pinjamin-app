import { prisma } from "../configs/db.config";
import { BadRequestError, NotFoundError } from "../configs/error.config";
import {
  Gedung,
  Gedungs,
  GedungCreate,
  GedungUpdate,
  GedungFilter,
} from "../interfaces/types/gedung.types";
import { IGedungService } from "../interfaces/services/gedung.interface";
import { STATUSPEMINJAMAN, Prisma } from "@prisma/client";

export class GedungService implements IGedungService {
  async getAllGedung(filter?: GedungFilter): Promise<Gedungs[]> {
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
      select: {
        id: true,
        nama_gedung: true,
        harga_sewa: true,
        foto_gedung: true,
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
        Peminjaman: true,
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

    // Create proper Prisma input with relation
    const createData: Prisma.GedungCreateInput = {
      nama_gedung: gedungData.nama_gedung,
      deskripsi: gedungData.deskripsi,
      harga_sewa: gedungData.harga_sewa,
      kapasitas: gedungData.kapasitas,
      lokasi: gedungData.lokasi,
      foto_gedung: gedungData.foto_gedung || "",
      TipeGedung: {
        connect: { id: gedungData.tipe_gedung_id },
      },
      FasilitasGedung: gedungData.fasilitas_gedung?.length ? {
        create: gedungData.fasilitas_gedung.map(fasilitas => ({
          nama_fasilitas: fasilitas.nama_fasilitas,
          icon_url: fasilitas.icon_url
        }))
      } : undefined,
      penganggung_jawab_gedung: gedungData.penanggung_jawab_gedung?.length ? {
        create: gedungData.penanggung_jawab_gedung.map(pj => ({
          nama_penangguang_jawab: pj.nama_penangguang_jawab,
          no_hp: pj.no_hp
        }))
      } : undefined
    };
  

    const gedung = await prisma.gedung.create({
      data: createData,
      include: {
        TipeGedung: true,
        FasilitasGedung: true,
        penganggung_jawab_gedung: true
      },
    });

    return gedung;
  }

   async updateGedung(id: string, gedungData: GedungUpdate): Promise<Gedung> {
    const existingGedung = await prisma.gedung.findUnique({
      where: { id },
      include: {
        FasilitasGedung: true,
        penganggung_jawab_gedung: true
      }
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

    // Start a transaction to handle all updates
    return prisma.$transaction(async (tx) => {
      // Update basic building information
      const updateData: Prisma.GedungUpdateInput = {};

      if (gedungData.nama_gedung !== undefined) updateData.nama_gedung = gedungData.nama_gedung;
      if (gedungData.deskripsi !== undefined) updateData.deskripsi = gedungData.deskripsi;
      if (gedungData.harga_sewa !== undefined) updateData.harga_sewa = gedungData.harga_sewa;
      if (gedungData.kapasitas !== undefined) updateData.kapasitas = gedungData.kapasitas;
      if (gedungData.lokasi !== undefined) updateData.lokasi = gedungData.lokasi;
      
      // Handle foto_gedung properly
      if (gedungData.foto_gedung !== undefined) {
        updateData.foto_gedung = gedungData.foto_gedung === null ? undefined : gedungData.foto_gedung;
      }

      if (gedungData.tipe_gedung_id !== undefined) {
        updateData.TipeGedung = {
          connect: { id: gedungData.tipe_gedung_id },
        };
      }

      // First, update the building details
      const updatedGedung = await tx.gedung.update({
        where: { id },
        data: updateData,
        include: {
          TipeGedung: true
        }
      });
      
      // Handle facilities update if provided
      if (gedungData.fasilitas_gedung && Array.isArray(gedungData.fasilitas_gedung)) {
        // Delete existing facilities
        await tx.fasilitasGedung.deleteMany({
          where: { gedung_id: id }
        });
        
        // Create new facilities
        if (gedungData.fasilitas_gedung.length > 0) {
          await tx.fasilitasGedung.createMany({
            data: gedungData.fasilitas_gedung.map(fasilitas => ({
              nama_fasilitas: fasilitas.nama_fasilitas,
              icon_url: fasilitas.icon_url,
              gedung_id: id
            }))
          });
        }
      }
      
      // Handle managers update if provided
      if (gedungData.penanggung_jawab_gedung && Array.isArray(gedungData.penanggung_jawab_gedung)) {
        // Delete existing managers
        await tx.penanggungJawabGedung.deleteMany({
          where: { gedung_id: id }
        });
        
        // Create new managers
        if (gedungData.penanggung_jawab_gedung.length > 0) {
          await tx.penanggungJawabGedung.createMany({
            data: gedungData.penanggung_jawab_gedung.map(pj => ({
              nama_penangguang_jawab: pj.nama_penangguang_jawab,
              no_hp: pj.no_hp,
              gedung_id: id
            }))
          });
        }
      }
      
      // Return the complete updated building with all relations
      return tx.gedung.findUnique({
        where: { id },
        include: {
          TipeGedung: true,
          FasilitasGedung: true,
          penganggung_jawab_gedung: true
        }
      }) as Promise<Gedung>;
    });
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

  async checkGedungAvailability(validatedData: {
    tanggalMulai: string;
    jamMulai: string;
  }): Promise<Gedungs[]> {
    const { tanggalMulai, jamMulai } = validatedData;

    const [startDay, startMonth, startYear] = tanggalMulai.split("-");
    const formattedStartDate = `${startYear}-${startMonth.padStart(
      2,
      "0"
    )}-${startDay.padStart(2, "0")}`;

    const [hours, minutes] = jamMulai.split(":").map(Number);
    const endHours = (hours + 3) % 24;
    const jamSelesai = `${endHours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    const allGedungs = await prisma.gedung.findMany({
      select: {
        id: true,
        nama_gedung: true,
        harga_sewa: true,
        foto_gedung: true,
        kapasitas: true,
        lokasi: true,
      },
    });

    const unavailableGedungIds = await prisma.peminjaman.findMany({
      where: {
        tanggal_mulai: formattedStartDate,
        status_peminjaman: {
          in: [STATUSPEMINJAMAN.DISETUJUI, STATUSPEMINJAMAN.DIPROSES],
        },
        OR: [
          // Time overlap scenarios
          {
            // Case 1: Requested start time falls within existing reservation time
            AND: [
              { jam_mulai: { lte: jamMulai } },
              { jam_selesai: { gt: jamMulai } },
            ],
          },
          {
            // Case 2: Requested end time falls within existing reservation time
            AND: [
              { jam_mulai: { lt: jamSelesai } },
              { jam_selesai: { gte: jamSelesai } },
            ],
          },
          {
            // Case 3: Requested time completely encompasses existing reservation time
            AND: [
              { jam_mulai: { gte: jamMulai } },
              { jam_selesai: { lte: jamSelesai } },
            ],
          },
        ],
      },
      select: {
        gedung_id: true,
      },
      distinct: ["gedung_id"],
    });

    const unavailableIds = unavailableGedungIds.map((item) => item.gedung_id);

    const availableGedungs = allGedungs.filter(
      (gedung) => !unavailableIds.includes(gedung.id)
    );

    return availableGedungs;
  }
}
