import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset } from "jest-mock-extended";

// Mock PrismaClient
jest.mock("./src/configs/db.config", () => {
  const mockPrisma = mockDeep<PrismaClient>();
  return {
    prisma: mockPrisma,
    connectToDatabase: jest.fn(),
    disconnectFromDatabase: jest.fn(),
  };
});

// Mock logger
jest.mock("./src/configs/logger.config", () => {
  return {
    logger: {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    },
    logInfo: jest.fn(),
    logError: jest.fn(),
    logWarning: jest.fn(),
    logDebug: jest.fn(),
    requestLogger: jest.fn((req, res, next) => next()),
  };
});

// Mock JWT
jest.mock("jsonwebtoken", () => {
  return {
    sign: jest.fn(() => "mock-token"),
    verify: jest.fn(() => ({
      id: "user-id",
      email: "test@example.com",
      role: "PEMINJAM",
    })),
  };
});

// Mock Pusher
jest.mock("./src/configs/pusher.config", () => {
  return {
    trigger: jest.fn(),
  };
});

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  const { prisma } = require("./src/db.config");
  mockReset(prisma);
});
