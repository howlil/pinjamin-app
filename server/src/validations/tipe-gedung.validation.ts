import { z } from "zod";

export const tipeGedungSchema = z.object({
  nama_tipe_gedung: z.string().min(3, "Nama tipe gedung minimal 3 karakter"),
});

export const tipeGedungUpdateSchema = z.object({
  nama_tipe_gedung: z
    .string()
    .min(3, "Nama tipe gedung minimal 3 karakter")
    .optional(),
});
