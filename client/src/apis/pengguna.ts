import { Pengguna, PenggunaUpdate } from "@/interfaces/IAuth";
import ApiService from "@/utils/api";

export class PenggunaService {
  private static baseUrl = "api/v1/profile";

  static async getProfile(): Promise<Pengguna> {
    const res = await ApiService.get<Pengguna>(`${this.baseUrl}`);
    return res.data;
  }

  static async updateProfile(data: PenggunaUpdate): Promise<Pengguna> {
    const res = await ApiService.patch<Pengguna>(`${this.baseUrl}`, data);
    return res.data;
  }
}
