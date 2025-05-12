// server/src/services/gedung.service.ts
import { BadRequestError, NotFoundError } from "../configs/error.config";
import { Gedung, Gedungs, GedungCreate, GedungUpdate, GedungFilter } from "../interfaces/types/gedung.types";
import { STATUSPEMINJAMAN, Prisma } from "@prisma/client";
import { BaseService } from "./base.service";

export class GedungService extends BaseService {
  constructor() {
    super('GedungService');
  }

  async getAllGedung(filter?: GedungFilter): Promise<Gedungs[]> {
    try {
      this.logInfo('Fetching all gedung', { filter });
      
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

      const gedung = await this.prisma.gedung.findMany({
        where: whereClause,
        select: {
          id: true,
          nama_gedung: true,
          harga_sewa: true,
          foto_gedung: true,
          kapasitas: true,
          lokasi: true
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      this.logInfo(`Found ${gedung.length} gedung`);
      return gedung;
    } catch (error) {
      this.handleError(error, 'getAllGedung');
      throw error;
    }
  }

  async getGedungById(id: string): Promise<Gedung> {
    try {
      this.logInfo('Fetching gedung by ID', { id });

      const gedung = await this.prisma.gedung.findUnique({
        where: { id },
        include: {
          TipeGedung: true,
          FasilitasGedung: {
            include: {
              fasilitas: true
            }
          },
          penganggung_jawab_gedung: true,
          Peminjaman: true,
        },
      });

      if (!gedung) {
        throw new NotFoundError("Gedung tidak ditemukan");
      }

      return gedung as unknown as Gedung;
    } catch (error) {
      this.handleError(error, 'getGedungById');
      throw error;
    }
  }

  async createGedung(gedungData: GedungCreate): Promise<Gedung> {
    try {
      this.logInfo('Creating new gedung', { gedungData });

      const tipeGedung = await this.prisma.tipeGedung.findUnique({
        where: { id: gedungData.tipe_gedung_id },
      });

      if (!tipeGedung) {
        throw new BadRequestError("Tipe gedung tidak ditemukan");
      }

      return await this.executeTransaction(async (tx) => {
        const gedung = await tx.gedung.create({
          data: {
            nama_gedung: gedungData.nama_gedung,
            deskripsi: gedungData.deskripsi,
            harga_sewa: gedungData.harga_sewa,
            kapasitas: gedungData.kapasitas,
            lokasi: gedungData.lokasi,
            foto_gedung: gedungData.foto_gedung || "",
            tipe_gedung_id: gedungData.tipe_gedung_id
          },
        });

        if (gedungData.fasilitas_gedung && gedungData.fasilitas_gedung.length > 0) {
          await tx.fasilitasGedung.createMany({
            data: gedungData.fasilitas_gedung.map(facilityData => ({
              fasilitas_id: facilityData.fasilitas_id,
              gedung_id: gedung.id
            }))
          });
        }

        this.logInfo('Gedung created successfully', { gedungId: gedung.id });
        return this.getGedungById(gedung.id);
      });
    } catch (error) {
      this.handleError(error, 'createGedung');
      throw error;
    }
  }

  async updateGedung(id: string, gedungData: GedungUpdate): Promise<Gedung> {
    try {
      this.logInfo('Updating gedung', { id, gedungData });

      const existingGedung = await this.prisma.gedung.findUnique({
        where: { id },
        include: {
          FasilitasGedung: true,
          penganggung_jawab_gedung: true,
        },
      });

      if (!existingGedung) {
        throw new NotFoundError("Gedung tidak ditemukan");
      }

      if (gedungData.tipe_gedung_id) {
        const tipeGedung = await this.prisma.tipeGedung.findUnique({
          where: { id: gedungData.tipe_gedung_id },
        });

        if (!tipeGedung) {
          throw new BadRequestError("Tipe gedung tidak ditemukan");
        }
      }

      return await this.executeTransaction(async (tx) => {
        const updateData: Prisma.GedungUpdateInput = {};

        if (gedungData.nama_gedung !== undefined)
          updateData.nama_gedung = gedungData.nama_gedung;
        if (gedungData.deskripsi !== undefined)
          updateData.deskripsi = gedungData.deskripsi;
        if (gedungData.harga_sewa !== undefined)
          updateData.harga_sewa = gedungData.harga_sewa;
        if (gedungData.kapasitas !== undefined)
          updateData.kapasitas = gedungData.kapasitas;
        if (gedungData.lokasi !== undefined)
          updateData.lokasi = gedungData.lokasi;
        if (gedungData.foto_gedung !== undefined) {
          updateData.foto_gedung = gedungData.foto_gedung === null ? "" : gedungData.foto_gedung;
        }
        if (gedungData.tipe_gedung_id !== undefined)
          updateData.TipeGedung = { connect: { id: gedungData.tipe_gedung_id } };

        await tx.gedung.update({
          where: { id },
          data: updateData,
        });

        if (gedungData.fasilitas_gedung !== undefined) {
          await tx.fasilitasGedung.deleteMany({
            where: { gedung_id: id },
          });

          if (gedungData.fasilitas_gedung.length > 0) {
            await tx.fasilitasGedung.createMany({
              data: gedungData.fasilitas_gedung.map((fasilitas) => ({
                fasilitas_id: fasilitas.fasilitas_id,
                gedung_id: id,
              })),
            });
          }
        }

        this.logInfo('Gedung updated successfully', { gedungId: id });
        return this.getGedungById(id);
      });
    } catch (error) {
      this.handleError(error, 'updateGedung');
      throw error;
    }
  }

  async deleteGedung(id: string): Promise<boolean> {
    try {
      this.logInfo('Deleting gedung', { id });

      const existingGedung = await this.prisma.gedung.findUnique({
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

      return await this.executeTransaction(async (tx) => {
        if (existingGedung.FasilitasGedung.length > 0) {
          await tx.fasilitasGedung.deleteMany({
            where: { gedung_id: id },
          });
        }

        if (existingGedung.penganggung_jawab_gedung.length > 0) {
          await tx.penanggungJawabGedung.deleteMany({
            where: { gedung_id: id },
          });
        }

        await tx.gedung.delete({
          where: { id },
        });

        this.logInfo('Gedung deleted successfully', { gedungId: id });
        return true;
      });
    } catch (error) {
      this.handleError(error, 'deleteGedung');
      throw error;
    }
  }

  async checkGedungAvailability(validatedData: {
    tanggalMulai: string;
    jamMulai: string;
  }): Promise<Gedungs[]> {
    try {
      this.logInfo('Checking gedung availability', validatedData);

      const { tanggalMulai, jamMulai } = validatedData;

      const [startDay, startMonth, startYear] = tanggalMulai.split("-");
      const formattedStartDate = `${startYear}-${startMonth.padStart(2, "0")}-${startDay.padStart(2, "0")}`;

      const [hours, minutes] = jamMulai.split(":").map(Number);
      const endHours = (hours + 3) % 24;
      const jamSelesai = `${endHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

      const allGedungs = await this.prisma.gedung.findMany({
        select: {
          id: true,
          nama_gedung: true,
          harga_sewa: true,
          foto_gedung: true,
          kapasitas: true,
          lokasi: true,
        },
      });

      const unavailableGedungIds = await this.prisma.peminjaman.findMany({
        where: {
          tanggal_mulai: formattedStartDate,
          status_peminjaman: {
            in: [STATUSPEMINJAMAN.DISETUJUI, STATUSPEMINJAMAN.DIPROSES],
          },
          OR: [
            {
              AND: [
                { jam_mulai: { lte: jamMulai } },
                { jam_selesai: { gt: jamMulai } },
              ],
            },
            {
              AND: [
                { jam_mulai: { lt: jamSelesai } },
                { jam_selesai: { gte: jamSelesai } },
              ],
            },
            {
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

      this.logInfo(`Found ${availableGedungs.length} available gedung`);
      return availableGedungs;
    } catch (error) {
      this.handleError(error, 'checkGedungAvailability');
      throw error;
    }
  }
}

export default new GedungService();