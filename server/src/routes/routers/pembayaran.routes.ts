// src/routes/pembayaran.routes.ts
import { Router } from 'express';
import authMiddleware from '../../middlewares/auth.middleware';
import pembayaranController from '../../controllers/pembayaran.controller';

const pembayaranRoutes = Router();

pembayaranRoutes.post(
  '/peminjaman/:peminjaman_id/payment',
  authMiddleware.authenticate,
  pembayaranController.createPayment
);

// Get payment status for a booking
pembayaranRoutes.get(
  '/peminjaman/:peminjaman_id/payment',
  authMiddleware.authenticate,
  pembayaranController.getPaymentStatus
);

// Handle Midtrans webhook notifications
// This doesn't need authentication as it's called by Midtrans
pembayaranRoutes.post(
  '/notifications/midtrans',
  pembayaranController.handleNotification
);

export default pembayaranRoutes;