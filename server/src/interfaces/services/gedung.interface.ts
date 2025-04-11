import {
  Gedung,
  Gedungs,
  GedungCreate,
  GedungUpdate,
  GedungFilter,
} from "../types/gedung.types";

export interface AvailabilityCheck {
  tanggalMulai: string;
  jamMulai: string;
}
export interface IGedungService {
  getAllGedung(filter?: GedungFilter): Promise<Gedungs[]>;
  getGedungById(id: string): Promise<Gedung>;
  createGedung(gedungData: GedungCreate): Promise<Gedung>;
  updateGedung(id: string, data: GedungUpdate): Promise<Gedung>;
  deleteGedung(id: string): Promise<boolean>;
  checkGedungAvailability(data: AvailabilityCheck): Promise<Gedungs[]>;
}
