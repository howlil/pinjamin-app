import { Notifikasi, NotifikasiCreate, NotifikasiUpdate } from '../types/notifikasi.types';
import { Notif } from '@prisma/client';

export interface INotifikasiService {
    getAllNotifikasi(): Promise<Notifikasi[]>;
    getNotifikasiById(id: string): Promise<Notifikasi>;
    getNotifikasiByUserId(userId: string): Promise<Notifikasi[]>;
    getUnreadNotifikasiCount(userId: string): Promise<number>;
    createNotifikasi(data: NotifikasiCreate): Promise<Notifikasi>;
    updateNotifikasi(id: string, data: NotifikasiUpdate): Promise<Notifikasi>;
    deleteNotifikasi(id: string): Promise<boolean>;
    markAsRead(id: string): Promise<Notifikasi>;
    markAllAsRead(userId: string): Promise<number>;
    sendPushNotification(userId: string, judul: string, pesan: string, jenisNotifikasi: Notif): Promise<void>;
  }
  