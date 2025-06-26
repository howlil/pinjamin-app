const jwt = require('jsonwebtoken');
const logger = require('./logger.lib');

const JwtHelper = {
    generateToken(payload, expiresIn = '24h') {
        try {
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw new Error('JWT_SECRET is not defined in environment variables');
            }

            return jwt.sign(payload, secret, {
                expiresIn,
                issuer: 'building-rental-api',
                audience: 'building-rental-client'
            });
        } catch (error) {
            logger.error('Error generating JWT token:', error);
            throw error;
        }
    },

    verifyToken(token) {
        try {
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw new Error('JWT_SECRET is not defined in environment variables');
            }

            return jwt.verify(token, secret, {
                issuer: 'building-rental-api',
                audience: 'building-rental-client'
            });
        } catch (error) {
            logger.error('Error verifying JWT token:', error);
            throw error;
        }
    },

    decodeToken(token) {
        try {
            return jwt.decode(token);
        } catch (error) {
            logger.error('Error decoding JWT token:', error);
            throw error;
        }
    },

    extractTokenFromHeader(authHeader) {
        if (!authHeader) {
            return null;
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return null;
        }

        return parts[1];
    }
};

module.exports = JwtHelper; 