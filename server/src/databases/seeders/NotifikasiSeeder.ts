import { Seeder } from "./Seeder";
import { PrismaClient, Notif } from "@prisma/client";
import { NotifikasiFactory } from "../factories/NotifikasiFactory";

export class NotifikasiSeeder extends Seeder {
  private factory: NotifikasiFactory;

  constructor(prisma: PrismaClient) {
    super(prisma);
    this.factory = new NotifikasiFactory(prisma);
  }

  async run(): Promise<void> {
    console.log("Seeding notifikasi...");

    const penggunaList = await this.prisma.pengguna.findMany();

    if (penggunaList.length === 0) {
      throw new Error("No pengguna found. Please run PenggunaSeeder first.");
    }

    // Create payment notifications
    const pembayaranNotifications = [
      "Pembayaran berhasil",
      "Pembayaran gagal",
      "Pembayaran tertunda",
      "Refund diproses",
      "Refund berhasil",
    ];

    // Create booking notifications
    const peminjamanNotifications = [
      "Pengajuan peminjaman diproses",
      "Peminjaman disetujui",
      "Peminjaman ditolak",
      "Peminjaman hampir selesai",
      "Peminjaman selesai",
    ];

    for (const pengguna of penggunaList) {
      // Create 2-5 notifications per user
      const count = Math.floor(Math.random() * 4) + 2;

      for (let i = 0; i < count; i++) {
        const notifType =
          Math.random() > 0.5 ? Notif.PEMBAYARAN : Notif.PEMINJAMAN;
        const notifTemplates =
          notifType === Notif.PEMBAYARAN
            ? pembayaranNotifications
            : peminjamanNotifications;

        const judul =
          notifTemplates[Math.floor(Math.random() * notifTemplates.length)];

        await this.factory.create({
          pengguna_id: pengguna.id,
          jenis_notifikasi: notifType,
          judul,
          status_baca: Math.random() > 0.7 ? 1 : 0, // 30% read, 70% unread
        });
      }
    }

    console.log("Notifikasi seeded successfully");
  }
}
