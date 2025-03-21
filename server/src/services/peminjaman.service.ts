import { prisma } from '../configs/db.config';
import { 
  Peminjaman, 
  PeminjamanCreate, 
  PeminjamanUpdate,
  PeminjamanApproval
} from '../interfaces/types/peminjaman.types';
import { IPeminjamanService } from '../interfaces/services/peminjaman.interface';
import { NotFoundError, BadRequestError } from '../configs/error.config';
import { NotifikasiService } from './notifikasi.service';
import { STATUSPEMINJAMAN } from '@prisma/client';

export class PeminjamanService implements IPeminjamanService {
  private notifikasiService: NotifikasiService;

  constructor() {
    this.notifikasiService = new NotifikasiService();
  }

  async getAllPeminjaman(): Promise<Peminjaman[]> {
    const peminjamans = await prisma.peminjaman.findMany({
      include: {
        pengguna: {
          select: {
            id: true,
            nama_lengkap: true,
            email: true,
            no_hp: true,
            tipe_peminjam: true,
          },
        },
        gedung: {
          select: {
            id: true,
            nama_gedung: true,
            lokasi: true,
            harga_sewa: true,
          },
        },
        pembayaran: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return peminjamans as unknown as Peminjaman[];
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
          },
        },
        gedung: {
          select: {
            id: true,
            nama_gedung: true,
            lokasi: true,
            harga_sewa: true,
            kapasitas: true,
            TipeGedung: true,
          },
        },
        pembayaran: true,
      },
    });
    
    if (!peminjaman) {
      throw new NotFoundError('Peminjaman tidak ditemukan');
    }
    
    return peminjaman as unknown as Peminjaman;
  }

  async getPeminjamanByPengguna(penggunaId: string): Promise<Peminjaman[]> {
    const peminjamans = await prisma.peminjaman.findMany({
      where: { pengguna_id: penggunaId },
      include: {
        gedung: {
          select: {
            id: true,
            nama_gedung: true,
            lokasi: true,
            harga_sewa: true,
          },
        },
        pembayaran: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return peminjamans as unknown as Peminjaman[];
  }

  async createPeminjaman(peminjamanData: PeminjamanCreate): Promise<Peminjaman> {
    // Cek ketersediaan gedung untuk tanggal yang diminta
    const existingPeminjaman = await prisma.peminjaman.findFirst({
      where: {
        gedung_id: peminjamanData.gedung_id,
        status_peminjaman: {
          in: [STATUSPEMINJAMAN.DIPROSES, STATUSPEMINJAMAN.DISETUJUI],
        },
        OR: [
          {
            // Requested dates overlap with existing booking
            AND: [
              {
                tanggal_mulai: {
                  lte: peminjamanData.tanggal_selesai,
                },
              },
              {
                tanggal_selesai: {
                  gte: peminjamanData.tanggal_mulai,
                },
              },
            ],
          },
        ],
      },
    });
    
    if (existingPeminjaman) {
      throw new BadRequestError('Gedung tidak tersedia untuk tanggal yang dipilih');
    }

    // Verifikasi tanggal_mulai sebelum tanggal_selesai
    const tanggalMulai = new Date(peminjamanData.tanggal_mulai);
    const tanggalSelesai = new Date(peminjamanData.tanggal_selesai);
    
    if (tanggalMulai > tanggalSelesai) {
      throw new BadRequestError('Tanggal mulai tidak boleh lebih dari tanggal selesai');
    }

     
    const peminjaman = await prisma.peminjaman.create({
      data: {
        ...peminjamanData,
        status_peminjaman: STATUSPEMINJAMAN.DIPROSES
      },
      include: {
        pengguna: {
          select: {
            id: true,
            nama_lengkap: true,
            email: true,
            no_hp: true,
          },
        },
        gedung: {
          select: {
            id: true,
            nama_gedung: true,
            lokasi: true,
            harga_sewa: true,
          },
        },
      },
    });

    // Kirim notifikasi ke user
    if (peminjaman.pengguna_id) {
      await this.notifikasiService.sendPeminjamanNotification(
        peminjaman.pengguna_id,
        peminjaman.id,
        'DIPROSES',
        'Pengajuan peminjaman gedung berhasil dibuat dan sedang diproses'
      );
    }

    return peminjaman as unknown as Peminjaman;
  }

  async updatePeminjaman(id: string, peminjamanData: PeminjamanUpdate): Promise<Peminjaman> {
    // Cek apakah peminjaman ada
    const existingPeminjaman = await prisma.peminjaman.findUnique({
      where: { id },
    });
    
    if (!existingPeminjaman) {
      throw new NotFoundError('Peminjaman tidak ditemukan');
    }

    // Jika update tanggal, cek konflik
    if (peminjamanData.tanggal_mulai && peminjamanData.tanggal_selesai) {
      const conflictingPeminjaman = await prisma.peminjaman.findFirst({
        where: {
          id: { not: id },
          gedung_id: existingPeminjaman.gedung_id,
          status_peminjaman: {
            in: [STATUSPEMINJAMAN.DIPROSES, STATUSPEMINJAMAN.DISETUJUI],
          },
          OR: [
            {
              AND: [
                {
                  tanggal_mulai: {
                    lte: peminjamanData.tanggal_selesai,
                  },
                },
                {
                  tanggal_selesai: {
                    gte: peminjamanData.tanggal_mulai,
                  },
                },
              ],
            },
          ],
        },
      });
      
      if (conflictingPeminjaman) {
        throw new BadRequestError('Gedung tidak tersedia untuk tanggal yang dipilih');
      }
    }

    // Update peminjaman
    const updatedPeminjaman = await prisma.peminjaman.update({
      where: { id },
      data: peminjamanData,
      include: {
        pengguna: {
          select: {
            id: true,
            nama_lengkap: true,
            email: true,
            no_hp: true,
          },
        },
        gedung: {
          select: {
            id: true,
            nama_gedung: true,
            lokasi: true,
            harga_sewa: true,
          },
        },
        pembayaran: true,
      },
    });

    return updatedPeminjaman as unknown as Peminjaman;
  }

  async approvePeminjaman(id: string, approvalData: PeminjamanApproval): Promise<Peminjaman> {
    // Cek apakah peminjaman ada
    const peminjaman = await prisma.peminjaman.findUnique({
      where: { id },
      include: {
        pengguna: true,
        gedung: true,
      },
    });
    
    if (!peminjaman) {
      throw new NotFoundError('Peminjaman tidak ditemukan');
    }

    // Update status peminjaman
    const updatedPeminjaman = await prisma.peminjaman.update({
      where: { id },
      data: approvalData,
      include: {
        pengguna: {
          select: {
            id: true,
            nama_lengkap: true,
            email: true,
            no_hp: true,
          },
        },
        gedung: {
          select: {
            id: true,
            nama_gedung: true,
            lokasi: true,
            harga_sewa: true,
          },
        },
        pembayaran: true,
      },
    });

    // Kirim notifikasi ke user
    if (peminjaman.pengguna_id) {
      const statusMap: Record<STATUSPEMINJAMAN, string> = {
        [STATUSPEMINJAMAN.DIPROSES]: 'sedang diproses',
        [STATUSPEMINJAMAN.DISETUJUI]: 'telah disetujui',
        [STATUSPEMINJAMAN.DITOLAK]: 'ditolak',
        [STATUSPEMINJAMAN.SELESAI]: 'telah selesai',
      };

      const message = `Peminjaman ${peminjaman.gedung.nama_gedung} ${statusMap[approvalData.status_peminjaman]}`;
      
      await this.notifikasiService.sendPeminjamanNotification(
        peminjaman.pengguna_id,
        peminjaman.id,
        approvalData.status_peminjaman,
        message + (approvalData.alasan_penolakan ? `. Alasan: ${approvalData.alasan_penolakan}` : '')
      );
    }

    return updatedPeminjaman as unknown as Peminjaman;
  }

  async deletePeminjaman(id: string): Promise<boolean> {
    // Cek apakah peminjaman ada
    const peminjaman = await prisma.peminjaman.findUnique({
      where: { id },
    });
    
    if (!peminjaman) {
      throw new NotFoundError('Peminjaman tidak ditemukan');
    }

    // Hapus peminjaman
    await prisma.peminjaman.delete({
      where: { id },
    });

    return true;
  }

  async getPeminjamanStatistics(): Promise<{
    total: number;
    approved: number;
    rejected: number;
    pending: number;
    completed: number;
    byMonth: {
      month: string;
      count: number;
    }[];
  }> {
    // Mendapatkan jumlah berdasarkan status
    const statusCounts = await prisma.peminjaman.groupBy({
      by: ['status_peminjaman'],
      _count: {
        id: true,
      },
    });

    // Mendapatkan jumlah berdasarkan bulan
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1).toISOString().split('T')[0];
    const endOfYear = new Date(currentYear, 11, 31).toISOString().split('T')[0];

    const peminjamansThisYear = await prisma.peminjaman.findMany({
      where: {
        tanggal_mulai: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
      select: {
        tanggal_mulai: true,
      },
    });

    // Kelompokkan berdasarkan bulan
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const byMonth = Array.from({ length: 12 }, (_, i) => ({
      month: monthNames[i],
      count: 0,
    }));

    peminjamansThisYear.forEach(peminjaman => {
      const month = new Date(peminjaman.tanggal_mulai).getMonth();
      byMonth[month].count++;
    });

    return {
      total: statusCounts.reduce((acc, curr) => acc + curr._count.id, 0),
      approved: statusCounts.find(sc => sc.status_peminjaman === STATUSPEMINJAMAN.DISETUJUI)?._count.id || 0,
      rejected: statusCounts.find(sc => sc.status_peminjaman === STATUSPEMINJAMAN.DITOLAK)?._count.id || 0,
      pending: statusCounts.find(sc => sc.status_peminjaman === STATUSPEMINJAMAN.DIPROSES)?._count.id || 0,
      completed: statusCounts.find(sc => sc.status_peminjaman === STATUSPEMINJAMAN.SELESAI)?._count.id || 0,
      byMonth,
    };
  }
}

export default new PeminjamanService();