import ApiService from "@/utils/api";
import { Login, LoginResponse, Register, Pengguna } from "@/apis/interfaces/IAuth";

export class AuthService {
  private static baseUrl = "/api/v1";

  static async login(data: Login): Promise<LoginResponse> {
    const response = await ApiService.post<LoginResponse>(
      `${this.baseUrl}/login`,
      data
    );
    return response.data;
  }

  static async register(data: Register): Promise<Pengguna> {
    const res = await ApiService.post<Pengguna>(
      `${this.baseUrl}/register`,
      data
    );
    return res.data;
  }

  static async logout(data: string) {
    const res = await ApiService.post(`${this.baseUrl}/logout`, data);
    return res.data;
  }
}
