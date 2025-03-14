// src/services/peminjaman.service.ts
import { prisma } from '../configs/db.config';
import { NotFoundError, BadRequestError } from '../configs/error.config';
import { Peminjaman, PeminjamanCreate, PeminjamanUpdate, PeminjamanApproval } from '../types/peminjaman.types';
import { IPeminjamanService } from '../interfaces/peminjaman.service.interface';
import { INotifikasiService } from '../interfaces/notifikasi.service.interface';
import { NotifikasiService } from './notifikasi.service';
import { GedungService } from './gedung.service';
import { Notif, STATUSPEMINJAMAN } from '@prisma/client';
import { logger } from '../configs/logger.config';

export class PeminjamanService implements IPeminjamanService {
  private notifikasiService: INotifikasiService;
  private gedungService: GedungService;

  constructor() {
    this.notifikasiService = new NotifikasiService();
    this.gedungService = new GedungService();
  }

  async getAllPeminjaman(): Promise<Peminjaman[]> {
    const peminjamanList = await prisma.peminjaman.findMany({
      include: {
        pengguna: {
          select: {
            id: true,
            nama_lengkap: true,
            email: true,
            no_hp: true,
            tipe_peminjam: true,
            role: true
          }
        },
        gedung: {
          include: {
            TipeGedung: true
          }
        },
        pembayaran: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    return peminjamanList as unknown as Peminjaman[];
  }

  async getPeminjamanById(id: string): Promise<Peminjaman> {
    const peminjaman = await prisma.peminjaman.findUnique({
      where: { id },
      include: {
        pengguna: {
          select: {
            id: true,
            nama_lengkap: true,
            email: true,
            no_hp: true,
            tipe_peminjam: true,
            role: true
          }
        },
        gedung: {
          include: {
            TipeGedung: true
          }
        },
        pembayaran: true
      }
    });
    
    if (!peminjaman) {
      throw new NotFoundError('Peminjaman tidak ditemukan');
    }
    
    return peminjaman as unknown as Peminjaman;
  }

  async getPeminjamanByUserId(userId: string): Promise<Peminjaman[]> {
    const peminjamanList = await prisma.peminjaman.findMany({
      where: { pengguna_id: userId },
      include: {
        gedung: {
          include: {
            TipeGedung: true
          }
        },
        pembayaran: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    return peminjamanList as unknown as Peminjaman[];
  }

  async createPeminjaman(data: PeminjamanCreate, userId: string): Promise<Peminjaman> {
    const { gedung_id, tanggal_mulai, tanggal_selesai } = data;
    
    // Check if gedung exists
    const gedung = await prisma.gedung.findUnique({
      where: { id: gedung_id }
    });
    
    if (!gedung) {
      throw new BadRequestError('Gedung tidak ditemukan');
    }
    
    // Check gedung availability
    const isAvailable = await this.gedungService.checkGedungAvailability(
      gedung_id,
      tanggal_mulai, 
      tanggal_selesai
    );
    
    if (!isAvailable) {
      throw new BadRequestError('Gedung tidak tersedia pada tanggal yang dipilih');
    }
    
    // Create peminjaman
    const peminjaman = await prisma.peminjaman.create({
      data: {
        ...data,
        pengguna_id: userId,
        status_peminjaman: STATUSPEMINJAMAN.DIPROSES
      },
      include: {
        gedung: true
      }
    });
    
    // Create notification for admin
    await this.notifikasiService.createNotifikasi({
      jenis_notifikasi: Notif.PEMINJAMAN,
      judul: 'Permohonan Peminjaman Baru',
      pesan: `Permohonan peminjaman baru untuk ${gedung.nama_gedung} pada tanggal ${tanggal_mulai} sampai ${tanggal_selesai}`,
      tanggal: new Date().toISOString().split('T')[0],
      status_baca: 0
    });
    
    logger.info(`Peminjaman baru dibuat oleh user ${userId} untuk gedung ${gedung_id}`);
    
    return peminjaman as unknown as Peminjaman;
  }

  async updatePeminjaman(id: string, data: PeminjamanUpdate): Promise<Peminjaman> {
    const peminjaman = await prisma.peminjaman.findUnique({
      where: { id }
    });
    
    if (!peminjaman) {
      throw new NotFoundError('Peminjaman tidak ditemukan');
    }
    
    // Check if status is not allowed to be changed through this method
    if (data.status_peminjaman && peminjaman.status_peminjaman !== data.status_peminjaman) {
      throw new BadRequestError('Untuk mengubah status peminjaman, gunakan API approval');
    }
    
    // If changing dates, check availability
    if ((data.tanggal_mulai || data.tanggal_selesai) && peminjaman.status_peminjaman === STATUSPEMINJAMAN.DIPROSES) {
      const tanggalMulai = data.tanggal_mulai || peminjaman.tanggal_mulai;
      const tanggalSelesai = data.tanggal_selesai || peminjaman.tanggal_selesai;
      
      const isAvailable = await this.gedungService.checkGedungAvailability(
        peminjaman.gedung_id,
        tanggalMulai, 
        tanggalSelesai
      );
      
      if (!isAvailable) {
        throw new BadRequestError('Gedung tidak tersedia pada tanggal yang dipilih');
      }
    }
    
    // Update peminjaman
    const updatedPeminjaman = await prisma.peminjaman.update({
      where: { id },
      data,
      include: {
        pengguna: {
          select: {
            id: true,
            nama_lengkap: true,
            email: true,
            no_hp: true
          }
        },
        gedung: true
      }
    });
    
    logger.info(`Peminjaman ${id} telah diperbarui`);
    
    return updatedPeminjaman as unknown as Peminjaman;
  }

  async deletePeminjaman(id: string): Promise<boolean> {
    const peminjaman = await prisma.peminjaman.findUnique({
      where: { id },
      include: {
        pembayaran: true
      }
    });
    
    if (!peminjaman) {
      throw new NotFoundError('Peminjaman tidak ditemukan');
    }
    
    // Check if peminjaman has active payment
    if (peminjaman.pembayaran) {
      throw new BadRequestError('Peminjaman tidak dapat dihapus karena sudah ada pembayaran');
    }
    
    // Check if status allows deletion
    if (peminjaman.status_peminjaman !== STATUSPEMINJAMAN.DIPROSES) {
      throw new BadRequestError('Hanya peminjaman dengan status DIPROSES yang dapat dihapus');
    }
    
    await prisma.peminjaman.delete({
      where: { id }
    });
    
    logger.info(`Peminjaman ${id} telah dihapus`);
    
    return true;
  }

  async approvePeminjaman(id: string, data: PeminjamanApproval): Promise<Peminjaman> {
    const peminjaman = await prisma.peminjaman.findUnique({
      where: { id },
      include: {
        pengguna: true,
        gedung: true
      }
    });
    
    if (!peminjaman) {
      throw new NotFoundError('Peminjaman tidak ditemukan');
    }
    
    // Check if status is valid for approval
    if (peminjaman.status_peminjaman !== STATUSPEMINJAMAN.DIPROSES) {
      throw new BadRequestError('Hanya peminjaman dengan status DIPROSES yang dapat disetujui atau ditolak');
    }
    
    // Check if approval data is valid
    if (data.status_peminjaman === STATUSPEMINJAMAN.DITOLAK && !data.alasan_penolakan) {
      throw new BadRequestError('Alasan penolakan harus diisi');
    }
    
    // Update peminjaman status
    const updatedPeminjaman = await prisma.peminjaman.update({
      where: { id },
      data: {
        status_peminjaman: data.status_peminjaman,
        alasan_penolakan: data.alasan_penolakan
      },
      include: {
        pengguna: true,
        gedung: true
      }
    });
    
    // Create notification for user
    if (peminjaman.pengguna && peminjaman.pengguna.id) {
      const notifikasiJudul = data.status_peminjaman === STATUSPEMINJAMAN.DISETUJUI
        ? 'Peminjaman Disetujui'
        : 'Peminjaman Ditolak';
        
      const notifikasiPesan = data.status_peminjaman === STATUSPEMINJAMAN.DISETUJUI
        ? `Peminjaman Anda untuk ${peminjaman.gedung.nama_gedung} pada tanggal ${peminjaman.tanggal_mulai} sampai ${peminjaman.tanggal_selesai} telah disetujui`
        : `Peminjaman Anda untuk ${peminjaman.gedung.nama_gedung} ditolak dengan alasan: ${data.alasan_penolakan}`;
      
      await this.notifikasiService.createNotifikasi({
        pengguna_id: peminjaman.pengguna.id,
        jenis_notifikasi: Notif.PEMINJAMAN,
        judul: notifikasiJudul,
        pesan: notifikasiPesan,
        tanggal: new Date().toISOString().split('T')[0],
        status_baca: 0
      });
      
      // Send push notification
      await this.notifikasiService.sendPushNotification(
        peminjaman.pengguna.id,
        notifikasiJudul,
        notifikasiPesan,
        Notif.PEMINJAMAN
      );
    }
    
    logger.info(`Peminjaman ${id} telah ${data.status_peminjaman === STATUSPEMINJAMAN.DISETUJUI ? 'disetujui' : 'ditolak'}`);
    
    return updatedPeminjaman as unknown as Peminjaman;
  }

  async getPeminjamanStatistics(): Promise<{
    totalPeminjaman: number;
    byStatus: Record<STATUSPEMINJAMAN, number>;
    byMonth: Array<{ month: string; count: number }>;
    byGedung: Array<{ gedungId: string; gedungName: string; count: number }>;
  }> {
    // Get total peminjaman
    const totalPeminjaman = await prisma.peminjaman.count();
    
    // Get peminjaman by status
    const statusCounts = await prisma.peminjaman.groupBy({
      by: ['status_peminjaman'],
      _count: {
        id: true
      }
    });
    
    const byStatus: Record<STATUSPEMINJAMAN, number> = {
      [STATUSPEMINJAMAN.DIPROSES]: 0,
      [STATUSPEMINJAMAN.DISETUJUI]: 0,
      [STATUSPEMINJAMAN.DITOLAK]: 0,
      [STATUSPEMINJAMAN.SELESAI]: 0
    };
    
    statusCounts.forEach(item => {
      byStatus[item.status_peminjaman] = item._count.id;
    });
    
    // Get peminjaman by month (last 12 months)
    const currentDate = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(currentDate.getMonth() - 11);
    
    const peminjamanByDate = await prisma.peminjaman.findMany({
      where: {
        createdAt: {
          gte: twelveMonthsAgo
        }
      },
      select: {
        createdAt: true
      }
    });
    
    const monthCounts: Record<string, number> = {};
    
    // Initialize all months with 0
    for (let i = 0; i < 12; i++) {
      const date = new Date(twelveMonthsAgo);
      date.setMonth(twelveMonthsAgo.getMonth() + i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthCounts[monthKey] = 0;
    }
    
    // Count peminjaman by month
    peminjamanByDate.forEach(item => {
      const date = new Date(item.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
    });
    
    const byMonth = Object.entries(monthCounts).map(([month, count]) => ({
      month,
      count
    })).sort((a, b) => a.month.localeCompare(b.month));
    
    // Get peminjaman by gedung
    const gedungCounts = await prisma.peminjaman.groupBy({
      by: ['gedung_id'],
      _count: {
        id: true
      }
    });
    
    const gedungIds = gedungCounts.map(item => item.gedung_id);
    
    const gedungDetails = await prisma.gedung.findMany({
      where: {
        id: {
          in: gedungIds
        }
      },
      select: {
        id: true,
        nama_gedung: true
      }
    });
    
    const gedungMap = new Map(gedungDetails.map(g => [g.id, g.nama_gedung]));
    
    const byGedung = gedungCounts.map(item => ({
      gedungId: item.gedung_id,
      gedungName: gedungMap.get(item.gedung_id) || 'Unknown',
      count: item._count.id
    })).sort((a, b) => b.count - a.count);
    
    return {
      totalPeminjaman,
      byStatus,
      byMonth,
      byGedung
    };
  }
}