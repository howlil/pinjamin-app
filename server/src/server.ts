import express, { Express, ErrorRequestHandler } from "express";
import path from "path";
import { setupUncaughtExceptionHandling } from "./utils/uncaught-exception.util";
import { errorMiddleware } from "./middlewares/error.middleware";
import { logger, requestLogger } from "./configs/logger.config";
import { setupSecurityMiddleware } from "./middlewares/security.middleware";
import { apiLimiter } from "./middlewares/rate-limit.middleware";
import { APP_CONFIG } from "./configs/app.config";
import { connectToDatabase } from "./configs/db.config";
import appRouter from "./routes/index"
export class Server {
  private app: Express;
  private port: number | string;
  
  constructor() {
    setupUncaughtExceptionHandling();
    this.app = express();
    this.port = APP_CONFIG.PORT;
    this.plugin();
    this.routes();
    this.errors();
  }
  
  protected plugin(): void {
    setupSecurityMiddleware(this.app);
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));
    this.app.use(requestLogger);
    this.app.use(apiLimiter);
    this.app.use( "/uploads", express.static(path.join(process.cwd(), APP_CONFIG.UPLOAD_PATH)));
  }
  
  protected routes(): void {
      this.app.use("/api",appRouter)
  }
  
  private errors(): void {
    this.app.use(errorMiddleware as unknown as ErrorRequestHandler);
  }
  
  public async start(): Promise<void> {
    try {
      await connectToDatabase();
      
      this.app.listen(this.port, () => {
        logger.info(
          `Server berjalan pada port ${this.port} di mode ${APP_CONFIG.NODE_ENV}`
        );
      });
    } catch (error) {
      logger.error("Failed to start server", { error });
      process.exit(1);
    }
  }
  
  public getApp(): Express {
    return this.app;
  }
}

export const startServer = async (): Promise<void> => {
  const server = new Server();
  await server.start();
};