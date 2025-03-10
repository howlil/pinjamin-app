import { STATUSTRANSAKSI } from '@prisma/client';
import { Peminjaman } from './peminjaman.types';
import { Refund } from './refund.types';

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
  status_pembayaran: STATUSTRANSAKSI;
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
  status_pembayaran: STATUSTRANSAKSI;
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
  status_pembayaran?: STATUSTRANSAKSI;
}