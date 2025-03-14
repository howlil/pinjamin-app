// src/__tests__/services/gedung.service.test.ts
import { GedungService } from '../../services/gedung.service';
import { prisma } from '../../configs/db.config';
import { NotFoundError, BadRequestError } from '../../configs/error.config';
import { STATUSPEMINJAMAN } from '@prisma/client';
import { TestLogger } from '../../utils/test-logger.util';

jest.mock('../../configs/db.config', () => ({
  prisma: {
    gedung: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    tipeGedung: {
      findUnique: jest.fn(),
    },
    peminjaman: {
      findFirst: jest.fn(),
    },
    fasilitasGedung: {
      deleteMany: jest.fn(),
    },
    penanggungJawabGedung: {
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(prisma)),
  },
}));

describe('GedungService', () => {
  let gedungService: GedungService;
  
  const mockGedung = {
    id: 'gedung-123',
    nama_gedung: 'Gedung Test',
    deskripsi: 'Deskripsi gedung test',
    harga_sewa: 1000000,
    kapasitas: 200,
    lokasi: 'Padang',
    tipe_gedung_id: 'tipe-123',
    createdAt: new Date(),
    updatedAt: new Date(),
    TipeGedung: {
      id: 'tipe-123',
      nama_tipe_gedung: 'Aula',
    },
    FasilitasGedung: [],
    penganggung_jawab_gedung: [],
    Peminjaman: [],
  };
  
  beforeEach(() => {
    gedungService = new GedungService();
    jest.clearAllMocks();
  });
  
  describe('getAllGedung', () => {
    it('should return all gedung without filter', async () => {
      (prisma.gedung.findMany as jest.Mock).mockResolvedValue([mockGedung]);
      
      const result = await gedungService.getAllGedung();
      
      expect(prisma.gedung.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          TipeGedung: true,
          FasilitasGedung: true,
          penganggung_jawab_gedung: true
        }
      });
      expect(result).toEqual([mockGedung]);
    });
    
    it('should apply filters correctly', async () => {
      const filter = {
        nama_gedung: 'Test',
        lokasi: 'Padang',
        tipe_gedung_id: 'tipe-123',
        kapasitas_min: 100,
        kapasitas_max: 300,
        harga_min: 500000,
        harga_max: 1500000,
      };
      
      (prisma.gedung.findMany as jest.Mock).mockResolvedValue([mockGedung]);
      
      const result = await gedungService.getAllGedung(filter);
      
      expect(prisma.gedung.findMany).toHaveBeenCalledWith({
        where: {
          nama_gedung: {
            contains: 'Test',
            mode: 'insensitive'
          },
          lokasi: {
            contains: 'Padang',
            mode: 'insensitive'
          },
          tipe_gedung_id: 'tipe-123',
          kapasitas: {
            gte: 100,
            lte: 300
          },
          harga_sewa: {
            gte: 500000,
            lte: 1500000
          }
        },
        include: {
          TipeGedung: true,
          FasilitasGedung: true,
          penganggung_jawab_gedung: true
        }
      });
      expect(result).toEqual([mockGedung]);
    });
  });
  
  describe('getGedungById', () => {
    it('should return gedung by id', async () => {
      (prisma.gedung.findUnique as jest.Mock).mockResolvedValue(mockGedung);
      
      const result = await gedungService.getGedungById('gedung-123');
      
      expect(prisma.gedung.findUnique).toHaveBeenCalledWith({
        where: { id: 'gedung-123' },
        include: {
          TipeGedung: true,
          FasilitasGedung: true,
          penganggung_jawab_gedung: true
        }
      });
      expect(result).toEqual(mockGedung);
    });
    
    it('should throw NotFoundError if gedung not found', async () => {
      (prisma.gedung.findUnique as jest.Mock).mockResolvedValue(null);
      
      await expect(gedungService.getGedungById('non-existent-id'))
        .rejects.toThrow(NotFoundError);
    });
  });
  
  describe('createGedung', () => {
    const createData = {
      nama_gedung: 'Gedung Baru',
      deskripsi: 'Deskripsi gedung baru',
      harga_sewa: 1500000,
      kapasitas: 300,
      lokasi: 'Padang',
      tipe_gedung_id: 'tipe-123',
    };
    
    it('should create gedung successfully', async () => {
      (prisma.tipeGedung.findUnique as jest.Mock).mockResolvedValue({
        id: 'tipe-123',
        nama_tipe_gedung: 'Aula',
      });
      
      (prisma.gedung.create as jest.Mock).mockResolvedValue({
        ...createData,
        id: 'gedung-new',
        createdAt: new Date(),
        updatedAt: new Date(),
        TipeGedung: {
          id: 'tipe-123',
          nama_tipe_gedung: 'Aula',
        }
      });
      
      const result = await gedungService.createGedung(createData);
      
      expect(prisma.tipeGedung.findUnique).toHaveBeenCalledWith({
        where: { id: 'tipe-123' }
      });
      
      expect(prisma.gedung.create).toHaveBeenCalledWith({
        data: createData,
        include: {
          TipeGedung: true
        }
      });
      
      expect(result).toHaveProperty('id', 'gedung-new');
      expect(result).toHaveProperty('nama_gedung', 'Gedung Baru');
    });
    
    it('should throw BadRequestError if tipe gedung not found', async () => {
      (prisma.tipeGedung.findUnique as jest.Mock).mockResolvedValue(null);
      
      await expect(gedungService.createGedung(createData))
        .rejects.toThrow(BadRequestError);
      
      expect(prisma.gedung.create).not.toHaveBeenCalled();
    });
  });
  
  describe('updateGedung', () => {
    const updateData = {
      nama_gedung: 'Gedung Updated',
      harga_sewa: 2000000,
    };
    
    it('should update gedung successfully', async () => {
      (prisma.gedung.findUnique as jest.Mock).mockResolvedValue(mockGedung);
      
      (prisma.gedung.update as jest.Mock).mockResolvedValue({
        ...mockGedung,
        ...updateData,
      });
      
      const result = await gedungService.updateGedung('gedung-123', updateData);
      
      expect(prisma.gedung.findUnique).toHaveBeenCalledWith({
        where: { id: 'gedung-123' }
      });
      
      expect(prisma.gedung.update).toHaveBeenCalledWith({
        where: { id: 'gedung-123' },
        data: updateData,
        include: {
          TipeGedung: true,
          FasilitasGedung: true,
          penganggung_jawab_gedung: true
        }
      });
      
      expect(result).toHaveProperty('nama_gedung', 'Gedung Updated');
      expect(result).toHaveProperty('harga_sewa', 2000000);
    });
    
    it('should throw NotFoundError if gedung not found', async () => {
      (prisma.gedung.findUnique as jest.Mock).mockResolvedValue(null);
      
      await expect(gedungService.updateGedung('non-existent-id', updateData))
        .rejects.toThrow(NotFoundError);
      
      expect(prisma.gedung.update).not.toHaveBeenCalled();
    });
    
    it('should validate tipe_gedung_id if provided', async () => {
      (prisma.gedung.findUnique as jest.Mock).mockResolvedValue(mockGedung);
      (prisma.tipeGedung.findUnique as jest.Mock).mockResolvedValue(null);
      
      await expect(gedungService.updateGedung('gedung-123', { 
        ...updateData,
        tipe_gedung_id: 'invalid-tipe'
      })).rejects.toThrow(BadRequestError);
      
      expect(prisma.gedung.update).not.toHaveBeenCalled();
    });
  });
  
  describe('deleteGedung', () => {
    it('should delete gedung successfully', async () => {
      (prisma.gedung.findUnique as jest.Mock).mockResolvedValue({
        ...mockGedung,
        Peminjaman: []
      });
      
      (prisma.fasilitasGedung.deleteMany as jest.Mock).mockResolvedValue({ count: 0 });
      (prisma.penanggungJawabGedung.deleteMany as jest.Mock).mockResolvedValue({ count: 0 });
      (prisma.gedung.delete as jest.Mock).mockResolvedValue(mockGedung);
      
      const result = await gedungService.deleteGedung('gedung-123');
      
      expect(prisma.gedung.findUnique).toHaveBeenCalledWith({
        where: { id: 'gedung-123' },
        include: {
          Peminjaman: true,
          FasilitasGedung: true,
          penganggung_jawab_gedung: true
        }
      });
      
      expect(prisma.fasilitasGedung.deleteMany).toHaveBeenCalledWith({
        where: { gedung_id: 'gedung-123' }
      });
      
      expect(prisma.penanggungJawabGedung.deleteMany).toHaveBeenCalledWith({
        where: { gedung_id: 'gedung-123' }
      });
      
      expect(prisma.gedung.delete).toHaveBeenCalledWith({
        where: { id: 'gedung-123' }
      });
      
      expect(result).toBe(true);
    });
    
    it('should throw NotFoundError if gedung not found', async () => {
      (prisma.gedung.findUnique as jest.Mock).mockResolvedValue(null);
      
      await expect(gedungService.deleteGedung('non-existent-id'))
        .rejects.toThrow(NotFoundError);
      
      expect(prisma.gedung.delete).not.toHaveBeenCalled();
    });
    
    it('should throw BadRequestError if gedung has active peminjaman', async () => {
      (prisma.gedung.findUnique as jest.Mock).mockResolvedValue({
        ...mockGedung,
        Peminjaman: [
          { id: 'peminjaman-1', status_peminjaman: STATUSPEMINJAMAN.DIPROSES }
        ]
      });
      
      await expect(gedungService.deleteGedung('gedung-123'))
        .rejects.toThrow(BadRequestError);
      
      expect(prisma.gedung.delete).not.toHaveBeenCalled();
    });
  });
  
  describe('checkGedungAvailability', () => {
    it('should return true if gedung is available', async () => {
      (prisma.gedung.findUnique as jest.Mock).mockResolvedValue(mockGedung);
      (prisma.peminjaman.findFirst as jest.Mock).mockResolvedValue(null);
      
      const result = await gedungService.checkGedungAvailability(
        'gedung-123',
        '2023-01-01',
        '2023-01-03'
      );
      
      expect(prisma.gedung.findUnique).toHaveBeenCalledWith({
        where: { id: 'gedung-123' }
      });
      
      expect(prisma.peminjaman.findFirst).toHaveBeenCalledWith({
        where: {
          gedung_id: 'gedung-123',
          status_peminjaman: {
            in: [STATUSPEMINJAMAN.DISETUJUI, STATUSPEMINJAMAN.DIPROSES]
          },
          OR: [
            {
              tanggal_mulai: {
                lte: '2023-01-03'
              },
              tanggal_selesai: {
                gte: '2023-01-01'
              }
            }
          ]
        }
      });
      
      expect(result).toBe(true);
    });
    
    it('should return false if gedung is not available', async () => {
      (prisma.gedung.findUnique as jest.Mock).mockResolvedValue(mockGedung);
      (prisma.peminjaman.findFirst as jest.Mock).mockResolvedValue({
        id: 'peminjaman-1',
        gedung_id: 'gedung-123',
        status_peminjaman: STATUSPEMINJAMAN.DISETUJUI,
        tanggal_mulai: '2023-01-01',
        tanggal_selesai: '2023-01-05'
      });
      
      const result = await gedungService.checkGedungAvailability(
        'gedung-123',
        '2023-01-03',
        '2023-01-06'
      );
      
      expect(result).toBe(false);
    });
    
    it('should throw NotFoundError if gedung not found', async () => {
      (prisma.gedung.findUnique as jest.Mock).mockResolvedValue(null);
      
      await expect(gedungService.checkGedungAvailability(
        'non-existent-id',
        '2023-01-01',
        '2023-01-03'
      )).rejects.toThrow(NotFoundError);
      
      expect(prisma.peminjaman.findFirst).not.toHaveBeenCalled();
    });
  });
});