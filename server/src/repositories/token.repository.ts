import { prisma } from '../configs/db';
import { Token } from '../types';
import { BaseRepository } from './base.repository';
import { logger } from '../configs/logger';

interface TokenCreate {
  pengguna_id: string;
  token: string;
}

interface TokenUpdate {
  token?: string;
}

export class TokenRepository extends BaseRepository<Token, TokenCreate, TokenUpdate> {
  constructor() {
    super(prisma.token);
  }

  /**
   * Find token by token value
   */
  async findByToken(token: string): Promise<Token | null> {
    try {
      return await prisma.token.findFirst({
        where: { token },
      });
    } catch (error) {
      logger.error(`Failed to find token: ${token}`, { error });
      throw new Error(`Gagal mendapatkan token: ${error}`);
    }
  }

  /**
   * Find tokens by user ID
   */
  async findByUserId(pengguna_id: string): Promise<Token[]> {
    try {
      return await prisma.token.findMany({
        where: { pengguna_id },
      });
    } catch (error) {
      logger.error(`Failed to find tokens for user: ${pengguna_id}`, { error });
      throw new Error(`Gagal mendapatkan token pengguna: ${error}`);
    }
  }

  /**
   * Delete tokens by user ID
   */
  async deleteByUserId(pengguna_id: string): Promise<number> {
    try {
      const result = await prisma.token.deleteMany({
        where: { pengguna_id },
      });
      return result.count;
    } catch (error) {
      logger.error(`Failed to delete tokens for user: ${pengguna_id}`, { error });
      throw new Error(`Gagal menghapus token pengguna: ${error}`);
    }
  }
}