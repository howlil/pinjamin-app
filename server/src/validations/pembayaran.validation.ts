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

export const midtransNotificationSchema = z.object({
  transaction_time: z.string(),
  transaction_status: z.string(),
  transaction_id: z.string(),
  status_message: z.string(),
  status_code: z.string(),
  signature_key: z.string(),
  payment_type: z.string(),
  order_id: z.string(),
  merchant_id: z.string(),
  gross_amount: z.string(),
  fraud_status: z.string().optional(),
  currency: z.string(),
});

export const refundSchema = z.object({
  alasan_refund: z.string().min(5, 'Alasan refund harus diisi minimal 5 karakter'),
});

export const refundUpdateSchema = z.object({
  status_redund: z.enum(['PROCESSED', 'FAILED', 'PENDING', 'COMPLETED'], {
    errorMap: () => ({ message: 'Status refund tidak valid' }),
  }),
  alasan_refund: z.string().min(5, 'Alasan refund harus diisi minimal 5 karakter').optional(),
});