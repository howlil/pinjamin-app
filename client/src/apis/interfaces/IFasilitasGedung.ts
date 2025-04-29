import { Gedung } from "./IGedung";

export interface FasilitasGedung {
  id: string;
  nama_fasilitas: string;
  icon_url: string;
  gedung_id: string;
  Gedung?: Gedung;
}

export interface FasilitasGedungCreate {
  nama_fasilitas: string;
  icon_url: string;
}

export interface FasilitasGedungUpdate {
  nama_fasilitas?: string;
  icon_url?: string;
}
