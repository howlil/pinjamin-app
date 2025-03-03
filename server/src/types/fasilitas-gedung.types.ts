import { Gedung } from './gedung.types';

export interface FasilitasGedung {
  id: string;
  nama_fasilitas: string;
  icon_url: string;
  gedung_id: string;
  Gedung?: Gedung;
  createdAt: Date;
  updatedAt: Date;
}

export interface FasilitasGedungCreate {
  nama_fasilitas: string;
  icon_url: string;
  gedung_id: string;
}

export interface FasilitasGedungUpdate {
  nama_fasilitas?: string;
  icon_url?: string;
}