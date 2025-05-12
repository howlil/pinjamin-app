// server/src/services/tipe-gedung.service.ts
import { BadRequestError, NotFoundError } from "../configs/error.config";
import { 
  TipeGedung, 
  TipeGedungCreate, 
  TipeGedungUpdate 
} from "../interfaces/types/tipe-gedung.types";
import { BaseService } from "./base.service";

export class TipeGedungService extends BaseService {
  constructor() {
    super('TipeGedungService');
  }

  async getAllTipeGedung(): Promise<TipeGedung[]> {
    try {
      this.logInfo('Fetching all building types');
      
      const tipeGedung = await this.prisma.tipeGedung.findMany({
        include: {
          gedung: true
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      this.logInfo(`Found ${tipeGedung.length} building types`);
      return tipeGedung as TipeGedung[];
    } catch (error) {
      this.handleError(error, 'getAllTipeGedung');
      throw error;
    }
  }

  async getTipeGedungById(id: string): Promise<TipeGedung> {
    try {
      this.logInfo('Fetching building type by ID', { id });
      
      const tipeGedung = await this.prisma.tipeGedung.findUnique({
        where: { id },
        include: {
          gedung: true
        }
      });

      if (!tipeGedung) {
        throw new NotFoundError("Tipe gedung tidak ditemukan");
      }

      return tipeGedung as TipeGedung;
    } catch (error) {
      this.handleError(error, 'getTipeGedungById');
      throw error;
    }
  }

  async createTipeGedung(data: TipeGedungCreate): Promise<TipeGedung> {
    try {
      this.logInfo('Creating new building type', { data });
      
      const existingTipe = await this.prisma.tipeGedung.findFirst({
        where: {
          nama_tipe_gedung: {
            equals: data.nama_tipe_gedung,
            mode: "insensitive"
          }
        }
      });

      if (existingTipe) {
        throw new BadRequestError("Tipe gedung dengan nama yang sama sudah ada");
      }

      const tipeGedung = await this.prisma.tipeGedung.create({
        data,
        include: {
          gedung: true
        }
      });

      this.logInfo('Building type created successfully', { id: tipeGedung.id });
      return tipeGedung as TipeGedung;
    } catch (error) {
      this.handleError(error, 'createTipeGedung');
      throw error;
    }
  }

  async updateTipeGedung(id: string, data: TipeGedungUpdate): Promise<TipeGedung> {
    try {
      this.logInfo('Updating building type', { id, data });
      
      const existingTipe = await this.prisma.tipeGedung.findUnique({
        where: { id }
      });

      if (!existingTipe) {
        throw new NotFoundError("Tipe gedung tidak ditemukan");
      }

      if (data.nama_tipe_gedung && 
          data.nama_tipe_gedung !== existingTipe.nama_tipe_gedung) {
        const nameConflict = await this.prisma.tipeGedung.findFirst({
          where: {
            nama_tipe_gedung: {
              equals: data.nama_tipe_gedung,
              mode: "insensitive"
            },
            id: {
              not: id
            }
          }
        });

        if (nameConflict) {
          throw new BadRequestError("Tipe gedung dengan nama yang sama sudah ada");
        }
      }

      const updatedTipe = await this.prisma.tipeGedung.update({
        where: { id },
        data,
        include: {
          gedung: true
        }
      });

      this.logInfo('Building type updated successfully', { id });
      return updatedTipe as TipeGedung;
    } catch (error) {
      this.handleError(error, 'updateTipeGedung');
      throw error;
    }
  }

  async deleteTipeGedung(id: string): Promise<boolean> {
    try {
      this.logInfo('Deleting building type', { id });
      
      const existingTipe = await this.prisma.tipeGedung.findUnique({
        where: { id },
        include: {
          gedung: true
        }
      });

      if (!existingTipe) {
        throw new NotFoundError("Tipe gedung tidak ditemukan");
      }

      if (existingTipe.gedung && existingTipe.gedung.length > 0) {
        throw new BadRequestError(
          "Tipe gedung tidak dapat dihapus karena masih memiliki gedung terkait"
        );
      }

      await this.prisma.tipeGedung.delete({
        where: { id }
      });

      this.logInfo('Building type deleted successfully', { id });
      return true;
    } catch (error) {
      this.handleError(error, 'deleteTipeGedung');
      throw error;
    }
  }
}

export default new TipeGedungService();