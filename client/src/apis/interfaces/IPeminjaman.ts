import { Pengguna } from "./IAuth";
import { STATUS } from "./IEnum";
import { Gedung } from "./IGedung";
import { Pembayaran } from "./IPembayaran";

export interface Peminjaman {
  id: string;
  pengguna_id?: string | null; // Allow null
  gedung_id: string;
  nama_kegiatan: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  jam_mulai: string;
  jam_selesai: string;
  surat_pengajuan: string;
  alasan_penolakan?: string | null; // Allow null
  status_peminjaman: typeof STATUS.STATUS_PEMINJAMAN;
  pembayaran?: Pembayaran | null; // Allow null
  pengguna?: Pengguna | null; // Allow null
  gedung?: Gedung | null; // Allow null
}

export interface PeminjamanFilter {
  total: number;
  approved: number;
  rejected: number;
  pending: number;
  completed: number;
  byMonth: BYMonthFilter;
}

interface BYMonthFilter {
  month: string;
  count: number;
}

export interface PeminjamanCreate {
  pengguna_id?: string | null; // Changed from string | undefined to string | null
  gedung_id: string;
  nama_kegiatan: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  jam_mulai: string;
  jam_selesai: string;
  surat_pengajuan: string;
  status_peminjaman?: typeof STATUS.STATUS_PEMINJAMAN;
}

export interface PeminjamanUpdate {
  nama_kegiatan?: string;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  jam_mulai?: string;
  jam_selesai?: string;
  surat_pengajuan?: string;
  alasan_penolakan?: string;
  status_peminjaman?: typeof STATUS.STATUS_PEMINJAMAN;
}

export interface PeminjamanApproval {
  status_peminjaman: typeof STATUS.STATUS_PEMINJAMAN;
  alasan_penolakan?: string | null;
}
