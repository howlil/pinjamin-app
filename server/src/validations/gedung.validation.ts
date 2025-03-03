import { z } from 'zod';

export const gedungSchema = z.object({
  nama_gedung: z.string().min(3, 'Nama gedung minimal 3 karakter'),
  deskripsi: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  harga_sewa: z.number().int().positive('Harga sewa harus bernilai positif'),
  kapasitas: z.number().int().positive('Kapasitas harus bernilai positif'),
  lokasi: z.string().min(3, 'Lokasi minimal 3 karakter'),
  tipe_gedung_id: z.string().uuid('ID tipe gedung tidak valid'),
});

export const gedungUpdateSchema = z.object({
  nama_gedung: z.string().min(3, 'Nama gedung minimal 3 karakter').optional(),
  deskripsi: z.string().min(10, 'Deskripsi minimal 10 karakter').optional(),
  harga_sewa: z.number().int().positive('Harga sewa harus bernilai positif').optional(),
  kapasitas: z.number().int().positive('Kapasitas harus bernilai positif').optional(),
  lokasi: z.string().min(3, 'Lokasi minimal 3 karakter').optional(),
  tipe_gedung_id: z.string().uuid('ID tipe gedung tidak valid').optional(),
});

export const gedungFilterSchema = z.object({
  nama_gedung: z.string().optional(),
  lokasi: z.string().optional(),
  tipe_gedung_id: z.string().uuid('ID tipe gedung tidak valid').optional(),
  kapasitas_min: z.number().int().positive('Kapasitas minimal harus bernilai positif').optional(),
  kapasitas_max: z.number().int().positive('Kapasitas maksimal harus bernilai positif').optional(),
  harga_min: z.number().int().positive('Harga minimal harus bernilai positif').optional(),
  harga_max: z.number().int().positive('Harga maksimal harus bernilai positif').optional(),
});