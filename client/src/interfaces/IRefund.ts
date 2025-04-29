
import { Pembayaran } from "./IPembayaran";

export interface Refund {
    id: string;
    pembayaran_id: string;
    jumlah_refund: number;
    status_redund: string;
    alasan_refund: string;
    transaski_refund_midtrans_id: string;
    tanggal_refund: string;
    createdAt: Date;
    updatedAt: Date;
    pembayaran?: Pembayaran;
  }
  
  export interface RefundCreate {
    pembayaran_id: string;
    jumlah_refund: number;
    status_redund: string;
    alasan_refund: string;
    transaski_refund_midtrans_id: string;
    tanggal_refund: string;
  }
  
  export interface RefundUpdate {
    jumlah_refund?: number;
    status_redund?: string;
    alasan_refund?: string;
    transaski_refund_midtrans_id?: string;
    tanggal_refund?: string;
  }