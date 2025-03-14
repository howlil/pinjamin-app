// src/__tests__/services/peminjaman.service.test.ts
import { PeminjamanService } from '../../services/peminjaman.service';
import { NotifikasiService } from '../../services/notifikasi.service';
import { GedungService } from '../../services/gedung.service';
import { prisma } from '../../configs/db.config';
import { NotFoundError, BadRequestError } from '../../configs/error.config';
import { STATUSPEMINJAMAN, Notif } from '@prisma/client';
import { TestLogger } from '../../utils/test-logger.util';

jest.mock('../../services/notifikasi.service');
jest.mock('../../services/gedung.service');
jest.mock('../../configs/db.config');
jest.mock('../../configs/logger.config', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

describe('PeminjamanService', () => {
  let peminjamanService: PeminjamanService;
  const mockNotifikasiService = NotifikasiService as jest.MockedClass<typeof NotifikasiService>;
  const mockGedungService = GedungService as jest.MockedClass<typeof GedungService>;

  beforeEach(() => {
    jest.clearAllMocks();
    peminjamanService = new PeminjamanService();
  });

  describe('getAllPeminjaman', () => {
    it('should return all peminjaman records', async () => {
      const mockPeminjaman = [
        {
          id: '1',
          gedung_id: 'gedung-1',
          pengguna_id: 'user-1',
          nama_kegiatan: 'Kegiatan 1',
          tanggal_mulai: '2023-01-01',
          tanggal_selesai: '2023-01-03',
          jam_mulai: '08:00',
          jam_selesai: '16:00',
          surat_pengajuan: 'surat1.pdf',
          status_peminjaman: STATUSPEMINJAMAN.DIPROSES,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      (prisma.peminjaman.findMany as jest.Mock).mockResolvedValue(mockPeminjaman);

      const result = await peminjamanService.getAllPeminjaman();

      expect(prisma.peminjaman.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.any(Object),
          orderBy: { updatedAt: 'desc' }
        })
      );
      expect(result).toEqual(mockPeminjaman);
    });
  });

  describe('getPeminjamanById', () => {
    it('should return peminjaman by id', async () => {
      const mockPeminjaman = {
        id: '1',
        gedung_id: 'gedung-1',
        pengguna_id: 'user-1',
        nama_kegiatan: 'Kegiatan 1',
        tanggal_mulai: '2023-01-01',
        tanggal_selesai: '2023-01-03',
        jam_mulai: '08:00',
        jam_selesai: '16:00',
        surat_pengajuan: 'surat1.pdf',
        status_peminjaman: STATUSPEMINJAMAN.DIPROSES,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (prisma.peminjaman.findUnique as jest.Mock).mockResolvedValue(mockPeminjaman);

      const result = await peminjamanService.getPeminjamanById('1');

      expect(prisma.peminjaman.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: expect.any(Object)
      });
      expect(result).toEqual(mockPeminjaman);
    });

    it('should throw NotFoundError when peminjaman not found', async () => {
      (prisma.peminjaman.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(peminjamanService.getPeminjamanById('999')).rejects.toThrow(NotFoundError);
    });
  });

  describe('createPeminjaman', () => {
    const mockGedung = {
      id: 'gedung-1',
      nama_gedung: 'Gedung A',
      deskripsi: 'Deskripsi Gedung A',
      harga_sewa: 1000000,
      kapasitas: 100,
      lokasi: 'Lokasi A',
      tipe_gedung_id: 'tipe-1',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const createData = {
      gedung_id: 'gedung-1',
      nama_kegiatan: 'Kegiatan Baru',
      tanggal_mulai: '2023-02-01',
      tanggal_selesai: '2023-02-03',
      jam_mulai: '09:00',
      jam_selesai: '17:00',
      surat_pengajuan: 'surat-baru.pdf'
    };

    it('should create a new peminjaman', async () => {
      (prisma.gedung.findUnique as jest.Mock).mockResolvedValue(mockGedung);
      (mockGedungService.prototype.checkGedungAvailability as jest.Mock).mockResolvedValue(true);
      
      const mockCreatedPeminjaman = {
        ...createData,
        id: 'peminjaman-new',
        pengguna_id: 'user-1',
        status_peminjaman: STATUSPEMINJAMAN.DIPROSES,
        createdAt: new Date(),
        updatedAt: new Date(),
        gedung: mockGedung
      };
      
      (prisma.peminjaman.create as jest.Mock).mockResolvedValue(mockCreatedPeminjaman);
      (mockNotifikasiService.prototype.createNotifikasi as jest.Mock).mockResolvedValue({});

      const result = await peminjamanService.createPeminjaman(createData, 'user-1');

      expect(prisma.gedung.findUnique).toHaveBeenCalledWith({
        where: { id: 'gedung-1' }
      });
      expect(mockGedungService.prototype.checkGedungAvailability).toHaveBeenCalledWith(
        'gedung-1',
        '2023-02-01',
        '2023-02-03'
      );
      expect(prisma.peminjaman.create).toHaveBeenCalledWith({
        data: {
          ...createData,
          pengguna_id: 'user-1',
          status_peminjaman: STATUSPEMINJAMAN.DIPROSES
        },
        include: { gedung: true }
      });
      expect(mockNotifikasiService.prototype.createNotifikasi).toHaveBeenCalled();
      expect(result).toEqual(mockCreatedPeminjaman);
    });

    it('should throw BadRequestError when gedung not found', async () => {
      (prisma.gedung.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(peminjamanService.createPeminjaman(createData, 'user-1')).rejects.toThrow(BadRequestError);
      expect(mockGedungService.prototype.checkGedungAvailability).not.toHaveBeenCalled();
      expect(prisma.peminjaman.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestError when gedung is not available', async () => {
      (prisma.gedung.findUnique as jest.Mock).mockResolvedValue(mockGedung);
      (mockGedungService.prototype.checkGedungAvailability as jest.Mock).mockResolvedValue(false);

      await expect(peminjamanService.createPeminjaman(createData, 'user-1')).rejects.toThrow(BadRequestError);
      expect(prisma.peminjaman.create).not.toHaveBeenCalled();
    });
  });

  describe('approvePeminjaman', () => {
    const mockPeminjaman = {
      id: '1',
      gedung_id: 'gedung-1',
      pengguna_id: 'user-1',
      nama_kegiatan: 'Kegiatan 1',
      tanggal_mulai: '2023-01-01',
      tanggal_selesai: '2023-01-03',
      jam_mulai: '08:00',
      jam_selesai: '16:00',
      surat_pengajuan: 'surat1.pdf',
      status_peminjaman: STATUSPEMINJAMAN.DIPROSES,
      gedung: {
        id: 'gedung-1',
        nama_gedung: 'Gedung A'
      },
      pengguna: {
        id: 'user-1',
        nama_lengkap: 'User Test'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    it('should approve peminjaman', async () => {
      (prisma.peminjaman.findUnique as jest.Mock).mockResolvedValue(mockPeminjaman);
      
      const updatedPeminjaman = {
        ...mockPeminjaman,
        status_peminjaman: STATUSPEMINJAMAN.DISETUJUI
      };
      
      (prisma.peminjaman.update as jest.Mock).mockResolvedValue(updatedPeminjaman);
      (mockNotifikasiService.prototype.createNotifikasi as jest.Mock).mockResolvedValue({});
      (mockNotifikasiService.prototype.sendPushNotification as jest.Mock).mockResolvedValue(undefined);

      const result = await peminjamanService.approvePeminjaman('1', {
        status_peminjaman: STATUSPEMINJAMAN.DISETUJUI
      });

      expect(prisma.peminjaman.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          status_peminjaman: STATUSPEMINJAMAN.DISETUJUI,
          alasan_penolakan: undefined
        },
        include: expect.any(Object)
      });
      expect(mockNotifikasiService.prototype.createNotifikasi).toHaveBeenCalled();
      expect(mockNotifikasiService.prototype.sendPushNotification).toHaveBeenCalled();
      expect(result).toEqual(updatedPeminjaman);
    });

    it('should reject peminjaman with reason', async () => {
      (prisma.peminjaman.findUnique as jest.Mock).mockResolvedValue(mockPeminjaman);
      
      const updatedPeminjaman = {
        ...mockPeminjaman,
        status_peminjaman: STATUSPEMINJAMAN.DITOLAK,
        alasan_penolakan: 'Jadwal bentrok'
      };
      
      (prisma.peminjaman.update as jest.Mock).mockResolvedValue(updatedPeminjaman);
      (mockNotifikasiService.prototype.createNotifikasi as jest.Mock).mockResolvedValue({});
      (mockNotifikasiService.prototype.sendPushNotification as jest.Mock).mockResolvedValue(undefined);

      const result = await peminjamanService.approvePeminjaman('1', {
        status_peminjaman: STATUSPEMINJAMAN.DITOLAK,
        alasan_penolakan: 'Jadwal bentrok'
      });

      expect(prisma.peminjaman.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          status_peminjaman: STATUSPEMINJAMAN.DITOLAK,
          alasan_penolakan: 'Jadwal bentrok'
        },
        include: expect.any(Object)
      });
      expect(mockNotifikasiService.prototype.createNotifikasi).toHaveBeenCalled();
      expect(mockNotifikasiService.prototype.sendPushNotification).toHaveBeenCalled();
      expect(result).toEqual(updatedPeminjaman);
    });

    it('should throw BadRequestError when rejecting without reason', async () => {
      (prisma.peminjaman.findUnique as jest.Mock).mockResolvedValue(mockPeminjaman);

      await expect(peminjamanService.approvePeminjaman('1', {
        status_peminjaman: STATUSPEMINJAMAN.DITOLAK
      })).rejects.toThrow(BadRequestError);
      
      expect(prisma.peminjaman.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError when peminjaman not found', async () => {
      (prisma.peminjaman.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(peminjamanService.approvePeminjaman('999', {
        status_peminjaman: STATUSPEMINJAMAN.DISETUJUI
      })).rejects.toThrow(NotFoundError);
    });

    it('should throw BadRequestError when peminjaman status is not DIPROSES', async () => {
      const nonProcessingPeminjaman = {
        ...mockPeminjaman,
        status_peminjaman: STATUSPEMINJAMAN.DISETUJUI
      };
      
      (prisma.peminjaman.findUnique as jest.Mock).mockResolvedValue(nonProcessingPeminjaman);

      await expect(peminjamanService.approvePeminjaman('1', {
        status_peminjaman: STATUSPEMINJAMAN.DITOLAK,
        alasan_penolakan: 'Alasan'
      })).rejects.toThrow(BadRequestError);
      
      expect(prisma.peminjaman.update).not.toHaveBeenCalled();
    });
  });

  describe('getPeminjamanStatistics', () => {
    it('should return statistics correctly', async () => {
      // Mock total count
      (prisma.peminjaman.count as jest.Mock).mockResolvedValue(100);
      
      // Mock status counts
      (prisma.peminjaman.groupBy as jest.Mock).mockResolvedValueOnce([
        { status_peminjaman: STATUSPEMINJAMAN.DIPROSES, _count: { id: 30 } },
        { status_peminjaman: STATUSPEMINJAMAN.DISETUJUI, _count: { id: 40 } },
        { status_peminjaman: STATUSPEMINJAMAN.DITOLAK, _count: { id: 20 } },
        { status_peminjaman: STATUSPEMINJAMAN.SELESAI, _count: { id: 10 } }
      ]);
      
      // Mock monthly data
      (prisma.peminjaman.findMany as jest.Mock).mockResolvedValueOnce([
        { createdAt: new Date('2023-01-15') },
        { createdAt: new Date('2023-01-20') },
        { createdAt: new Date('2023-02-10') },
        { createdAt: new Date('2023-03-05') }
      ]);
      
      // Mock gedung counts
      (prisma.peminjaman.groupBy as jest.Mock).mockResolvedValueOnce([
        { gedung_id: 'gedung-1', _count: { id: 50 } },
        { gedung_id: 'gedung-2', _count: { id: 30 } },
        { gedung_id: 'gedung-3', _count: { id: 20 } }
      ]);
      
      // Mock gedung details
      (prisma.gedung.findMany as jest.Mock).mockResolvedValueOnce([
        { id: 'gedung-1', nama_gedung: 'Gedung A' },
        { id: 'gedung-2', nama_gedung: 'Gedung B' },
        { id: 'gedung-3', nama_gedung: 'Gedung C' }
      ]);

      const result = await peminjamanService.getPeminjamanStatistics();

      expect(result).toHaveProperty('totalPeminjaman', 100);
      expect(result).toHaveProperty('byStatus');
      expect(result.byStatus).toEqual({
        [STATUSPEMINJAMAN.DIPROSES]: 30,
        [STATUSPEMINJAMAN.DISETUJUI]: 40,
        [STATUSPEMINJAMAN.DITOLAK]: 20,
        [STATUSPEMINJAMAN.SELESAI]: 10
      });
      expect(result).toHaveProperty('byMonth');
      expect(result).toHaveProperty('byGedung');
      expect(result.byGedung).toEqual([
        { gedungId: 'gedung-1', gedungName: 'Gedung A', count: 50 },
        { gedungId: 'gedung-2', gedungName: 'Gedung B', count: 30 },
        { gedungId: 'gedung-3', gedungName: 'Gedung C', count: 20 }
      ]);
    });
  });
});