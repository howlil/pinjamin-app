import rateLimit from "express-rate-limit";
import { APP_CONFIG } from "../configs/app.config";
import { logger } from "../configs/logger.config";

export const apiLimiter = rateLimit({
  windowMs: APP_CONFIG.RATE_LIMIT_WINDOW_MS,
  max: APP_CONFIG.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded: ${req.ip}`, {
      ip: req.ip,
      path: req.path,
      method: req.method,
    });

    res.status(429).json({
      status: "error",
      message: "Terlalu banyak permintaan, silakan coba lagi nanti.",
    });
  },
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`Auth rate limit exceeded: ${req.ip}`, {
      ip: req.ip,
      path: req.path,
      method: req.method,
    });

    res.status(429).json({
      status: "error",
      message: "Terlalu banyak percobaan login, silakan coba lagi nanti.",
    });
  },
  skipSuccessfulRequests: true,
});
