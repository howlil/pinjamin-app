import {
  Gedung,
  GedungCreate,
  GedungUpdate,
  GedungFilter,
} from "../types/gedung.types";

export interface IGedungService {
  getAllGedung(filter?: GedungFilter): Promise<Gedung[]>;
  getGedungById(id: string): Promise<Gedung>;
  createGedung(gedungData: GedungCreate): Promise<Gedung>;
  updateGedung(id: string, gedungData: GedungUpdate): Promise<Gedung>;
  deleteGedung(id: string): Promise<boolean>;
  checkGedungAvailability(
    gedungId: string,
    tanggalMulai: string,
    tanggalSelesai: string
  ): Promise<boolean>;
}
