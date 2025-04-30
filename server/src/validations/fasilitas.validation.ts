import { z } from 'zod';

export const fasilitasSchema = z.object({
  nama_fasilitas: z.string().min(3, 'Nama fasilitas minimal 3 karakter'),
  icon_url: z.string().url('URL icon tidak valid')
});

export const fasilitasUpdateSchema = fasilitasSchema.partial();

export const fasilitasGedungSchema = z.object({
  fasilitas_id: z.string().uuid('ID fasilitas tidak valid')
});

export const fasilitasGedungUpdateSchema = fasilitasGedungSchema.partial();