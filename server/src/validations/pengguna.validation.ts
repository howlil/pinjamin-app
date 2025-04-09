import { z } from 'zod';
import { TIPEUSER } from '@prisma/client';

export const penggunaSchema = z.object({
  nama_lengkap: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  kata_sandi: z.string().min(6, 'Kata sandi minimal 6 karakter'),
  no_hp: z.string().min(10, 'Nomor HP tidak valid'),
  tipe_peminjam: z.nativeEnum(TIPEUSER, {
    errorMap: () => ({ message: 'Tipe peminjam tidak valid' }),
  }),
}).refine(
  (data) => {
    if (data.tipe_peminjam === TIPEUSER.INUNAND) {
      return data.email.endsWith('@unand.ac.id');
    }
    return true;
  },
  {
    message: 'Email internal harus menggunakan domain @unand.ac.id',
    path: ['email'],
  }
);

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