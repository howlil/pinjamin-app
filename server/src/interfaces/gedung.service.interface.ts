import { Gedung, GedungCreate, GedungUpdate, GedungFilter } from '../types/gedung.types';

export interface IGedungService {
  getAllGedung(filter?: GedungFilter): Promise<Gedung[]>;
  getGedungById(id: string): Promise<Gedung>;
  createGedung(data: GedungCreate): Promise<Gedung>;
  updateGedung(id: string, data: GedungUpdate): Promise<Gedung>;
  deleteGedung(id: string): Promise<boolean>;
  checkGedungAvailability(gedungId: string, tanggalMulai: string, tanggalSelesai: string): Promise<boolean>;
  getAvailableGedung(tanggalMulai: string, tanggalSelesai: string, filter?: GedungFilter): Promise<Gedung[]>;
}