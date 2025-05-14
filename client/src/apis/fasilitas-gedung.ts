import ApiService from "@/utils/api";
import {
  Fasilitas,
  FasilitasCreate,
  FasilitasUpdate,
} from "@/apis/interfaces/IFasilitasGedung";

export class FasilitasGedungService {
  private static baseUrl = "/api/v1/fasilitas";

  /**
   * Get all facilities
   * @returns Promise<Fasilitas[]>
   */
  static async getAllFasilitas(): Promise<Fasilitas[]> {
    const response = await ApiService.get<{ data: Fasilitas[] }>(
      `${this.baseUrl}`
    );
    return response.data.data || [];
  }

  /**
   * Create a new facility
   * @param data FasilitasCreate
   * @returns Promise<Fasilitas>
   */
  static async createFasilitas(data: FasilitasCreate): Promise<Fasilitas> {
    const response = await ApiService.post<{ data: Fasilitas }>(
      `${this.baseUrl}`,
      data
    );
    return response.data.data;
  }

  /**
   * Update an existing facility
   * @param id string
   * @param data FasilitasUpdate
   * @returns Promise<Fasilitas>
   */
  static async updateFasilitas(
    id: string,
    data: FasilitasUpdate
  ): Promise<Fasilitas> {
    const response = await ApiService.patch<{ data: Fasilitas }>(
      `${this.baseUrl}/${id}`,
      data
    );
    return response.data.data;
  }

  /**
   * Delete a facility
   * @param id string
   * @returns Promise<boolean>
   */
  static async deleteFasilitas(id: string): Promise<boolean> {
    const response = await ApiService.delete<{ message: string }>(
      `${this.baseUrl}/${id}`
    );
    return response.status === 200;
  }
}

export default FasilitasGedungService;