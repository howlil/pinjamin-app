import ApiService from "@/utils/api";
import {
  CheckAvailable,
  Gedung,
  Gedungs,
  GedungFilter,
  ResCheckAvailable,
  GedungCreate,
  GedungUpdate,
} from "@/apis/interfaces/IGedung";

export class GedungService {
  private static baseUrl = "/api/v1/gedung";

  /**
   * Get all gedung with optional filtering
   */
  static async getGedung(filter: GedungFilter): Promise<Gedung[]> {
    let queryParams = "";

    if (filter) {
      const params = new URLSearchParams();

      if (filter.nama_gedung) {
        params.append("nama_gedung", filter.nama_gedung);
      }

      if (filter.lokasi) {
        params.append("lokasi", filter.lokasi);
      }

      if (filter.tipe_gedung_id) {
        params.append("tipe_gedung_id", filter.tipe_gedung_id);
      }

      if (filter.kapasitas_min) {
        params.append("kapasitas_min", filter.kapasitas_min.toString());
      }

      if (filter.kapasitas_max) {
        params.append("kapasitas_max", filter.kapasitas_max.toString());
      }

      if (filter.harga_min) {
        params.append("harga_min", filter.harga_min.toString());
      }

      if (filter.harga_max) {
        params.append("harga_max", filter.harga_max.toString());
      }

      queryParams = `?${params.toString()}`;
    }
    const res = await ApiService.get<{ data: Gedung[] }>(
      `${this.baseUrl}${queryParams}`
    );
    return res.data.data || [];
  }

  /**
   * Get a specific gedung by ID
   */
  static async getGedungById(id: string): Promise<Gedungs> {
    const res = await ApiService.get<Gedungs>(`${this.baseUrl}/${id}`);
    return res.data;
  }

  /**
   * Check availability of gedung for a specific date and time
   */
  static async checkAvailability(
    data: CheckAvailable
  ): Promise<ResCheckAvailable[]> {
    // Format date if needed (DD-MM-YYYY to DD-MM-YYYY)
    if (data.tanggalMulai && data.tanggalMulai.includes("-")) {
      const parts = data.tanggalMulai.split("-");
      if (parts.length === 3 && parts[0].length === 4) {
        data = {
          ...data,
          tanggalMulai: `${parts[2]}-${parts[1]}-${parts[0]}`,
        };
      }
    }

    const response = await ApiService.post<{ data: ResCheckAvailable[] }>(
      `${this.baseUrl}/check-availability`,
      data
    );

    if (response && response.data) {
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
    }

    return [];
  }

  /**
   * Create a new gedung with file upload support
   */
  static async createGedung(data: GedungCreate, fotoGedung?: File): Promise<Gedung> {
    // If there's a file upload, use FormData
    if (fotoGedung) {
      const formData = new FormData();
      
      // Add the file
      formData.append("foto_gedung", fotoGedung);
      
      // Add all other fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "foto_gedung" && value !== undefined && value !== null) {
          // Handle arrays like fasilitas_gedung specially
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      const res = await ApiService.post<Gedung>(
        `${this.baseUrl}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    } else {
      // No file, just send JSON
      const res = await ApiService.post<Gedung>(`${this.baseUrl}`, data);
      return res.data;
    }
  }

  /**
   * Update an existing gedung with file upload support
   */
  static async updateGedung(id: string, data: GedungUpdate, fotoGedung?: File): Promise<Gedung> {
    // If there's a file upload, use FormData
    if (fotoGedung) {
      const formData = new FormData();
      
      // Add the file
      formData.append("foto_gedung", fotoGedung);
      
      // Add all other fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "foto_gedung" && value !== undefined && value !== null) {
          // Handle arrays like fasilitas_gedung specially
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      const res = await ApiService.patch<Gedung>(
        `${this.baseUrl}/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    } else {
      // No file, just send JSON
      const res = await ApiService.patch<Gedung>(`${this.baseUrl}/${id}`, data);
      return res.data;
    }
  }

  /**
   * Delete a gedung by ID
   */
  static async deleteGedung(id: string): Promise<boolean> {
    const res = await ApiService.delete<boolean>(`${this.baseUrl}/${id}`);
    return res.data;
  }
}