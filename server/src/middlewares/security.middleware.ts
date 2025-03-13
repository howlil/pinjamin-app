import helmet from "helmet";
import cors from "cors";
import { Express } from "express";
import { APP_CONFIG } from "../configs/app.config";

export const setupSecurityMiddleware = (app: Express) => {
  app.use(helmet());

  app.use(
    cors({
      origin: APP_CONFIG.CORS_ORIGIN,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );

  app.disable("x-powered-by");

  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    })
  );

  app.use(helmet.xssFilter());

  app.use(helmet.noSniff());

  app.use(helmet.frameguard({ action: "deny" }));

  app.use(
    helmet.hsts({
      maxAge: 15552000,
      includeSubDomains: true,
      preload: true,
    })
  );

  app.use(helmet.referrerPolicy({ policy: "same-origin" }));
};
