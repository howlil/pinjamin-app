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
