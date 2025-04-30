import { prisma } from "../configs/db.config";
import { BadRequestError, NotFoundError } from "../configs/error.config";
import { 
  Fasilitas, 
  FasilitasCreate, 
  FasilitasUpdate, 
  FasilitasWithGedung 
} from "../interfaces/types/fasilitas.types";

export class FasilitasService {
  
  async getAllFasilitas(): Promise<Fasilitas[]> {
    const fasilitas = await prisma.fasilitas.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return fasilitas;
  }


  async createFasilitas(facilityData: FasilitasCreate): Promise<Fasilitas> {
    const existingFasilitas = await prisma.fasilitas.findFirst({
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

    const fasilitas = await prisma.fasilitas.create({
      data: facilityData
    });

    return fasilitas;
  }

  
  async updateFasilitas(id: string, facilityData: FasilitasUpdate): Promise<Fasilitas> {
    // Check if the facility exists
    const existingFasilitas = await prisma.fasilitas.findUnique({
      where: { id }
    });

    if (!existingFasilitas) {
      throw new NotFoundError("Fasilitas tidak ditemukan");
    }

    if (facilityData.nama_fasilitas && 
        facilityData.nama_fasilitas !== existingFasilitas.nama_fasilitas) {
      const nameConflict = await prisma.fasilitas.findFirst({
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

    const updatedFasilitas = await prisma.fasilitas.update({
      where: { id },
      data: facilityData
    });

    return updatedFasilitas;
  }

  async deleteFasilitas(id: string): Promise<boolean> {
    const existingFasilitas = await prisma.fasilitas.findUnique({
      where: { id },
      include: {
        FasilitasGedung: true
      }
    });

    if (!existingFasilitas) {
      throw new NotFoundError("Fasilitas tidak ditemukan");
    }

    return prisma.$transaction(async (tx) => {
      if (existingFasilitas.FasilitasGedung.length > 0) {
        await tx.fasilitasGedung.deleteMany({
          where: { fasilitas_id: id }
        });
      }

      await tx.fasilitas.delete({
        where: { id }
      });

      return true;
    });
  }

  
}