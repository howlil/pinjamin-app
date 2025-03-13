import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email harus diisi" })
    .email({ message: "Format email tidak valid" }),
  password: z
    .string()
    .min(8, { message: "Password minimal 8 karakter" })
});

export const registerSchema = z.object({
  namaLengkap: z
    .string()
    .min(1, { message: "Nama lengkap harus diisi" }),
  tipePengguna: z
    .string()
    .min(1, { message: "Tipe pengguna harus dipilih" }),
  email: z
    .string()
    .min(1, { message: "Email harus diisi" })
    .email({ message: "Format email tidak valid" }),
  password: z
    .string()
    .min(8, { message: "Password minimal 8 karakter" })
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;