import { Request, Response } from 'express';
import { PenggunaController } from '../../controllers/pengguna.controller';
import { PenggunaService } from '../../services/pengguna.service';
import { ROLE, TIPEUSER } from '@prisma/client';
import { ValidationUtil } from '../../utils/validation.util';
import { TestLogger } from '../../utils/test-logger.util';

jest.mock('../../services/pengguna.service');
jest.mock('../../utils/validation.util');

describe('PenggunaController', () => {
  let penggunaController: PenggunaController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;
  
  beforeEach(() => {
    jest.clearAllMocks();
    penggunaController = new PenggunaController();
    mockRequest = {
      body: {},
      user: { id: 'user-123', email: 'test@example.com', role: ROLE.PEMINJAM },
      headers: { authorization: 'Bearer test.jwt.token' }
    };
    mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    mockNext = jest.fn();
  });

  describe('register', () => {
    const registerData = { nama_lengkap: 'Test User', email: 'test@example.com', kata_sandi: 'password123', no_hp: '08123456789', tipe_peminjam: TIPEUSER.EXUNAND, role: ROLE.PEMINJAM };
    
    it('should register a new user successfully', async () => {
      try {
        mockRequest.body = registerData;
        (ValidationUtil.validateBody as jest.Mock).mockReturnValue(registerData);
        (PenggunaService.prototype.register as jest.Mock).mockResolvedValue({ id: 'user-123', ...registerData, createdAt: new Date(), updatedAt: new Date() });
        
        await penggunaController.register(mockRequest as Request, mockResponse as Response, mockNext);
        
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({ success: true, message: 'Pengguna berhasil terdaftar', data: expect.objectContaining({ id: 'user-123' }) });
        expect(mockNext).not.toHaveBeenCalled();
        TestLogger.log("✅ Register success", registerData);
      } catch (error) {
        TestLogger.log("❌ Register failed", error);
        throw error;
      }
    });
  });

  describe('login', () => {
    const loginData = { email: 'test@example.com', kata_sandi: 'password123' };
    
    it('should login successfully', async () => {
      try {
        mockRequest.body = loginData;
        (ValidationUtil.validateBody as jest.Mock).mockReturnValue(loginData);
        (PenggunaService.prototype.login as jest.Mock).mockResolvedValue({ pengguna: { id: 'user-123', nama_lengkap: 'Test User', email: loginData.email }, token: 'test.jwt.token' });
        
        await penggunaController.login(mockRequest as Request, mockResponse as Response, mockNext);
        
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ success: true, message: 'Login berhasil', data: expect.objectContaining({ token: 'test.jwt.token' }) });
        expect(mockNext).not.toHaveBeenCalled();
        TestLogger.log("✅ Login success", loginData);
      } catch (error) {
        TestLogger.log("❌ Login failed", error);
        throw error;
      }
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      try {
        (PenggunaService.prototype.logout as jest.Mock).mockResolvedValue(true);
        
        await penggunaController.logout(mockRequest as Request, mockResponse as Response, mockNext);
        
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ success: true, message: 'Logout berhasil', data: null });
        expect(mockNext).not.toHaveBeenCalled();
        TestLogger.log("✅ Logout success");
      } catch (error) {
        TestLogger.log("❌ Logout failed", error);
        throw error;
      }
    });
  });
});
