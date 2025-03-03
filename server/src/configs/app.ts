import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const APP_CONFIG = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'rahasia-jwt',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  NODE_ENV: process.env.NODE_ENV || 'development',
  UPLOAD_PATH: process.env.UPLOAD_PATH || path.join(process.cwd(), 'uploads'),
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  APP_NAME: process.env.APP_NAME || 'Peminjaman Gedung API',
  APP_VERSION: process.env.APP_VERSION || '1.0.0',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  MAX_UPLOAD_SIZE: process.env.MAX_UPLOAD_SIZE 
    ? parseInt(process.env.MAX_UPLOAD_SIZE) 
    : 5 * 1024 * 1024, // Default 5MB
  MIDTRANS_SERVER_KEY: process.env.MIDTRANS_SERVER_KEY,
  MIDTRANS_CLIENT_KEY: process.env.MIDTRANS_CLIENT_KEY,
  MIDTRANS_IS_PRODUCTION: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS 
    ? parseInt(process.env.RATE_LIMIT_WINDOW_MS) 
    : 15 * 60 * 1000, // Default 15 menit
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX 
    ? parseInt(process.env.RATE_LIMIT_MAX) 
    : 100, // Default 100 requests per window
};

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'MIDTRANS_SERVER_KEY',
  'MIDTRANS_CLIENT_KEY',
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  } else {
    console.warn(`WARNING: Missing environment variables: ${missingEnvVars.join(', ')}`);
  }
}