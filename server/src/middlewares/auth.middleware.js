const JwtHelper = require('../libs/jwt.lib');
const AuthService = require('../services/auth.service');
const ResponseHelper = require('../libs/response.lib');
const logger = require('../libs/logger.lib');

const AuthMiddleware = {
    // Authenticate user token
    async authenticate(req, res, next) {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return ResponseHelper.unauthorized(res, 'Token tidak ditemukan');
            }

            const token = JwtHelper.extractTokenFromHeader(authHeader);

            if (!token) {
                return ResponseHelper.unauthorized(res, 'Format token tidak valid');
            }

            // Verify token with database
            const verificationResult = await AuthService.verifyToken(token);

            // Attach user to request
            req.user = verificationResult.user;
            req.tokenData = verificationResult.tokenData;

            next();
        } catch (error) {
            logger.error('Authentication middleware error:', error);

            if (error.message === 'Token tidak valid') {
                return ResponseHelper.unauthorized(res, 'Token tidak valid');
            }

            if (error.name === 'JsonWebTokenError') {
                return ResponseHelper.unauthorized(res, 'Token tidak valid');
            }

            if (error.name === 'TokenExpiredError') {
                return ResponseHelper.unauthorized(res, 'Token sudah expired');
            }

            return ResponseHelper.unauthorized(res, 'Token tidak valid');
        }
    },

    // Require admin role
    async requireAdmin(req, res, next) {
        try {
            if (!req.user) {
                return ResponseHelper.unauthorized(res, 'Authentication required');
            }

            if (req.user.role !== 'ADMIN') {
                return ResponseHelper.forbidden(res, 'Admin access required');
            }

            next();
        } catch (error) {
            logger.error('Admin authorization middleware error:', error);
            return ResponseHelper.forbidden(res, 'Admin access required');
        }
    },

    // Require borrower role
    async requireBorrower(req, res, next) {
        try {
            if (!req.user) {
                return ResponseHelper.unauthorized(res, 'Authentication required');
            }

            if (req.user.role !== 'BORROWER') {
                return ResponseHelper.forbidden(res, 'Borrower access required');
            }

            next();
        } catch (error) {
            logger.error('Borrower authorization middleware error:', error);
            return ResponseHelper.forbidden(res, 'Borrower access required');
        }
    },

    // Check if user owns the resource (for user-specific operations)
    async requireOwnership(req, res, next) {
        try {
            if (!req.user) {
                return ResponseHelper.unauthorized(res, 'Authentication required');
            }

            const userId = req.params.userId || req.body.userId || req.query.userId;

            if (!userId) {
                return ResponseHelper.badRequest(res, 'User ID parameter required');
            }

            // Admin can access any user's data
            if (req.user.role === 'ADMIN') {
                return next();
            }

            // User can only access their own data
            if (req.user.id !== userId) {
                return ResponseHelper.forbidden(res, 'Access denied - can only access your own data');
            }

            next();
        } catch (error) {
            logger.error('Ownership authorization middleware error:', error);
            return ResponseHelper.forbidden(res, 'Access denied');
        }
    },

    // Optional authentication (doesn't fail if no token provided)
    async optionalAuth(req, res, next) {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return next();
            }

            const token = JwtHelper.extractTokenFromHeader(authHeader);

            if (!token) {
                return next();
            }

            try {
                // Verify token with database
                const verificationResult = await AuthService.verifyToken(token);

                // Attach user to request
                req.user = verificationResult.user;
                req.tokenData = verificationResult.tokenData;
            } catch (error) {
                // If token is invalid, continue without user
                logger.warn('Optional auth failed:', error.message);
            }

            next();
        } catch (error) {
            logger.error('Optional authentication middleware error:', error);
            next();
        }
    },

    // Prevent admin users from certain actions (like creating bookings)
    async preventAdmin(req, res, next) {
        try {
            if (!req.user) {
                return ResponseHelper.unauthorized(res, 'Authentication required');
            }

            if (req.user.role === 'ADMIN') {
                return ResponseHelper.forbidden(res, 'Admin users cannot perform this action');
            }

            next();
        } catch (error) {
            logger.error('Prevent admin middleware error:', error);
            return ResponseHelper.forbidden(res, 'Access denied');
        }
    },

    // Rate limiting based on user role
    async rateLimitByRole(req, res, next) {
        try {
            // This is a placeholder for rate limiting implementation
            // You can implement rate limiting based on user role here
            // For example: Admin users might have higher rate limits

            if (req.user && req.user.role === 'ADMIN') {
                // Admin users have higher rate limits
                req.rateLimit = {
                    maxRequests: 1000,
                    windowMs: 15 * 60 * 1000 // 15 minutes
                };
            } else {
                // Regular users have standard rate limits
                req.rateLimit = {
                    maxRequests: 100,
                    windowMs: 15 * 60 * 1000 // 15 minutes
                };
            }

            next();
        } catch (error) {
            logger.error('Rate limit middleware error:', error);
            next();
        }
    }
};

module.exports = AuthMiddleware; 