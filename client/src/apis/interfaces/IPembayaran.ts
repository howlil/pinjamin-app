import { Peminjaman } from './IPeminjaman';
import { Refund } from './IRefund';
import { STATUS } from './IEnum';



export interface Pembayaran {
  id: string;
  transaksi_midtrans_id: string;
  peminjaman_id: string;
  no_invoice?: string | null; // Changed this line to accept null
  tanggal_bayar: string;
  jumlah_bayar: number;
  biaya_midtrans: number;
  total_bayar: number;
  metode_pembayaran: string;
  url_pembayaran: string;
  snap_token: string;
  status_pembayaran: typeof STATUS.STATUS_TRANSAKSI  ;
  refund?: Refund;
  peminjaman?: Peminjaman;
  createdAt: Date;
  updatedAt: Date;
}

export interface PembayaranCreate {
  transaksi_midtrans_id: string;
  peminjaman_id: string;
  no_invoice?: string;
  tanggal_bayar: string;
  jumlah_bayar: number;
  biaya_midtrans: number;
  total_bayar: number;
  metode_pembayaran: string;
  url_pembayaran: string;
  snap_token: string;
  status_pembayaran: typeof  STATUS.STATUS_TRANSAKSI;
}

export interface PembayaranUpdate {
  transaksi_midtrans_id?: string;
  no_invoice?: string;
  tanggal_bayar?: string;
  jumlah_bayar?: number;
  biaya_midtrans?: number;
  total_bayar?: number;
  metode_pembayaran?: string;
  url_pembayaran?: string;
  snap_token?: string;
  status_pembayaran?: typeof  STATUS.STATUS_TRANSAKSI;
}
export interface MidtransNotification {
  transaction_time: string;
  transaction_status: string;
  transaction_id: string;
  status_message: string;
  status_code: string;
  signature_key: string;
  payment_type: string;
  order_id: string;
  merchant_id: string;
  gross_amount: string;
  fraud_status?: string;
  currency: string;
}