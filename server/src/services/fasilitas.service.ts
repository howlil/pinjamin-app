// server/src/services/fasilitas.service.ts
import { BadRequestError, NotFoundError } from "../configs/error.config";
import { 
  Fasilitas, 
  FasilitasCreate, 
  FasilitasUpdate,
} from "../interfaces/types/fasilitas.types";
import { BaseService } from "./base.service";

export class FasilitasService extends BaseService {
  constructor() {
    super('FasilitasService');
  }

  async getAllFasilitas(): Promise<Fasilitas[]> {
    try {
      this.logInfo('Fetching all facilities');
      
      const fasilitas = await this.prisma.fasilitas.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

      this.logInfo(`Found ${fasilitas.length} facilities`);
      return fasilitas;
    } catch (error) {
      this.handleError(error, 'getAllFasilitas');
      throw error;
    }
  }

  async createFasilitas(facilityData: FasilitasCreate): Promise<Fasilitas> {
    try {
      this.logInfo('Creating new facility', { facilityData });
      
      const existingFasilitas = await this.prisma.fasilitas.findFirst({
        where: {
          nama_fasilitas: {
            equals: facilityData.nama_fasilitas,
            mode: "insensitive"
          }
        }
      });

      if (existingFasilitas) {
        throw new BadRequestError("Fasilitas dengan nama yang sama sudah ada");
      }

      const fasilitas = await this.prisma.fasilitas.create({
        data: facilityData
      });

      this.logInfo('Facility created successfully', { facilityId: fasilitas.id });
      return fasilitas;
    } catch (error) {
      this.handleError(error, 'createFasilitas');
      throw error;
    }
  }

  async updateFasilitas(id: string, facilityData: FasilitasUpdate): Promise<Fasilitas> {
    try {
      this.logInfo('Updating facility', { id, facilityData });
      
      const existingFasilitas = await this.prisma.fasilitas.findUnique({
        where: { id }
      });

      if (!existingFasilitas) {
        throw new NotFoundError("Fasilitas tidak ditemukan");
      }

      if (facilityData.nama_fasilitas && 
          facilityData.nama_fasilitas !== existingFasilitas.nama_fasilitas) {
        const nameConflict = await this.prisma.fasilitas.findFirst({
          where: {
            nama_fasilitas: {
              equals: facilityData.nama_fasilitas,
              mode: "insensitive"
            },
            id: {
              not: id
            }
          }
        });

        if (nameConflict) {
          throw new BadRequestError("Fasilitas dengan nama yang sama sudah ada");
        }
      }

      const updatedFasilitas = await this.prisma.fasilitas.update({
        where: { id },
        data: facilityData
      });

      this.logInfo('Facility updated successfully', { facilityId: id });
      return updatedFasilitas;
    } catch (error) {
      this.handleError(error, 'updateFasilitas');
      throw error;
    }
  }

  async deleteFasilitas(id: string): Promise<boolean> {
    try {
      this.logInfo('Deleting facility', { id });
      
      const existingFasilitas = await this.prisma.fasilitas.findUnique({
        where: { id },
        include: {
          FasilitasGedung: true
        }
      });

      if (!existingFasilitas) {
        throw new NotFoundError("Fasilitas tidak ditemukan");
      }

      return await this.executeTransaction(async (tx) => {
        if (existingFasilitas.FasilitasGedung.length > 0) {
          await tx.fasilitasGedung.deleteMany({
            where: { fasilitas_id: id }
          });
        }

        await tx.fasilitas.delete({
          where: { id }
        });

        this.logInfo('Facility deleted successfully', { facilityId: id });
        return true;
      });
    } catch (error) {
      this.handleError(error, 'deleteFasilitas');
      throw error;
    }
  }
}

export default new FasilitasService();