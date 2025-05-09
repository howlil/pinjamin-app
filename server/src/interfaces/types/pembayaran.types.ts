import { Peminjaman } from './peminjaman.types';
import { STATUSTRANSAKSI } from '@prisma/client';

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

export interface Pembayaran {
  id: string;
  transaksi_midtrans_id: string;
  peminjaman_id: string;
  no_invoice?: string | null;
  tanggal_bayar: string;
  jumlah_bayar: number;
  biaya_midtrans: number;
  total_bayar: number;
  metode_pembayaran: string;
  url_pembayaran: string;
  snap_token: string;
  status_pembayaran: STATUSTRANSAKSI;
  refund?: Refund | null;
  peminjaman?: Peminjaman;
  createdAt: Date;
  updatedAt: Date;
}

export interface PembayaranCreate {
  peminjaman_id: string;
  transaksi_midtrans_id: string;
  no_invoice?: string;
  tanggal_bayar: string;
  jumlah_bayar: number;
  biaya_midtrans: number;
  total_bayar: number;
  metode_pembayaran: string;
  url_pembayaran: string;
  snap_token: string;
  status_pembayaran: STATUSTRANSAKSI;
}

export interface PembayaranUpdate {
  transaksi_midtrans_id?: string;
  no_invoice?: string | null;
  tanggal_bayar?: string;
  jumlah_bayar?: number;
  biaya_midtrans?: number;
  total_bayar?: number;
  metode_pembayaran?: string;
  url_pembayaran?: string;
  snap_token?: string;
  status_pembayaran?: STATUSTRANSAKSI;
}