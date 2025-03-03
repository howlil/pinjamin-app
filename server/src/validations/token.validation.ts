import { z } from 'zod';

export const tokenSchema = z.object({
  pengguna_id: z.string().uuid('ID pengguna tidak valid'),
  token: z.string().min(10, 'Token tidak valid'),
});

export const tokenUpdateSchema = z.object({
  token: z.string().min(10, 'Token tidak valid').optional(),
});