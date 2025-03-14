import { Notifikasi } from '../types/notifikasi.types';

/**
 * Maps a Prisma Notifikasi result to our application's Notifikasi type
 */
export function mapToNotifikasi(prismaResult: any): Notifikasi {
  return {
    id: prismaResult.id,
    pengguna_id: prismaResult.pengguna_id,
    jenis_notifikasi: prismaResult.jenis_notifikasi,
    judul: prismaResult.judul,
    pesan: prismaResult.pesan,
    tanggal: prismaResult.tanggal,
    status_baca: prismaResult.status_baca,
    Pengguna: prismaResult.Pengguna,
    createdAt: prismaResult.createdAt,
    updatedAt: prismaResult.updatedAt
  };
}

/**
 * Maps an array of Prisma Notifikasi results to our application's Notifikasi[] type
 */
export function mapToNotifikasiArray(prismaResults: any[]): Notifikasi[] {
  return prismaResults.map(mapToNotifikasi);
}

// src/mappers/peminjaman.mapper.ts
import { Peminjaman } from '../types/peminjaman.types';

/**
 * Maps a Prisma Peminjaman result to our application's Peminjaman type
 */
export function mapToPeminjaman(prismaResult: any): Peminjaman {
  return {
    id: prismaResult.id,
    pengguna_id: prismaResult.pengguna_id,
    gedung_id: prismaResult.gedung_id,
    nama_kegiatan: prismaResult.nama_kegiatan,
    tanggal_mulai: prismaResult.tanggal_mulai,
    tanggal_selesai: prismaResult.tanggal_selesai,
    jam_mulai: prismaResult.jam_mulai,
    jam_selesai: prismaResult.jam_selesai,
    surat_pengajuan: prismaResult.surat_pengajuan,
    alasan_penolakan: prismaResult.alasan_penolakan,
    status_peminjaman: prismaResult.status_peminjaman,
    pembayaran: prismaResult.pembayaran,
    pengguna: prismaResult.pengguna,
    gedung: prismaResult.gedung,
    createdAt: prismaResult.createdAt,
    updatedAt: prismaResult.updatedAt
  };
}

/**
 * Maps an array of Prisma Peminjaman results to our application's Peminjaman[] type
 */
export function mapToPeminjamanArray(prismaResults: any[]): Peminjaman[] {
  return prismaResults.map(mapToPeminjaman);
}