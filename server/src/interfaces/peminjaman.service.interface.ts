import { Peminjaman, PeminjamanCreate, PeminjamanUpdate, PeminjamanApproval } from '../types/peminjaman.types';
import { STATUSPEMINJAMAN } from '@prisma/client';

export interface IPeminjamanService {
  getAllPeminjaman(): Promise<Peminjaman[]>;
  getPeminjamanById(id: string): Promise<Peminjaman>;
  getPeminjamanByUserId(userId: string): Promise<Peminjaman[]>;
  createPeminjaman(data: PeminjamanCreate, userId: string): Promise<Peminjaman>;
  updatePeminjaman(id: string, data: PeminjamanUpdate): Promise<Peminjaman>;
  deletePeminjaman(id: string): Promise<boolean>;
  approvePeminjaman(id: string, data: PeminjamanApproval): Promise<Peminjaman>;
  getPeminjamanStatistics(): Promise<{
    totalPeminjaman: number;
    byStatus: Record<STATUSPEMINJAMAN, number>;
    byMonth: Array<{ month: string; count: number }>;
    byGedung: Array<{ gedungId: string; gedungName: string; count: number }>;
  }>;
}