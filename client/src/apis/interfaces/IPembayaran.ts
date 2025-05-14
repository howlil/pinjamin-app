// client/src/apis/interfaces/IPembayaran.ts
import { Peminjaman } from './IPeminjaman';
import { Refund } from './IRefund';
import { STATUS } from './IEnum';

// Main Pembayaran interface matching server response
export interface Pembayaran {
  id: string;
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
  status_pembayaran: typeof STATUS.STATUS_TRANSAKSI;
  refund?: Refund;
  peminjaman?: Peminjaman;
  createdAt: Date;
  updatedAt: Date;
}

// Payment token response
export interface PaymentTokenResponse {
  snapToken: string;
  redirectUrl: string;
  orderId: string;
}

// Refund request
export interface RefundRequest {
  alasan_refund: string;
}

// Refund status response
export interface RefundStatusResponse {
  refund_status: string;
  refund_amount: number;
  status_code: string;
  status_message: string;
}

// Midtrans notification webhook payload
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

// Snap Result interfaces
export interface SnapSuccessResult {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  fraud_status?: string;
  finish_redirect_url?: string;
}

export interface SnapPendingResult {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
}

export interface SnapErrorResult {
  status_code: string;
  status_message: string;
}

// Create and Update interfaces for future use if needed
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
  status_pembayaran: typeof STATUS.STATUS_TRANSAKSI;
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
  status_pembayaran?: typeof STATUS.STATUS_TRANSAKSI;
}