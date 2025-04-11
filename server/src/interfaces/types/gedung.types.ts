import { FasilitasGedung } from './fasilitas-gedung.types';
import { TipeGedung } from './tipe-gedung.types';
import { PenanggungJawabGedung, PenanggungJawabGedungCreate } from './penanggung-jawab-gedung.types';
import { FasilitasGedungCreate } from './fasilitas-gedung.types';
import { Peminjaman } from './peminjaman.types';

export interface Gedung {
  id: string;
  nama_gedung: string;
  deskripsi: string;
  harga_sewa: number;
  foto_gedung?: string | null;
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
  foto_gedung?: string | null;
  harga_sewa: number;
}

export interface GedungCreate {
  nama_gedung: string;
  deskripsi: string;
  harga_sewa: number;
  kapasitas: number;
  foto_gedung?: string | null;
  lokasi: string;
  tipe_gedung_id: string;
  penanggung_jawab_gedung?: PenanggungJawabGedungCreate[]; // Make optional
  fasilitas_gedung?: FasilitasGedungCreate[]; // Make optional
}

export interface GedungUpdate {
  nama_gedung?: string;
  deskripsi?: string;
  harga_sewa?: number;
  kapasitas?: number;
  lokasi?: string;
  foto_gedung?: string | null;
  tipe_gedung_id?: string;
  penanggung_jawab_gedung?: PenanggungJawabGedungCreate[]; // Make optional
  fasilitas_gedung?: FasilitasGedungCreate[]; // Make optional
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