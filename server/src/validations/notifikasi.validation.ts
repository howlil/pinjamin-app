import { z } from 'zod';
import { Notif } from '@prisma/client';

export const notifikasiSchema = z.object({
  pengguna_id: z.string().uuid('ID pengguna tidak valid').optional(),
  jenis_notifikasi: z.nativeEnum(Notif, {
    errorMap: () => ({ message: 'Jenis notifikasi tidak valid' }),
  }),
  judul: z.string().min(3, 'Judul minimal 3 karakter'),
  pesan: z.string().min(5, 'Pesan minimal 5 karakter'),
  tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal tidak valid'),
  status_baca: z.number().int().min(0).max(1),
});

export const notifikasiUpdateSchema = z.object({
  jenis_notifikasi: z.nativeEnum(Notif, {
    errorMap: () => ({ message: 'Jenis notifikasi tidak valid' }),
  }).optional(),
  judul: z.string().min(3, 'Judul minimal 3 karakter').optional(),
  pesan: z.string().min(5, 'Pesan minimal 5 karakter').optional(),
  tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal tidak valid').optional(),
  status_baca: z.number().int().min(0).max(1).optional(),
});