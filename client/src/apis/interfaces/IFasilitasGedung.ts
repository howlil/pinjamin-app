export interface Fasilitas {
  id: string;
  nama_fasilitas: string;
  icon_url?: string;
  createdAt: Date;
  updatedAt: Date;
  FasilitasGedung?: FasilitasGedung[];
}

export interface FasilitasCreate {
  nama_fasilitas: string;
  icon_url?: string;
}

export interface FasilitasUpdate {
  nama_fasilitas?: string;
  icon_url?: string;
}

// Relation interface - if used elsewhere
export interface FasilitasGedung {
  id: string;
  fasilitas_id: string;
  gedung_id: string;
  createdAt: Date;
  updatedAt: Date;
}