import { BaseAuthService } from './base-auth.service';
import { PenggunaRepository } from '../repositories/pengguna.repository';
import { PenggunaCreate, PenggunaLogin, Pengguna } from '../types/pengguna.types';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../configs/error';
import { logger } from '../configs/logger';

export class AuthService extends BaseAuthService {
  private penggunaRepository: PenggunaRepository;

  constructor() {
    super();
    this.penggunaRepository = new PenggunaRepository();
  }

  /**
   * Register new user
   */
  async register(penggunaData: PenggunaCreate): Promise<{ pengguna: Pengguna; token: string }> {
    try {
      // Check if email already exists
      const existingPengguna = await this.penggunaRepository.findByEmail(penggunaData.email);
      if (existingPengguna) {
        throw new BadRequestError('Email sudah terdaftar');
      }

      // Hash password
      const hashedPassword = await this.hashPassword(penggunaData.kata_sandi);

      // Create new user
      const newPengguna = await this.penggunaRepository.create({
        ...penggunaData,
        kata_sandi: hashedPassword,
      });

      // Create JWT token
      const tokenPayload = {
        id: newPengguna.id,
        email: newPengguna.email,
        role: newPengguna.role
      };
      const token = this.generateToken(tokenPayload);

      // Save token to database
      await this.saveToken(newPengguna.id, token);

      // Remove password from response
      const { kata_sandi, ...penggunaWithoutPassword } = newPengguna;

      return {
        pengguna: penggunaWithoutPassword as Pengguna,
        token,
      };
    } catch (error) {
      logger.error('Error during registration', { error });
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(loginData: PenggunaLogin): Promise<{ pengguna: Pengguna; token: string }> {
    try {
      // Find user by email
      const pengguna = await this.penggunaRepository.findByEmail(loginData.email);
      if (!pengguna) {
        throw new NotFoundError('Pengguna tidak ditemukan');
      }

      // Check password
      const isPasswordValid = await this.verifyPassword(loginData.kata_sandi, pengguna.kata_sandi);
      if (!isPasswordValid) {
        throw new UnauthorizedError('Kata sandi salah');
      }

      // Create JWT token
      const tokenPayload = {
        id: pengguna.id,
        email: pengguna.email,
        role: pengguna.role
      };
      const token = this.generateToken(tokenPayload);

      // Save token to database
      await this.saveToken(pengguna.id, token);

      // Remove password from response
      const { kata_sandi, ...penggunaWithoutPassword } = pengguna;

      return {
        pengguna: penggunaWithoutPassword as Pengguna,
        token,
      };
    } catch (error) {
      logger.error('Error during login', { error });
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(token: string): Promise<void> {
    try {
      await this.removeToken(token);
    } catch (error) {
      logger.error('Error during logout', { error });
      throw error;
    }
  }

  /**
   * Get user data from token
   */
  async getPenggunaFromToken(token: string): Promise<Pengguna> {
    try {
      const decoded = await this.verifyToken(token);
      
      // Get user data
      const pengguna = await this.penggunaRepository.findById(decoded.id);
      if (!pengguna) {
        throw new NotFoundError('Pengguna tidak ditemukan');
      }

      // Remove password from response
      const { kata_sandi, ...penggunaWithoutPassword } = pengguna;

      return penggunaWithoutPassword as Pengguna;
    } catch (error) {
      logger.error('Error getting user from token', { error });
      throw error;
    }
  }
}

export const authService = new AuthService();