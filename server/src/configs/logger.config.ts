import winston from "winston";
import path from "path";
import fs from "fs";
import { APP_CONFIG } from "./app.config";

// Memastikan direktori logs ada
const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Format log
const logFormat = winston.format.printf(
  ({ level, message, timestamp, ...meta }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
    }`;
  }
);

// Setup logger
export const logger = winston.createLogger({
  level: APP_CONFIG.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  defaultMeta: { service: "peminjaman-gedung-api" },
  transports: [
    // Menulis semua log ke console
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),

    // Menulis semua log level ke file combined.log
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),

    // Menulis log level error ke file error.log
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),

    // Menulis log level info ke file info.log
    new winston.transports.File({
      filename: path.join(logDir, "info.log"),
      level: "info",
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, "exceptions.log"),
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, "rejections.log"),
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
  ],
});

// Setup logging middleware untuk HTTP requests
export const requestLogger = (req: any, res: any, next: any) => {
  const start = new Date().getTime();

  res.on("finish", () => {
    const duration = new Date().getTime() - start;

    logger.info(`${req.method} ${req.originalUrl}`, {
      method: req.method,
      url: req.originalUrl,
      query: req.query,
      params: req.params,
      body:
        req.method === "POST" || req.method === "PUT" || req.method === "PATCH"
          ? APP_CONFIG.NODE_ENV === "development"
            ? req.body
            : "[REDACTED]"
          : undefined,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      user: req.pengguna ? req.pengguna.id : "anonymous",
    });
  });

  next();
};

// Fungsi untuk log database queries (Prisma)
export const logDatabaseQuery = (
  query: string,
  params: string,
  duration: number
) => {
  if (APP_CONFIG.NODE_ENV !== "production") {
    logger.debug("Database Query", {
      query,
      params,
      duration: `${duration}ms`,
    });
  }
};

// Tambahkan fungsi helper untuk logging
export const logInfo = (message: string, meta?: object) => {
  logger.info(message, meta);
};

export const logError = (message: string, error?: Error, meta?: object) => {
  logger.error(message, { ...meta, error: error });
};

export const logWarning = (message: string, meta?: object) => {
  logger.warn(message, meta);
};

export const logDebug = (message: string, meta?: object) => {
  logger.debug(message, meta);
};
