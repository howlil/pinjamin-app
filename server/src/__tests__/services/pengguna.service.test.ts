import { PenggunaService } from '../../services/pengguna.service';
import { prisma } from '../../configs/db.config';
import { logger } from '../../configs/logger.config';
import { createMockUser } from '../../utils/test.utils';
import { UnauthorizedError, NotFoundError } from '../../configs/error.config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ROLE, TIPEUSER } from '@prisma/client';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(() => 'hashed_password'),
  compare: jest.fn(() => true),
}));

describe('PenggunaService', () => {
  let penggunaService: PenggunaService;
  const mockPrisma = prisma as any;

  beforeEach(() => {
    penggunaService = new PenggunaService();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const mockUser = createMockUser();
      const userData = {
        nama_lengkap: 'Test User',
        email: 'test@example.com',
        kata_sandi: 'password123',
        no_hp: '0812345678',
        tipe_peminjam: TIPEUSER.INUNAND,
        role: ROLE.PEMINJAM,
      };
      
      mockPrisma.pengguna.findUnique.mockResolvedValue(null);
      mockPrisma.pengguna.create.mockResolvedValue(mockUser);

      // Act
      const result = await penggunaService.register(userData);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.kata_sandi, expect.any(Number));
      expect(mockPrisma.pengguna.create).toHaveBeenCalledWith({
        data: {
          ...userData,
          kata_sandi: 'hashed_password',
        },
      });
      expect(result).toEqual({
        id: mockUser.id,
        nama_lengkap: mockUser.nama_lengkap,
        email: mockUser.email,
        no_hp: mockUser.no_hp,
        tipe_peminjam: mockUser.tipe_peminjam,
        role: mockUser.role,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
      expect(logger.info).toHaveBeenCalled();
    });

    it('should throw error if email already exists', async () => {
      // Arrange
      const existingUser = createMockUser();
      const userData = {
        nama_lengkap: 'Test User',
        email: 'test@example.com',
        kata_sandi: 'password123',
        no_hp: '0812345678',
        tipe_peminjam: TIPEUSER.INUNAND,
        role: ROLE.PEMINJAM,
      };
      
      mockPrisma.pengguna.findUnique.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(penggunaService.register(userData)).rejects.toThrow('Email sudah digunakan');
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      // Arrange
      const mockUser = createMockUser();
      const loginData = {
        email: 'test@example.com',
        kata_sandi: 'password123',
      };
      
      mockPrisma.pengguna.findUnique.mockResolvedValue(mockUser);
      mockPrisma.token.create.mockResolvedValue({ id: 'token-id', pengguna_id: mockUser.id, token: 'mock-token', createdAt: new Date(), updatedAt: new Date() });

      // Act
      const result = await penggunaService.login(loginData);

      // Assert
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.kata_sandi, mockUser.kata_sandi);
      expect(jwt.sign).toHaveBeenCalled();
      expect(mockPrisma.token.create).toHaveBeenCalled();
      expect(result).toHaveProperty('pengguna');
      expect(result).toHaveProperty('token', 'mock-token');
      expect(logger.info).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      // Arrange
      const loginData = {
        email: 'nonexistent@example.com',
        kata_sandi: 'password123',
      };
      
      mockPrisma.pengguna.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(penggunaService.login(loginData)).rejects.toThrow(UnauthorizedError);
      expect(logger.error).toHaveBeenCalled();
    });

    it('should throw error if password is incorrect', async () => {
      // Arrange
      const mockUser = createMockUser();
      const loginData = {
        email: 'test@example.com',
        kata_sandi: 'wrong_password',
      };
      
      mockPrisma.pengguna.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(penggunaService.login(loginData)).rejects.toThrow(UnauthorizedError);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      // Arrange
      const mockUser = createMockUser();
      mockPrisma.pengguna.findUnique.mockResolvedValue(mockUser);

      // Act
      const result = await penggunaService.getProfile(mockUser.id);

      // Assert
      expect(mockPrisma.pengguna.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id }
      });
      expect(result).toEqual({
        id: mockUser.id,
        nama_lengkap: mockUser.nama_lengkap,
        email: mockUser.email,
        no_hp: mockUser.no_hp,
        tipe_peminjam: mockUser.tipe_peminjam,
        role: mockUser.role,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
      expect(logger.info).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      // Arrange
      mockPrisma.pengguna.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(penggunaService.getProfile('nonexistent-id')).rejects.toThrow(NotFoundError);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      // Arrange
      const mockUser = createMockUser();
      const updatedMockUser = {
        ...mockUser,
        nama_lengkap: 'Updated Name',
        no_hp: '087654321',
      };
      const updateData = {
        nama_lengkap: 'Updated Name',
        no_hp: '087654321',
      };
      
      mockPrisma.pengguna.findUnique.mockResolvedValue(mockUser);
      mockPrisma.pengguna.update.mockResolvedValue(updatedMockUser);

      // Act
      const result = await penggunaService.updateProfile(mockUser.id, updateData);

      // Assert
      expect(mockPrisma.pengguna.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: updateData,
      });
      expect(result).toEqual({
        id: updatedMockUser.id,
        nama_lengkap: updatedMockUser.nama_lengkap,
        email: updatedMockUser.email,
        no_hp: updatedMockUser.no_hp,
        tipe_peminjam: updatedMockUser.tipe_peminjam,
        role: updatedMockUser.role,
        createdAt: updatedMockUser.createdAt,
        updatedAt: updatedMockUser.updatedAt,
      });
      expect(logger.info).toHaveBeenCalled();
    });

    it('should hash password if provided in update data', async () => {
      // Arrange
      const mockUser = createMockUser();
      const updatedMockUser = {
        ...mockUser,
        kata_sandi: 'new_hashed_password',
      };
      const updateData = {
        kata_sandi: 'new_password',
      };
      
      mockPrisma.pengguna.findUnique.mockResolvedValue(mockUser);
      mockPrisma.pengguna.update.mockResolvedValue(updatedMockUser);

      // Act
      await penggunaService.updateProfile(mockUser.id, updateData);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(updateData.kata_sandi, expect.any(Number));
      expect(mockPrisma.pengguna.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { kata_sandi: 'hashed_password' },
      });
      expect(logger.info).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      // Arrange
      mockPrisma.pengguna.findUnique.mockResolvedValue(null);
      const updateData = {
        nama_lengkap: 'Updated Name',
      };

      // Act & Assert
      await expect(penggunaService.updateProfile('nonexistent-id', updateData)).rejects.toThrow(NotFoundError);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      // Arrange
      mockPrisma.token.deleteMany.mockResolvedValue({ count: 1 });

      // Act
      const result = await penggunaService.logout('mock-token');

      // Assert
      expect(mockPrisma.token.deleteMany).toHaveBeenCalledWith({
        where: { token: 'mock-token' },
      });
      expect(result).toBe(true);
      expect(logger.info).toHaveBeenCalled();
    });
  });
});