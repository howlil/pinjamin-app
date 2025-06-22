const multer = require('multer');
const multerConfig = require('../configs/multer.config');
const { ErrorHandler } = require('../utils');

class UploadMiddleware {
    static handleImageUpload = (req, res, next) => {
        multerConfig.imageUpload(req, res, (error) => {
            if (error) {
                if (error instanceof multer.MulterError) {
                    switch (error.code) {
                        case 'LIMIT_FILE_SIZE':
                            return next(ErrorHandler.badRequest('File size too large. Maximum 5MB allowed'));
                        case 'LIMIT_FILE_COUNT':
                            return next(ErrorHandler.badRequest('Too many files. Only 1 file allowed'));
                        case 'LIMIT_UNEXPECTED_FILE':
                            return next(ErrorHandler.badRequest('Unexpected field name. Use "image" field'));
                        default:
                            return next(ErrorHandler.badRequest('File upload error'));
                    }
                }
                return next(ErrorHandler.badRequest(error.message));
            }

            if (!req.file) {
                return next(ErrorHandler.badRequest('No image file provided'));
            }

            next();
        });
    };

    static handlePdfUpload = (req, res, next) => {
        multerConfig.pdfUpload(req, res, (error) => {
            if (error) {
                if (error instanceof multer.MulterError) {
                    switch (error.code) {
                        case 'LIMIT_FILE_SIZE':
                            return next(ErrorHandler.badRequest('File size too large. Maximum 10MB allowed'));
                        case 'LIMIT_FILE_COUNT':
                            return next(ErrorHandler.badRequest('Too many files. Only 1 file allowed'));
                        case 'LIMIT_UNEXPECTED_FILE':
                            return next(ErrorHandler.badRequest('Unexpected field name. Use "document" field'));
                        default:
                            return next(ErrorHandler.badRequest('File upload error'));
                    }
                }
                return next(ErrorHandler.badRequest(error.message));
            }

            if (!req.file) {
                return next(ErrorHandler.badRequest('No PDF file provided'));
            }

            next();
        });
    };

    static handleProposalUpload = (req, res, next) => {
        multerConfig.proposalUpload(req, res, (error) => {
            if (error) {
                if (error instanceof multer.MulterError) {
                    switch (error.code) {
                        case 'LIMIT_FILE_SIZE':
                            return next(ErrorHandler.badRequest('File size too large. Maximum 10MB allowed'));
                        case 'LIMIT_FILE_COUNT':
                            return next(ErrorHandler.badRequest('Too many files. Only 1 file allowed'));
                        case 'LIMIT_UNEXPECTED_FILE':
                            return next(ErrorHandler.badRequest('Unexpected field name. Use "proposalLetter" field'));
                        default:
                            return next(ErrorHandler.badRequest('File upload error'));
                    }
                }
                return next(ErrorHandler.badRequest(error.message));
            }

            if (!req.file) {
                return next(ErrorHandler.badRequest('No proposal letter file provided'));
            }

            next();
        });
    };

    static optionalImageUpload = (req, res, next) => {
        multerConfig.imageUpload(req, res, (error) => {
            if (error) {
                if (error instanceof multer.MulterError) {
                    switch (error.code) {
                        case 'LIMIT_FILE_SIZE':
                            return next(ErrorHandler.badRequest('File size too large. Maximum 5MB allowed'));
                        case 'LIMIT_FILE_COUNT':
                            return next(ErrorHandler.badRequest('Too many files. Only 1 file allowed'));
                        case 'LIMIT_UNEXPECTED_FILE':
                            return next(ErrorHandler.badRequest('Unexpected field name. Use "image" field'));
                        default:
                            return next(ErrorHandler.badRequest('File upload error'));
                    }
                }
                return next(ErrorHandler.badRequest(error.message));
            }

            next();
        });
    };

    static optionalPdfUpload = (req, res, next) => {
        multerConfig.pdfUpload(req, res, (error) => {
            if (error) {
                if (error instanceof multer.MulterError) {
                    switch (error.code) {
                        case 'LIMIT_FILE_SIZE':
                            return next(ErrorHandler.badRequest('File size too large. Maximum 10MB allowed'));
                        case 'LIMIT_FILE_COUNT':
                            return next(ErrorHandler.badRequest('Too many files. Only 1 file allowed'));
                        case 'LIMIT_UNEXPECTED_FILE':
                            return next(ErrorHandler.badRequest('Unexpected field name. Use "document" field'));
                        default:
                            return next(ErrorHandler.badRequest('File upload error'));
                    }
                }
                return next(ErrorHandler.badRequest(error.message));
            }

            next();
        });
    };

    static optionalProposalUpload = (req, res, next) => {
        multerConfig.proposalUpload(req, res, (error) => {
            if (error) {
                if (error instanceof multer.MulterError) {
                    switch (error.code) {
                        case 'LIMIT_FILE_SIZE':
                            return next(ErrorHandler.badRequest('File size too large. Maximum 10MB allowed'));
                        case 'LIMIT_FILE_COUNT':
                            return next(ErrorHandler.badRequest('Too many files. Only 1 file allowed'));
                        case 'LIMIT_UNEXPECTED_FILE':
                            return next(ErrorHandler.badRequest('Unexpected field name. Use "proposalLetter" field'));
                        default:
                            return next(ErrorHandler.badRequest('File upload error'));
                    }
                }
                return next(ErrorHandler.badRequest(error.message));
            }

            // Don't require file to be present - controller will handle the check
            next();
        });
    };
}

module.exports = UploadMiddleware; 