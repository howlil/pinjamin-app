const jwt = require('jsonwebtoken');
const { Logger } = require('./logger.util');

class JWTUtil {
    static #jwtSecret = process.env.JWT_SECRET || 'default-secret-key';
    static #jwtExpiration = process.env.JWT_EXPIRATION || '24h';

    static generateToken(payload, options = {}) {
        try {
            if (!payload || typeof payload !== 'object') {
                throw new Error('Payload must be a non-empty object');
            }

            const tokenOptions = {
                expiresIn: options.expiresIn || this.#jwtExpiration,
                issuer: options.issuer || 'building-rental-api',
                audience: options.audience || 'building-rental-users',
                ...options
            };

            const token = jwt.sign(payload, this.#jwtSecret, tokenOptions);
            Logger.debug('JWT token generated successfully', {
                userId: payload.id || payload.userId,
                expiresIn: tokenOptions.expiresIn
            });

            return token;
        } catch (error) {
            Logger.error('JWT token generation failed', { error: error.message });
            throw error;
        }
    }

    static verifyToken(token, options = {}) {
        try {
            if (!token || typeof token !== 'string') {
                throw new Error('Token must be a non-empty string');
            }

            const verifyOptions = {
                issuer: options.issuer || 'building-rental-api',
                audience: options.audience || 'building-rental-users',
                ...options
            };

            const decoded = jwt.verify(token, this.#jwtSecret, verifyOptions);
            Logger.debug('JWT token verified successfully', {
                userId: decoded.id || decoded.userId,
                exp: decoded.exp
            });

            return decoded;
        } catch (error) {
            Logger.warn('JWT token verification failed', { error: error.message });
            throw error;
        }
    }

    static decodeToken(token, options = {}) {
        try {
            if (!token || typeof token !== 'string') {
                throw new Error('Token must be a non-empty string');
            }

            const decoded = jwt.decode(token, options);
            Logger.debug('JWT token decoded successfully');

            return decoded;
        } catch (error) {
            Logger.error('JWT token decode failed', { error: error.message });
            throw error;
        }
    }

    static getTokenExpiration(token) {
        try {
            const decoded = this.decodeToken(token);
            if (!decoded || !decoded.exp) {
                throw new Error('Token does not contain expiration information');
            }

            const expirationDate = new Date(decoded.exp * 1000);
            Logger.debug('Token expiration retrieved', { expiration: expirationDate });

            return expirationDate;
        } catch (error) {
            Logger.error('Failed to get token expiration', { error: error.message });
            throw error;
        }
    }

    static isTokenExpired(token) {
        try {
            const expirationDate = this.getTokenExpiration(token);
            const isExpired = expirationDate < new Date();

            Logger.debug('Token expiration check completed', { isExpired });
            return isExpired;
        } catch (error) {
            Logger.error('Token expiration check failed', { error: error.message });
            return true;
        }
    }

    static getTokenPayload(token) {
        try {
            const decoded = this.decodeToken(token);
            if (!decoded) {
                throw new Error('Unable to decode token payload');
            }

            const { iat, exp, iss, aud, ...payload } = decoded;
            Logger.debug('Token payload extracted successfully');

            return payload;
        } catch (error) {
            Logger.error('Failed to extract token payload', { error: error.message });
            throw error;
        }
    }
}

module.exports = JWTUtil; 