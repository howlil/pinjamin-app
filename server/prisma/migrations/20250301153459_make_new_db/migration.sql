-- CreateEnum
CREATE TYPE "STATUSTRANSAKSI" AS ENUM ('PAID', 'PENDING', 'CANCELED', 'REFUNDED', 'PARTIAL_REFUNDED', 'CHECKOUT');

-- CreateEnum
CREATE TYPE "STATUSPEMINJAMAN" AS ENUM ('DIPROSES', 'DISETUJUI', 'DITOLAK', 'SELESAI');

-- CreateEnum
CREATE TYPE "Notif" AS ENUM ('PEMBAYARAN', 'PEMINJAMAN');

-- CreateEnum
CREATE TYPE "TIPEUSER" AS ENUM ('INUNAND', 'EXUNAND');

-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('PEMINJAM', 'ADMIN');

-- CreateTable
CREATE TABLE "Pengguna" (
    "id" TEXT NOT NULL,
    "nama_lengkap" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "kata_sandi" TEXT NOT NULL,
    "no_hp" TEXT NOT NULL,
    "tipe_peminjam" "TIPEUSER" NOT NULL,
    "role" "ROLE" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pengguna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifikasi" (
    "id" TEXT NOT NULL,
    "pengguna_id" TEXT,
    "jenis_notifikasi" "Notif" NOT NULL,
    "judul" TEXT NOT NULL,
    "pesan" TEXT NOT NULL,
    "tanggal" TEXT NOT NULL,
    "status_baca" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notifikasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "pengguna_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FasilitasGedung" (
    "id" TEXT NOT NULL,
    "nama_fasilitas" TEXT NOT NULL,
    "icon_url" TEXT NOT NULL,
    "gedung_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FasilitasGedung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gedung" (
    "id" TEXT NOT NULL,
    "nama_gedung" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "harga_sewa" INTEGER NOT NULL,
    "kapasitas" INTEGER NOT NULL,
    "lokasi" TEXT NOT NULL,
    "tipe_gedung_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gedung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenanggungJawabGedung" (
    "id" TEXT NOT NULL,
    "nama_penangguang_jawab" TEXT NOT NULL,
    "no_hp" TEXT NOT NULL,
    "gedung_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenanggungJawabGedung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipeGedung" (
    "id" TEXT NOT NULL,
    "nama_tipe_gedung" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TipeGedung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Peminjaman" (
    "id" TEXT NOT NULL,
    "pengguna_id" TEXT,
    "gedung_id" TEXT NOT NULL,
    "nama_kegiatan" TEXT NOT NULL,
    "tanggal_mulai" TEXT NOT NULL,
    "tanggal_selesai" TEXT NOT NULL,
    "jam_mulai" TEXT NOT NULL,
    "jam_selesai" TEXT NOT NULL,
    "surat_pengajuan" TEXT NOT NULL,
    "alasan_penolakan" TEXT,
    "status_peminjaman" "STATUSPEMINJAMAN" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Peminjaman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pembayaran" (
    "id" TEXT NOT NULL,
    "transaksi_midtrans_id" TEXT NOT NULL,
    "peminjaman_id" TEXT NOT NULL,
    "no_invoice" TEXT,
    "tanggal_bayar" TEXT NOT NULL,
    "jumlah_bayar" INTEGER NOT NULL,
    "biaya_midtrans" INTEGER NOT NULL,
    "total_bayar" INTEGER NOT NULL,
    "metode_pembayaran" TEXT NOT NULL,
    "url_pembayaran" TEXT NOT NULL,
    "snap_token" TEXT NOT NULL,
    "status_pembayaran" "STATUSTRANSAKSI" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Refund" (
    "id" TEXT NOT NULL,
    "pembayaran_id" TEXT NOT NULL,
    "jumlah_refund" INTEGER NOT NULL,
    "status_redund" TEXT NOT NULL,
    "alasan_refund" TEXT NOT NULL,
    "transaski_refund_midtrans_id" TEXT NOT NULL,
    "tanggal_refund" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Refund_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pengguna_email_key" ON "Pengguna"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pembayaran_peminjaman_id_key" ON "Pembayaran"("peminjaman_id");

-- CreateIndex
CREATE UNIQUE INDEX "Refund_pembayaran_id_key" ON "Refund"("pembayaran_id");

-- AddForeignKey
ALTER TABLE "Notifikasi" ADD CONSTRAINT "Notifikasi_pengguna_id_fkey" FOREIGN KEY ("pengguna_id") REFERENCES "Pengguna"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_pengguna_id_fkey" FOREIGN KEY ("pengguna_id") REFERENCES "Pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FasilitasGedung" ADD CONSTRAINT "FasilitasGedung_gedung_id_fkey" FOREIGN KEY ("gedung_id") REFERENCES "Gedung"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gedung" ADD CONSTRAINT "Gedung_tipe_gedung_id_fkey" FOREIGN KEY ("tipe_gedung_id") REFERENCES "TipeGedung"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenanggungJawabGedung" ADD CONSTRAINT "PenanggungJawabGedung_gedung_id_fkey" FOREIGN KEY ("gedung_id") REFERENCES "Gedung"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman" ADD CONSTRAINT "Peminjaman_pengguna_id_fkey" FOREIGN KEY ("pengguna_id") REFERENCES "Pengguna"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman" ADD CONSTRAINT "Peminjaman_gedung_id_fkey" FOREIGN KEY ("gedung_id") REFERENCES "Gedung"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pembayaran" ADD CONSTRAINT "Pembayaran_peminjaman_id_fkey" FOREIGN KEY ("peminjaman_id") REFERENCES "Peminjaman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_pembayaran_id_fkey" FOREIGN KEY ("pembayaran_id") REFERENCES "Pembayaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
