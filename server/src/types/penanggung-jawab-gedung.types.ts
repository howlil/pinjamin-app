import { Gedung } from './gedung.types';

export interface PenanggungJawabGedung {
  id: string;
  nama_penangguang_jawab: string;
  no_hp: string;
  gedung_id: string;
  createdAt: Date;
  updatedAt: Date;
  Gedung?: Gedung;
}

export interface PenanggungJawabGedungCreate {
  nama_penangguang_jawab: string;
  no_hp: string;
  gedung_id: string;
}

export interface PenanggungJawabGedungUpdate {
  nama_penangguang_jawab?: string;
  no_hp?: string;
}