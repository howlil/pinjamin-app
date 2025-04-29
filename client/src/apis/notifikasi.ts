import { Notifikasi } from "@/apis/interfaces/INotifikasi";
import ApiService from "@/utils/api";

export class NotifikasiService {
  private static baseUrl = "/api/v1/notif";

  static async getNotifbyUser(): Promise<Notifikasi> {
    const res = await ApiService.get<Notifikasi>(`${this.baseUrl}`);
    return res.data;
  }

  static async markAllAsRead() {
    const res = await ApiService.patch(`${this.baseUrl}/read`);
    return res.data;
  }

  static async getUnreadCount() {
    const res = await ApiService.get(`${this.baseUrl}/unread/count`);
    return res.data;
  }

  static async markAsRead(id: string) {
    const res = await ApiService.patch(`${this.baseUrl}/${id}/read`);
    return res.data;
  }
}
