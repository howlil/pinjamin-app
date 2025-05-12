import { Gedung } from './gedung.types';

export interface Fasilitas {
  id: string;
  nama_fasilitas: string;
  icon_url: string;
  createdAt: Date;
  updatedAt: Date;
  FasilitasGedung?: FasilitasGedung[];
}

export interface FasilitasGedung {
  fasilitas_id: string;
  gedung_id: string;
  fasilitas?: Fasilitas;
  gedung?: Gedung;
}

export interface FasilitasWithGedung extends Fasilitas {
  FasilitasGedung: Array<{
    fasilitas_id: string;
    gedung_id: string;
    gedung: Gedung;
  }>;
}

export interface FasilitasCreate {
  nama_fasilitas: string;
  icon_url: string;
}

export interface FasilitasUpdate {
  nama_fasilitas?: string;
  icon_url?: string;
}

export interface FasilitasGedungCreate {
  fasilitas_id: string;
  gedung_id: string;
}

export interface FasilitasGedungConnection {
  facilityId: string;
  buildingId: string;
}