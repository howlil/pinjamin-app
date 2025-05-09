import ApiService from "@/utils/api";
import {
  Peminjaman,
  PeminjamanApproval,
  PeminjamanCreate,
  PeminjamanFilter,
  PeminjamanUpdate,
} from "@/apis/interfaces/IPeminjaman";

export class PeminjamanService {
  private static baseUrl = "/api/v1/peminjaman";

  /**
   * Get all peminjaman (admin only)
   */
  static async getAllPeminjaman(): Promise<Peminjaman[]> {
    const response = await ApiService.get<{ data: Peminjaman[] }>(`${this.baseUrl}`);
    return response.data.data || [];
  }

  /**
   * Get specific peminjaman by ID
   */
  static async getPeminjamanById(id: string): Promise<Peminjaman> {
    const res = await ApiService.get<{ data: Peminjaman }>(`${this.baseUrl}/${id}`);
    return res.data.data;
  }

  /**
   * Get all peminjaman for the current logged in user
   */
  static async getPeminjamanByPengguna(): Promise<Peminjaman[]> {
    const res = await ApiService.get<{ data: Peminjaman[] }>(`${this.baseUrl}/user`);
    return res.data.data || [];
  }

  /**
   * Create a new peminjaman with optional file upload
   */
  static async createPeminjaman(data: PeminjamanCreate, suratPengajuan?: File): Promise<Peminjaman> {
    if (suratPengajuan) {
      const formData = new FormData();
      
      // Add the surat pengajuan file
      formData.append("surat_pengajuan", suratPengajuan);
      
      // Add all other fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "surat_pengajuan" && value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      const res = await ApiService.post<{ data: Peminjaman }>(
        `${this.baseUrl}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data.data;
    } else {
      const res = await ApiService.post<{ data: Peminjaman }>(`${this.baseUrl}`, data);
      return res.data.data;
    }
  }

  /**
   * Update an existing peminjaman with optional file upload
   */
  static async updatePeminjaman(id: string, data: PeminjamanUpdate, suratPengajuan?: File): Promise<Peminjaman> {
    if (suratPengajuan) {
      const formData = new FormData();
      
      // Add the surat pengajuan file
      formData.append("surat_pengajuan", suratPengajuan);
      
      // Add all other fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "surat_pengajuan" && value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      const res = await ApiService.patch<{ data: Peminjaman }>(
        `${this.baseUrl}/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data.data;
    } else {
      const res = await ApiService.patch<{ data: Peminjaman }>(`${this.baseUrl}/${id}`, data);
      return res.data.data;
    }
  }

  /**
   * Approve or reject a peminjaman (admin only)
   */
  static async approvePeminjaman(
    id: string,
    data: PeminjamanApproval
  ): Promise<Peminjaman> {
    const res = await ApiService.patch<{ data: Peminjaman }>(
      `${this.baseUrl}/${id}/approval`,
      data
    );
    return res.data.data;
  }

  /**
   * Delete a peminjaman
   */
  static async deletePeminjaman(id: string): Promise<boolean> {
    const res = await ApiService.delete<{ data: boolean }>(`${this.baseUrl}/${id}`);
    return res.data.data || false;
  }

  /**
   * Get peminjaman statistics (admin only)
   */
  static async getPeminjamanStats(): Promise<PeminjamanFilter> {
    const res = await ApiService.get<{ data: PeminjamanFilter }>(
      `${this.baseUrl}/statistik`
    );
    return res.data.data;
  }
}