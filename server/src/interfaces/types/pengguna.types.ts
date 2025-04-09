import { ROLE, TIPEUSER } from '@prisma/client';
import { Notifikasi } from './notifikasi.types';
import { Peminjaman } from './peminjaman.types';
import { Token } from './token.types';

export interface Pengguna {
  id: string;
  nama_lengkap: string;
  email: string;
  kata_sandi: string;
  no_hp: string;
  tipe_peminjam: TIPEUSER;
  role: ROLE;
  notifikasi?: Notifikasi[];
  token?: Token[];
  createdAt: Date;
  updatedAt: Date;
  Peminjaman?: Peminjaman[];
}

export interface PenggunaCreate {
  nama_lengkap: string;
  email: string;
  kata_sandi: string;
  no_hp: string;
  tipe_peminjam: TIPEUSER;
}

export interface PenggunaUpdate {
  nama_lengkap?: string;
  email?: string;
  kata_sandi?: string;
  no_hp?: string;
  tipe_peminjam?: TIPEUSER;
}

export interface PenggunaLogin {
  email: string;
  kata_sandi: string;
}