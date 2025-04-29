import { STATUS } from "./IEnum";
import { Pengguna } from "./IAuth";

export interface Notifikasi {
  id: string;
  pengguna_id: string | null;  // Changed from string | undefined to string | null
  jenis_notifikasi: typeof STATUS.STATUS_NOTIF;
  judul: string;
  pesan: string;
  tanggal: string;
  status_baca: number;
  Pengguna?: Pengguna;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotifikasiCreate {
  pengguna_id?: string | null;  // Changed from string | undefined to string | null
  jenis_notifikasi: typeof STATUS.STATUS_NOTIF;
  judul: string;
  pesan: string;
  tanggal: string;
  status_baca: number;
}

export interface NotifikasiUpdate {
  jenis_notifikasi?: typeof STATUS.STATUS_NOTIF;
  judul?: string;
  pesan?: string;
  tanggal?: string;
  status_baca?: number;
}