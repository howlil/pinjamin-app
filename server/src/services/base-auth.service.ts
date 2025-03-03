import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { APP_CONFIG } from '../configs/app';
import { UnauthorizedError  } from '../configs/error';
import { TokenRepository } from '../repositories/token.repository';
import { logger } from '../configs/logger';

export abstract class BaseAuthService {
  protected tokenRepository: TokenRepository;

  constructor() {
    this.tokenRepository = new TokenRepository();
  }

  /**
   * Generate JWT token
   */
  protected generateToken(payload: any): string {
    return jwt.sign(
      payload,
      APP_CONFIG.JWT_SECRET,
      { expiresIn: APP_CONFIG.JWT_EXPIRES_IN }
    );
  }

  /**
   * Verify password
   */
  protected async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Hash password
   */
  protected async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  /**
   * Verify token
   */
  async verifyToken(token: string): Promise<any> {
    try {
      // Verify JWT token
      const decoded = jwt.verify(token, APP_CONFIG.JWT_SECRET) as { id: string };

      // Check if token exists in database
      const tokenData = await this.tokenRepository.findByToken(token);
      if (!tokenData) {
        throw new UnauthorizedError('Token tidak valid');
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Token tidak valid');
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Token sudah kadaluarsa');
      }

      logger.error('Error during token verification', { error });
      throw error;
    }
  }

  /**
   * Save token to database
   */
  protected async saveToken(pengguna_id: string, token: string): Promise<void> {
    await this.tokenRepository.create({
      pengguna_id,
      token,
    });
  }

  /**
   * Remove token from database
   */
  async removeToken(token: string): Promise<void> {
    const tokenData = await this.tokenRepository.findByToken(token);
    if (tokenData) {
      await this.tokenRepository.delete(tokenData.id);
    }
  }

  /**
   * Remove all tokens for a user
   */
  async removeAllTokensForUser(pengguna_id: string): Promise<void> {
    await this.tokenRepository.deleteByUserId(pengguna_id);
  }
}