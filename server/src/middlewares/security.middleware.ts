import cors from "cors";
import { Express } from "express";
import { APP_CONFIG } from "../configs/app.config";

export const setupSecurityMiddleware = (app: Express) => {

  app.use(
    cors({
      origin: APP_CONFIG.CORS_ORIGIN,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );



};
