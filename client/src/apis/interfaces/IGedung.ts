import { PenanggungJawabGedungCreate } from './IPenanggungJawabGedung';
import { FasilitasGedungCreate } from './IFasilitasGedung';

export interface Gedung {
  id: string;
  nama_gedung: string;
  harga_sewa: number;
  foto_gedung?: string;
  kapasitas?: number;
}

export interface GedungExtended extends Gedung {
  deskripsi: string;
  lokasi: string;
  tipe_gedung_id: string;
  TipeGedung?: TipeGedung;
  FasilitasGedung?: Array<{
    id: string;
    nama_fasilitas: string;
    icon_url?: string;
    gedung_id: string;
  }>;
  penganggung_jawab_gedung?: Array<{
    id: string;
    nama_penangguang_jawab: string;
    no_hp: string;
    gedung_id: string;
  }>;
}

export function isGedungExtended(gedung: Gedung): gedung is GedungExtended {
  return (
    'deskripsi' in gedung && 
    'lokasi' in gedung && 
    'tipe_gedung_id' in gedung
  );
}

export function extendGedung(gedung: Gedung): GedungExtended {
  return {
    ...gedung,
    deskripsi: (gedung as any).deskripsi || "",
    lokasi: (gedung as any).lokasi || "",
    tipe_gedung_id: (gedung as any).tipe_gedung_id || "",
    TipeGedung: (gedung as any).TipeGedung,
    FasilitasGedung: (gedung as any).FasilitasGedung || [],
    penganggung_jawab_gedung: (gedung as any).penganggung_jawab_gedung || []
  };
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

export interface GedungFilter {
  nama_gedung?: string;
  lokasi?: string;
  tipe_gedung_id?: string;
  kapasitas_min?: number;
  kapasitas_max?: number;
  harga_min?: number;
  harga_max?: number;
}

export interface CheckAvailable {
  tanggalMulai: string;
  jamMulai: string;
}

export interface ResCheckAvailable {
  id: string;
  nama_gedung: string;
  harga_sewa: number;
  kapasitas: number;
  foto_gedung : string;
  lokasi: string;
}

export interface Gedungs {
  id: string;
  nama_gedung: string;
  foto_gedung: string;
  deskripsi: string;
  harga_sewa: number;
  kapasitas: number;
  lokasi: string;
  tipe_gedung_id: string;
  TipeGedung: TipeGedung;
  FasilitasGedung: FasilitasGedung[];
  penganggung_jawab_gedung: PenanggungJawabGedung[];
  Peminjaman: import('./IPeminjaman').Peminjaman[];
}

export interface FasilitasGedung {
  id: string;
  nama_fasilitas: string;
  icon_url?: string;
  gedung_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface TipeGedung {
  id: string;
  nama_tipe_gedung: string;
  createdAt: string;
  updatedAt: string;
}

export interface PenanggungJawabGedung {
  id: string;
  nama_penangguang_jawab: string;
  no_hp: string;
  gedung_id: string;
  createdAt: string;
  updatedAt: string;
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