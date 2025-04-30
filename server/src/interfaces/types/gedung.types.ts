import { FasilitasGedung } from './fasilitas.types';
import { TipeGedung } from './tipe-gedung.types';
import { PenanggungJawabGedung } from './penanggung-jawab-gedung.types';
import { Peminjaman } from './peminjaman.types';

export interface Gedung {
  id: string;
  nama_gedung: string;
  deskripsi: string;
  harga_sewa: number;
  foto_gedung: string | null;
  kapasitas: number;
  lokasi: string;
  tipe_gedung_id: string;
  penganggung_jawab_gedung?: PenanggungJawabGedung[];
  FasilitasGedung?: FasilitasGedung[];
  TipeGedung?: TipeGedung;
  Peminjaman?: Peminjaman[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Gedungs {
  id: string;
  nama_gedung: string;
  foto_gedung: string | null;
  harga_sewa: number;
  kapasitas?: number;
  lokasi?: string;
}

export interface GedungCreate {
  nama_gedung: string;
  deskripsi: string;
  harga_sewa: number;
  kapasitas: number;
  foto_gedung?: string | null;
  lokasi: string;
  tipe_gedung_id: string;
  fasilitas_gedung?: { fasilitas_id: string }[];
  // Removed penanggung_jawab_gedung field
}

export interface GedungUpdate {
  nama_gedung?: string;
  deskripsi?: string;
  harga_sewa?: number;
  kapasitas?: number;
  lokasi?: string;
  foto_gedung?: string | null;
  tipe_gedung_id?: string;
  fasilitas_gedung?: { fasilitas_id: string }[];
  // Removed penanggung_jawab_gedung field
}

export interface GedungFilter {
  nama_gedung?: string;
  lokasi?: string;
  tipe_gedung_id?: string;
  kapasitas_min?: number;
  kapasitas_max?: number;
  harga_min?: number;
  harga_max?: number;
}