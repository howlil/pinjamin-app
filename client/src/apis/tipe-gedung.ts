import ApiService from "@/utils/api";
import {
  TipeGedung,
  TipeGedungCreate,
  TipeGedungUpdate,
} from "@/apis/interfaces/ITipeGedung";

export class TipeGedungService {
  private static baseUrl = "/api/v1/tipe-gedung";

  /**
   * Get all tipe gedung
   * @returns Promise<TipeGedung[]>
   */
  static async getAllTipeGedung(): Promise<TipeGedung[]> {
    const response = await ApiService.get<{ data: TipeGedung[] }>(
      `${this.baseUrl}`
    );
    return response.data.data || [];
  }

  /**
   * Get tipe gedung by ID
   * @param id string
   * @returns Promise<TipeGedung>
   */
  static async getTipeGedungById(id: string): Promise<TipeGedung> {
    const response = await ApiService.get<{ data: TipeGedung }>(
      `${this.baseUrl}/${id}`
    );
    return response.data.data;
  }

  /**
   * Create a new tipe gedung
   * @param data TipeGedungCreate
   * @returns Promise<TipeGedung>
   */
  static async createTipeGedung(data: TipeGedungCreate): Promise<TipeGedung> {
    const response = await ApiService.post<{ data: TipeGedung }>(
      `${this.baseUrl}`,
      data
    );
    return response.data.data;
  }

  /**
   * Update an existing tipe gedung
   * @param id string
   * @param data TipeGedungUpdate
   * @returns Promise<TipeGedung>
   */
  static async updateTipeGedung(
    id: string,
    data: TipeGedungUpdate
  ): Promise<TipeGedung> {
    const response = await ApiService.patch<{ data: TipeGedung }>(
      `${this.baseUrl}/${id}`,
      data
    );
    return response.data.data;
  }

  /**
   * Delete a tipe gedung
   * @param id string
   * @returns Promise<boolean>
   */
  static async deleteTipeGedung(id: string): Promise<boolean> {
    const response = await ApiService.delete<{ message: string }>(
      `${this.baseUrl}/${id}`
    );
    return response.status === 200;
  }
}

export default TipeGedungService;