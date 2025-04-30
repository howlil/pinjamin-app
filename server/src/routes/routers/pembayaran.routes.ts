import { BaseRouter } from "../base.route";
import pembayaranController from "../../controllers/pembayaran.controller";
import authMiddleware from "../../middlewares/auth.middleware";

class PembayaranRouter extends BaseRouter {
  public routes(): void {
    
    this.router.post("/v1/payment/notification", pembayaranController.handleNotification);
    
    
    this.router.post(
      "/v1/payment/:peminjaman_id",
      authMiddleware.authenticate,
      pembayaranController.createPayment
    );
    
    // Get payment status for a booking
    this.router.get(
      "/v1/payment/status/:peminjaman_id",
      authMiddleware.authenticate,
      pembayaranController.getPaymentStatus
    );
    
    // Admin routes (requires admin role)
    // Get all payments
    this.router.get(
      "/v1/payment",
      authMiddleware.authenticate,
      authMiddleware.authorizeAdmin,
      pembayaranController.getAllPembayaran
    );
    
    // Manually process refund for a booking (added for admins to handle special cases)
    this.router.post(
      "/v1/payment/:peminjaman_id/refund",
      authMiddleware.authenticate,
      authMiddleware.authorizeAdmin,
      pembayaranController.processRefund
    );
    
    // Check refund status
    this.router.get(
      "/v1/payment/refund/:refund_id",
      authMiddleware.authenticate,
      authMiddleware.authorizeAdmin,
      pembayaranController.checkRefundStatus
    );
  }
}

export default new PembayaranRouter().router;