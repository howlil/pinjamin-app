import ApiService from "@/utils/api";
import {
  Peminjaman,
  PeminjamanApproval,
  PeminjamanCreate,
  PeminjamanFilter,
  PeminjamanUpdate,
} from "@/interfaces/IPeminjaman";
export class PeminjamanService {
  private static baseUrl = "/api/v1/peminjaman";

  static async getAllPeminjaman(): Promise<Peminjaman[]> {
    const response = await ApiService.get<Peminjaman[]>(`${this.baseUrl}`);
    return response.data;
  }

  static async getPeminjamanById(id: string): Promise<Peminjaman> {
    const res = await ApiService.get<Peminjaman>(`${this.baseUrl}/${id}`);
    return res.data;
  }

  static async getPeminjamanByPengguna(): Promise<Peminjaman[]> {
    const res = await ApiService.get<Peminjaman[]>(`${this.baseUrl}/user`);
    return res.data;
  }

  static async createPeminjaman(data: PeminjamanCreate): Promise<Peminjaman> {
    const res = await ApiService.post<Peminjaman>(`${this.baseUrl}`, data);
    return res.data;
  }

  static async updatePeminjaman(data: PeminjamanUpdate): Promise<Peminjaman> {
    const res = await ApiService.patch<Peminjaman>(`${this.baseUrl}`, data);
    return res.data;
  }

  static async approvePeminjaman(
    id: string,
    data: PeminjamanApproval
  ): Promise<Peminjaman> {
    const res = await ApiService.patch<Peminjaman>(
      `${this.baseUrl}/${id}/approval`,
      data
    );
    return res.data;
  }

  static async deletePeminjamana(id: string): Promise<Boolean> {
    const res = await ApiService.delete<Boolean>(`${this.baseUrl}/${id}`);
    return res.data;
  }

  static async getPeminjamanStat(): Promise<PeminjamanFilter> {
    const res = await ApiService.get<PeminjamanFilter>(
      `${this.baseUrl}/statistik`
    );
    return res.data;
  }
}
