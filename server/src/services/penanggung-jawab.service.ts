// server/src/services/penanggung-jawab.service.ts
import { BadRequestError, NotFoundError } from "../configs/error.config";
import { 
  PenanggungJawabGedung, 
  PenanggungJawabGedungCreate, 
  PenanggungJawabGedungUpdate 
} from "../interfaces/types/penanggung-jawab-gedung.types";
import { BaseService } from "./base.service";

export class PenanggungJawabGedungService extends BaseService {
  constructor() {
    super('PenanggungJawabGedungService');
  }

  async getAllPenanggungJawab(): Promise<PenanggungJawabGedung[]> {
    try {
      this.logInfo('Fetching all penanggung jawab');
      
      const penanggungJawab = await this.prisma.penanggungJawabGedung.findMany({
        include: {
          Gedung: true
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      this.logInfo(`Found ${penanggungJawab.length} penanggung jawab`);
      return penanggungJawab as PenanggungJawabGedung[];
    } catch (error) {
      this.handleError(error, 'getAllPenanggungJawab');
      throw error;
    }
  }

  async createPenanggungJawab(data: PenanggungJawabGedungCreate): Promise<PenanggungJawabGedung> {
    try {
      this.logInfo('Creating new penanggung jawab', { data });
      
      const gedung = await this.prisma.gedung.findUnique({
        where: { id: data.gedung_id }
      });

      if (!gedung) {
        throw new NotFoundError("Gedung tidak ditemukan");
      }

      const existingWithPhone = await this.prisma.penanggungJawabGedung.findFirst({
        where: {
          no_hp: data.no_hp,
          gedung_id: data.gedung_id
        }
      });

      if (existingWithPhone) {
        throw new BadRequestError("Nomor HP penanggung jawab sudah terdaftar untuk gedung ini");
      }

      const penanggungJawab = await this.prisma.penanggungJawabGedung.create({
        data,
        include: {
          Gedung: true
        }
      });

      this.logInfo('Penanggung jawab created successfully', { id: penanggungJawab.id });
      return penanggungJawab as PenanggungJawabGedung;
    } catch (error) {
      this.handleError(error, 'createPenanggungJawab');
      throw error;
    }
  }

  async updatePenanggungJawab(
    id: string, 
    data: PenanggungJawabGedungUpdate
  ): Promise<PenanggungJawabGedung> {
    try {
      this.logInfo('Updating penanggung jawab', { id, data });
      
      const existingPJ = await this.prisma.penanggungJawabGedung.findUnique({
        where: { id }
      });

      if (!existingPJ) {
        throw new NotFoundError("Penanggung jawab gedung tidak ditemukan");
      }

      if (data.gedung_id && data.gedung_id !== existingPJ.gedung_id) {
        const gedung = await this.prisma.gedung.findUnique({
          where: { id: data.gedung_id }
        });

        if (!gedung) {
          throw new NotFoundError("Gedung tidak ditemukan");
        }
      }

      if (data.no_hp && data.no_hp !== existingPJ.no_hp) {
        const gedungId = data.gedung_id || existingPJ.gedung_id;
        
        const existingWithPhone = await this.prisma.penanggungJawabGedung.findFirst({
          where: {
            no_hp: data.no_hp,
            gedung_id: gedungId,
            id: { not: id }
          }
        });

        if (existingWithPhone) {
          throw new BadRequestError("Nomor HP penanggung jawab sudah terdaftar untuk gedung ini");
        }
      }

      const updatedPJ = await this.prisma.penanggungJawabGedung.update({
        where: { id },
        data,
        include: {
          Gedung: true
        }
      });

      this.logInfo('Penanggung jawab updated successfully', { id });
      return updatedPJ as PenanggungJawabGedung;
    } catch (error) {
      this.handleError(error, 'updatePenanggungJawab');
      throw error;
    }
  }

  async deletePenanggungJawab(id: string): Promise<boolean> {
    try {
      this.logInfo('Deleting penanggung jawab', { id });
      
      const existingPJ = await this.prisma.penanggungJawabGedung.findUnique({
        where: { id }
      });

      if (!existingPJ) {
        throw new NotFoundError("Penanggung jawab gedung tidak ditemukan");
      }

      await this.prisma.penanggungJawabGedung.delete({
        where: { id }
      });

      this.logInfo('Penanggung jawab deleted successfully', { id });
      return true;
    } catch (error) {
      this.handleError(error, 'deletePenanggungJawab');
      throw error;
    }
  }
}

export default new PenanggungJawabGedungService();