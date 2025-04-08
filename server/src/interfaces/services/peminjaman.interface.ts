import { 
    Peminjaman, 
    PeminjamanCreate, 
    PeminjamanUpdate,
    PeminjamanApproval 
  } from '../types/peminjaman.types';
  
  export interface IPeminjamanService {
    getAllPeminjaman(): Promise<Peminjaman[]>;
    getPeminjamanById(id: string): Promise<Peminjaman>;
    getPeminjamanByPengguna(penggunaId: string): Promise<Peminjaman[]>;
    createPeminjaman(peminjamanData: PeminjamanCreate): Promise<Peminjaman>;
    updatePeminjaman(id: string, peminjamanData: PeminjamanUpdate): Promise<Peminjaman>;
    approvePeminjaman(id: string, approvalData: PeminjamanApproval): Promise<Peminjaman>;
    deletePeminjaman(id: string): Promise<boolean>;
    getPeminjamanStatistics(): Promise<{
      total: number;
      approved: number;
      rejected: number;
      pending: number;
      completed: number;
      byMonth: {
        month: string;
        count: number;
      }[];
    }>;
  }