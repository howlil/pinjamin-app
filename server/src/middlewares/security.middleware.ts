import helmet from 'helmet';
import cors from 'cors';
import { Express } from 'express';
import { APP_CONFIG } from '../configs/app';

export const setupSecurityMiddleware = (app: Express) => {
  // Menggunakan Helmet untuk keamanan HTTP headers
  app.use(helmet());
  
  // CORS middleware
  app.use(cors({
    origin: APP_CONFIG.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));
  
  // Menambahkan middleware tambahan untuk keamanan
  app.disable('x-powered-by');
  
  // Content Security Policy
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    })
  );
  
  // XSS Protection
  app.use(helmet.xssFilter());
  
  // Prevent MIME type sniffing
  app.use(helmet.noSniff());
  
  // Frameguard to prevent clickjacking
  app.use(helmet.frameguard({ action: 'deny' }));
  
  // HTTP Strict Transport Security
  app.use(
    helmet.hsts({
      maxAge: 15552000, // 180 days in seconds
      includeSubDomains: true,
      preload: true,
    })
  );
  
  // Referrer policy
  app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
};