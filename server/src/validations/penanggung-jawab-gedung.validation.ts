import { z } from 'zod';

export const penanggungJawabGedungSchema = z.object({
  nama_penangguang_jawab: z.string().min(3, 'Nama penanggung jawab minimal 3 karakter'),
  no_hp: z.string().min(10, 'Nomor HP tidak valid'),
  gedung_id: z.string().uuid('ID gedung tidak valid'),
});

export const penanggungJawabGedungUpdateSchema = z.object({
  nama_penangguang_jawab: z.string().min(3, 'Nama penanggung jawab minimal 3 karakter').optional(),
  no_hp: z.string().min(10, 'Nomor HP tidak valid').optional(),
});