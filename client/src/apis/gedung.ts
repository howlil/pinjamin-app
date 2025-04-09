import ApiService from "@/utils/api";
import { CheckAvailable, Gedung, Gedungs, ResCheckAvailable } from "@/interfaces/IGedung";

export class GedungService {
  private static baseUrl = "/api/v1/gedung";

  static async getGedung(): Promise<Gedung[]> {
    const res = await ApiService.get<Gedung[]>(`${this.baseUrl}`);
    return res.data;
  }
  static async getGedungById(id: string): Promise<Gedungs> {
    const res = await ApiService.get<Gedungs>(`${this.baseUrl}/${id}`);
    return res.data;
  }

  static async checkAvailibility(data:CheckAvailable):Promise<ResCheckAvailable[]>{
    if (data.tanggalMulai && data.tanggalMulai.includes('-')) {
      const parts = data.tanggalMulai.split('-');
      if (parts.length === 3 && parts[0].length === 4) {
        data = {
          ...data,
          tanggalMulai: `${parts[2]}-${parts[1]}-${parts[0]}`
        };
      }
    }
    const response = await ApiService.post<{ data: ResCheckAvailable[] }>(`${this.baseUrl}/check-availability`, data);

    if (response && response.data) {
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
    }
    
    return [];
  }

}

