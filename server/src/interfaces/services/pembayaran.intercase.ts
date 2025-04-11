import { Pembayaran,PembayaranCreate } from "../types";

export interface IPembayaranService {
    createSnapToken(peminjaman_id: string, userId: string): Promise<{
      snapToken: string;
      redirectUrl: string;
      orderId: string;
    }>;
    
    createPembayaran(pembayaranData: PembayaranCreate): Promise<Pembayaran>;
    
    getPembayaranByPeminjamanId(peminjaman_id: string): Promise<Pembayaran | null>;
    
    updateStatusPembayaran(
      transaction_id: string, 
      status: string
    ): Promise<Pembayaran>;
    
    checkTransactionStatus(order_id: string): Promise<any>;
  }