import { Peminjaman } from "./IPeminjaman";

export interface Gedung {
  id: string;
  nama_gedung: string;
  harga_sewa: number;
}

export interface CheckAvailable {
  tanggalMulai : string;
  jamMulai : string;
}
export interface ResCheckAvailable {
  id : string;
  nama_gedung : string;
  harga_sewa: number;
  kapasitas : number;
  lokasi : string;
}

export interface Gedungs {
  id: string;
  nama_gedung: string;
  deskripsi: string;
  harga_sewa: number;
  kapasitas: number;
  lokasi: string;
  tipe_gedung_id: string;
  createdAt: string;
  updatedAt: string;
  TipeGedung: TipeGedung;
  FasilitasGedung: FasilitasGedung[];
  penganggung_jawab_gedung: PenanggungJawabGedung[];
  Peminjaman: Peminjaman[];
}

export interface FasilitasGedung{

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
