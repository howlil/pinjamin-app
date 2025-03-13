import { z } from 'zod';
import { ROLE, TIPEUSER } from '@prisma/client';

export const penggunaSchema = z.object({
  nama_lengkap: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  kata_sandi: z.string().min(6, 'Kata sandi minimal 6 karakter'),
  no_hp: z.string().min(10, 'Nomor HP tidak valid'),
  tipe_peminjam: z.nativeEnum(TIPEUSER, {
    errorMap: () => ({ message: 'Tipe peminjam tidak valid' }),
  }),
  role: z.nativeEnum(ROLE, {
    errorMap: () => ({ message: 'Role tidak valid' }),
  }),
});

export const penggunaUpdateSchema = z.object({
  nama_lengkap: z.string().min(3, 'Nama lengkap minimal 3 karakter').optional(),
  email: z.string().email('Email tidak valid').optional(),
  kata_sandi: z.string().min(6, 'Kata sandi minimal 6 karakter').optional(),
  no_hp: z.string().min(10, 'Nomor HP tidak valid').optional(),
});

export const penggunaLoginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  kata_sandi: z.string().min(1, 'Kata sandi tidak boleh kosong'),
});