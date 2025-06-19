const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger.util');

class PrismaConfig {
    #client = null;
    #isConnected = false;

    constructor() {
        this.#initializeClient();
    }

    #initializeClient = () => {
        try {
            this.#client = new PrismaClient({
                log: [
                    { emit: 'event', level: 'query' },
                    { emit: 'event', level: 'error' },
                    { emit: 'event', level: 'info' },
                    { emit: 'event', level: 'warn' }
                ],
                errorFormat: 'minimal'
            });

            this.#setupEventListeners();
            this.#setupGracefulShutdown();
        } catch (error) {
            logger.error('Failed to initialize Prisma client:', error);
            throw error;
        }
    };

    #setupEventListeners = () => {
        this.#client.$on('query', (event) => {
            logger.debug(`Query: ${event.query}`);
            logger.debug(`Duration: ${event.duration}ms`);
        });

        this.#client.$on('error', (event) => {
            logger.error('Prisma error:', event);
        });

        this.#client.$on('info', (event) => {
            logger.info('Prisma info:', event.message);
        });

        this.#client.$on('warn', (event) => {
            logger.warn('Prisma warning:', event.message);
        });
    };

    #setupGracefulShutdown = () => {
        const gracefulShutdown = async () => {
            try {
                await this.disconnect();
                process.exit(0);
            } catch (error) {
                logger.error('Error during graceful shutdown:', error);
                process.exit(1);
            }
        };

        process.on('SIGINT', gracefulShutdown);
        process.on('SIGTERM', gracefulShutdown);
        process.on('beforeExit', gracefulShutdown);
    };

    connect = async () => {
        if (this.#isConnected) {
            return this.#client;
        }

        try {
            await this.#client.$connect();
            this.#isConnected = true;
            logger.info('Prisma client connected successfully');
            return this.#client;
        } catch (error) {
            logger.error('Failed to connect Prisma client:', error);
            throw error;
        }
    };

    disconnect = async () => {
        if (!this.#isConnected) {
            return;
        }

        try {
            await this.#client.$disconnect();
            this.#isConnected = false;
            logger.info('Prisma client disconnected successfully');
        } catch (error) {
            logger.error('Failed to disconnect Prisma client:', error);
            throw error;
        }
    };

    healthCheck = async () => {
        try {
            await this.#client.$queryRaw`SELECT 1`;
            return { status: 'healthy', timestamp: new Date().toISOString() };
        } catch (error) {
            logger.error('Prisma health check failed:', error);
            return { status: 'unhealthy', error: error.message, timestamp: new Date().toISOString() };
        }
    };

    transaction = async (callback) => {
        try {
            return await this.#client.$transaction(callback);
        } catch (error) {
            logger.error('Transaction failed:', error);
            throw error;
        }
    };

    executeRaw = async (query, ...params) => {
        try {
            return await this.#client.$executeRaw(query, ...params);
        } catch (error) {
            logger.error('Raw query execution failed:', error);
            throw error;
        }
    };

    queryRaw = async (query, ...params) => {
        try {
            return await this.#client.$queryRaw(query, ...params);
        } catch (error) {
            logger.error('Raw query failed:', error);
            throw error;
        }
    };

    get client() {
        if (!this.#client) {
            throw new Error('Prisma client not initialized');
        }
        return this.#client;
    }

    get isConnected() {
        return this.#isConnected;
    }

    get user() {
        return this.#client.user;
    }

    get notification() {
        return this.#client.notification;
    }

    get token() {
        return this.#client.token;
    }

    get facility() {
        return this.#client.facility;
    }

    get facilityBuilding() {
        return this.#client.facilityBuilding;
    }

    get building() {
        return this.#client.building;
    }

    get buildingManager() {
        return this.#client.buildingManager;
    }

    get booking() {
        return this.#client.booking;
    }

    get payment() {
        return this.#client.payment;
    }

    get refund() {
        return this.#client.refund;
    }
}

module.exports = new PrismaConfig(); 