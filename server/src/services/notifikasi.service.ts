import { prisma } from "../configs/db.config";
import { Notif, Pembayaran } from "@prisma/client";
import pusherClient from "../configs/pusher.config";
import { GetNotif } from "../interfaces/types";

export class NotifikasiService {
  /**
   * Membuat notifikasi baru dan mengirimkan melalui Pusher
   */
  async createNotifikasi(data: GetNotif): Promise<void> {
    try {
      // Buat tanggal hari ini
      const today = new Date().toISOString().split("T")[0];

      // Buat notifikasi di database
      const notifikasi = await prisma.notifikasi.create({
        data: {
          pengguna_id: data.pengguna_id,
          jenis_notifikasi: data.jenisNotifikasi,
          judul: data.judul,
          pesan: data.pesan,
          tanggal: today,
          status_baca: 0,
        },
      });

      // Kirim notifikasi real-time melalui Pusher
      await this.sendPusherNotification(
        data.pengguna_id,
        notifikasi.id,
        data.judul,
        data.pesan
      );
    } catch (error) {
      console.error("Error creating notification:", error);
      // Lanjutkan eksekusi meskipun terjadi error
    }
  }

  /**
   * Mendapatkan semua notifikasi untuk pengguna tertentu
   */
  async getNotifikasiByPengguna(penggunaId: string) {
    return await prisma.notifikasi.findMany({
      where: { pengguna_id: penggunaId },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Menandai notifikasi sebagai telah dibaca
   */
  async markAsRead(notifikasiId: string) {
    return await prisma.notifikasi.update({
      where: { id: notifikasiId },
      data: { status_baca: 1 },
    });
  }

  /**
   * Menandai semua notifikasi pengguna sebagai telah dibaca
   */
  async markAllAsRead(penggunaId: string) {
    return await prisma.notifikasi.updateMany({
      where: {
        pengguna_id: penggunaId,
        status_baca: 0,
      },
      data: { status_baca: 1 },
    });
  }

  /**
   * Mendapatkan jumlah notifikasi yang belum dibaca
   */
  async getUnreadCount(penggunaId: string) {
    return await prisma.notifikasi.count({
      where: {
        pengguna_id: penggunaId,
        status_baca: 0,
      },
    });
  }

  /**
   * Mengirim notifikasi perubahan status peminjaman
   */
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

  /**
   * Mengirim notifikasi pembayaran
   */
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

  /**
   * Kirim notifikasi melalui Pusher
   */
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
    } catch (error) {
      console.error("Failed to send pusher notification:", error);
      // Lanjutkan eksekusi meskipun Pusher gagal
    }
  }
}
