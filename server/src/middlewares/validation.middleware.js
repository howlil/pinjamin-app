const Joi = require('joi');
const ResponseHelper = require('../libs/response.lib');
const logger = require('../libs/logger.lib');

const ValidationMiddleware = {
    // Generic validation middleware
    validate(schema) {
        return (req, res, next) => {
            try {
                if (!schema) {
                    logger.error('Body validation schema is undefined');
                    return ResponseHelper.error(res, 'Schema validasi tidak ditemukan', 500);
                }

                const { error } = schema.validate(req.body, {
                    abortEarly: false,
                    stripUnknown: true,
                    allowUnknown: false,
                    convert: true
                });

                if (error) {
                    const errors = error.details.map(detail => ({
                        field: detail.path.join('.'),
                        message: detail.message
                    }));

                    return ResponseHelper.validationError(res, 'Data tidak valid', errors);
                }

                next();
            } catch (err) {
                logger.error('Validation middleware error:', err);
                return ResponseHelper.error(res, 'Kesalahan validasi', 500);
            }
        };
    },

    // Validate query parameters
    validateQuery(schema) {
        return (req, res, next) => {
            try {
                if (!schema) {
                    logger.error('Query validation schema is undefined');
                    return ResponseHelper.error(res, 'Schema validasi tidak ditemukan', 500);
                }

                const { error, value } = schema.validate(req.query, {
                    abortEarly: false,
                    stripUnknown: true
                });

                if (error) {
                    const errors = error.details.map(detail => ({
                        field: detail.path.join('.'),
                        message: detail.message
                    }));

                    return ResponseHelper.validationError(res, 'Parameter query tidak valid', errors);
                }

                req.query = value;
                next();
            } catch (err) {
                logger.error('Query validation middleware error:', err);
                return ResponseHelper.error(res, 'Kesalahan validasi query', 500);
            }
        };
    },

    // Validate URL parameters
    validateParams(schema) {
        return (req, res, next) => {
            try {
                if (!schema) {
                    logger.error('Params validation schema is undefined');
                    return ResponseHelper.error(res, 'Schema validasi parameter tidak ditemukan', 500);
                }

                const { error, value } = schema.validate(req.params, {
                    abortEarly: false,
                    stripUnknown: true
                });

                if (error) {
                    const errors = error.details.map(detail => ({
                        field: detail.path.join('.'),
                        message: detail.message
                    }));

                    return ResponseHelper.validationError(res, 'Parameter URL tidak valid', errors);
                }

                req.params = value;
                next();
            } catch (err) {
                logger.error('Params validation middleware error:', err);
                return ResponseHelper.error(res, 'Kesalahan validasi parameter', 500);
            }
        };
    },

    // Custom validation for multipart/form-data
    validateMultipart(bodySchema, fileSchema = null) {
        return (req, res, next) => {
            try {
                // Validate body
                if (bodySchema) {
                    const { error: bodyError } = bodySchema.validate(req.body, {
                        abortEarly: false,
                        stripUnknown: true,
                        allowUnknown: false,
                        convert: true
                    });

                    if (bodyError) {
                        const errors = bodyError.details.map(detail => ({
                            field: detail.path.join('.'),
                            message: detail.message
                        }));

                        return ResponseHelper.validationError(res, 'Data form tidak valid', errors);
                    }
                }

                // Validate files
                if (fileSchema && req.files) {
                    const { error: fileError } = fileSchema.validate(req.files, {
                        abortEarly: false
                    });

                    if (fileError) {
                        const errors = fileError.details.map(detail => ({
                            field: detail.path.join('.'),
                            message: detail.message
                        }));

                        return ResponseHelper.validationError(res, 'File tidak valid', errors);
                    }
                }

                next();
            } catch (err) {
                logger.error('Multipart validation middleware error:', err);
                return ResponseHelper.error(res, 'Kesalahan validasi multipart', 500);
            }
        };
    }
};

module.exports = ValidationMiddleware; 