// src/__tests__/controllers/notifikasi.controller.test.ts
import { Request, Response } from 'express';
import { NotifikasiController } from '../../controllers/notifikasi.controller';
import { NotifikasiService } from '../../services/notifikasi.service';
import { UnauthorizedError, ForbiddenError } from '../../configs/error.config';
import { ValidationUtil } from '../../utils/validation.util';
import { ROLE, Notif } from '@prisma/client';
import { TestLogger } from '../../utils/test-logger.util';


jest.mock('../../services/notifikasi.service');
jest.mock('../../utils/validation.util');

describe('NotifikasiController', () => {
  let notifikasiController: NotifikasiController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;
  
  beforeEach(() => {
    jest.clearAllMocks();
    notifikasiController = new NotifikasiController();
    
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
  
  describe('getAllNotifikasi', () => {
    it('should return all notifikasi for admin', async () => {
      mockRequest.user = {
        id: 'admin-1',
        email: 'admin@example.com',
        role: ROLE.ADMIN
      };
      
      const mockNotifikasis = [
        { 
          id: '1', 
          judul: 'Test Notification', 
          pesan: 'Test message',
          jenis_notifikasi: Notif.PEMINJAMAN
        }
      ];
      
      (NotifikasiService.prototype.getAllNotifikasi as jest.Mock).mockResolvedValue(mockNotifikasis);
      
      await notifikasiController.getAllNotifikasi(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(NotifikasiService.prototype.getAllNotifikasi).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Daftar notifikasi berhasil diambil',
        data: mockNotifikasis
      });
    });
    
    it('should throw UnauthorizedError for non-admin users', async () => {
      await notifikasiController.getAllNotifikasi(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(NotifikasiService.prototype.getAllNotifikasi).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });
  
  describe('getNotifikasiById', () => {
    it('should return notifikasi if user owns it', async () => {
      const mockNotifikasi = {
        id: '1',
        pengguna_id: 'user-1',
        judul: 'Test Notification',
        pesan: 'Test message',
        jenis_notifikasi: Notif.PEMINJAMAN,
        status_baca: 0
      };
      
      (NotifikasiService.prototype.getNotifikasiById as jest.Mock).mockResolvedValue(mockNotifikasi);
      
      await notifikasiController.getNotifikasiById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(NotifikasiService.prototype.getNotifikasiById).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Detail notifikasi berhasil diambil',
        data: mockNotifikasi
      });
    });
    
    it('should return notifikasi if user is admin', async () => {
      mockRequest.user = {
        id: 'admin-1',
        email: 'admin@example.com',
        role: ROLE.ADMIN
      };
      
      const mockNotifikasi = {
        id: '1',
        pengguna_id: 'user-1',
        judul: 'Test Notification',
        pesan: 'Test message',
        jenis_notifikasi: Notif.PEMINJAMAN,
        status_baca: 0
      };
      
      (NotifikasiService.prototype.getNotifikasiById as jest.Mock).mockResolvedValue(mockNotifikasi);
      
      await notifikasiController.getNotifikasiById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(NotifikasiService.prototype.getNotifikasiById).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
    
    it('should throw ForbiddenError if user does not own notifikasi', async () => {
      const mockNotifikasi = {
        id: '1',
        pengguna_id: 'other-user',
        judul: 'Test Notification',
        pesan: 'Test message',
        jenis_notifikasi: Notif.PEMINJAMAN,
        status_baca: 0
      };
      
      (NotifikasiService.prototype.getNotifikasiById as jest.Mock).mockResolvedValue(mockNotifikasi);
      
      await notifikasiController.getNotifikasiById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });
    
    it('should throw UnauthorizedError if user not found in request', async () => {
      mockRequest.user = undefined;
      
      await notifikasiController.getNotifikasiById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });
  
  describe('getUserNotifikasi', () => {
    it('should return notifications for the current user', async () => {
      const mockNotifikasis = [
        { 
          id: '1', 
          pengguna_id: 'user-1',
          judul: 'Test Notification', 
          pesan: 'Test message',
          jenis_notifikasi: Notif.PEMINJAMAN,
          status_baca: 0
        }
      ];
      
      (NotifikasiService.prototype.getNotifikasiByUserId as jest.Mock).mockResolvedValue(mockNotifikasis);
      
      await notifikasiController.getUserNotifikasi(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(NotifikasiService.prototype.getNotifikasiByUserId).toHaveBeenCalledWith('user-1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Daftar notifikasi pengguna berhasil diambil',
        data: mockNotifikasis
      });
    });
    
    it('should throw UnauthorizedError if user not found in request', async () => {
      mockRequest.user = undefined;
      
      await notifikasiController.getUserNotifikasi(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });
  
  describe('getUnreadNotifikasiCount', () => {
    it('should return unread notifications count', async () => {
      (NotifikasiService.prototype.getUnreadNotifikasiCount as jest.Mock).mockResolvedValue(5);
      
      await notifikasiController.getUnreadNotifikasiCount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(NotifikasiService.prototype.getUnreadNotifikasiCount).toHaveBeenCalledWith('user-1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Jumlah notifikasi belum dibaca berhasil diambil',
        data: { count: 5 }
      });
    });
  });
  
  describe('createNotifikasi', () => {
    it('should create notification if user is admin', async () => {
      mockRequest.user = {
        id: 'admin-1',
        email: 'admin@example.com',
        role: ROLE.ADMIN
      };
      
      const notifikasiData = {
        pengguna_id: 'user-1',
        judul: 'New Notification',
        pesan: 'New message',
        jenis_notifikasi: Notif.PEMINJAMAN,
        tanggal: '2023-03-01',
        status_baca: 0
      };
      
      mockRequest.body = notifikasiData;
      
      (ValidationUtil.validateBody as jest.Mock).mockReturnValue(notifikasiData);
      
      const mockCreatedNotifikasi = {
        ...notifikasiData,
        id: 'notif-1'
      };
      
      (NotifikasiService.prototype.createNotifikasi as jest.Mock).mockResolvedValue(mockCreatedNotifikasi);
      
      await notifikasiController.createNotifikasi(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(ValidationUtil.validateBody).toHaveBeenCalled();
      expect(NotifikasiService.prototype.createNotifikasi).toHaveBeenCalledWith(notifikasiData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Notifikasi berhasil dibuat',
        data: mockCreatedNotifikasi
      });
    });
    
    it('should throw UnauthorizedError for non-admin users', async () => {
      await notifikasiController.createNotifikasi(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(NotifikasiService.prototype.createNotifikasi).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });
  
  describe('markAsRead', () => {
    it('should mark notification as read if user owns it', async () => {
      const mockNotifikasi = {
        id: '1',
        pengguna_id: 'user-1',
        judul: 'Test Notification',
        pesan: 'Test message',
        jenis_notifikasi: Notif.PEMINJAMAN,
        status_baca: 0
      };
      
      const mockUpdatedNotifikasi = {
        ...mockNotifikasi,
        status_baca: 1
      };
      
      (NotifikasiService.prototype.getNotifikasiById as jest.Mock).mockResolvedValue(mockNotifikasi);
      (NotifikasiService.prototype.markAsRead as jest.Mock).mockResolvedValue(mockUpdatedNotifikasi);
      
      await notifikasiController.markAsRead(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(NotifikasiService.prototype.getNotifikasiById).toHaveBeenCalledWith('1');
      expect(NotifikasiService.prototype.markAsRead).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Notifikasi berhasil ditandai telah dibaca',
        data: mockUpdatedNotifikasi
      });
    });
    
    it('should mark notification as read if user is admin', async () => {
      mockRequest.user = {
        id: 'admin-1',
        email: 'admin@example.com',
        role: ROLE.ADMIN
      };
      
      const mockNotifikasi = {
        id: '1',
        pengguna_id: 'user-1',
        judul: 'Test Notification',
        pesan: 'Test message',
        jenis_notifikasi: Notif.PEMINJAMAN,
        status_baca: 0
      };
      
      const mockUpdatedNotifikasi = {
        ...mockNotifikasi,
        status_baca: 1
      };
      
      (NotifikasiService.prototype.getNotifikasiById as jest.Mock).mockResolvedValue(mockNotifikasi);
      (NotifikasiService.prototype.markAsRead as jest.Mock).mockResolvedValue(mockUpdatedNotifikasi);
      
      await notifikasiController.markAsRead(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(NotifikasiService.prototype.markAsRead).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });
  
  describe('markAllAsRead', () => {
    it('should mark all user notifications as read', async () => {
      (NotifikasiService.prototype.markAllAsRead as jest.Mock).mockResolvedValue(3);
      
      await notifikasiController.markAllAsRead(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(NotifikasiService.prototype.markAllAsRead).toHaveBeenCalledWith('user-1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: '3 notifikasi berhasil ditandai telah dibaca',
        data: { count: 3 }
      });
    });
  });
  
  describe('deleteNotifikasi', () => {
    it('should delete notification if user owns it', async () => {
      const mockNotifikasi = {
        id: '1',
        pengguna_id: 'user-1',
        judul: 'Test Notification',
        pesan: 'Test message'
      };
      
      (NotifikasiService.prototype.getNotifikasiById as jest.Mock).mockResolvedValue(mockNotifikasi);
      (NotifikasiService.prototype.deleteNotifikasi as jest.Mock).mockResolvedValue(true);
      
      await notifikasiController.deleteNotifikasi(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(NotifikasiService.prototype.getNotifikasiById).toHaveBeenCalledWith('1');
      expect(NotifikasiService.prototype.deleteNotifikasi).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Notifikasi berhasil dihapus',
        data: null
      });
    });
    
    it('should delete notification if user is admin', async () => {
      mockRequest.user = {
        id: 'admin-1',
        email: 'admin@example.com',
        role: ROLE.ADMIN
      };
      
      const mockNotifikasi = {
        id: '1',
        pengguna_id: 'user-1',
        judul: 'Test Notification',
        pesan: 'Test message'
      };
      
      (NotifikasiService.prototype.getNotifikasiById as jest.Mock).mockResolvedValue(mockNotifikasi);
      (NotifikasiService.prototype.deleteNotifikasi as jest.Mock).mockResolvedValue(true);
      
      await notifikasiController.deleteNotifikasi(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(NotifikasiService.prototype.deleteNotifikasi).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
    
    it('should throw ForbiddenError if user does not own notification', async () => {
      const mockNotifikasi = {
        id: '1',
        pengguna_id: 'other-user',
        judul: 'Test Notification',
        pesan: 'Test message'
      };
      
      (NotifikasiService.prototype.getNotifikasiById as jest.Mock).mockResolvedValue(mockNotifikasi);
      
      await notifikasiController.deleteNotifikasi(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(NotifikasiService.prototype.getNotifikasiById).toHaveBeenCalledWith('1');
      
      await notifikasiController.deleteNotifikasi(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(NotifikasiService.prototype.deleteNotifikasi).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });
    
    it('should throw UnauthorizedError if user not found in request', async () => {
      mockRequest.user = undefined;
      
      await notifikasiController.deleteNotifikasi(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      
      expect(NotifikasiService.prototype.getNotifikasiById).not.toHaveBeenCalled();
      expect(NotifikasiService.prototype.deleteNotifikasi).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });
});