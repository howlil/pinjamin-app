const { PrismaClient } = require('@prisma/client');
const logger = require('./logger.lib');

let prisma;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    if (!global.__prisma) {
        global.__prisma = new PrismaClient({
            log: [
                {
                    emit: 'event',
                    level: 'query',
                },
                {
                    emit: 'event',
                    level: 'error',
                },
                {
                    emit: 'event',
                    level: 'info',
                },
                {
                    emit: 'event',
                    level: 'warn',
                },
            ],
        });

        // Log database queries in development
        global.__prisma.$on('query', (e) => {
            logger.debug(`Query: ${e.query}`);
            logger.debug(`Params: ${e.params}`);
            logger.debug(`Duration: ${e.duration}ms`);
        });

        global.__prisma.$on('error', (e) => {
            logger.error(`Database error: ${e.message}`);
        });

        global.__prisma.$on('info', (e) => {
            logger.info(`Database info: ${e.message}`);
        });

        global.__prisma.$on('warn', (e) => {
            logger.warn(`Database warning: ${e.message}`);
        });
    }
    prisma = global.__prisma;
}

module.exports = prisma; 