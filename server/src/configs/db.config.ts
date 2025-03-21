import { PrismaClient } from "@prisma/client";
import { logger } from "./logger.config";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: [
      {
        emit: "event",
        level: "query",
      },
      {
        emit: "event",
        level: "error",
      },
      {
        emit: "event",
        level: "info",
      },
      {
        emit: "event",
        level: "warn",
      },
    ],
  });
};

export const prisma = global.prisma || prismaClientSingleton();

type QueryEvent = {
  timestamp: Date;
  query: string;
  params: string;
  duration: number;
  target: string;
};

type LogEvent = {
  timestamp: Date;
  message: string;
  target: string;
};

// Logging untuk query
prisma.$on("query" as never, (e: QueryEvent) => {
  if (process.env.NODE_ENV !== "production") {
    logger.debug("Prisma Query", {
      query: e.query,
      params: e.params,
      duration: `${e.duration}ms`,
    });
  }
});

// Logging untuk error
prisma.$on("error" as never, (e: LogEvent) => {
  logger.error("Prisma Error", {
    message: e.message,
    target: e.target,
  });
});

// Logging untuk info
prisma.$on("info" as never, (e: LogEvent) => {
  logger.info("Prisma Info", {
    message: e.message,
    target: e.target,
  });
});

// Logging untuk warn
prisma.$on("warn" as never, (e: LogEvent) => {
  logger.warn("Prisma Warning", {
    message: e.message,
    target: e.target,
  });
});

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// Fungsi untuk menghubungkan ke database
export const connectToDatabase = async () => {
  try {
    await prisma.$connect();
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error("Failed to connect to database", { error });
    process.exit(1);
  }
};

// Fungsi untuk menutup koneksi database
export const disconnectFromDatabase = async () => {
  try {
    await prisma.$disconnect();
    logger.info("Database disconnected successfully");
  } catch (error) {
    logger.error("Failed to disconnect from database", { error });
    process.exit(1);
  }
};
