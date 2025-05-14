import ApiService from "@/utils/api";
import {
  PenanggungJawabGedung,
  PenanggungJawabGedungCreate,
  PenanggungJawabGedungUpdate,
} from "@/apis/interfaces/IPenanggungJawabGedung";

export class PenanggungJawabService {
  private static baseUrl = "/api/v1/penanggung-jawab";

  /**
   * Get all penanggung jawab gedung
   * @returns Promise<PenanggungJawabGedung[]>
   */
  static async getAllPenanggungJawab(): Promise<PenanggungJawabGedung[]> {
    const response = await ApiService.get<{ data: PenanggungJawabGedung[] }>(
      `${this.baseUrl}`
    );
    return response.data.data || [];
  }

  /**
   * Create a new penanggung jawab gedung
   * @param data PenanggungJawabGedungCreate
   * @returns Promise<PenanggungJawabGedung>
   */
  static async createPenanggungJawab(
    data: PenanggungJawabGedungCreate
  ): Promise<PenanggungJawabGedung> {
    const response = await ApiService.post<{ data: PenanggungJawabGedung }>(
      `${this.baseUrl}`,
      data
    );
    return response.data.data;
  }

  /**
   * Update an existing penanggung jawab gedung
   * @param id string
   * @param data PenanggungJawabGedungUpdate
   * @returns Promise<PenanggungJawabGedung>
   */
  static async updatePenanggungJawab(
    id: string,
    data: PenanggungJawabGedungUpdate
  ): Promise<PenanggungJawabGedung> {
    const response = await ApiService.patch<{ data: PenanggungJawabGedung }>(
      `${this.baseUrl}/${id}`,
      data
    );
    return response.data.data;
  }

  /**
   * Delete a penanggung jawab gedung
   * @param id string
   * @returns Promise<boolean>
   */
  static async deletePenanggungJawab(id: string): Promise<boolean> {
    const response = await ApiService.delete<{ message: string }>(
      `${this.baseUrl}/${id}`
    );
    return response.status === 200;
  }
}

export default PenanggungJawabService;