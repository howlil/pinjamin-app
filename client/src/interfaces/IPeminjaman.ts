export interface Peminjaman {
  id: string;
  pengguna_id: string;
  gedung_id: string;
  nama_kegiatan: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  jam_mulai: string;
  jam_selesai: string;
  surat_pengajuan: string;
  alasan_penolakan: string | null;
  status_peminjaman: "DIPROSES" | "DISETUJUI" | "DITOLAK";
  createdAt: string;
  updatedAt: string;
}
