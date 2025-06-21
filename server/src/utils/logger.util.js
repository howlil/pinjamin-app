const winston = require('winston');
const moment = require('moment');

class Logger {
    static #createFormat() {
        return winston.format.combine(
            winston.format.timestamp({
                format: () => moment().format('DD-MM-YYYY HH:mm:ss')
            }),
            winston.format.errors({ stack: true }),
            winston.format.printf(({ timestamp, level, message, stack }) => {
                return `[${timestamp}] ${level.toUpperCase()}: ${stack || message}`;
            })
        );
    }

    static #createTransports() {
        const transports = [];

        try {
            transports.push(
                new winston.transports.File({
                    filename: 'logs/error.log',
                    level: 'error',
                    maxsize: 5242880,
                    maxFiles: 5,
                    handleExceptions: true,
                    handleRejections: true
                }),
                new winston.transports.File({
                    filename: 'logs/combined.log',
                    maxsize: 5242880,
                    maxFiles: 5,
                    handleExceptions: true,
                    handleRejections: true
                })
            );
        } catch (error) {
            console.error('Failed to create file transports, falling back to console only:', error.message);
        }

        // Always add console transport as fallback
        transports.push(new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                this.#createFormat()
            ),
            handleExceptions: true,
            handleRejections: true
        }));

        return transports;
    }

    static #create() {
        return winston.createLogger({
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
            format: this.#createFormat(),
            transports: this.#createTransports(),
            exitOnError: false
        });
    }

    static info(message, meta = {}) {
        try {
            this.#create().info(message, meta);
        } catch (error) {
            console.log(`[INFO] ${message}`, meta);
        }
    }

    static error(message, meta = {}) {
        try {
            this.#create().error(message, meta);
        } catch (error) {
            console.error(`[ERROR] ${message}`, meta);
        }
    }

    static warn(message, meta = {}) {
        try {
            this.#create().warn(message, meta);
        } catch (error) {
            console.warn(`[WARN] ${message}`, meta);
        }
    }

    static debug(message, meta = {}) {
        try {
            this.#create().debug(message, meta);
        } catch (error) {
            console.debug(`[DEBUG] ${message}`, meta);
        }
    }
}

module.exports = Logger; 