const { Logger } = require('./logger.util');

class ErrorHandler {
    static #createErrorResponse(status, message, errors = null) {
        return {
            status: 'error',
            message,
            ...(errors && { errors })
        };
    }

    static #createValidationErrorResponse(message, errors) {
        return {
            status: 'error',
            message,
            errors: Array.isArray(errors) ? errors : [errors],
            errorCount: Array.isArray(errors) ? errors.length : 1
        };
    }

    static #logError(error, req = null) {
        const logData = {
            error: error.message,
            stack: error.stack,
            ...(req && {
                method: req.method,
                url: req.originalUrl,
                body: req.body,
                params: req.params,
                query: req.query,
                headers: req.headers
            })
        };
        Logger.error('Application Error', logData);
    }

    static createCustomError(message, statusCode = 500) {
        const error = new Error(message);
        error.statusCode = statusCode;
        return error;
    }

    static badRequest(message = 'Bad request') {
        return this.createCustomError(message, 400);
    }

    static unauthorized(message = 'Unauthorized access') {
        return this.createCustomError(message, 401);
    }

    static forbidden(message = 'Access forbidden') {
        return this.createCustomError(message, 403);
    }

    static notFound(message = 'Resource not found') {
        return this.createCustomError(message, 404);
    }

    static methodNotAllowed(message = 'Method not allowed') {
        return this.createCustomError(message, 405);
    }

    static conflict(message = 'Conflict occurred') {
        return this.createCustomError(message, 409);
    }

    static unprocessableEntity(message = 'Unprocessable entity') {
        return this.createCustomError(message, 422);
    }

    static tooManyRequests(message = 'Too many requests') {
        return this.createCustomError(message, 429);
    }

    static internalServerError(message = 'Internal server error') {
        return this.createCustomError(message, 500);
    }

    static notImplemented(message = 'Not implemented') {
        return this.createCustomError(message, 501);
    }

    static badGateway(message = 'Bad gateway') {
        return this.createCustomError(message, 502);
    }

    static serviceUnavailable(message = 'Service unavailable') {
        return this.createCustomError(message, 503);
    }

    static gatewayTimeout(message = 'Gateway timeout') {
        return this.createCustomError(message, 504);
    }

    static handleValidationError(error, req, res, next) {
        if (error.isJoi) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message.replace(/"/g, ''),
                value: detail.context?.value,
                type: detail.type
            }));

            ErrorHandler.#logError(error, req);

            return res.status(400).json(
                ErrorHandler.#createValidationErrorResponse('Request validation failed', errors)
            );
        }

        if (error.validationErrors && Array.isArray(error.validationErrors)) {
            ErrorHandler.#logError(error, req);
            return res.status(400).json(
                ErrorHandler.#createValidationErrorResponse('Validation failed', error.validationErrors)
            );
        }

        next(error);
    }

    static handleDatabaseError(error, req, res, next) {
        if (error.code) {
            let message = 'Database operation failed';
            let statusCode = 500;

            switch (error.code) {
                case 'P2002':
                    message = 'Duplicate entry. Data already exists';
                    statusCode = 409;
                    break;
                case 'P2003':
                    message = 'Foreign key constraint failed';
                    statusCode = 400;
                    break;
                case 'P2025':
                    message = 'Record not found';
                    statusCode = 404;
                    break;
                case 'P2014':
                    message = 'Invalid ID. Related record not found';
                    statusCode = 400;
                    break;
                case 'P2016':
                    message = 'Query interpretation error';
                    statusCode = 400;
                    break;
                case 'P2021':
                    message = 'Table does not exist in current database';
                    statusCode = 500;
                    break;
                case 'P2022':
                    message = 'Column does not exist in current database';
                    statusCode = 500;
                    break;
                default:
                    message = 'Database error occurred';
                    statusCode = 500;
            }

            ErrorHandler.#logError(error, req);

            return res.status(statusCode).json(
                ErrorHandler.#createErrorResponse(message, message)
            );
        }
        next(error);
    }

    static handleGenericError(error, req, res, next) {
        ErrorHandler.#logError(error, req);

        const statusCode = error.statusCode || error.status || 500;
        const message = error.message || 'Internal server error';

        return res.status(statusCode).json(
            ErrorHandler.#createErrorResponse('Server error', message)
        );
    }

    static asyncHandler(fn) {
        return (req, res, next) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };
    }
}

module.exports = ErrorHandler; 