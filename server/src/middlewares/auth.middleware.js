const { prisma } = require('../configs');
const { JWTUtil, ErrorHandler, Logger } = require('../utils');

class AuthMiddleware {
    static authenticate = async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return next(ErrorHandler.unauthorized('Authorization header is required'));
            }

            if (!authHeader.startsWith('Bearer ')) {
                return next(ErrorHandler.unauthorized('Invalid authorization format. Use Bearer token'));
            }

            const token = authHeader.substring(7);

            if (!token) {
                return next(ErrorHandler.unauthorized('Token is required'));
            }

            let decoded;
            try {
                decoded = JWTUtil.verifyToken(token);
            } catch (jwtError) {
                if (jwtError.name === 'TokenExpiredError') {
                    return next(ErrorHandler.unauthorized('Token has expired'));
                }
                if (jwtError.name === 'JsonWebTokenError') {
                    return next(ErrorHandler.unauthorized('Invalid token'));
                }
                return next(ErrorHandler.unauthorized('Token verification failed'));
            }

            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    role: true,
                    borrowerType: true,
                    phoneNumber: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            if (!user) {
                return next(ErrorHandler.unauthorized('User not found'));
            }

            const tokenExists = await prisma.token.findFirst({
                where: {
                    userId: user.id,
                    token: token
                }
            });

            if (!tokenExists) {
                return next(ErrorHandler.unauthorized('Token is invalid or has been revoked'));
            }

            req.user = user;
            req.token = token;

            Logger.debug('User authenticated successfully', {
                userId: user.id,
                email: user.email,
                role: user.role
            });

            next();
        } catch (error) {
            Logger.error('Authentication error', { error: error.message });
            return next(ErrorHandler.internalServerError('Authentication failed'));
        }
    };

    static authorize = (...allowedRoles) => {
        return (req, res, next) => {
            if (!req.user) {
                return next(ErrorHandler.unauthorized('Authentication required'));
            }

            if (!allowedRoles.includes(req.user.role)) {
                Logger.warn('Authorization failed', {
                    userId: req.user.id,
                    userRole: req.user.role,
                    allowedRoles
                });
                return next(ErrorHandler.forbidden('Insufficient permissions'));
            }

            Logger.debug('User authorized successfully', {
                userId: req.user.id,
                role: req.user.role,
                allowedRoles
            });

            next();
        };
    };

    static authorizeOwnerOrAdmin = (resourceUserIdField = 'userId') => {
        return (req, res, next) => {
            if (!req.user) {
                return next(ErrorHandler.unauthorized('Authentication required'));
            }

            const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];

            if (req.user.role === 'ADMIN') {
                Logger.debug('Admin access granted', { userId: req.user.id });
                return next();
            }

            if (req.user.id === resourceUserId) {
                Logger.debug('Owner access granted', { userId: req.user.id });
                return next();
            }

            Logger.warn('Owner/Admin authorization failed', {
                userId: req.user.id,
                userRole: req.user.role,
                resourceUserId
            });

            return next(ErrorHandler.forbidden('Access denied. You can only access your own resources'));
        };
    };

    static authorizeUserType = (...allowedUserTypes) => {
        return (req, res, next) => {
            if (!req.user) {
                return next(ErrorHandler.unauthorized('Authentication required'));
            }

            if (!allowedUserTypes.includes(req.user.borrowerType)) {
                Logger.warn('User type authorization failed', {
                    userId: req.user.id,
                    userType: req.user.borrowerType,
                    allowedUserTypes
                });
                return next(ErrorHandler.forbidden('Access denied for your user type'));
            }

            Logger.debug('User type authorized successfully', {
                userId: req.user.id,
                userType: req.user.borrowerType,
                allowedUserTypes
            });

            next();
        };
    };

    static optionalAuth = async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                req.user = null;
                return next();
            }

            const token = authHeader.substring(7);

            if (!token) {
                req.user = null;
                return next();
            }

            try {
                const decoded = JWTUtil.verifyToken(token);

                const user = await prisma.user.findUnique({
                    where: { id: decoded.id },
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        role: true,
                        borrowerType: true,
                        phoneNumber: true,
                        createdAt: true,
                        updatedAt: true
                    }
                });

                if (user) {
                    const tokenExists = await prisma.token.findFirst({
                        where: {
                            userId: user.id,
                            token: token
                        }
                    });

                    if (tokenExists) {
                        req.user = user;
                        req.token = token;
                        Logger.debug('Optional auth successful', { userId: user.id });
                    } else {
                        req.user = null;
                    }
                } else {
                    req.user = null;
                }
            } catch (jwtError) {
                req.user = null;
            }

            next();
        } catch (error) {
            Logger.error('Optional authentication error', { error: error.message });
            req.user = null;
            next();
        }
    };
}

module.exports = AuthMiddleware; 