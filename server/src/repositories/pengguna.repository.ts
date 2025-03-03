import { prisma } from "../configs/db";
import { Pengguna, PenggunaCreate, PenggunaUpdate } from "../types";
import { BaseRepository } from "./base.repository";
import { logger } from "../configs/logger";
import { ROLE } from "@prisma/client";

export class PenggunaRepository extends BaseRepository<
  Pengguna,
  PenggunaCreate,
  PenggunaUpdate
> {
  constructor() {
    super(prisma.pengguna);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<Pengguna | null> {
    try {
      return await prisma.pengguna.findUnique({
        where: { email },
      });
    } catch (error) {
      logger.error(`Failed to find user by email: ${email}`, { error });
      throw new Error(`Gagal mendapatkan pengguna berdasarkan email: ${error}`);
    }
  }

  /**
   * Find users by role
   */
  async findByRole(role: ROLE): Promise<Pengguna[]> {
    try {
      return await prisma.pengguna.findMany({
        where: { role },
      });
    } catch (error) {
      logger.error(`Failed to find users by role: ${role}`, { error });
      throw new Error(`Gagal mendapatkan pengguna berdasarkan role: ${error}`);
    }
  }

  /**
   * Find users with pagination
   */
  async findWithPagination(
    page: number = 1,
    limit: number = 10,
    filter: any = {}
  ): Promise<{ data: Pengguna[]; total: number; page: number; limit: number }> {
    try {
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        prisma.pengguna.findMany({
          where: filter,
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.pengguna.count({
          where: filter,
        }),
      ]);

      return {
        data,
        total,
        page,
        limit,
      };
    } catch (error) {
      logger.error("Failed to find users with pagination", {
        error,
        page,
        limit,
        filter,
      });
      throw new Error(`Gagal mendapatkan pengguna dengan pagination: ${error}`);
    }
  }
}
