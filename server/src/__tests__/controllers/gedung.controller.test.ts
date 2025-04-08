import { GedungController } from '../../controllers/gedung.controller';
import { GedungService } from '../../services/gedung.service';
import { ValidationUtil } from '../../utils/validation.util';
import { UnauthorizedError } from '../../configs/error.config';
import { createMockGedung } from '../../utils/test.utils';
import { mockRequest, mockResponse, mockNext } from '../../utils/test.utils';
import { ROLE } from '@prisma/client';

// Mock GedungService
jest.mock('../../services/gedung.service');

// Mock ValidationUtil
jest.mock('../../utils/validation.util', () => ({
  ValidationUtil: {
    validateBody: jest.fn(),
    validateQuery: jest.fn(),
  },
}));

describe('GedungController', () => {
  let gedungController: GedungController;
  let mockGedungService: jest.Mocked<GedungService>;

  beforeEach(() => {
    mockGedungService = new GedungService() as jest.Mocked<GedungService>;
    gedungController = new GedungController();
    (gedungController as any).gedungService = mockGedungService;
  });

  describe('index', () => {
    it('should get all gedung without filter', async () => {
      // Arrange
      const mockGedungs = [createMockGedung(), createMockGedung({ id: 'gedung-id-2' })];
      mockGedungService.getAllGedung.mockResolvedValue(mockGedungs);
      
      const req = mockRequest({ query: {} });
      const res = mockResponse();

      // Act
      await gedungController.index(req, res, mockNext);

      // Assert
      expect(mockGedungService.getAllGedung).toHaveBeenCalledWith(undefined);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Daftar gedung berhasil diambil',
        data: mockGedungs,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should get all gedung with filter', async () => {
      // Arrange
      const filter = {
        nama_gedung: 'Test',
        lokasi: 'Padang',
      };
      
      const mockGedungs = [createMockGedung()];
      
      (ValidationUtil.validateQuery as jest.Mock).mockReturnValue(filter);
      mockGedungService.getAllGedung.mockResolvedValue(mockGedungs);
      
      const req = mockRequest({ query: filter });
      const res = mockResponse();

      // Act
      await gedungController.index(req, res, mockNext);

      // Assert
      expect(ValidationUtil.validateQuery).toHaveBeenCalled();
      expect(mockGedungService.getAllGedung).toHaveBeenCalledWith(filter);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Daftar gedung berhasil diambil',
        data: mockGedungs,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should pass error to next middleware if getting gedung fails', async () => {
      // Arrange
      const error = new Error('Get gedung failed');
      mockGedungService.getAllGedung.mockRejectedValue(error);
      
      const req = mockRequest();
      const res = mockResponse();

      // Act
      await gedungController.index(req, res, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new gedung successfully as admin', async () => {
      // Arrange
      const validatedData = {
        nama_gedung: 'Gedung Test',
        deskripsi: 'Deskripsi gedung test',
        harga_sewa: 1000000,
        kapasitas: 100,
        lokasi: 'Padang',
        tipe_gedung_id: 'tipe-gedung-id',
      };
      
      const mockGedung = createMockGedung();
      
      (ValidationUtil.validateBody as jest.Mock).mockReturnValue(validatedData);
      mockGedungService.createGedung.mockResolvedValue(mockGedung);
      
      const req = mockRequest({ user: { id: 'admin-id', email: 'admin@example.com', role: ROLE.ADMIN } });
      const res = mockResponse();

      // Act
      await gedungController.create(req, res, mockNext);

      // Assert
      expect(ValidationUtil.validateBody).toHaveBeenCalled();
      expect(mockGedungService.createGedung).toHaveBeenCalledWith(validatedData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Gedung berhasil ditambahkan',
        data: mockGedung,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw error if user is not admin', async () => {
      // Arrange
      const req = mockRequest();
      const res = mockResponse();

      // Act
      await gedungController.create(req, res, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(mockGedungService.createGedung).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update gedung successfully as admin', async () => {
      // Arrange
      const gedungId = 'gedung-id';
      const validatedData = {
        nama_gedung: 'Updated Gedung',
        harga_sewa: 1500000,
      };
      
      const mockGedung = createMockGedung();
      const updatedGedung = { ...mockGedung, ...validatedData };
      
      (ValidationUtil.validateBody as jest.Mock).mockReturnValue(validatedData);
      mockGedungService.updateGedung.mockResolvedValue(updatedGedung);
      
      const req = mockRequest({
        user: { id: 'admin-id', email: 'admin@example.com', role: ROLE.ADMIN },
        params: { id: gedungId }
      });
      const res = mockResponse();

      // Act
      await gedungController.update(req, res, mockNext);

      // Assert
      expect(ValidationUtil.validateBody).toHaveBeenCalled();
      expect(mockGedungService.updateGedung).toHaveBeenCalledWith(gedungId, validatedData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Gedung berhasil diperbarui',
        data: updatedGedung,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw error if user is not admin', async () => {
      // Arrange
      const req = mockRequest({
        params: { id: 'gedung-id' }
      });
      const res = mockResponse();

      // Act
      await gedungController.update(req, res, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(mockGedungService.updateGedung).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete gedung successfully as admin', async () => {
      // Arrange
      const gedungId = 'gedung-id';
      mockGedungService.deleteGedung.mockResolvedValue(true);
      
      const req = mockRequest({
        user: { id: 'admin-id', email: 'admin@example.com', role: ROLE.ADMIN },
        params: { id: gedungId }
      });
      const res = mockResponse();

      // Act
      await gedungController.delete(req, res, mockNext);

      // Assert
      expect(mockGedungService.deleteGedung).toHaveBeenCalledWith(gedungId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Gedung berhasil dihapus',
        data: null,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw error if user is not admin', async () => {
      // Arrange
      const req = mockRequest({
        params: { id: 'gedung-id' }
      });
      const res = mockResponse();

      // Act
      await gedungController.delete(req, res, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(mockGedungService.deleteGedung).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('show', () => {
    it('should get gedung by id successfully', async () => {
      // Arrange
      const gedungId = 'gedung-id';
      const mockGedung = createMockGedung({ id: gedungId });
      
      mockGedungService.getGedungById.mockResolvedValue(mockGedung);
      
      const req = mockRequest({
        params: { id: gedungId }
      });
      const res = mockResponse();

      // Act
      await gedungController.show(req, res, mockNext);

      // Assert
      expect(mockGedungService.getGedungById).toHaveBeenCalledWith(gedungId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Gedung berhasil diambil',
        data: mockGedung,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should pass error to next middleware if getting gedung fails', async () => {
      // Arrange
      const error = new Error('Get gedung failed');
      mockGedungService.getGedungById.mockRejectedValue(error);
      
      const req = mockRequest({
        params: { id: 'gedung-id' }
      });
      const res = mockResponse();

      // Act
      await gedungController.show(req, res, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('checkGedungAvailability', () => {
    it('should check gedung availability successfully', async () => {
      // Arrange
      const query = {
        gedungId: 'gedung-id',
        tanggalMulai: '2025-01-01',
        tanggalSelesai: '2025-01-03',
      };
      
      mockGedungService.checkGedungAvailability.mockResolvedValue(true);
      
      const req = mockRequest({ query });
      const res = mockResponse();

      // Act
      await gedungController.checkGedungAvailability(req, res, mockNext);

      // Assert
      expect(mockGedungService.checkGedungAvailability).toHaveBeenCalledWith(
        query.gedungId,
        query.tanggalMulai,
        query.tanggalSelesai
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Gedung tersedia pada tanggal yang ditentukan',
        data: { isAvailable: true },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return not available message when gedung is not available', async () => {
      // Arrange
      const query = {
        gedungId: 'gedung-id',
        tanggalMulai: '2025-01-01',
        tanggalSelesai: '2025-01-03',
      };
      
      mockGedungService.checkGedungAvailability.mockResolvedValue(false);
      
      const req = mockRequest({ query });
      const res = mockResponse();

      // Act
      await gedungController.checkGedungAvailability(req, res, mockNext);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Gedung tidak tersedia pada tanggal yang ditentukan',
        data: { isAvailable: false },
      });
    });

    it('should return error for missing parameters', async () => {
      // Arrange
      const req = mockRequest({ query: {} });
      const res = mockResponse();

      // Act
      await gedungController.checkGedungAvailability(req, res, mockNext);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Parameter gedungId, tanggalMulai, dan tanggalSelesai diperlukan',
        data: null,
      });
      expect(mockGedungService.checkGedungAvailability).not.toHaveBeenCalled();
    });
  });
});