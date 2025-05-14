import { PenanggungJawabGedungCreate } from "./IPenanggungJawabGedung";
import { FasilitasCreate } from "./IFasilitasGedung"; // Ensure this is imported correctly

export interface Gedung {
  id: string;
  nama_gedung: string;
  harga_sewa: number;
  foto_gedung?: string;
  kapasitas?: number;
  tipe_gedung_id?: string;
  lokasi?: string;
  deskripsi?: string;
}

export interface GedungExtended extends Gedung {
  deskripsi: string;
  lokasi: string;
  tipe_gedung_id: string;
  TipeGedung?: TipeGedung; // Optional, add it only to GedungExtended
  FasilitasGedung?: Array<FasilitasGedung>; // Optional, add it only to GedungExtended
  penganggung_jawab_gedung?: Array<PenanggungJawabGedung>; // Optional, add it only to GedungExtended
}

export function isGedungExtended(gedung: Gedung): gedung is GedungExtended {
  return (
    "deskripsi" in gedung && "lokasi" in gedung && "tipe_gedung_id" in gedung
  );
}

export function extendGedung(gedung: Gedung): GedungExtended {
  return {
    ...gedung,
    deskripsi: gedung.deskripsi || "",
    lokasi: gedung.lokasi || "",
    tipe_gedung_id: gedung.tipe_gedung_id || "",
    TipeGedung: gedung.TipeGedung,  // Add this only if the object is GedungExtended
    FasilitasGedung: gedung.FasilitasGedung || [],
    penganggung_jawab_gedung: gedung.penganggung_jawab_gedung || [],
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
  penanggung_jawab_gedung?: PenanggungJawabGedungCreate[]; // Optional
  fasilitas_gedung?: FasilitasCreate[]; // Optional
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
  foto_gedung: string;
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
  Peminjaman: import("./IPeminjaman").Peminjaman[];
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
  penanggung_jawab_gedung?: PenanggungJawabGedungCreate[]; // Optional
  fasilitas_gedung?: FasilitasCreate[]; // Optional
}
