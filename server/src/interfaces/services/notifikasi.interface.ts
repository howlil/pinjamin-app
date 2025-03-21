import {
  Notifikasi,
  NotifikasiCreate,
  NotifikasiUpdate,
} from "../types/notifikasi.types";
import { Notif } from "@prisma/client";

export interface INotifikasiService {
  getAllNotifikasi(): Promise<Notifikasi[]>;
  getNotifikasiById(id: string): Promise<Notifikasi>;
  getNotifikasiByPengguna(penggunaId: string): Promise<Notifikasi[]>;
  createNotifikasi(notifikasiData: NotifikasiCreate): Promise<Notifikasi>;
  updateNotifikasi(
    id: string,
    notifikasiData: NotifikasiUpdate
  ): Promise<Notifikasi>;
  markAsRead(id: string): Promise<Notifikasi>;
  markAllAsRead(penggunaId: string): Promise<number>;
  deleteNotifikasi(id: string): Promise<boolean>;
  sendPeminjamanNotification(
    penggunaId: string,
    peminjamanId: string,
    status: string,
    message: string
  ): Promise<Notifikasi>;
  countUnreadNotifikasi(penggunaId: string): Promise<number>;
}
