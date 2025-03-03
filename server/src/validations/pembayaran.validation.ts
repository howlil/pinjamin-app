import { z } from 'zod';
import { STATUSTRANSAKSI } from '@prisma/client';

export const pembayaranSchema = z.object({
  transaksi_midtrans_id: z.string(),
  peminjaman_id: z.string().uuid('ID peminjaman tidak valid'),
  no_invoice: z.string().optional(),
  tanggal_bayar: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal bayar tidak valid'),
  jumlah_bayar: z.number().int().positive('Jumlah bayar harus bernilai positif'),
  biaya_midtrans: z.number().int().min(0, 'Biaya midtrans tidak boleh negatif'),
  total_bayar: z.number().int().positive('Total bayar harus bernilai positif'),
  metode_pembayaran: z.string(),
  url_pembayaran: z.string().url('URL pembayaran tidak valid'),
  snap_token: z.string(),
  status_pembayaran: z.nativeEnum(STATUSTRANSAKSI, {
    errorMap: () => ({ message: 'Status transaksi tidak valid' }),
  }),
});

export const pembayaranUpdateSchema = z.object({
  transaksi_midtrans_id: z.string().optional(),
  no_invoice: z.string().optional(),
  tanggal_bayar: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal bayar tidak valid').optional(),
  jumlah_bayar: z.number().int().positive('Jumlah bayar harus bernilai positif').optional(),
  biaya_midtrans: z.number().int().min(0, 'Biaya midtrans tidak boleh negatif').optional(),
  total_bayar: z.number().int().positive('Total bayar harus bernilai positif').optional(),
  metode_pembayaran: z.string().optional(),
  url_pembayaran: z.string().url('URL pembayaran tidak valid').optional(),
  snap_token: z.string().optional(),
  status_pembayaran: z.nativeEnum(STATUSTRANSAKSI, {
    errorMap: () => ({ message: 'Status transaksi tidak valid' }),
  }).optional(),
});

export const pembayaranCreateSchema = z.object({
  peminjaman_id: z.string().uuid('ID peminjaman tidak valid'),
});