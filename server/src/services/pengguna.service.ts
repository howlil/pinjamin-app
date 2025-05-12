// server/src/services/pengguna.service.ts
import { APP_CONFIG } from "../configs/app.config";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
} from "../configs/error.config";
import {
  Pengguna,
  PenggunaCreate,
  PenggunaLogin,
  PenggunaUpdate,
} from "../interfaces/types/pengguna.types";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ROLE, TIPEUSER } from "@prisma/client";
import { BaseService } from "./base.service";

export class PenggunaService extends BaseService {
  constructor() {
    super('PenggunaService');
  }

  async register(
    penggunaData: PenggunaCreate
  ): Promise<Omit<Pengguna, "kata_sandi">> {
    try {
      this.logInfo('Registering new user', { email: penggunaData.email });
      
      const existingUser = await this.prisma.pengguna.findUnique({
        where: { email: penggunaData.email },
      });

      if (existingUser) {
        throw new ConflictError("Email sudah terdaftar");
      }

      const role = ROLE.PEMINJAM;
      const userData = {
        ...penggunaData,
        role,
      };

      if (userData.tipe_peminjam === TIPEUSER.INUNAND) {
        if (!userData.email.endsWith("@unand.ac.id")) {
          throw new BadRequestError(
            "Email internal harus menggunakan domain @unand.ac.id"
          );
        }
      }

      const hashedPassword = await bcrypt.hash(
        userData.kata_sandi,
        APP_CONFIG.BCRYPT_SALT_ROUNDS
      );

      const pengguna = await this.prisma.pengguna.create({
        data: {
          ...userData,
          kata_sandi: hashedPassword,
        },
      });

      const { kata_sandi, ...penggunaWithoutPassword } = pengguna;

      this.logInfo(`User registered successfully: ${pengguna.email}`);
      return penggunaWithoutPassword;
    } catch (error) {
      this.handleError(error, 'register');
      throw error;
    }
  }

  async login(
    loginData: PenggunaLogin
  ): Promise<{ pengguna: Omit<Pengguna, "kata_sandi">; token: string }> {
    try {
      this.logInfo('User login attempt', { email: loginData.email });
      
      const pengguna = await this.prisma.pengguna.findUnique({
        where: { email: loginData.email },
      });

      if (!pengguna) {
        throw new UnauthorizedError("Email atau kata sandi tidak valid");
      }

      const isPasswordValid = await bcrypt.compare(
        loginData.kata_sandi,
        pengguna.kata_sandi
      );

      if (!isPasswordValid) {
        throw new UnauthorizedError("Email atau kata sandi tidak valid");
      }

      const tokenPayload = {
        id: pengguna.id,
        email: pengguna.email,
        role: pengguna.role,
      };

      const token = jwt.sign(tokenPayload, APP_CONFIG.JWT_SECRET, {
        expiresIn: APP_CONFIG.JWT_EXPIRES_IN,
      });

      await this.prisma.token.create({
        data: {
          pengguna_id: pengguna.id,
          token,
        },
      });

      const { kata_sandi, ...newPengguna } = pengguna;

      this.logInfo(`User logged in successfully: ${pengguna.email}`);
      return {
        pengguna: newPengguna,
        token,
      };
    } catch (error) {
      this.handleError(error, 'login');
      throw error;
    }
  }

  async getProfile(userId: string): Promise<Omit<Pengguna, "kata_sandi">> {
    try {
      this.logInfo('Fetching user profile', { userId });
      
      const pengguna = await this.prisma.pengguna.findUnique({
        where: { id: userId },
        select: {
          id: true,
          nama_lengkap: true,
          email: true,
          no_hp: true,
          tipe_peminjam: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!pengguna) {
        throw new NotFoundError("Pengguna tidak ditemukan");
      }

      return pengguna as Omit<Pengguna, "kata_sandi">;
    } catch (error) {
      this.handleError(error, 'getProfile');
      throw error;
    }
  }

  async updateProfile(
    userId: string,
    userData: PenggunaUpdate
  ): Promise<Omit<Pengguna, "kata_sandi">> {
    try {
      this.logInfo('Updating user profile', { userId });
      
      const existingUser = await this.prisma.pengguna.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        throw new NotFoundError("Pengguna tidak ditemukan");
      }

      if (userData.email && userData.email !== existingUser.email) {
        const emailExists = await this.prisma.pengguna.findUnique({
          where: { email: userData.email },
        });

        if (emailExists) {
          throw new ConflictError("Email sudah terdaftar");
        }

        if (
          (userData.tipe_peminjam === TIPEUSER.INUNAND ||
            (!userData.tipe_peminjam &&
              existingUser.tipe_peminjam === TIPEUSER.INUNAND)) &&
          !userData.email.endsWith("@unand.ac.id")
        ) {
          throw new BadRequestError(
            "Email internal harus menggunakan domain @unand.ac.id"
          );
        }
      }

      let updatedData: any = { ...userData };
      if (userData.kata_sandi) {
        updatedData.kata_sandi = await bcrypt.hash(
          userData.kata_sandi,
          APP_CONFIG.BCRYPT_SALT_ROUNDS
        );
      }

      const updatedPengguna = await this.prisma.pengguna.update({
        where: { id: userId },
        data: updatedData,
        select: {
          id: true,
          nama_lengkap: true,
          email: true,
          no_hp: true,
          tipe_peminjam: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      this.logInfo(`User profile updated: ${updatedPengguna.email}`);
      return updatedPengguna as Omit<Pengguna, "kata_sandi">;
    } catch (error) {
      this.handleError(error, 'updateProfile');
      throw error;
    }
  }

  async logout(token: string): Promise<boolean> {
    try {
      this.logInfo('User logout', { token: token.substring(0, 10) + '...' });
      
      await this.prisma.token.deleteMany({
        where: { token },
      });

      this.logInfo("User logged out successfully");
      return true;
    } catch (error) {
      this.handleError(error, 'logout');
      throw new BadRequestError("Gagal logout");
    }
  }
}

export default new PenggunaService();