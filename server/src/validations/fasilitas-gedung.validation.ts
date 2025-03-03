import { z } from 'zod';

export const fasilitasGedungSchema = z.object({
  nama_fasilitas: z.string().min(3, 'Nama fasilitas minimal 3 karakter'),
  icon_url: z.string().url('URL icon tidak valid'),
  gedung_id: z.string().uuid('ID gedung tidak valid'),
});

export const fasilitasGedungUpdateSchema = z.object({
  nama_fasilitas: z.string().min(3, 'Nama fasilitas minimal 3 karakter').optional(),
  icon_url: z.string().url('URL icon tidak valid').optional(),
});