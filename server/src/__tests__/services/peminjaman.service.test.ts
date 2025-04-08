import { PeminjamanService } from '../../services/peminjaman.service';
import { prisma } from '../../configs/db.config';
import { logger } from '../../configs/logger.config';
import { createMockPeminjaman, createMockGedung, createMockUser } from '../../utils/test.utils';
import { NotFoundError, BadRequestError } from '../../configs/error.config';
import { STATUSPEMINJAMAN } from '@prisma/client';

// Mock NotifikasiService
jest.mock('../../services/notifikasi.service', () => {
  return {
    NotifikasiService: jest.fn().mockImplementation(() => {
      return {
        sendPeminjamanNotification: jest.fn().mockResolvedValue({}),
      };
    }),
  };
});

describe('PeminjamanService', () => {
  let peminjamanService: PeminjamanService;
  const mockPrisma = prisma as any;

  beforeEach(() => {
    peminjamanService = new PeminjamanService();
  });

  describe('getAllPeminjaman', () => {
    it('should return all peminjaman', async () => {
      // Arrange
      const mockPeminjamans = [
        createMockPeminjaman(),
        createMockPeminjaman({ id: 'peminjaman-id-2' })
      ];
      mockPrisma.peminjaman.findMany.mockResolvedValue(mockPeminjamans);

      // Act
      const result = await peminjamanService.getAllPeminjaman();

      // Assert
      expect(mockPrisma.peminjaman.findMany).toHaveBeenCalledWith({
        include: {
          pengguna: {
            select: {
              id: true,
              nama_lengkap: true,
              email: true,
              no_hp: true,
              tipe_peminjam: true,
            },
          },
          gedung: {
            select: {
              id: true,
              nama_gedung: true,
              lokasi: true,
              harga_sewa: true,
            },
          },
          pembayaran: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(result).toEqual(mockPeminjamans);
      expect(logger.info).toHaveBeenCalled();
    });
  });

  describe('getPeminjamanById', () => {
    it('should return peminjaman by id', async () => {
      // Arrange
      const mockPeminjaman = createMockPeminjaman();
      mockPrisma.peminjaman.findUnique.mockResolvedValue(mockPeminjaman);

      // Act
      const result = await peminjamanService.getPeminjamanById(mockPeminjaman.id);

      // Assert
      expect(mockPrisma.peminjaman.findUnique).toHaveBeenCalledWith({
        where: { id: mockPeminjaman.id },
        include: {
          pengguna: {
            select: {
              id: true,
              nama_lengkap: true,
              email: true,
              no_hp: true,
              tipe_peminjam: true,
            },
          },
          gedung: {
            select: {
              id: true,
              nama_gedung: true,
              lokasi: true,
              harga_sewa: true,
              kapasitas: true,
              TipeGedung: true,
            },
          },
          pembayaran: true,
        },
      });
      expect(result).toEqual(mockPeminjaman);
      expect(logger.info).toHaveBeenCalled();
    });

    it('should throw error if peminjaman not found', async () => {
      // Arrange
      mockPrisma.peminjaman.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(peminjamanService.getPeminjamanById('nonexistent-id')).rejects.toThrow(NotFoundError);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('getPeminjamanByPengguna', () => {
    it('should return peminjaman for a user', async () => {
      // Arrange
      const mockUser = createMockUser();
      const mockPeminjamans = [
        createMockPeminjaman({ pengguna_id: mockUser.id }),
        createMockPeminjaman({ id: 'peminjaman-id-2', pengguna_id: mockUser.id })
      ];
      mockPrisma.peminjaman.findMany.mockResolvedValue(mockPeminjamans);

      // Act
      const result = await peminjamanService.getPeminjamanByPengguna(mockUser.id);

      // Assert
      expect(mockPrisma.peminjaman.findMany).toHaveBeenCalledWith({
        where: { pengguna_id: mockUser.id },
        include: {
          gedung: {
            select: {
              id: true,
              nama_gedung: true,
              lokasi: true,
              harga_sewa: true,
            },
          },
          pembayaran: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(result).toEqual(mockPeminjamans);
      expect(logger.info).toHaveBeenCalled();
    });
  });

  describe('createPeminjaman', () => {
    it('should create peminjaman successfully', async () => {
      // Arrange
      const mockGedung = createMockGedung();
      const mockPeminjaman = createMockPeminjaman();
      const peminjamanData = {
        pengguna_id: 'user-id',
        gedung_id: mockGedung.id,
        nama_kegiatan: 'Kegiatan Test',
        tanggal_mulai: '2025-01-01',
        tanggal_selesai: '2025-01-02',
        jam_mulai: '08:00',
        jam_selesai: '16:00',
        surat_pengajuan: 'path/to/surat.pdf',
        status_peminjaman: STATUSPEMINJAMAN.DIPROSES,
      };
      
      mockPrisma.peminjaman.findFirst.mockResolvedValue(null);
      mockPrisma.peminjaman.create.mockResolvedValue({
        ...mockPeminjaman,
        pengguna: { id: 'user-id', nama_lengkap: 'Test User', email: 'user@example.com', no_hp: '081234567890' },
        gedung: { id: mockGedung.id, nama_gedung: mockGedung.nama_gedung, lokasi: mockGedung.lokasi, harga_sewa: mockGedung.harga_sewa }
      });

      // Act
      const result = await peminjamanService.createPeminjaman(peminjamanData);

      // Assert
      expect(mockPrisma.peminjaman.create).toHaveBeenCalledWith({
        data: {
          ...peminjamanData,
          status_peminjaman: STATUSPEMINJAMAN.DIPROSES
        },
        include: {
          pengguna: {
            select: {
              id: true,
              nama_lengkap: true,
              email: true,
              no_hp: true,
            },
          },
          gedung: {
            select: {
              id: true,
              nama_gedung: true,
              lokasi: true,
              harga_sewa: true,
            },
          },
        },
      });
      expect(result).toEqual(expect.objectContaining({
        id: mockPeminjaman.id,
        nama_kegiatan: peminjamanData.nama_kegiatan,
      }));
      expect(logger.info).toHaveBeenCalled();
    });

    it('should throw error if gedung is not available', async () => {
      // Arrange
      const existingPeminjaman = createMockPeminjaman({
        tanggal_mulai: '2025-01-01',
        tanggal_selesai: '2025-01-03',
        status_peminjaman: STATUSPEMINJAMAN.DISETUJUI,
      });
      
      const peminjamanData = {
        pengguna_id: 'user-id',
        gedung_id: 'gedung-id',
        nama_kegiatan: 'Kegiatan Test',
        tanggal_mulai: '2025-01-02',
        tanggal_selesai: '2025-01-04',
        jam_mulai: '08:00',
        jam_selesai: '16:00',
        surat_pengajuan: 'path/to/surat.pdf',
        status_peminjaman: STATUSPEMINJAMAN.DIPROSES,
      };
      
      mockPrisma.peminjaman.findFirst.mockResolvedValue(existingPeminjaman);

      // Act & Assert
      await expect(peminjamanService.createPeminjaman(peminjamanData)).rejects.toThrow(BadRequestError);
      expect(logger.error).toHaveBeenCalled();
    });

    it('should throw error if tanggal_mulai is after tanggal_selesai', async () => {
      // Arrange
      const peminjamanData = {
        pengguna_id: 'user-id',
        gedung_id: 'gedung-id',
        nama_kegiatan: 'Kegiatan Test',
        tanggal_mulai: '2025-01-05',
        tanggal_selesai: '2025-01-03',
        jam_mulai: '08:00',
        jam_selesai: '16:00',
        surat_pengajuan: 'path/to/surat.pdf',
        status_peminjaman: STATUSPEMINJAMAN.DIPROSES,
      };

      // Act & Assert
      await expect(peminjamanService.createPeminjaman(peminjamanData)).rejects.toThrow(BadRequestError);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('updatePeminjaman', () => {
    it('should update peminjaman successfully', async () => {
      // Arrange
      const mockPeminjaman = createMockPeminjaman();
      const updatedMockPeminjaman = {
        ...mockPeminjaman,
        nama_kegiatan: 'Updated Kegiatan',
      };
      const updateData = {
        nama_kegiatan: 'Updated Kegiatan',
      };
      
      mockPrisma.peminjaman.findUnique.mockResolvedValue(mockPeminjaman);
      mockPrisma.peminjaman.update.mockResolvedValue(updatedMockPeminjaman);

      // Act
      const result = await peminjamanService.updatePeminjaman(mockPeminjaman.id, updateData);

      // Assert
      expect(mockPrisma.peminjaman.update).toHaveBeenCalledWith({
        where: { id: mockPeminjaman.id },
        data: updateData,
        include: {
          pengguna: {
            select: {
              id: true,
              nama_lengkap: true,
              email: true,
              no_hp: true,
            },
          },
          gedung: {
            select: {
              id: true,
              nama_gedung: true,
              lokasi: true,
              harga_sewa: true,
            },
          },
          pembayaran: true,
        },
      });
      expect(result).toEqual(updatedMockPeminjaman);
      expect(logger.info).toHaveBeenCalled();
    });

    it('should throw error if peminjaman not found', async () => {
      // Arrange
      mockPrisma.peminjaman.findUnique.mockResolvedValue(null);
      const updateData = {
        nama_kegiatan: 'Updated Kegiatan',
      };

      // Act & Assert
      await expect(peminjamanService.updatePeminjaman('nonexistent-id', updateData)).rejects.toThrow(NotFoundError);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('approvePeminjaman', () => {
    it('should approve peminjaman successfully', async () => {
      // Arrange
      const mockPeminjaman = createMockPeminjaman();
      const mockGedung = createMockGedung();
      const mockPeminjamanWithRelations = {
        ...mockPeminjaman,
        pengguna: createMockUser(),
        gedung: mockGedung,
      };
      
      const approvalData = {
        status_peminjaman: STATUSPEMINJAMAN.DISETUJUI,
      };
      
      const updatedMockPeminjaman = {
        ...mockPeminjaman,
        status_peminjaman: STATUSPEMINJAMAN.DISETUJUI,
      };
      
      mockPrisma.peminjaman.findUnique.mockResolvedValue(mockPeminjamanWithRelations);
      mockPrisma.peminjaman.update.mockResolvedValue(updatedMockPeminjaman);

      // Act
      const result = await peminjamanService.approvePeminjaman(mockPeminjaman.id, approvalData);

      // Assert
      expect(mockPrisma.peminjaman.update).toHaveBeenCalledWith({
        where: { id: mockPeminjaman.id },
        data: approvalData,
        include: {
          pengguna: {
            select: {
              id: true,
              nama_lengkap: true,
              email: true,
              no_hp: true,
            },
          },
          gedung: {
            select: {
              id: true,
              nama_gedung: true,
              lokasi: true,
              harga_sewa: true,
            },
          },
          pembayaran: true,
        },
      });
      expect(result).toEqual(updatedMockPeminjaman);
      expect(logger.info).toHaveBeenCalled();
    });

    it('should throw error if peminjaman not found', async () => {
      // Arrange
      mockPrisma.peminjaman.findUnique.mockResolvedValue(null);
      const approvalData = {
        status_peminjaman: STATUSPEMINJAMAN.DISETUJUI,
      };

      // Act & Assert
      await expect(peminjamanService.approvePeminjaman('nonexistent-id', approvalData)).rejects.toThrow(NotFoundError);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('deletePeminjaman', () => {
    it('should delete peminjaman successfully', async () => {
      // Arrange
      const mockPeminjaman = createMockPeminjaman();
      mockPrisma.peminjaman.findUnique.mockResolvedValue(mockPeminjaman);
      mockPrisma.peminjaman.delete.mockResolvedValue(mockPeminjaman);

      // Act
      const result = await peminjamanService.deletePeminjaman(mockPeminjaman.id);

      // Assert
      expect(mockPrisma.peminjaman.delete).toHaveBeenCalledWith({
        where: { id: mockPeminjaman.id },
      });
      expect(result).toBe(true);
      expect(logger.info).toHaveBeenCalled();
    });

    it('should throw error if peminjaman not found', async () => {
      // Arrange
      mockPrisma.peminjaman.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(peminjamanService.deletePeminjaman('nonexistent-id')).rejects.toThrow(NotFoundError);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('getPeminjamanStatistics', () => {
    it('should return peminjaman statistics', async () => {
      // Arrange
      const statusCounts = [
        { status_peminjaman: STATUSPEMINJAMAN.DIPROSES, _count: { id: 10 } },
        { status_peminjaman: STATUSPEMINJAMAN.DISETUJUI, _count: { id: 20 } },
        { status_peminjaman: STATUSPEMINJAMAN.DITOLAK, _count: { id: 5 } },
        { status_peminjaman: STATUSPEMINJAMAN.SELESAI, _count: { id: 15 } },
      ];
      
      const peminjamansThisYear = Array(12).fill(null).map((_, i) => ({
        tanggal_mulai: `2025-${String(i + 1).padStart(2, '0')}-01`
      }));
      
      mockPrisma.peminjaman.groupBy.mockResolvedValue(statusCounts);
      mockPrisma.peminjaman.findMany.mockResolvedValue(peminjamansThisYear);

      // Act
      const result = await peminjamanService.getPeminjamanStatistics();

      // Assert
      expect(mockPrisma.peminjaman.groupBy).toHaveBeenCalledWith({
        by: ['status_peminjaman'],
        _count: {
          id: true,
        },
      });
      
      expect(result).toEqual({
        total: 50,
        approved: 20,
        rejected: 5,
        pending: 10,
        completed: 15,
        byMonth: expect.any(Array),
      });
      
      expect(result.byMonth).toHaveLength(12);
      expect(logger.info).toHaveBeenCalled();
    });
  });
});