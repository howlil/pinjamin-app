import { STATUSPEMINJAMAN } from '@prisma/client';
import { Pengguna } from './pengguna.types';
import { Gedung } from './gedung.types';
import { Pembayaran } from './pembayaran.types';

export interface Peminjaman {
  id: string;
  pengguna_id: string | null;  // Changed from string | undefined to string | null
  gedung_id: string;
  nama_kegiatan: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  jam_mulai: string;
  jam_selesai: string;
  surat_pengajuan: string;
  alasan_penolakan?: string;
  status_peminjaman: STATUSPEMINJAMAN;
  pembayaran?: Pembayaran;
  pengguna?: Pengguna;
  gedung?: Gedung;
  createdAt: Date;
  updatedAt: Date;
}

export interface PeminjamanCreate {
  pengguna_id?: string | null;  // Changed from string | undefined to string | null
  gedung_id: string;
  nama_kegiatan: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  jam_mulai: string;
  jam_selesai: string;
  surat_pengajuan: string;
  status_peminjaman?: STATUSPEMINJAMAN;
}

export interface PeminjamanUpdate {
  nama_kegiatan?: string;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  jam_mulai?: string;
  jam_selesai?: string;
  surat_pengajuan?: string;
  alasan_penolakan?: string;
  status_peminjaman?: STATUSPEMINJAMAN;
}

export interface PeminjamanApproval {
  status_peminjaman: STATUSPEMINJAMAN;
  alasan_penolakan?: string | null;  
}