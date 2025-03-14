// src/types/notifikasi.types.ts
import { Notif } from '@prisma/client';
import { Pengguna } from './pengguna.types';

export interface Notifikasi {
  id: string;
  pengguna_id: string | null;
  jenis_notifikasi: Notif;
  judul: string;
  pesan: string;
  tanggal: string;
  status_baca: number;
  Pengguna?: Pengguna | null; // Allow null for the relationship
  createdAt: Date;
  updatedAt: Date;
}

export interface NotifikasiCreate {
  pengguna_id?: string | null;
  jenis_notifikasi: Notif;
  judul: string;
  pesan: string;
  tanggal: string;
  status_baca: number;
}

export interface NotifikasiUpdate {
  jenis_notifikasi?: Notif;
  judul?: string;
  pesan?: string;
  tanggal?: string;
  status_baca?: number;
}