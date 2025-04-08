import { Pengguna, Gedung, Peminjaman, Notifikasi, Pembayaran, ROLE, TIPEUSER, STATUSPEMINJAMAN, Notif, STATUSTRANSAKSI } from '@prisma/client';

// Helper to create mock user data
export const createMockUser = (overrides: Partial<Pengguna> = {}): Pengguna => ({
  id: 'user-id',
  nama_lengkap: 'Test User',
  email: 'test@example.com',
  kata_sandi: 'hashed_password',
  no_hp: '0812345678',
  tipe_peminjam: TIPEUSER.INUNAND,
  role: ROLE.PEMINJAM,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
});

// Helper to create mock gedung data
export const createMockGedung = (overrides: Partial<Gedung> = {}): Gedung => ({
  id: 'gedung-id',
  nama_gedung: 'Gedung Test',
  deskripsi: 'Deskripsi gedung test untuk unit testing',
  harga_sewa: 1000000,
  kapasitas: 100,
  lokasi: 'Padang',
  tipe_gedung_id: 'tipe-gedung-id',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
});

// Helper to create mock peminjaman data
export const createMockPeminjaman = (overrides: Partial<Peminjaman> = {}): Peminjaman => ({
  id: 'peminjaman-id',
  pengguna_id: 'user-id',
  gedung_id: 'gedung-id',
  nama_kegiatan: 'Kegiatan Test',
  tanggal_mulai: '2025-01-01',
  tanggal_selesai: '2025-01-02',
  jam_mulai: '08:00',
  jam_selesai: '16:00',
  surat_pengajuan: 'path/to/surat.pdf',
  alasan_penolakan: null, // Changed from null to undefined to match the Peminjaman interface
  status_peminjaman: STATUSPEMINJAMAN.DIPROSES,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
});

// Helper to create mock notifikasi data
export const createMockNotifikasi = (overrides: Partial<Notifikasi> = {}): Notifikasi => ({
  id: 'notifikasi-id',
  pengguna_id: 'user-id',
  jenis_notifikasi: Notif.PEMINJAMAN,
  judul: 'Test Notifikasi',
  pesan: 'Pesan test notifikasi',
  tanggal: '2025-01-01',
  status_baca: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
});

// Helper to create mock pembayaran data
export const createMockPembayaran = (overrides: Partial<Pembayaran> = {}): Pembayaran => ({
  id: 'pembayaran-id',
  transaksi_midtrans_id: 'midtrans-id',
  peminjaman_id: 'peminjaman-id',
  no_invoice: 'INV/2025/01/001',
  tanggal_bayar: '2025-01-01',
  jumlah_bayar: 1000000,
  biaya_midtrans: 5000,
  total_bayar: 1005000,
  metode_pembayaran: 'bank_transfer',
  url_pembayaran: 'https://example.com/pay',
  snap_token: 'snap-token',
  status_pembayaran: STATUSTRANSAKSI.PENDING,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
});

// Mock Request object for controller tests
export const mockRequest = (overrides = {}) => {
  const req: any = {
    body: {},
    params: {},
    query: {},
    user: {
      id: 'user-id',
      email: 'test@example.com',
      role: ROLE.PEMINJAM
    },
    headers: {
      authorization: 'Bearer mock-token'
    },
    ...overrides
  };
  return req;
};

// Mock Response object for controller tests
export const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Mock Next function for controller tests
export const mockNext = jest.fn();