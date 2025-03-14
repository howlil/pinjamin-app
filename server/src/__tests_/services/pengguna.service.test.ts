import { PenggunaService } from "../../services/pengguna.service";
import { prisma } from "../../configs/db.config";
import { ROLE, TIPEUSER } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { APP_CONFIG } from "../../configs/app.config";
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} from "../../configs/error.config";
import { TestLogger } from "../../utils/test-logger.util";

// Mock dependencies
jest.mock("../../configs/db.config", () => ({
  prisma: {
    pengguna: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    token: {
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

jest.mock("../../configs/logger.config", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe("PenggunaService", () => {
  let penggunaService: PenggunaService;

  beforeEach(() => {
    penggunaService = new PenggunaService();
    jest.clearAllMocks();
  });

  describe("register", () => {
    const penggunaData = {
      nama_lengkap: "Test User",
      email: "test@example.com",
      kata_sandi: "password123",
      no_hp: "08123456789",
      tipe_peminjam: TIPEUSER.EXUNAND,
      role: ROLE.PEMINJAM,
    };

    it("should register a new user successfully", async () => {
      try {
        (prisma.pengguna.findUnique as jest.Mock).mockResolvedValue(null);
        (prisma.pengguna.findFirst as jest.Mock).mockResolvedValue(null);
        (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_password");
        (prisma.pengguna.create as jest.Mock).mockResolvedValue({
          ...penggunaData,
          id: "user-123",
          kata_sandi: "hashed_password",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const result = await penggunaService.register(penggunaData);

        expect(prisma.pengguna.findUnique).toHaveBeenCalledWith({
          where: { email: penggunaData.email },
        });
        expect(bcrypt.hash).toHaveBeenCalledWith(
          penggunaData.kata_sandi,
          APP_CONFIG.BCRYPT_SALT_ROUNDS
        );
        expect(prisma.pengguna.create).toHaveBeenCalledWith({
          data: {
            ...penggunaData,
            kata_sandi: "hashed_password",
          },
        });

        expect(result).toEqual(
          expect.objectContaining({
            id: "user-123",
            nama_lengkap: penggunaData.nama_lengkap,
            email: penggunaData.email,
            no_hp: penggunaData.no_hp,
            tipe_peminjam: penggunaData.tipe_peminjam,
            role: penggunaData.role,
          })
        );
        expect(result).not.toHaveProperty("kata_sandi");

        TestLogger.log("✅ Register success", result);
      } catch (error) {
        TestLogger.log("❌ Register failed", error);
        throw error;
      }
    });

    it("should throw ConflictError if email already exists", async () => {
      try {
        (prisma.pengguna.findUnique as jest.Mock).mockResolvedValue({
          id: "existing-user",
          email: penggunaData.email,
        });

        await expect(penggunaService.register(penggunaData)).rejects.toThrow(
          ConflictError
        );

        expect(prisma.pengguna.create).not.toHaveBeenCalled();
        TestLogger.log("✅ Register conflict detected");
      } catch (error) {
        TestLogger.log("❌ Register conflict test failed", error);
        throw error;
      }
    });
  });

  describe("login", () => {
    const loginData = {
      email: "test@example.com",
      kata_sandi: "password123",
    };

    const penggunaData = {
      id: "user-123",
      nama_lengkap: "Test User",
      email: loginData.email,
      kata_sandi: "hashed_password",
      no_hp: "08123456789",
      tipe_peminjam: TIPEUSER.EXUNAND,
      role: ROLE.PEMINJAM,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("should login user successfully", async () => {
      try {
        (prisma.pengguna.findUnique as jest.Mock).mockResolvedValue(penggunaData);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (jwt.sign as jest.Mock).mockReturnValue("test.jwt.token");
        (prisma.token.create as jest.Mock).mockResolvedValue({
          id: "token-123",
          pengguna_id: penggunaData.id,
          token: "test.jwt.token",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const result = await penggunaService.login(loginData);

        expect(prisma.pengguna.findUnique).toHaveBeenCalledWith({
          where: { email: loginData.email },
        });
        expect(bcrypt.compare).toHaveBeenCalledWith(
          loginData.kata_sandi,
          penggunaData.kata_sandi
        );
        expect(jwt.sign).toHaveBeenCalledWith(
          {
            id: penggunaData.id,
            email: penggunaData.email,
            role: penggunaData.role,
          },
          APP_CONFIG.JWT_SECRET,
          { expiresIn: APP_CONFIG.JWT_EXPIRES_IN }
        );

        expect(result).toEqual({
          pengguna: expect.objectContaining({
            id: penggunaData.id,
            nama_lengkap: penggunaData.nama_lengkap,
            email: penggunaData.email,
          }),
          token: "test.jwt.token",
        });

        expect(result.pengguna).not.toHaveProperty("kata_sandi");

        TestLogger.log("✅ Login success", result);
      } catch (error) {
        TestLogger.log("❌ Login failed", error);
        throw error;
      }
    });

    it("should throw UnauthorizedError if user not found", async () => {
      try {
        (prisma.pengguna.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(penggunaService.login(loginData)).rejects.toThrow(
          UnauthorizedError
        );

        TestLogger.log("✅ Unauthorized login blocked");
      } catch (error) {
        TestLogger.log("❌ Unauthorized login test failed", error);
        throw error;
      }
    });
  });

  describe("logout", () => {
    it("should logout successfully", async () => {
      try {
        (prisma.token.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });

        const result = await penggunaService.logout("test.jwt.token");

        expect(prisma.token.deleteMany).toHaveBeenCalledWith({
          where: { token: "test.jwt.token" },
        });
        expect(result).toBe(true);

        TestLogger.log("✅ Logout success");
      } catch (error) {
        TestLogger.log("❌ Logout failed", error);
        throw error;
      }
    });

    it("should throw BadRequestError if token deletion fails", async () => {
      try {
        (prisma.token.deleteMany as jest.Mock).mockRejectedValue(
          new Error("Database error")
        );

        await expect(penggunaService.logout("test.jwt.token")).rejects.toThrow(
          BadRequestError
        );

        TestLogger.log("✅ Logout failure handled correctly");
      } catch (error) {
        TestLogger.log("❌ Logout failure test failed", error);
        throw error;
      }
    });
  });
});
