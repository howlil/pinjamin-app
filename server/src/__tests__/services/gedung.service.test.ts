import { GedungService } from '../../services/gedung.service';
import { prisma } from '../../configs/db.config';
import { logger } from '../../configs/logger.config';
import { createMockGedung } from '../../utils/test.utils';
import { NotFoundError } from '../../configs/error.config';
import { STATUSPEMINJAMAN } from '@prisma/client';

describe('GedungService', () => {
  let gedungService: GedungService;
  const mockPrisma = prisma as any;

  beforeEach(() => {
    gedungService = new GedungService();
  });

  describe('getAllGedung', () => {
    it('should return all gedung without filter', async () => {
      // Arrange
      const mockGedungs = [createMockGedung(), createMockGedung({ id: 'gedung-id-2' })];
      mockPrisma.gedung.findMany.mockResolvedValue(mockGedungs);

      // Act
      const result = await gedungService.getAllGedung();

      // Assert
      expect(mockPrisma.gedung.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockGedungs);
      expect(logger.info).toHaveBeenCalled();
    });

    it('should apply filters when provided', async () => {
      // Arrange
      const mockGedungs = [createMockGedung()];
      const filter = {
        nama_gedung: 'Test',
        lokasi: 'Padang',
        tipe_gedung_id: 'tipe-id',
        kapasitas_min: 50,
        kapasitas_max: 200,
        harga_min: 500000,
        harga_max: 2000000
      };
      
      mockPrisma.gedung.findMany.mockResolvedValue(mockGedungs);

      // Act
      const result = await gedungService.getAllGedung(filter);

      // Assert
      expect(mockPrisma.gedung.findMany).toHaveBeenCalledWith({
        where: {
          nama_gedung: { contains: filter.nama_gedung, mode: 'insensitive' },
          lokasi: { contains: filter.lokasi, mode: 'insensitive' },
          tipe_gedung_id: filter.tipe_gedung_id,
          kapasitas: {
            gte: filter.kapasitas_min,
            lte: filter.kapasitas_max,
          },
          harga_sewa: {
            gte: filter.harga_min,
            lte: filter.harga_max,
          },
        },
        include: {
          TipeGedung: true,
          FasilitasGedung: true,
          penganggung_jawab_gedung: true,
        },
      });
      expect(result).toEqual(mockGedungs);
      expect(logger.info).toHaveBeenCalled();
    });
  });

  describe('getGedungById', () => {
    it('should return gedung by id', async () => {
      // Arrange
      const mockGedung = createMockGedung();
      mockPrisma.gedung.findUnique.mockResolvedValue(mockGedung);

      // Act
      const result = await gedungService.getGedungById(mockGedung.id);

      // Assert
      expect(mockPrisma.gedung.findUnique).toHaveBeenCalledWith({
        where: { id: mockGedung.id },
        include: {
          TipeGedung: true,
          FasilitasGedung: true,
          penganggung_jawab_gedung: true,
        },
      });
      expect(result).toEqual(mockGedung);
      expect(logger.info).toHaveBeenCalled();
    });

    it('should throw error if gedung not found', async () => {
      // Arrange
      mockPrisma.gedung.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(gedungService.getGedungById('nonexistent-id')).rejects.toThrow(NotFoundError);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('createGedung', () => {
    it('should create a new gedung successfully', async () => {
      // Arrange
      const mockGedung = createMockGedung();
      const gedungData = {
        nama_gedung: 'Gedung Test',
        deskripsi: 'Deskripsi gedung test',
        harga_sewa: 1000000,
        kapasitas: 100,
        lokasi: 'Padang',
        tipe_gedung_id: 'tipe-gedung-id',
      };
      
      mockPrisma.gedung.create.mockResolvedValue(mockGedung);

      // Act
      const result = await gedungService.createGedung(gedungData);

      // Assert
      expect(mockPrisma.gedung.create).toHaveBeenCalledWith({
        data: gedungData,
        include: {
          TipeGedung: true,
          FasilitasGedung: true,
          penganggung_jawab_gedung: true,
        },
      });
      expect(result).toEqual(mockGedung);
      expect(logger.info).toHaveBeenCalled();
    });
  });

  describe('updateGedung', () => {
    it('should update gedung successfully', async () => {
      // Arrange
      const mockGedung = createMockGedung();
      const updatedMockGedung = {
        ...mockGedung,
        nama_gedung: 'Updated Gedung',
        harga_sewa: 1500000,
      };
      const updateData = {
        nama_gedung: 'Updated Gedung',
        harga_sewa: 1500000,
      };
      
      mockPrisma.gedung.findUnique.mockResolvedValue(mockGedung);
      mockPrisma.gedung.update.mockResolvedValue(updatedMockGedung);

      // Act
      const result = await gedungService.updateGedung(mockGedung.id, updateData);

      // Assert
      expect(mockPrisma.gedung.update).toHaveBeenCalledWith({
        where: { id: mockGedung.id },
        data: updateData,
        include: {
          TipeGedung: true,
          FasilitasGedung: true,
          penganggung_jawab_gedung: true,
        },
      });
      expect(result).toEqual(updatedMockGedung);
      expect(logger.info).toHaveBeenCalled();
    });

    it('should throw error if gedung not found', async () => {
      // Arrange
      mockPrisma.gedung.findUnique.mockResolvedValue(null);
      const updateData = {
        nama_gedung: 'Updated Gedung',
      };

      // Act & Assert
      await expect(gedungService.updateGedung('nonexistent-id', updateData)).rejects.toThrow(NotFoundError);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('deleteGedung', () => {
    it('should delete gedung successfully', async () => {
      // Arrange
      const mockGedung = createMockGedung();
      mockPrisma.gedung.findUnique.mockResolvedValue(mockGedung);
      mockPrisma.gedung.delete.mockResolvedValue(mockGedung);

      // Act
      const result = await gedungService.deleteGedung(mockGedung.id);

      // Assert
      expect(mockPrisma.gedung.delete).toHaveBeenCalledWith({
        where: { id: mockGedung.id },
      });
      expect(result).toBe(true);
      expect(logger.info).toHaveBeenCalled();
    });

    it('should throw error if gedung not found', async () => {
      // Arrange
      mockPrisma.gedung.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(gedungService.deleteGedung('nonexistent-id')).rejects.toThrow(NotFoundError);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('checkGedungAvailability', () => {
    it('should return true if gedung is available', async () => {
      // Arrange
      const mockGedung = createMockGedung();
      mockPrisma.gedung.findUnique.mockResolvedValue(mockGedung);
      mockPrisma.peminjaman.findFirst.mockResolvedValue(null);

      // Act
      const result = await gedungService.checkGedungAvailability(
        mockGedung.id,
        '2025-01-01',
        '2025-01-03'
      );

      // Assert
      expect(mockPrisma.peminjaman.findFirst).toHaveBeenCalledWith({
        where: {
          gedung_id: mockGedung.id,
          status_peminjaman: {
            in: [STATUSPEMINJAMAN.DIPROSES, STATUSPEMINJAMAN.DISETUJUI],
          },
          OR: [
            {
              AND: [
                {
                  tanggal_mulai: {
                    lte: '2025-01-03',
                  },
                },
                {
                  tanggal_selesai: {
                    gte: '2025-01-01',
                  },
                },
              ],
            },
          ],
        },
      });
      expect(result).toBe(true);
      expect(logger.info).toHaveBeenCalled();
    });

    it('should return false if gedung is not available', async () => {
      // Arrange
      const mockGedung = createMockGedung();
      const conflictingPeminjaman = {
        id: 'peminjaman-id',
        gedung_id: mockGedung.id,
        tanggal_mulai: '2025-01-02',
        tanggal_selesai: '2025-01-05',
        status_peminjaman: STATUSPEMINJAMAN.DISETUJUI,
      };
      
      mockPrisma.gedung.findUnique.mockResolvedValue(mockGedung);
      mockPrisma.peminjaman.findFirst.mockResolvedValue(conflictingPeminjaman);

      // Act
      const result = await gedungService.checkGedungAvailability(
        mockGedung.id,
        '2025-01-01',
        '2025-01-03'
      );

      // Assert
      expect(result).toBe(false);
      expect(logger.info).toHaveBeenCalled();
    });

    it('should throw error if gedung not found', async () => {
      // Arrange
      mockPrisma.gedung.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(gedungService.checkGedungAvailability(
        'nonexistent-id',
        '2025-01-01',
        '2025-01-03'
      )).rejects.toThrow(NotFoundError);
      expect(logger.error).toHaveBeenCalled();
    });
  });
})
