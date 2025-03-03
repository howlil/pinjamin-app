import { logger } from '../configs/logger';

export const setupUncaughtExceptionHandling = () => {
  // Menangani unhandled promise rejections
  process.on('unhandledRejection', (reason: Error) => {
    logger.error('Unhandled Promise Rejection', { error: reason });
    
    // Log stack trace untuk debugging
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(reason);
    
    // Close server gracefully dan exit dengan failure code
    process.exit(1);
  });

  // Menangani uncaught exceptions
  process.on('uncaughtException', (err: Error) => {
    logger.error('Uncaught Exception', { error: err });
    
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err);
    
    // Exit dengan failure code
    process.exit(1);
  });
};