import { z } from 'zod';
import { STATUSPEMINJAMAN } from '@prisma/client';

export const peminjamanSchema = z.object({
  pengguna_id: z.string().uuid('ID pengguna tidak valid').optional(),
  gedung_id: z.string().uuid('ID gedung tidak valid'),
  nama_kegiatan: z.string().min(3, 'Nama kegiatan minimal 3 karakter'),
  tanggal_mulai: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal mulai tidak valid'),
  tanggal_selesai: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal selesai tidak valid'),
  jam_mulai: z.string().regex(/^\d{2}:\d{2}$/, 'Format jam mulai tidak valid'),
  jam_selesai: z.string().regex(/^\d{2}:\d{2}$/, 'Format jam selesai tidak valid'),
  surat_pengajuan: z.string(),
  status_peminjaman: z.nativeEnum(STATUSPEMINJAMAN, {
    errorMap: () => ({ message: 'Status peminjaman tidak valid' }),
  }),
});

export const peminjamanUpdateSchema = z.object({
  nama_kegiatan: z.string().min(3, 'Nama kegiatan minimal 3 karakter').optional(),
  tanggal_mulai: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal mulai tidak valid').optional(),
  tanggal_selesai: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal selesai tidak valid').optional(),
  jam_mulai: z.string().regex(/^\d{2}:\d{2}$/, 'Format jam mulai tidak valid').optional(),
  jam_selesai: z.string().regex(/^\d{2}:\d{2}$/, 'Format jam selesai tidak valid').optional(),
  surat_pengajuan: z.string().optional(),
  alasan_penolakan: z.string().optional(),
  status_peminjaman: z.nativeEnum(STATUSPEMINJAMAN, {
    errorMap: () => ({ message: 'Status peminjaman tidak valid' }),
  }).optional(),
});

export const peminjamanApprovalSchema = z.object({
  status_peminjaman: z.nativeEnum(STATUSPEMINJAMAN, {
    errorMap: () => ({ message: 'Status peminjaman tidak valid' }),
  }),
  alasan_penolakan: z.string().optional().nullable(),
});