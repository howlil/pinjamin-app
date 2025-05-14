import ApiService from "@/utils/api";
import {
  Pembayaran,

  MidtransNotification,
} from "@/apis/interfaces/IPembayaran";

export class PembayaranService {
  private static baseUrl = "/api/v1/payment";

  /**
   * Create payment token for a booking
   * POST /api/v1/payment/:peminjaman_id
   */
  static async createPayment(
    peminjamanId: string
  ): Promise<{
    snapToken: string;
    redirectUrl: string;
    orderId: string;
  }> {
    const response = await ApiService.post<{
      data: {
        snapToken: string;
        redirectUrl: string;
        orderId: string;
      };
    }>(`${this.baseUrl}/${peminjamanId}`);
    
    return response.data.data;
  }

  /**
   * Get payment status for a booking
   * GET /api/v1/payment/status/:peminjaman_id
   */
  static async getPaymentStatus(
    peminjamanId: string
  ): Promise<Pembayaran | null> {
    const response = await ApiService.get<{ data: Pembayaran | null }>(
      `${this.baseUrl}/status/${peminjamanId}`
    );
    
    return response.data.data;
  }

  /**
   * Get all payments (Admin only)
   * GET /api/v1/payment
   */
  static async getAllPayments(): Promise<Pembayaran[]> {
    const response = await ApiService.get<{ data: Pembayaran[] }>(
      `${this.baseUrl}`
    );
    
    return response.data.data || [];
  }

  /**
   * Process refund for a booking (Admin only)
   * POST /api/v1/payment/:peminjaman_id/refund
   */
  static async processRefund(
    peminjamanId: string,
    alasanRefund: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await ApiService.post<{
      data: { success: boolean; message: string };
    }>(`${this.baseUrl}/${peminjamanId}/refund`, {
      alasan_refund: alasanRefund,
    });
    
    return response.data.data;
  }

  /**
   * Check refund status (Admin only)
   * GET /api/v1/payment/refund/:refund_id
   */
  static async checkRefundStatus(
    refundId: string
  ): Promise<{
    refund_status: string;
    refund_amount: number;
    status_code: string;
    status_message: string;
  }> {
    const response = await ApiService.get<{
      data: {
        refund_status: string;
        refund_amount: number;
        status_code: string;
        status_message: string;
      };
    }>(`${this.baseUrl}/refund/${refundId}`);
    
    return response.data.data;
  }

  /**
   * Handle payment notification from Midtrans (webhook)
   * POST /api/v1/payment/notification
   * Note: This is typically called by Midtrans directly, not from the client
   */
  static async handleNotification(
    notification: MidtransNotification
  ): Promise<{ success: boolean }> {
    const response = await ApiService.post<{ success: boolean }>(
      `${this.baseUrl}/notification`,
      notification
    );
    
    return response.data;
  }

  /**
   * Initialize Midtrans Snap payment
   * This function handles the Snap popup and payment flow
   */
  static async initiateSnapPayment(
    peminjamanId: string,
    onSuccess?: (result: any) => void,
    onPending?: (result: any) => void,
    onError?: (error: any) => void
  ): Promise<void> {
    try {
      // Get payment token
      const { snapToken } = await this.createPayment(peminjamanId);

      // Check if window.snap is available
      if (!(window as any).snap) {
        throw new Error(
          "Midtrans Snap is not loaded. Please check your internet connection."
        );
      }

      // Open Snap popup
      (window as any).snap.pay(snapToken, {
        onSuccess: (result: any) => {
          onSuccess?.(result);
        },
        onPending: (result: any) => {
          onPending?.(result);
        },
        onError: (result: any) => {
          onError?.(result);
        },
        onClose: () => {
          // Handle when customer close the popup without finishing the payment
          console.log("Customer closed the popup without finishing the payment");
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Load Midtrans Snap script
   * Should be called once when the app initializes
   */
  static loadMidtransScript(clientKey: string, isProduction: boolean = false): void {
    const script = document.createElement("script");
    script.src = isProduction
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    
    document.body.appendChild(script);
  }
}

export default PembayaranService;