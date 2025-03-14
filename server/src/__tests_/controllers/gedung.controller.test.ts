// src/__tests__/controllers/gedung.controller.test.ts
import { Request, Response } from 'express';
import { GedungController } from '../../controllers/gedung.controller';
import { GedungService } from '../../services/gedung.service';
import { ROLE } from '@prisma/client';
import { ValidationUtil } from '../../utils/validation.util';
import { UnauthorizedError, BadRequestError } from '../../configs/error.config';
import { TestLogger } from '../../utils/test-logger.util';

jest.mock('../../services/gedung.service');
jest.mock('../../utils/validation.util');

describe('GedungController', () => {
  let gedungController: GedungController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;
  
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
  };
  
  beforeEach(() => {
    gedungController = new GedungController();
    
    mockRequest = {
      body: {},
      params: {},
      query: {},
      user: {
        id: 'user-123',
        email: 'admin@unand.ac.id',
        role: ROLE.ADMIN
      }
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    mockNext = jest.fn();
    
    jest.clearAllMocks();
  });
  
  describe('getAllGedung', () => {
    it('should return all gedung', async () => {
      const mockFilter = { nama_gedung: 'Test' };
      
      (ValidationUtil.validateQuery as jest.Mock).mockReturnValue(mockFilter);
      (GedungService.prototype.getAllGedung as jest.Mock).mockResolvedValue([mockGedung]);
      
      await gedungController.getAllGedung(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(ValidationUtil.validateQuery).toHaveBeenCalled();
      expect(GedungService.prototype.getAllGedung).toHaveBeenCalledWith(mockFilter);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Daftar gedung berhasil diambil',
        data: [mockGedung]
      });
    });
    
    it('should handle errors properly', async () => {
      const error = new Error('Test error');
      (GedungService.prototype.getAllGedung as jest.Mock).mockRejectedValue(error);
      
      await gedungController.getAllGedung(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
  
  describe('getGedungById', () => {
    it('should return gedung by id', async () => {
      mockRequest.params = { id: 'gedung-123' };
      
      (GedungService.prototype.getGedungById as jest.Mock).mockResolvedValue(mockGedung);
      
      await gedungController.getGedungById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(GedungService.prototype.getGedungById).toHaveBeenCalledWith('gedung-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Detail gedung berhasil diambil',
        data: mockGedung
      });
    });
  });
  
  describe('createGedung', () => {
    it('should create gedung if user is admin', async () => {
      const createData = {
        nama_gedung: 'Gedung Baru',
        deskripsi: 'Deskripsi gedung baru',
        harga_sewa: 1500000,
        kapasitas: 300,
        lokasi: 'Padang',
        tipe_gedung_id: 'tipe-123',
      };
      
      (ValidationUtil.validateBody as jest.Mock).mockReturnValue(createData);
      (GedungService.prototype.createGedung as jest.Mock).mockResolvedValue({
        ...createData,
        id: 'gedung-new',
      });
      
      await gedungController.createGedung(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(ValidationUtil.validateBody).toHaveBeenCalled();
      expect(GedungService.prototype.createGedung).toHaveBeenCalledWith(createData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Gedung berhasil dibuat',
        data: expect.objectContaining({
          id: 'gedung-new',
          nama_gedung: 'Gedung Baru',
        })
      });
    });
    
    it('should throw UnauthorizedError if user is not admin', async () => {
      mockRequest.user = {
        id: 'user-123',
        email: 'user@example.com',
        role: ROLE.PEMINJAM
      };
      
      await gedungController.createGedung(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(ValidationUtil.validateBody).not.toHaveBeenCalled();
      expect(GedungService.prototype.createGedung).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });
  
  describe('updateGedung', () => {
    it('should update gedung if user is admin', async () => {
      mockRequest.params = { id: 'gedung-123' };
      const updateData = {
        nama_gedung: 'Gedung Updated',
        harga_sewa: 2000000,
      };
      
      (ValidationUtil.validateBody as jest.Mock).mockReturnValue(updateData);
      (GedungService.prototype.updateGedung as jest.Mock).mockResolvedValue({
        ...mockGedung,
        ...updateData,
      });
      
      await gedungController.updateGedung(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(ValidationUtil.validateBody).toHaveBeenCalled();
      expect(GedungService.prototype.updateGedung).toHaveBeenCalledWith('gedung-123', updateData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Gedung berhasil diperbarui',
        data: expect.objectContaining({
          id: 'gedung-123',
          nama_gedung: 'Gedung Updated',
          harga_sewa: 2000000,
        })
      });
    });
    
    it('should throw UnauthorizedError if user is not admin', async () => {
      mockRequest.user = {
        id: 'user-123',
        email: 'user@example.com',
        role: ROLE.PEMINJAM
      };
      
      await gedungController.updateGedung(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(ValidationUtil.validateBody).not.toHaveBeenCalled();
      expect(GedungService.prototype.updateGedung).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });
  
  describe('deleteGedung', () => {
    it('should delete gedung if user is admin', async () => {
      mockRequest.params = { id: 'gedung-123' };
      
      (GedungService.prototype.deleteGedung as jest.Mock).mockResolvedValue(true);
      
      await gedungController.deleteGedung(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(GedungService.prototype.deleteGedung).toHaveBeenCalledWith('gedung-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Gedung berhasil dihapus',
        data: null
      });
    });
    
    it('should throw UnauthorizedError if user is not admin', async () => {
      mockRequest.user = {
        id: 'user-123',
        email: 'user@example.com',
        role: ROLE.PEMINJAM
      };
      
      await gedungController.deleteGedung(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(GedungService.prototype.deleteGedung).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });
  
  describe('checkGedungAvailability', () => {
    it('should check gedung availability', async () => {
      mockRequest.query = {
        gedungId: 'gedung-123',
        tanggalMulai: '2023-01-01',
        tanggalSelesai: '2023-01-03'
      };
      
      (GedungService.prototype.checkGedungAvailability as jest.Mock).mockResolvedValue(true);
      
      await gedungController.checkGedungAvailability(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(GedungService.prototype.checkGedungAvailability).toHaveBeenCalledWith(
        'gedung-123',
        '2023-01-01',
        '2023-01-03'
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Ketersediaan gedung berhasil diperiksa',
        data: {
          gedungId: 'gedung-123',
          tanggalMulai: '2023-01-01',
          tanggalSelesai: '2023-01-03',
          isAvailable: true
        }
      });
    });
    
    it('should throw BadRequestError if required parameters are missing', async () => {
      mockRequest.query = {
        gedungId: 'gedung-123',
        // Missing tanggalMulai and tanggalSelesai
      };
      
      await gedungController.checkGedungAvailability(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(GedungService.prototype.checkGedungAvailability).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
    });
  });
  
  describe('getAvailableGedung', () => {
    it('should get available gedung', async () => {
      mockRequest.query = {
        tanggalMulai: '2023-01-01',
        tanggalSelesai: '2023-01-03'
      };
      
      const mockFilter = { nama_gedung: 'Test' };
      (ValidationUtil.validateQuery as jest.Mock).mockReturnValue(mockFilter);
      (GedungService.prototype.getAvailableGedung as jest.Mock).mockResolvedValue([mockGedung]);
      
      await gedungController.getAvailableGedung(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(ValidationUtil.validateQuery).toHaveBeenCalled();
      expect(GedungService.prototype.getAvailableGedung).toHaveBeenCalledWith(
        '2023-01-01',
        '2023-01-03',
        mockFilter
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Daftar gedung tersedia berhasil diambil',
        data: [mockGedung]
      });
    });
    
    it('should throw BadRequestError if required parameters are missing', async () => {
      mockRequest.query = {
        // Missing tanggalMulai and tanggalSelesai
      };
      
      await gedungController.getAvailableGedung(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(GedungService.prototype.getAvailableGedung).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
    });
  });
});