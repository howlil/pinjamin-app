import rateLimit from 'express-rate-limit';
import { APP_CONFIG } from '../configs/app';
import { logger } from '../configs/logger';

export const apiLimiter = rateLimit({
  windowMs: APP_CONFIG.RATE_LIMIT_WINDOW_MS, // 15 menit default
  max: APP_CONFIG.RATE_LIMIT_MAX, // limit 100 requests per window default
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded: ${req.ip}`, {
      ip: req.ip,
      path: req.path,
      method: req.method,
    });
    
    res.status(429).json({
      status: 'error',
      message: 'Terlalu banyak permintaan, silakan coba lagi nanti.',
    });
  },
});

// Rate limiter khusus untuk authentikasi untuk mencegah brute force
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  max: 10, // 10 permintaan per jam
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`Auth rate limit exceeded: ${req.ip}`, {
      ip: req.ip,
      path: req.path,
      method: req.method,
    });
    
    res.status(429).json({
      status: 'error',
      message: 'Terlalu banyak percobaan login, silakan coba lagi nanti.',
    });
  },
  skipSuccessfulRequests: true, // Hanya menghitung request yang gagal
});