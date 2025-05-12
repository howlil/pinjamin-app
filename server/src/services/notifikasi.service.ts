// server/src/services/notifikasi.service.ts
import { Notif } from "@prisma/client";
import pusherClient from "../configs/pusher.config";
import { GetNotif } from "../interfaces/types";
import { BaseService } from "./base.service";

export class NotifikasiService extends BaseService {
  constructor() {
    super('NotifikasiService');
  }

  async createNotifikasi(data: GetNotif): Promise<void> {
    try {
      this.logInfo('Creating new notification', { data });
      const today = new Date().toISOString().split("T")[0];

      const notifikasi = await this.prisma.notifikasi.create({
        data: {
          pengguna_id: data.pengguna_id,
          jenis_notifikasi: data.jenisNotifikasi,
          judul: data.judul,
          pesan: data.pesan,
          tanggal: today,
          status_baca: 0,
        },
      });

      await this.sendPusherNotification(
        data.pengguna_id,
        notifikasi.id,
        data.judul,
        data.pesan
      );

      this.logInfo('Notification created successfully', { notifikasiId: notifikasi.id });
    } catch (error) {
      this.logError("Error creating notification", error);
      // Continue execution even if error occurs
    }
  }

  async getNotifikasiByPengguna(penggunaId: string) {
    try {
      this.logInfo('Fetching notifications for user', { penggunaId });
      return await this.prisma.notifikasi.findMany({
        where: { pengguna_id: penggunaId },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      this.handleError(error, 'getNotifikasiByPengguna');
      throw error;
    }
  }

  async markAsRead(notifikasiId: string) {
    try {
      this.logInfo('Marking notification as read', { notifikasiId });
      return await this.prisma.notifikasi.update({
        where: { id: notifikasiId },
        data: { status_baca: 1 },
      });
    } catch (error) {
      this.handleError(error, 'markAsRead');
      throw error;
    }
  }

  async markAllAsRead(penggunaId: string) {
    try {
      this.logInfo('Marking all notifications as read', { penggunaId });
      return await this.prisma.notifikasi.updateMany({
        where: {
          pengguna_id: penggunaId,
          status_baca: 0,
        },
        data: { status_baca: 1 },
      });
    } catch (error) {
      this.handleError(error, 'markAllAsRead');
      throw error;
    }
  }

  async getUnreadCount(penggunaId: string) {
    try {
      this.logInfo('Getting unread count', { penggunaId });
      return await this.prisma.notifikasi.count({
        where: {
          pengguna_id: penggunaId,
          status_baca: 0,
        },
      });
    } catch (error) {
      this.handleError(error, 'getUnreadCount');
      throw error;
    }
  }

  async sendPeminjamanNotification(
    penggunaId: string,
    peminjamanId: string,
    status: string,
    message: string
  ): Promise<void> {
    const judul = `Status Peminjaman: ${status}`;
    await this.createNotifikasi({
      pengguna_id: penggunaId,
      judul: judul,
      pesan: message,
      jenisNotifikasi: Notif.PEMINJAMAN,
    });
  }

  async sendPembayaranNotification(
    penggunaId: string,
    pembayaranId: string,
    status: string,
    message: string
  ): Promise<void> {
    const judul = `Status Pembayaran: ${status}`;
    await this.createNotifikasi({
      pengguna_id: penggunaId,
      judul: judul,
      pesan: message,
      jenisNotifikasi: Notif.PEMBAYARAN,
    });
  }

  private async sendPusherNotification(
    penggunaId: string,
    notifikasiId: string,
    judul: string,
    pesan: string
  ): Promise<void> {
    try {
      await pusherClient.trigger(`user-${penggunaId}`, "new-notification", {
        id: notifikasiId,
        title: judul,
        message: pesan,
        timestamp: new Date().toISOString(),
      });
      this.logInfo('Pusher notification sent', { penggunaId, notifikasiId });
    } catch (error) {
      this.logError("Failed to send pusher notification", error);
    }
  }
}

export default new NotifikasiService();