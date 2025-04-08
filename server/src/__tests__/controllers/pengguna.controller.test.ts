import { PenggunaController } from '../../controllers/pengguna.controller';
import { PenggunaService } from '../../services/pengguna.service';
import { ValidationUtil } from '../../utils/validation.util';
import { UnauthorizedError } from '../../configs/error.config';
import { createMockUser } from '../../utils/test.utils';
import { mockRequest, mockResponse, mockNext } from '../../utils/test.utils';

// Mock PenggunaService
jest.mock('../../services/pengguna.service');

// Mock ValidationUtil
jest.mock('../../utils/validation.util', () => ({
  ValidationUtil: {
    validateBody: jest.fn(),
  },
}));

describe('PenggunaController', () => {
  let penggunaController: PenggunaController;
  let mockPenggunaService: jest.Mocked<PenggunaService>;

  beforeEach(() => {
    mockPenggunaService = new PenggunaService() as jest.Mocked<PenggunaService>;
    penggunaController = new PenggunaController();
    (penggunaController as any).penggunaService = mockPenggunaService;
  });

  describe('create', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const validatedData = {
        nama_lengkap: 'Test User',
        email: 'test@example.com',
        kata_sandi: 'password123',
        no_hp: '0812345678',
        tipe_peminjam: 'INUNAND',
        role: 'PEMINJAM',
      };
      
      const mockUser = createMockUser();
      const { kata_sandi, ...userWithoutPassword } = mockUser;
      
      (ValidationUtil.validateBody as jest.Mock).mockReturnValue(validatedData);
      mockPenggunaService.register.mockResolvedValue(userWithoutPassword);
      
      const req = mockRequest();
      const res = mockResponse();

      // Act
      await penggunaController.create(req, res, mockNext);

      // Assert
      expect(ValidationUtil.validateBody).toHaveBeenCalled();
      expect(mockPenggunaService.register).toHaveBeenCalledWith(validatedData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Pengguna berhasil terdaftar',
        data: userWithoutPassword,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should pass error to next middleware if registration fails', async () => {
      // Arrange
      const error = new Error('Registration failed');
      (ValidationUtil.validateBody as jest.Mock).mockImplementation(() => {
        throw error;
      });
      
      const req = mockRequest();
      const res = mockResponse();

      // Act
      await penggunaController.create(req, res, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update user profile successfully', async () => {
      // Arrange
      const validatedData = {
        nama_lengkap: 'Updated Name',
        no_hp: '087654321',
      };
      
      const mockUser = createMockUser();
      const { kata_sandi, ...userWithoutPassword } = mockUser;
      const updatedUser = { ...userWithoutPassword, nama_lengkap: 'Updated Name', no_hp: '087654321' };
      
      (ValidationUtil.validateBody as jest.Mock).mockReturnValue(validatedData);
      mockPenggunaService.updateProfile.mockResolvedValue(updatedUser);
      
      const req = mockRequest();
      const res = mockResponse();

      // Act
      await penggunaController.update(req, res, mockNext);

      // Assert
      expect(ValidationUtil.validateBody).toHaveBeenCalled();
      expect(mockPenggunaService.updateProfile).toHaveBeenCalledWith(req.user.id, validatedData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Profil berhasil diperbarui',
        data: updatedUser,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw error if user is not found in request', async () => {
      // Arrange
      const req = mockRequest({ user: null });
      const res = mockResponse();

      // Act
      await penggunaController.update(req, res, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('show', () => {
    it('should get user profile successfully', async () => {
      // Arrange
      const mockUser = createMockUser();
      const { kata_sandi, ...userWithoutPassword } = mockUser;
      
      mockPenggunaService.getProfile.mockResolvedValue(userWithoutPassword);
      
      const req = mockRequest();
      const res = mockResponse();

      // Act
      await penggunaController.show(req, res, mockNext);

      // Assert
      expect(mockPenggunaService.getProfile).toHaveBeenCalledWith(req.user.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Profil berhasil diambil',
        data: userWithoutPassword,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw error if user is not found in request', async () => {
      // Arrange
      const req = mockRequest({ user: null });
      const res = mockResponse();

      // Act
      await penggunaController.show(req, res, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      // Arrange
      const validatedData = {
        email: 'test@example.com',
        kata_sandi: 'password123',
      };
      
      const mockUser = createMockUser();
      const { kata_sandi, ...userWithoutPassword } = mockUser;
      const loginResult = {
        pengguna: userWithoutPassword,
        token: 'mock-token',
      };
      
      (ValidationUtil.validateBody as jest.Mock).mockReturnValue(validatedData);
      mockPenggunaService.login.mockResolvedValue(loginResult);
      
      const req = mockRequest();
      const res = mockResponse();

      // Act
      await penggunaController.login(req, res, mockNext);

      // Assert
      expect(ValidationUtil.validateBody).toHaveBeenCalled();
      expect(mockPenggunaService.login).toHaveBeenCalledWith(validatedData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Login berhasil',
        data: loginResult,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should pass error to next middleware if login fails', async () => {
      // Arrange
      const error = new Error('Login failed');
      (ValidationUtil.validateBody as jest.Mock).mockImplementation(() => {
        throw error;
      });
      
      const req = mockRequest();
      const res = mockResponse();

      // Act
      await penggunaController.login(req, res, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      // Arrange
      mockPenggunaService.logout.mockResolvedValue(true);
      
      const req = mockRequest();
      const res = mockResponse();

      // Act
      await penggunaController.logout(req, res, mockNext);

      // Assert
      expect(mockPenggunaService.logout).toHaveBeenCalledWith('mock-token');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logout berhasil',
        data: null,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw error if user is not found in request', async () => {
      // Arrange
      const req = mockRequest({ user: null });
      const res = mockResponse();

      // Act
      await penggunaController.logout(req, res, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should throw error if token is not found in request', async () => {
      // Arrange
      const req = mockRequest({ headers: { authorization: null } });
      const res = mockResponse();

      // Act
      await penggunaController.logout(req, res, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});