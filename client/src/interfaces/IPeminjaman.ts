export interface Peminjaman {
  id: string;
  gedung_id: string;
  user_id: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  jam_mulai: string;
  jam_selesai: string;
  status_peminjaman: 'PENDING' | 'DISETUJUI' | 'DITOLAK';
  jumlah_peserta: number;
  createdAt: string;
  updatedAt: string;
  keterangan?: string;
  nama_acara?: string;
}