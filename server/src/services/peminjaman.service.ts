// server/src/services/peminjaman.service.ts
import {
  Peminjaman,
  PeminjamanCreate,
  PeminjamanUpdate,
  PeminjamanApproval,
} from "../interfaces/types/peminjaman.types";
import { NotFoundError, BadRequestError } from "../configs/error.config";
import { NotifikasiService } from "./notifikasi.service";
import { STATUSPEMINJAMAN } from "@prisma/client";
import { PembayaranService } from "./pembayaran.service";
import { BaseService } from "./base.service";

export class PeminjamanService extends BaseService {
  private notifikasiService: NotifikasiService;
  private pembayaranService: PembayaranService;

  constructor() {
    super('PeminjamanService');
    this.notifikasiService = new NotifikasiService();
    this.pembayaranService = new PembayaranService();
  }

  async getAllPeminjaman(): Promise<Peminjaman[]> {
    try {
      this.logInfo('Fetching all peminjaman');
      
      const peminjamans = await this.prisma.peminjaman.findMany({
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
          pembayaran: {
            include: {
              refund: true
            }
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      this.logInfo(`Found ${peminjamans.length} peminjaman`);
      return peminjamans as unknown as Peminjaman[];
    } catch (error) {
      this.handleError(error, 'getAllPeminjaman');
      throw error;
    }
  }

  async getPeminjamanById(id: string): Promise<Peminjaman> {
    try {
      this.logInfo('Fetching peminjaman by ID', { id });
      
      const peminjaman = await this.prisma.peminjaman.findUnique({
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
          pembayaran: {
            include: {
              refund: true
            }
          },
        },
      });

      if (!peminjaman) {
        throw new NotFoundError("Peminjaman tidak ditemukan");
      }

      return peminjaman as unknown as Peminjaman;
    } catch (error) {
      this.handleError(error, 'getPeminjamanById');
      throw error;
    }
  }

  async getPeminjamanByPengguna(penggunaId: string): Promise<Peminjaman[]> {
    try {
      this.logInfo('Fetching peminjaman by user', { penggunaId });
      
      const peminjamans = await this.prisma.peminjaman.findMany({
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
          pembayaran: {
            include: {
              refund: true
            }
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return peminjamans as unknown as Peminjaman[];
    } catch (error) {
      this.handleError(error, 'getPeminjamanByPengguna');
      throw error;
    }
  }

  async createPeminjaman(
    peminjamanData: PeminjamanCreate
  ): Promise<Peminjaman> {
    try {
      this.logInfo('Creating new peminjaman', { peminjamanData });
      
      // Check building availability
      const existingPeminjaman = await this.prisma.peminjaman.findFirst({
        where: {
          gedung_id: peminjamanData.gedung_id,
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

      if (existingPeminjaman) {
        throw new BadRequestError(
          "Gedung tidak tersedia untuk tanggal yang dipilih"
        );
      }

      // Verify dates
      const tanggalMulai = new Date(peminjamanData.tanggal_mulai);
      const tanggalSelesai = new Date(peminjamanData.tanggal_selesai);

      if (tanggalMulai > tanggalSelesai) {
        throw new BadRequestError(
          "Tanggal mulai tidak boleh lebih dari tanggal selesai"
        );
      }

      const peminjaman = await this.prisma.peminjaman.create({
        data: {
          ...peminjamanData,
          status_peminjaman: STATUSPEMINJAMAN.DIPROSES,
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

      if (peminjaman.pengguna_id) {
        await this.pembayaranService.createSnapToken(peminjaman.id, peminjaman.pengguna_id);
        await this.notifikasiService.sendPeminjamanNotification(
          peminjaman.pengguna_id,
          peminjaman.id,
          "DIPROSES",
          "Pengajuan peminjaman gedung berhasil dibuat dan sedang diproses"
        );
      }

      this.logInfo('Peminjaman created successfully', { peminjamanId: peminjaman.id });
      return peminjaman as unknown as Peminjaman;
    } catch (error) {
      this.handleError(error, 'createPeminjaman');
      throw error;
    }
  }

  async updatePeminjaman(
    id: string,
    peminjamanData: PeminjamanUpdate
  ): Promise<Peminjaman> {
    try {
      this.logInfo('Updating peminjaman', { id, peminjamanData });
      
      const existingPeminjaman = await this.prisma.peminjaman.findUnique({
        where: { id },
        include: {
          pembayaran: true
        }
      });

      if (!existingPeminjaman) {
        throw new NotFoundError("Peminjaman tidak ditemukan");
      }

      // Check for conflicts if updating dates
      if (peminjamanData.tanggal_mulai && peminjamanData.tanggal_selesai) {
        const conflictingPeminjaman = await this.prisma.peminjaman.findFirst({
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
          throw new BadRequestError(
            "Gedung tidak tersedia untuk tanggal yang dipilih"
          );
        }
      }

      const updatedPeminjaman = await this.prisma.peminjaman.update({
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
          pembayaran: {
            include: {
              refund: true
            }
          },
        },
      });

      this.logInfo('Peminjaman updated successfully', { peminjamanId: id });
      return updatedPeminjaman as unknown as Peminjaman;
    } catch (error) {
      this.handleError(error, 'updatePeminjaman');
      throw error;
    }
  }

  async approvePeminjaman(
    id: string,
    approvalData: PeminjamanApproval
  ): Promise<Peminjaman> {
    try {
      this.logInfo('Processing peminjaman approval', { id, status: approvalData.status_peminjaman });
      
      const peminjaman = await this.prisma.peminjaman.findUnique({
        where: { id },
        include: {
          pengguna: true,
          gedung: true,
          pembayaran: true
        },
      });

      if (!peminjaman) {
        throw new NotFoundError("Peminjaman tidak ditemukan");
      }

      if (approvalData.status_peminjaman === STATUSPEMINJAMAN.DITOLAK && 
          peminjaman.pembayaran) {
        try {
          await this.pembayaranService.autoProcessRefundForRejectedBooking(
            id,
            approvalData.alasan_penolakan || "Peminjaman ditolak oleh admin"
          );
          
          this.logInfo("Refund processed successfully for rejected booking", { peminjamanId: id });
        } catch (error) {
          this.logError("Failed to process refund for rejected booking", error, { peminjamanId: id });
        }
      }

      const updatedPeminjaman = await this.prisma.peminjaman.update({
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
          pembayaran: {
            include: {
              refund: true
            }
          },
        },
      });

      // Send notification to user
      if (peminjaman.pengguna_id) {
        const statusMap: Record<STATUSPEMINJAMAN, string> = {
          [STATUSPEMINJAMAN.DIPROSES]: "sedang diproses",
          [STATUSPEMINJAMAN.DISETUJUI]: "telah disetujui",
          [STATUSPEMINJAMAN.DITOLAK]: "ditolak",
          [STATUSPEMINJAMAN.SELESAI]: "telah selesai",
        };

        const message = `Peminjaman ${peminjaman.gedung.nama_gedung} ${
          statusMap[approvalData.status_peminjaman]
        }`;

        let additionalInfo = approvalData.alasan_penolakan
          ? `. Alasan: ${approvalData.alasan_penolakan}`
          : "";
        
        if (approvalData.status_peminjaman === STATUSPEMINJAMAN.DITOLAK && 
            peminjaman.pembayaran) {
          additionalInfo += ". Pembayaran Anda akan direfund.";
        }

        await this.notifikasiService.sendPeminjamanNotification(
          peminjaman.pengguna_id,
          peminjaman.id,
          approvalData.status_peminjaman,
          message + additionalInfo
        );
      }

      this.logInfo('Peminjaman approval processed successfully', { peminjamanId: id });
      return updatedPeminjaman as unknown as Peminjaman;
    } catch (error) {
      this.handleError(error, 'approvePeminjaman');
      throw error;
    }
  }

  async deletePeminjaman(id: string): Promise<boolean> {
    try {
      this.logInfo('Deleting peminjaman', { id });
      
      const peminjaman = await this.prisma.peminjaman.findUnique({
        where: { id },
        include: {
          pembayaran: true
        }
      });

      if (!peminjaman) {
        throw new NotFoundError("Peminjaman tidak ditemukan");
      }

      if (peminjaman.pembayaran) {
        throw new BadRequestError(
          "Peminjaman yang sudah memiliki pembayaran tidak dapat dihapus"
        );
      }

      await this.prisma.peminjaman.delete({
        where: { id },
      });

      this.logInfo('Peminjaman deleted successfully', { peminjamanId: id });
      return true;
    } catch (error) {
      this.handleError(error, 'deletePeminjaman');
      throw error;
    }
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
    try {
      this.logInfo('Fetching peminjaman statistics');
      
      const statusCounts = await this.prisma.peminjaman.groupBy({
        by: ["status_peminjaman"],
        _count: {
          id: true,
        },
      });

      const currentYear = new Date().getFullYear();
      const startOfYear = new Date(currentYear, 0, 1).toISOString().split("T")[0];
      const endOfYear = new Date(currentYear, 11, 31).toISOString().split("T")[0];

      const peminjamansThisYear = await this.prisma.peminjaman.findMany({
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

      const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember",
      ];

      const byMonth = Array.from({ length: 12 }, (_, i) => ({
        month: monthNames[i],
        count: 0,
      }));

      peminjamansThisYear.forEach((peminjaman) => {
        const month = new Date(peminjaman.tanggal_mulai).getMonth();
        byMonth[month].count++;
      });

      const statistics = {
        total: statusCounts.reduce((acc, curr) => acc + curr._count.id, 0),
        approved:
          statusCounts.find(
            (sc) => sc.status_peminjaman === STATUSPEMINJAMAN.DISETUJUI
          )?._count.id || 0,
        rejected:
          statusCounts.find(
            (sc) => sc.status_peminjaman === STATUSPEMINJAMAN.DITOLAK
          )?._count.id || 0,
        pending:
          statusCounts.find(
            (sc) => sc.status_peminjaman === STATUSPEMINJAMAN.DIPROSES
          )?._count.id || 0,
        completed:
          statusCounts.find(
            (sc) => sc.status_peminjaman === STATUSPEMINJAMAN.SELESAI
          )?._count.id || 0,
        byMonth,
      };

      this.logInfo('Statistics fetched successfully', statistics);
      return statistics;
    } catch (error) {
      this.handleError(error, 'getPeminjamanStatistics');
      throw error;
    }
  }
}

export default new PeminjamanService();