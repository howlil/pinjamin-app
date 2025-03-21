import { Gedung } from './gedung.types';

export interface TipeGedung {
  id: string;
  nama_tipe_gedung: string;
  gedung?: Gedung[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TipeGedungCreate {
  nama_tipe_gedung: string;
}

export interface TipeGedungUpdate {
  nama_tipe_gedung?: string;
}