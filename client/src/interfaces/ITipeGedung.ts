import { Gedung } from "@/interfaces/IGedung";

export interface TipeGedung {
  id: string;
  nama_tipe_gedung: string;
  gedung?: Gedung[];
}

export interface TipeGedungCreate {
  nama_tipe_gedung: string;
}

export interface TipeGedungUpdate {
  nama_tipe_gedung?: string;
}
