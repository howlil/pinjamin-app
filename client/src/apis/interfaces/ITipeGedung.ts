import { Gedung } from "./IGedung";

export interface TipeGedung {
  id: string;
  nama_tipe_gedung: string;
  createdAt: Date;
  updatedAt: Date;
  Gedung?: Gedung[];
}

export interface TipeGedungCreate {
  nama_tipe_gedung: string;
}

export interface TipeGedungUpdate {
  nama_tipe_gedung?: string;
}