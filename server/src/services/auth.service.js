const { prisma } = require('../configs');
const { BcryptUtil, JWTUtil, ErrorHandler, Logger } = require('../utils');
const EmailService = require('./email.service');

class AuthService {
    static async register(userData) {
        const existingUser = await prisma.user.findUnique({
            where: { email: userData.email }
        });

        if (existingUser) {
            throw ErrorHandler.conflict('Email already registered');
        }

        const hashedPassword = await BcryptUtil.hash(userData.password);

        const user = await prisma.user.create({
            data: {
                fullName: userData.fullName,
                email: userData.email,
                password: hashedPassword,
                phoneNumber: userData.phoneNumber,
                borrowerType: userData.borrowerType,
                role: 'BORROWER',
                bankName: userData.bankName,
                bankNumber: userData.bankNumber
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true
            }
        });

        return user;
    }

    static async login(email, password) {
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                fullName: true,
                email: true,
                password: true,
                role: true
            }
        });

        if (!user) {
            throw ErrorHandler.unauthorized('Invalid email or password');
        }

        const isValidPassword = await BcryptUtil.compare(password, user.password);
        if (!isValidPassword) {
            throw ErrorHandler.unauthorized('Invalid email or password');
        }

        const token = JWTUtil.generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        await prisma.token.create({
            data: {
                userId: user.id,
                token
            }
        });

        return {
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        };
    }

    static async getProfile(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
                borrowerType: true,
                bankName: true,
                bankNumber: true
            }
        });

        if (!user) {
            throw ErrorHandler.notFound('User not found');
        }

        return user;
    }

    static async updateProfile(userId, updateData) {
        if (updateData.email) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    email: updateData.email,
                    NOT: { id: userId }
                }
            });

            if (existingUser) {
                throw ErrorHandler.conflict('Email already in use');
            }
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
                borrowerType: true,
                bankName: true,
                bankNumber: true
            }
        });

        return user;
    }

    static async logout(userId, token) {
        await prisma.token.deleteMany({
            where: {
                userId,
                token
            }
        });

        return true;
    }

    static async changePassword(userId, currentPassword, newPassword) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { password: true }
        });

        if (!user) {
            throw ErrorHandler.notFound('User not found');
        }

        const isValidPassword = await BcryptUtil.compare(currentPassword, user.password);
        if (!isValidPassword) {
            throw ErrorHandler.badRequest('Current password is incorrect');
        }

        const hashedNewPassword = await BcryptUtil.hash(newPassword);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword }
        });

        return true;
    }

    static async forgotPassword(email) {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, fullName: true }
        });

        if (!user) {
            throw ErrorHandler.notFound('User not found');
        }

        // Generate reset token
        const resetToken = JWTUtil.generateToken(
            { userId: user.id, email: user.email, type: 'reset' },
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        try {
            // Send email with reset token
            await EmailService.sendResetPasswordEmail(user.email, user.fullName, resetToken);

            Logger.info('Password reset email sent successfully', {
                email: user.email,
                userId: user.id
            });

            return {
                success: true,
                message: 'Password reset instructions have been sent to your email'
            };
        } catch (error) {
            Logger.error('Failed to send password reset email:', error);
            throw ErrorHandler.internalServerError('Failed to send password reset email. Please try again later.');
        }
    }

    static async resetPassword(token, newPassword) {
        try {
            const decoded = JWTUtil.verifyToken(token);

            if (decoded.type !== 'reset') {
                throw ErrorHandler.badRequest('Invalid reset token');
            }

            const hashedPassword = await BcryptUtil.hash(newPassword);

            await prisma.user.update({
                where: { id: decoded.userId },
                data: { password: hashedPassword }
            });

            return true;
        } catch (error) {
            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                throw ErrorHandler.badRequest('Invalid or expired reset token');
            }
            throw error;
        }
    }
}

module.exports = AuthService; 