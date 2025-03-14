import { prisma } from '../configs/db.config';
import { NotFoundError, BadRequestError } from '../configs/error.config';
import { Gedung, GedungCreate, GedungUpdate, GedungFilter } from '../types/gedung.types';
import { STATUSPEMINJAMAN } from '@prisma/client';
import { IGedungService } from '../interfaces/gedung.service.interface';

export class GedungService implements IGedungService {
  
  async getAllGedung(filter?: GedungFilter): Promise<Gedung[]> {
    const where: any = {};
    
    if (filter) {
      if (filter.nama_gedung) {
        where.nama_gedung = {
          contains: filter.nama_gedung,
          mode: 'insensitive'
        };
      }
      
      if (filter.lokasi) {
        where.lokasi = {
          contains: filter.lokasi,
          mode: 'insensitive'
        };
      }
      
      if (filter.tipe_gedung_id) {
        where.tipe_gedung_id = filter.tipe_gedung_id;
      }
      
      if (filter.kapasitas_min) {
        where.kapasitas = {
          ...where.kapasitas,
          gte: filter.kapasitas_min
        };
      }
      
      if (filter.kapasitas_max) {
        where.kapasitas = {
          ...where.kapasitas,
          lte: filter.kapasitas_max
        };
      }
      
      if (filter.harga_min) {
        where.harga_sewa = {
          ...where.harga_sewa,
          gte: filter.harga_min
        };
      }
      
      if (filter.harga_max) {
        where.harga_sewa = {
          ...where.harga_sewa,
          lte: filter.harga_max
        };
      }
    }
    
    const gedungList = await prisma.gedung.findMany({
      where,
      include: {
        TipeGedung: true,
        FasilitasGedung: true,
        penganggung_jawab_gedung: true
      }
    });
    
    return gedungList;
  }
  
  async getGedungById(id: string): Promise<Gedung> {
    const gedung = await prisma.gedung.findUnique({
      where: { id },
      include: {
        TipeGedung: true,
        FasilitasGedung: true,
        penganggung_jawab_gedung: true
      }
    });
    
    if (!gedung) {
      throw new NotFoundError('Gedung tidak ditemukan');
    }
    
    return gedung;
  }
  
  async createGedung(data: GedungCreate): Promise<Gedung> {
    const tipeGedung = await prisma.tipeGedung.findUnique({
      where: { id: data.tipe_gedung_id }
    });
    
    if (!tipeGedung) {
      throw new BadRequestError('Tipe gedung tidak valid');
    }
    
    const gedung = await prisma.gedung.create({
      data,
      include: {
        TipeGedung: true
      }
    });
    
    return gedung;
  }
  
  async updateGedung(id: string, data: GedungUpdate): Promise<Gedung> {
    const gedung = await prisma.gedung.findUnique({
      where: { id }
    });
    
    if (!gedung) {
      throw new NotFoundError('Gedung tidak ditemukan');
    }
    
    if (data.tipe_gedung_id) {
      const tipeGedung = await prisma.tipeGedung.findUnique({
        where: { id: data.tipe_gedung_id }
      });
      
      if (!tipeGedung) {
        throw new BadRequestError('Tipe gedung tidak valid');
      }
    }
    
    const updatedGedung = await prisma.gedung.update({
      where: { id },
      data,
      include: {
        TipeGedung: true,
        FasilitasGedung: true,
        penganggung_jawab_gedung: true
      }
    });
    
    return updatedGedung;
  }
  
  async deleteGedung(id: string): Promise<boolean> {
    const gedung = await prisma.gedung.findUnique({
      where: { id },
      include: {
        Peminjaman: true,
        FasilitasGedung: true,
        penganggung_jawab_gedung: true
      }
    });
    
    if (!gedung) {
      throw new NotFoundError('Gedung tidak ditemukan');
    }
    
    if (gedung.Peminjaman && gedung.Peminjaman.length > 0) {
      throw new BadRequestError('Gedung sedang digunakan untuk peminjaman dan tidak dapat dihapus');
    }
    
    await prisma.$transaction(async (tx) => {
      await tx.fasilitasGedung.deleteMany({
        where: { gedung_id: id }
      });
      
      await tx.penanggungJawabGedung.deleteMany({
        where: { gedung_id: id }
      });
      
      await tx.gedung.delete({
        where: { id }
      });
    });
    
    return true;
  }
  
  async checkGedungAvailability(gedungId: string, tanggalMulai: string, tanggalSelesai: string): Promise<boolean> {
    const gedung = await prisma.gedung.findUnique({
      where: { id: gedungId }
    });
    
    if (!gedung) {
      throw new NotFoundError('Gedung tidak ditemukan');
    }
    
    const overlappingPeminjaman = await prisma.peminjaman.findFirst({
      where: {
        gedung_id: gedungId,
        status_peminjaman: {
          in: [STATUSPEMINJAMAN.DISETUJUI, STATUSPEMINJAMAN.DIPROSES]
        },
        OR: [
          {
            tanggal_mulai: {
              lte: tanggalSelesai
            },
            tanggal_selesai: {
              gte: tanggalMulai
            }
          }
        ]
      }
    });
    
    return !overlappingPeminjaman;
  }
  
  async getAvailableGedung(tanggalMulai: string, tanggalSelesai: string, filter?: GedungFilter): Promise<Gedung[]> {
    const allGedung = await this.getAllGedung(filter);
    
    const availableGedungPromises = allGedung.map(async (gedung) => {
      const isAvailable = await this.checkGedungAvailability(gedung.id, tanggalMulai, tanggalSelesai);
      return { gedung, isAvailable };
    });
    
    const availabilityResults = await Promise.all(availableGedungPromises);
    const availableGedung = availabilityResults
      .filter(result => result.isAvailable)
      .map(result => result.gedung);
    
    return availableGedung;
  }
}