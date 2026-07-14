import app from './app.js';
import { env } from './config/env.js';
import prisma from './lib/prisma.js';
import { logger } from './lib/logger.js';

const server = app.listen(env.PORT, async () => {
  logger.info(`Server successfully started on port ${env.PORT} in ${env.NODE_ENV} mode.`);
  
  try {
    // Verify database connection
    await prisma.$connect();
    logger.info('Database connection established successfully via Prisma Client.');
  } catch (error) {
    logger.error({ error }, 'Database connection failure during bootstrap.');
    process.exit(1);
  }
});

// Graceful shutdown logic
const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Graceful shutdown initiated...`);
  
  server.close(async () => {
    logger.info('HTTP server closed.');
    try {
      await prisma.$disconnect();
      logger.info('Database connection closed successfully.');
      process.exit(0);
    } catch (error) {
      logger.error({ error }, 'Failed to disconnect database during shutdown.');
      process.exit(1);
    }
  });

  // Force kill if graceful shutdown hangs
  setTimeout(() => {
    logger.error('Forceful shutdown due to timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
