export interface Gedung {
  id: string;
  nama_gedung: string;
  harga_sewa: number;
  foto_gedung?: string;
  kapasitas?: number;
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