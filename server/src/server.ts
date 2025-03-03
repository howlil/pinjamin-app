import express, { Express, ErrorRequestHandler } from "express";
import { setupUncaughtExceptionHandling } from "./utils/uncaught-exception.handler";
import { errorMiddleware } from "./middlewares/error.middleware";
import { logger, requestLogger } from "./configs/logger";
import { setupSecurityMiddleware } from "./middlewares/security.middleware";
import { apiLimiter } from "./middlewares/rate-limit.middleware";
import { APP_CONFIG } from "./configs/app";
import { connectToDatabase } from "./configs/db";
import path from "path";
import publicRoute from "./routes/public.routes";
import privateRoute from "./routes/private.routes";

setupUncaughtExceptionHandling();

const app: Express = express();

setupSecurityMiddleware(app);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(requestLogger);
app.use(apiLimiter);
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), APP_CONFIG.UPLOAD_PATH))
);

app.use(publicRoute)
app.use(privateRoute)

app.use(errorMiddleware as unknown as ErrorRequestHandler);

const PORT = APP_CONFIG.PORT;

const startServer = async () => {
  try {
    // Connect to database
    await connectToDatabase();

    // Start server
    app.listen(PORT, () => {
      logger.info(
        `Server berjalan pada port ${PORT} di mode ${APP_CONFIG.NODE_ENV}`
      );
    });
  } catch (error) {
    logger.error("Failed to start server", { error });
    process.exit(1);
  }
};

export { app, startServer };
