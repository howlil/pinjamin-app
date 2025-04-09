import { z } from 'zod';

export const gedungSchema = z.object({
  nama_gedung: z.string().min(3, 'Nama gedung minimal 3 karakter'),
  deskripsi: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  harga_sewa: z.coerce.number().int().positive('Harga sewa harus bernilai positif'),
  kapasitas: z.coerce.number().int().positive('Kapasitas harus bernilai positif'),
  foto_gedung: z.string(),
  lokasi: z.string().min(3, 'Lokasi minimal 3 karakter'),
  tipe_gedung_id: z.string().uuid('ID tipe gedung tidak valid'),
});

export const gedungUpdateSchema = z.object({
  nama_gedung: z.string().min(3, 'Nama gedung minimal 3 karakter').optional(),
  deskripsi: z.string().min(10, 'Deskripsi minimal 10 karakter').optional(),
  harga_sewa: z.coerce.number().int().positive('Harga sewa harus bernilai positif').optional(),
  kapasitas: z.coerce.number().int().positive('Kapasitas harus bernilai positif').optional(),
  lokasi: z.string().min(3, 'Lokasi minimal 3 karakter').optional(),
  tipe_gedung_id: z.string().uuid('ID tipe gedung tidak valid').optional(),
  foto_gedung: z.string().optional(),
});

export const gedungFilterSchema = z.object({
  nama_gedung: z.string().optional(),
  lokasi: z.string().optional(),
  tipe_gedung_id: z.string().uuid('ID tipe gedung tidak valid').optional(),
  kapasitas_min: z.coerce.number().int().positive('Kapasitas minimal harus bernilai positif').optional(),
  kapasitas_max: z.coerce.number().int().positive('Kapasitas maksimal harus bernilai positif').optional(),
  harga_min: z.coerce.number().int().positive('Harga minimal harus bernilai positif').optional(),
  harga_max: z.coerce.number().int().positive('Harga maksimal harus bernilai positif').optional(),
});

export const availabilityCheckSchema = z.object({
  tanggalMulai: z.string().refine(
    (date) => {
      return /^\d{2}-\d{2}-\d{4}$/.test(date);
    },
    {
      message: "Tanggal mulai harus dalam format DD-MM-YYYY"
    }
  ),
  jamMulai: z.string().refine(
    (time) => {
      return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
    },
    {
      message: "Jam mulai harus dalam format HH:MM (24 jam)"
    }
  )
});