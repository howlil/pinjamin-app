// src/__tests__/controllers/peminjaman.controller.test.ts
import { Request, Response } from 'express';
import { PeminjamanController } from '../../controllers/peminjaman.controller';
import { PeminjamanService } from '../../services/peminjaman.service';
import { UnauthorizedError, ForbiddenError } from '../../configs/error.config';
import { ValidationUtil } from '../../utils/validation.util';
import { ROLE, STATUSPEMINJAMAN } from '@prisma/client';
import { TestLogger } from '../../utils/test-logger.util';

jest.mock('../../services/peminjaman.service');
jest.mock('../../utils/validation.util');

describe('PeminjamanController', () => {
  let peminjamanController: PeminjamanController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;
  
  beforeEach(() => {
    TestLogger.log('Setting up PeminjamanController test');
    jest.clearAllMocks();
    peminjamanController = new PeminjamanController();
    
    mockRequest = {
      params: { id: '1' },
      body: {},
      query: {},
      user: {
        id: 'user-1',
        email: 'user@example.com',
        role: ROLE.PEMINJAM
      }
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    mockNext = jest.fn();
  });
  
  describe('getAllPeminjaman', () => {
    it('should return all peminjaman for admin', async () => {
      TestLogger.log('Testing getAllPeminjaman for admin');
      mockRequest.user = {
        id: 'admin-1',
        email: 'admin@example.com',
        role: ROLE.ADMIN
      };
      
      const mockPeminjamans = [{ id: '1', nama_kegiatan: 'Test Event' }];
      (PeminjamanService.prototype.getAllPeminjaman as jest.Mock).mockResolvedValue(mockPeminjamans);
      
      await peminjamanController.getAllPeminjaman(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      TestLogger.log('Verifying getAllPeminjaman call and response', {
        serviceMethodCalled: 'getAllPeminjaman',
        responseStatus: 200,
        responseData: mockPeminjamans
      });
      
      expect(PeminjamanService.prototype.getAllPeminjaman).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Daftar peminjaman berhasil diambil',
        data: mockPeminjamans
      });
    });
    
    it('should throw UnauthorizedError for non-admin users', async () => {
      TestLogger.log('Testing getAllPeminjaman for non-admin users');
      await peminjamanController.getAllPeminjaman(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      TestLogger.log('Verifying UnauthorizedError was thrown', {
        serviceMethodCalled: 'None',
        errorType: 'UnauthorizedError'
      });
      
      expect(PeminjamanService.prototype.getAllPeminjaman).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });
  
  describe('getPeminjamanById', () => {
    it('should return peminjaman if user owns it', async () => {
      TestLogger.log('Testing getPeminjamanById for owner');
      const mockPeminjaman = {
        id: '1',
        pengguna_id: 'user-1',
        nama_kegiatan: 'Test Event'
      };
      
      (PeminjamanService.prototype.getPeminjamanById as jest.Mock).mockResolvedValue(mockPeminjaman);
      
      await peminjamanController.getPeminjamanById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      TestLogger.log('Verifying getPeminjamanById call and response', {
        serviceMethodCalled: 'getPeminjamanById',
        id: '1',
        responseStatus: 200,
        responseData: mockPeminjaman
      });
      
      expect(PeminjamanService.prototype.getPeminjamanById).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Detail peminjaman berhasil diambil',
        data: mockPeminjaman
      });
    });
    
    it('should return peminjaman if user is admin', async () => {
      TestLogger.log('Testing getPeminjamanById for admin');
      mockRequest.user = {
        id: 'admin-1',
        email: 'admin@example.com',
        role: ROLE.ADMIN
      };
      
      const mockPeminjaman = {
        id: '1',
        pengguna_id: 'user-1',
        nama_kegiatan: 'Test Event'
      };
      
      (PeminjamanService.prototype.getPeminjamanById as jest.Mock).mockResolvedValue(mockPeminjaman);
      
      await peminjamanController.getPeminjamanById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      TestLogger.log('Verifying getPeminjamanById call and response for admin', {
        serviceMethodCalled: 'getPeminjamanById',
        id: '1',
        responseStatus: 200
      });
      
      expect(PeminjamanService.prototype.getPeminjamanById).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
    
    it('should throw ForbiddenError if user does not own peminjaman', async () => {
      TestLogger.log('Testing getPeminjamanById with non-owner');
      const mockPeminjaman = {
        id: '1',
        pengguna_id: 'other-user',
        nama_kegiatan: 'Test Event'
      };
      
      (PeminjamanService.prototype.getPeminjamanById as jest.Mock).mockResolvedValue(mockPeminjaman);
      
      await peminjamanController.getPeminjamanById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      TestLogger.log('Verifying ForbiddenError was thrown', {
        peminjaman: mockPeminjaman,
        user: mockRequest.user,
        errorType: 'ForbiddenError'
      });
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });
  });
  
  describe('getUserPeminjaman', () => {
    it('should return user peminjaman list', async () => {
      TestLogger.log('Testing getUserPeminjaman');
      const mockPeminjamans = [{ id: '1', nama_kegiatan: 'Test Event' }];
      (PeminjamanService.prototype.getPeminjamanByUserId as jest.Mock).mockResolvedValue(mockPeminjamans);
      
      await peminjamanController.getUserPeminjaman(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      TestLogger.log('Verifying getUserPeminjaman call and response', {
        serviceMethodCalled: 'getPeminjamanByUserId',
        userId: 'user-1',
        responseStatus: 200,
        responseData: mockPeminjamans
      });
      
      expect(PeminjamanService.prototype.getPeminjamanByUserId).toHaveBeenCalledWith('user-1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Daftar peminjaman pengguna berhasil diambil',
        data: mockPeminjamans
      });
    });
    
    it('should throw UnauthorizedError if user not found in request', async () => {
      TestLogger.log('Testing getUserPeminjaman with no user');
      mockRequest.user = undefined;
      
      await peminjamanController.getUserPeminjaman(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      TestLogger.log('Verifying UnauthorizedError was thrown', {
        errorType: 'UnauthorizedError',
        reason: 'No user in request'
      });
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });
  
  describe('createPeminjaman', () => {
    it('should create new peminjaman', async () => {
      TestLogger.log('Testing createPeminjaman');
      const peminjamanData = {
        gedung_id: 'gedung-1',
        nama_kegiatan: 'New Event',
        tanggal_mulai: '2023-03-01',
        tanggal_selesai: '2023-03-03',
        jam_mulai: '09:00',
        jam_selesai: '17:00',
        surat_pengajuan: 'file.pdf'
      };
      
      mockRequest.body = peminjamanData;
      
      (ValidationUtil.validateBody as jest.Mock).mockReturnValue(peminjamanData);
      
      const mockNewPeminjaman = {
        ...peminjamanData,
        id: 'new-1',
        pengguna_id: 'user-1',
        status_peminjaman: STATUSPEMINJAMAN.DIPROSES
      };
      
      (PeminjamanService.prototype.createPeminjaman as jest.Mock).mockResolvedValue(mockNewPeminjaman);
      
      await peminjamanController.createPeminjaman(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      TestLogger.log('Verifying createPeminjaman call and response', {
        serviceMethodCalled: 'createPeminjaman',
        requestData: peminjamanData,
        userId: 'user-1',
        responseStatus: 201,
        responseData: mockNewPeminjaman
      });
      
      expect(ValidationUtil.validateBody).toHaveBeenCalled();
      expect(PeminjamanService.prototype.createPeminjaman).toHaveBeenCalledWith(
        peminjamanData, 
        'user-1'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Peminjaman berhasil dibuat',
        data: mockNewPeminjaman
      });
    });
  });
  
  describe('approvePeminjaman', () => {
    it('should approve peminjaman if user is admin', async () => {
      TestLogger.log('Testing approvePeminjaman with admin');
      mockRequest.user = {
        id: 'admin-1',
        email: 'admin@example.com',
        role: ROLE.ADMIN
      };
      
      mockRequest.body = {
        status_peminjaman: STATUSPEMINJAMAN.DISETUJUI
      };
      
      (ValidationUtil.validateBody as jest.Mock).mockReturnValue({
        status_peminjaman: STATUSPEMINJAMAN.DISETUJUI
      });
      
      const mockUpdatedPeminjaman = {
        id: '1',
        status_peminjaman: STATUSPEMINJAMAN.DISETUJUI
      };
      
      (PeminjamanService.prototype.approvePeminjaman as jest.Mock).mockResolvedValue(mockUpdatedPeminjaman);
      
      await peminjamanController.approvePeminjaman(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      TestLogger.log('Verifying approvePeminjaman call and response', {
        serviceMethodCalled: 'approvePeminjaman',
        id: '1',
        approvalData: { status_peminjaman: STATUSPEMINJAMAN.DISETUJUI },
        responseStatus: 200,
        responseData: mockUpdatedPeminjaman
      });
      
      expect(ValidationUtil.validateBody).toHaveBeenCalled();
      expect(PeminjamanService.prototype.approvePeminjaman).toHaveBeenCalledWith(
        '1',
        { status_peminjaman: STATUSPEMINJAMAN.DISETUJUI }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Peminjaman berhasil disetujui',
        data: mockUpdatedPeminjaman
      });
    });
    
    it('should throw UnauthorizedError for non-admin users', async () => {
      TestLogger.log('Testing approvePeminjaman with non-admin');
      mockRequest.body = {
        status_peminjaman: STATUSPEMINJAMAN.DITOLAK,
        alasan_penolakan: 'Some reason'
      };
      
      await peminjamanController.approvePeminjaman(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      TestLogger.log('Verifying UnauthorizedError was thrown', {
        userRole: ROLE.PEMINJAM,
        requiredRole: ROLE.ADMIN,
        errorType: 'UnauthorizedError'
      });
      
      expect(PeminjamanService.prototype.approvePeminjaman).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });
  
  describe('getPeminjamanStatistics', () => {
    it('should return statistics if user is admin', async () => {
      TestLogger.log('Testing getPeminjamanStatistics with admin');
      mockRequest.user = {
        id: 'admin-1',
        email: 'admin@example.com',
        role: ROLE.ADMIN
      };
      
      const mockStatistics = {
        totalPeminjaman: 100,
        byStatus: {
          [STATUSPEMINJAMAN.DIPROSES]: 30,
          [STATUSPEMINJAMAN.DISETUJUI]: 40,
          [STATUSPEMINJAMAN.DITOLAK]: 20,
          [STATUSPEMINJAMAN.SELESAI]: 10
        },
        byMonth: [],
        byGedung: []
      };
      
      (PeminjamanService.prototype.getPeminjamanStatistics as jest.Mock).mockResolvedValue(mockStatistics);
      
      await peminjamanController.getPeminjamanStatistics(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      TestLogger.log('Verifying getPeminjamanStatistics call and response', {
        serviceMethodCalled: 'getPeminjamanStatistics',
        responseStatus: 200,
        responseData: {
          totalPeminjaman: mockStatistics.totalPeminjaman,
          byStatus: mockStatistics.byStatus
        }
      });
      
      expect(PeminjamanService.prototype.getPeminjamanStatistics).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Statistik peminjaman berhasil diambil',
        data: mockStatistics
      });
    });
    
    it('should throw UnauthorizedError for non-admin users', async () => {
      TestLogger.log('Testing getPeminjamanStatistics with non-admin');
      await peminjamanController.getPeminjamanStatistics(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      TestLogger.log('Verifying UnauthorizedError was thrown', {
        userRole: ROLE.PEMINJAM,
        requiredRole: ROLE.ADMIN,
        errorType: 'UnauthorizedError'
      });
      
      expect(PeminjamanService.prototype.getPeminjamanStatistics).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });
});