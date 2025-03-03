import express, { Express, ErrorRequestHandler } from "express";
import { setupUncaughtExceptionHandling } from "./utils/uncaught-exception.handler";
import { errorMiddleware } from "./middlewares/error.middleware";
import { logger, requestLogger } from "./configs/logger";
import { setupSecurityMiddleware } from "./middlewares/security.middleware";
import { apiLimiter } from "./middlewares/rate-limit.middleware";
import { APP_CONFIG } from "./configs/app";
import { connectToDatabase } from "./configs/db";
import path from "path";

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

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: `${APP_CONFIG.APP_NAME} API is running`,
    version: APP_CONFIG.APP_VERSION,
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route tidak ditemukan",
  });
});

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
