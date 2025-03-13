import { logger } from "../configs/logger.config";

export const setupUncaughtExceptionHandling = () => {
  process.on("unhandledRejection", (reason: Error) => {
    logger.error("Unhandled Promise Rejection", { error: reason });

    console.error("UNHANDLED REJECTION! 💥 Shutting down...");
    console.error(reason);

    process.exit(1);
  });

  process.on("uncaughtException", (err: Error) => {
    logger.error("Uncaught Exception", { error: err });

    console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.error(err);

    process.exit(1);
  });
};
