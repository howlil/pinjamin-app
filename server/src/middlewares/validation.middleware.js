const { Response, Logger } = require('../utils');

class ValidationMiddleware {
    static validate(schema) {
        return (req, res, next) => {
            try {
                const { error, value } = schema.validate(req.body, {
                    abortEarly: false,
                    stripUnknown: true
                });

                if (error) {
                    const errorMessages = error.details.map(detail => detail.message);
                    Logger.warn('Validation error:', errorMessages);
                    return Response.error(res, errorMessages, 400);
                }

                req.body = value;
                next();
            } catch (err) {
                Logger.error('Validation middleware error:', err);
                return Response.error(res, 'Validation error', 500);
            }
        };
    }

    static validateQuery(schema) {
        return (req, res, next) => {
            try {
                const { error, value } = schema.validate(req.query, {
                    abortEarly: false,
                    stripUnknown: true
                });

                if (error) {
                    const errorMessages = error.details.map(detail => detail.message);
                    Logger.warn('Query validation error:', errorMessages);
                    return Response.error(res, errorMessages, 400);
                }

                req.query = value;
                next();
            } catch (err) {
                Logger.error('Query validation middleware error:', err);
                return Response.error(res, 'Query validation error', 500);
            }
        };
    }

    static validateParams(schema) {
        return (req, res, next) => {
            try {
                const { error, value } = schema.validate(req.params, {
                    abortEarly: false,
                    stripUnknown: true
                });

                if (error) {
                    const errorMessages = error.details.map(detail => detail.message);
                    Logger.warn('Params validation error:', errorMessages);
                    return Response.error(res, errorMessages, 400);
                }

                req.params = value;
                next();
            } catch (err) {
                Logger.error('Params validation middleware error:', err);
                return Response.error(res, 'Params validation error', 500);
            }
        };
    }
}

module.exports = ValidationMiddleware; 