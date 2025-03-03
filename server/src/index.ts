import { startServer } from './server';
import { logger } from './configs/logger';

// Start the server
startServer().catch((error) => {
  logger.error('Failed to start application', { error });
  process.exit(1);
});