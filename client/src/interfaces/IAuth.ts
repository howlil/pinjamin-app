import { STATUS } from "./IEnum";

export interface Login {
  email: string;
  kata_sandi: string;
}
export interface Register {
  nama_lengkap: string;
  email: string;
  no_hp: string;
  kata_sandi: string;
  tipe_peminjam: string;
}

export interface LoginResponse {
  data: {
    pengguna: Pengguna;
    token: string;
  };
}

export interface Pengguna {
  id: string;
  nama_lengkap: string;
  email: string;
  no_hp: string;
  tipe_peminjam: string;
  role: string;
}

export interface PenggunaUpdate {
  nama_lengkap?: string;
  email?: string;
  kata_sandi?: string;
  no_hp?: string;
  tipe_peminjam?: typeof STATUS.TIPEUSER;
}