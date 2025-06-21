const bcrypt = require('bcrypt');
const Logger = require('./logger.util');

class BcryptUtil {
    static #saltRounds = 12;

    static async hash(password) {
        try {
            if (!password || typeof password !== 'string') {
                throw new Error('Password must be a non-empty string');
            }

            const hashedPassword = await bcrypt.hash(password, this.#saltRounds);
            Logger.debug('Password hashed successfully');
            return hashedPassword;
        } catch (error) {
            Logger.error('Password hashing failed', { error: error.message });
            throw error;
        }
    }

    static async compare(plainPassword, hashedPassword) {
        try {
            if (!plainPassword || !hashedPassword) {
                throw new Error('Both plain password and hashed password are required');
            }

            const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
            Logger.debug('Password comparison completed', { isMatch });
            return isMatch;
        } catch (error) {
            Logger.error('Password comparison failed', { error: error.message });
            throw error;
        }
    }

    static hashSync(password) {
        try {
            if (!password || typeof password !== 'string') {
                throw new Error('Password must be a non-empty string');
            }

            const hashedPassword = bcrypt.hashSync(password, this.#saltRounds);
            Logger.debug('Password hashed synchronously');
            return hashedPassword;
        } catch (error) {
            Logger.error('Synchronous password hashing failed', { error: error.message });
            throw error;
        }
    }

    static compareSync(plainPassword, hashedPassword) {
        try {
            if (!plainPassword || !hashedPassword) {
                throw new Error('Both plain password and hashed password are required');
            }

            const isMatch = bcrypt.compareSync(plainPassword, hashedPassword);
            Logger.debug('Password comparison completed synchronously', { isMatch });
            return isMatch;
        } catch (error) {
            Logger.error('Synchronous password comparison failed', { error: error.message });
            throw error;
        }
    }

    static async generateSalt(rounds = this.#saltRounds) {
        try {
            const salt = await bcrypt.genSalt(rounds);
            Logger.debug('Salt generated successfully');
            return salt;
        } catch (error) {
            Logger.error('Salt generation failed', { error: error.message });
            throw error;
        }
    }

    static generateSaltSync(rounds = this.#saltRounds) {
        try {
            const salt = bcrypt.genSaltSync(rounds);
            Logger.debug('Salt generated synchronously');
            return salt;
        } catch (error) {
            Logger.error('Synchronous salt generation failed', { error: error.message });
            throw error;
        }
    }
}

module.exports = BcryptUtil; 