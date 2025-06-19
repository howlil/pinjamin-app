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
        const transports = [
            new winston.transports.File({
                filename: 'logs/error.log',
                level: 'error',
                maxsize: 5242880,
                maxFiles: 5
            }),
            new winston.transports.File({
                filename: 'logs/combined.log',
                maxsize: 5242880,
                maxFiles: 5
            })
        ];

        if (process.env.NODE_ENV !== 'production') {
            transports.push(new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    this.#createFormat()
                )
            }));
        }

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
        this.#create().info(message, meta);
    }

    static error(message, meta = {}) {
        this.#create().error(message, meta);
    }

    static warn(message, meta = {}) {
        this.#create().warn(message, meta);
    }

    static debug(message, meta = {}) {
        this.#create().debug(message, meta);
    }
}

module.exports = Logger; 