const { prisma } = require('../configs');
const { Logger, Response } = require('../utils');

class DatabaseMiddleware {
    static checkConnection = async (req, res, next) => {
        try {
            await prisma.$queryRaw`SELECT 1`;
            next();
        } catch (error) {
            Logger.error('Database connection check failed:', error);
            return Response.error(res, 'Database connection error', 503);
        }
    };

    static handleDatabaseError = (error, req, res, next) => {
        if (error.code === 'P2002') {
            Logger.error('Unique constraint violation:', error);
            return Response.error(res, 'Data already exists', 409);
        }

        if (error.code === 'P2025') {
            Logger.error('Record not found:', error);
            return Response.error(res, 'Record not found', 404);
        }

        if (error.code === 'P2003') {
            Logger.error('Foreign key constraint violation:', error);
            return Response.error(res, 'Invalid reference data', 400);
        }

        if (error.code === 'P2014') {
            Logger.error('Invalid ID provided:', error);
            return Response.error(res, 'Invalid ID format', 400);
        }

        if (error.code === 'P1001') {
            Logger.error('Database connection failed:', error);
            return Response.error(res, 'Database connection error', 503);
        }

        if (error.code === 'P1008') {
            Logger.error('Database timeout:', error);
            return Response.error(res, 'Database operation timeout', 408);
        }

        Logger.error('Unhandled database error:', error);
        return Response.error(res, 'Internal server error', 500);
    };

    static transactionWrapper = (handler) => {
        return async (req, res, next) => {
            try {
                await prisma.$transaction(async (tx) => {
                    req.prisma = tx;
                    await handler(req, res, next);
                });
            } catch (error) {
                this.handleDatabaseError(error, req, res, next);
            }
        };
    };
}

module.exports = DatabaseMiddleware; 