import { prisma } from "../configs/db.config";
import { BadRequestError, NotFoundError } from "../configs/error.config";
import { 
  PenanggungJawabGedung, 
  PenanggungJawabGedungCreate, 
  PenanggungJawabGedungUpdate 
} from "../interfaces/types/penanggung-jawab-gedung.types";

export class PenanggungJawabGedungService {

  async getAllPenanggungJawab(): Promise<PenanggungJawabGedung[]> {
    const penanggungJawab = await prisma.penanggungJawabGedung.findMany({
      include: {
        Gedung: true
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return penanggungJawab as PenanggungJawabGedung[];
  }


  async createPenanggungJawab(data: PenanggungJawabGedungCreate): Promise<PenanggungJawabGedung> {
    const gedung = await prisma.gedung.findUnique({
      where: { id: data.gedung_id }
    });

    if (!gedung) {
      throw new NotFoundError("Gedung tidak ditemukan");
    }

    const existingWithPhone = await prisma.penanggungJawabGedung.findFirst({
      where: {
        no_hp: data.no_hp,
        gedung_id: data.gedung_id
      }
    });

    if (existingWithPhone) {
      throw new BadRequestError("Nomor HP penanggung jawab sudah terdaftar untuk gedung ini");
    }

    const penanggungJawab = await prisma.penanggungJawabGedung.create({
      data,
      include: {
        Gedung: true
      }
    });

    return penanggungJawab as PenanggungJawabGedung;
  }

  async updatePenanggungJawab(
    id: string, 
    data: PenanggungJawabGedungUpdate
  ): Promise<PenanggungJawabGedung> {
    // Check if the person in charge exists
    const existingPJ = await prisma.penanggungJawabGedung.findUnique({
      where: { id }
    });

    if (!existingPJ) {
      throw new NotFoundError("Penanggung jawab gedung tidak ditemukan");
    }

    if (data.gedung_id && data.gedung_id !== existingPJ.gedung_id) {
      const gedung = await prisma.gedung.findUnique({
        where: { id: data.gedung_id }
      });

      if (!gedung) {
        throw new NotFoundError("Gedung tidak ditemukan");
      }
    }

    if (data.no_hp && data.no_hp !== existingPJ.no_hp) {
      const gedungId = data.gedung_id || existingPJ.gedung_id;
      
      const existingWithPhone = await prisma.penanggungJawabGedung.findFirst({
        where: {
          no_hp: data.no_hp,
          gedung_id: gedungId,
          id: { not: id } // Exclude the current record
        }
      });

      if (existingWithPhone) {
        throw new BadRequestError("Nomor HP penanggung jawab sudah terdaftar untuk gedung ini");
      }
    }

    const updatedPJ = await prisma.penanggungJawabGedung.update({
      where: { id },
      data,
      include: {
        Gedung: true
      }
    });

    return updatedPJ as PenanggungJawabGedung;
  }

  
  async deletePenanggungJawab(id: string): Promise<boolean> {
    const existingPJ = await prisma.penanggungJawabGedung.findUnique({
      where: { id }
    });

    if (!existingPJ) {
      throw new NotFoundError("Penanggung jawab gedung tidak ditemukan");
    }

    await prisma.penanggungJawabGedung.delete({
      where: { id }
    });

    return true;
  }
}