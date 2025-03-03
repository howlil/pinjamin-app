import { z } from 'zod';

export const refundSchema = z.object({
  pembayaran_id: z.string().uuid('ID pembayaran tidak valid'),
  jumlah_refund: z.number().int().positive('Jumlah refund harus bernilai positif'),
  status_redund: z.string(),
  alasan_refund: z.string().min(5, 'Alasan refund minimal 5 karakter'),
  transaski_refund_midtrans_id: z.string(),
  tanggal_refund: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal refund tidak valid'),
});

export const refundUpdateSchema = z.object({
  jumlah_refund: z.number().int().positive('Jumlah refund harus bernilai positif').optional(),
  status_redund: z.string().optional(),
  alasan_refund: z.string().min(5, 'Alasan refund minimal 5 karakter').optional(),
  transaski_refund_midtrans_id: z.string().optional(),
  tanggal_refund: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal refund tidak valid').optional(),
});

export const refundCreateSchema = z.object({
  pembayaran_id: z.string().uuid('ID pembayaran tidak valid'),
  alasan_refund: z.string().min(5, 'Alasan refund minimal 5 karakter'),
});