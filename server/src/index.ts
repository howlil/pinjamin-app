// src/index.ts
import { startServer } from "./server";
import { logger } from "./configs/logger.config";

startServer().catch((error) => {
  logger.error("Failed to start application", { error });
  process.exit(1);
});