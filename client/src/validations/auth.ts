import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email harus diisi" })
    .email({ message: "Format email tidak valid" }),
  kata_sandi: z.string().min(8, { message: "Password minimal 8 karakter" }),
});

export const registerSchema = z.object({
  nama_lengkap: z.string().min(1, { message: "Nama lengkap harus diisi" }),
  tipe_peminjam: z.string().min(1, { message: "Tipe pengguna harus dipilih" }),
  no_hp: z.string().min(1, { message: "Tipe pengguna harus dipilih" }),
  email: z
    .string()
    .min(1, { message: "Email harus diisi" })
    .email({ message: "Format email tidak valid" }),
  kata_sandi: z.string().min(8, { message: "Password minimal 8 karakter" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
