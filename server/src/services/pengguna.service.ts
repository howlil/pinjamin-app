import { prisma } from "../configs/db.config";
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
import { logger } from "../configs/logger.config";

export class PenggunaService {
  async register(
    penggunaData: PenggunaCreate
  ): Promise<Omit<Pengguna, "kata_sandi">> {
    const existingUser = await prisma.pengguna.findUnique({
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

    const pengguna = await prisma.pengguna.create({
      data: {
        ...userData,
        kata_sandi: hashedPassword,
      },
    });

    const { kata_sandi, ...penggunaWithoutPassword } = pengguna;

    logger.info(`Pengguna baru terdaftar: ${pengguna.email}`);

    return penggunaWithoutPassword;
  }

  async login(
    loginData: PenggunaLogin
  ): Promise<{ pengguna: Omit<Pengguna, "kata_sandi">; token: string }> {
    const pengguna = await prisma.pengguna.findUnique({
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

    await prisma.token.create({
      data: {
        pengguna_id: pengguna.id,
        token,
      },
    });

    const { kata_sandi, ...newPengguna } = pengguna;

    logger.info(`Pengguna berhasil login: ${pengguna.email}`);

    return {
      pengguna: newPengguna,
      token,
    };
  }

  async getProfile(userId: string): Promise<Omit<Pengguna, "kata_sandi">> {
    const pengguna = await prisma.pengguna.findUnique({
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
  }

  async updateProfile(
    userId: string,
    userData: PenggunaUpdate
  ): Promise<Omit<Pengguna, "kata_sandi">> {
    const existingUser = await prisma.pengguna.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundError("Pengguna tidak ditemukan");
    }

    // Jika ada perubahan email, cek apakah email sudah terdaftar
    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = await prisma.pengguna.findUnique({
        where: { email: userData.email },
      });

      if (emailExists) {
        throw new ConflictError("Email sudah terdaftar");
      }

      // Validasi email untuk INUNAND
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

    // Update profil
    const updatedPengguna = await prisma.pengguna.update({
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

    logger.info(`Profil pengguna diperbarui: ${updatedPengguna.email}`);

    return updatedPengguna as Omit<Pengguna, "kata_sandi">;
  }

  async logout(token: string): Promise<boolean> {
    try {
      // Hapus token dari database
      await prisma.token.deleteMany({
        where: { token },
      });

      logger.info("Pengguna berhasil logout");
      return true;
    } catch (error) {
      throw new BadRequestError("Gagal logout");
    }
  }
}
