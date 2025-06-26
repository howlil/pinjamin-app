const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const prisma = require('../libs/database.lib');
const JwtHelper = require('../libs/jwt.lib');
const logger = require('../libs/logger.lib');
const EmailHelper = require('../libs/email.lib');

const AuthService = {
    // Login user
    async login(email, password) {
        try {
            // Find user by email
            const user = await prisma.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    password: true,
                    phoneNumber: true,
                    borrowerType: true,
                    role: true,
                    bankName: true,
                    bankNumber: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            if (!user) {
                throw new Error('Email atau password salah');
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Email atau password salah');
            }

            // Generate JWT token
            const tokenPayload = {
                id: user.id,
                email: user.email,
                role: user.role
            };

            const token = JwtHelper.generateToken(tokenPayload, '24h');

            // Store token in database
            await prisma.token.create({
                data: {
                    id: uuidv4(),
                    userId: user.id,
                    token: token
                }
            });

            // Remove password from response
            const { password: _, ...userWithoutPassword } = user;

            return {
                user: userWithoutPassword,
                token: token
            };
        } catch (error) {
            logger.error('Auth service login error:', error);
            throw error;
        }
    },

    // Register new user
    async register(userData) {
        try {
            const { fullName, email, password, borrowerType, phoneNumber, bankName, bankNumber } = userData;

            // Check if email already exists
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUser) {
                throw new Error('Email sudah terdaftar');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 12);

            // Create user
            const newUser = await prisma.user.create({
                data: {
                    id: uuidv4(),
                    fullName,
                    email,
                    password: hashedPassword,
                    borrowerType,
                    phoneNumber,
                    bankName,
                    bankNumber,
                    role: 'BORROWER' // Default role
                },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phoneNumber: true,
                    borrowerType: true,
                    role: true,
                    bankName: true,
                    bankNumber: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            // Generate JWT token
            const tokenPayload = {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role
            };

            const token = JwtHelper.generateToken(tokenPayload, '24h');

            // Store token in database
            await prisma.token.create({
                data: {
                    id: uuidv4(),
                    userId: newUser.id,
                    token: token
                }
            });

            return {
                user: newUser,
                token: token
            };
        } catch (error) {
            logger.error('Auth service register error:', error);
            throw error;
        }
    },

    // Get user profile
    async getProfile(userId) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phoneNumber: true,
                    borrowerType: true,
                    role: true,
                    bankName: true,
                    bankNumber: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            if (!user) {
                throw new Error('User tidak ditemukan');
            }

            return user;
        } catch (error) {
            logger.error('Auth service get profile error:', error);
            throw error;
        }
    },

    // Update user profile
    async updateProfile(userId, updateData) {
        try {
            // Check if user exists
            const existingUser = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!existingUser) {
                throw new Error('User tidak ditemukan');
            }

            // Check if email is being updated and already exists
            if (updateData.email && updateData.email !== existingUser.email) {
                const emailExists = await prisma.user.findUnique({
                    where: { email: updateData.email }
                });

                if (emailExists) {
                    throw new Error('Email sudah digunakan');
                }
            }

            // Update user
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: updateData,
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phoneNumber: true,
                    borrowerType: true,
                    role: true,
                    bankName: true,
                    bankNumber: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            return updatedUser;
        } catch (error) {
            logger.error('Auth service update profile error:', error);
            throw error;
        }
    },

    // Logout user
    async logout(userId, token) {
        try {
            // Remove token from database
            await prisma.token.deleteMany({
                where: {
                    userId: userId,
                    token: token
                }
            });

            return { success: true };
        } catch (error) {
            logger.error('Auth service logout error:', error);
            throw error;
        }
    },

    // Change password
    async changePassword(userId, currentPassword, newPassword) {
        try {
            // Get user
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) {
                throw new Error('User tidak ditemukan');
            }

            // Verify current password
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                throw new Error('Password lama tidak sesuai');
            }

            // Hash new password
            const hashedNewPassword = await bcrypt.hash(newPassword, 12);

            // Update password
            await prisma.user.update({
                where: { id: userId },
                data: { password: hashedNewPassword }
            });

            return { success: true };
        } catch (error) {
            logger.error('Auth service change password error:', error);
            throw error;
        }
    },

    // Forgot password
    async forgotPassword(email) {
        try {
            // Find user by email
            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (!user) {
                throw new Error('User tidak ditemukan');
            }

            // Generate reset token
            const resetToken = crypto.randomBytes(32).toString('hex');
            const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

            // Store token in database (expires in 10 minutes)
            await prisma.token.create({
                data: {
                    id: uuidv4(),
                    userId: user.id,
                    token: hashedToken
                }
            });

            // Check if email service is configured and ready
            if (!EmailHelper.isConfigured()) {
                logger.warn('Email service not configured, using fallback mode for password reset');
                logger.info('Email configuration status:', EmailHelper.getConfigurationStatus());
                return {
                    success: true,
                    message: "Instruksi reset password telah disiapkan. Hubungi administrator jika tidak menerima email."
                };
            }

            // Try to send email if SMTP is configured
            try {
                await EmailHelper.sendPasswordResetEmail(email, resetToken, user.fullName);
                logger.info(`Password reset email sent successfully to ${email}`);

                return {
                    success: true,
                    message: "Instruksi reset password telah dikirim ke email Anda"
                };
            } catch (emailError) {
                logger.error('Failed to send password reset email:', emailError);
                logger.error('Email error details:', {
                    error: emailError.message,
                    code: emailError.code,
                    command: emailError.command
                });

                // Use fallback mode when email fails
                logger.warn('Email service failed, switching to fallback mode');
                return {
                    success: true,
                    message: "Email sedang bermasalah. Token reset telah dibuat. Silakan hubungi administrator untuk mendapatkan token reset."
                };
            }
        } catch (error) {
            logger.error('Auth service forgot password error:', error);
            throw error;
        }
    },

    // Reset password
    async resetPassword(token, newPassword) {
        try {
            // Hash the provided token
            const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

            // Find token in database
            const tokenRecord = await prisma.token.findFirst({
                where: {
                    token: hashedToken
                },
                include: {
                    user: true
                }
            });

            if (!tokenRecord) {
                throw new Error('Token tidak valid atau sudah expired');
            }

            // Check if token is expired (10 minutes)
            const tokenAge = Date.now() - tokenRecord.createdAt.getTime();
            const tenMinutes = 10 * 60 * 1000;

            if (tokenAge > tenMinutes) {
                // Delete expired token
                await prisma.token.delete({
                    where: { id: tokenRecord.id }
                });
                throw new Error('Token tidak valid atau sudah expired');
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 12);

            // Update password
            await prisma.user.update({
                where: { id: tokenRecord.userId },
                data: { password: hashedPassword }
            });

            // Delete the used token
            await prisma.token.delete({
                where: { id: tokenRecord.id }
            });

            return { success: true };
        } catch (error) {
            logger.error('Auth service reset password error:', error);
            throw error;
        }
    },

    // Verify token
    async verifyToken(token) {
        try {
            // Check if token exists in database
            const tokenRecord = await prisma.token.findFirst({
                where: { token },
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            role: true,
                            borrowerType: true,
                            phoneNumber: true,
                            bankName: true,
                            bankNumber: true
                        }
                    }
                }
            });

            if (!tokenRecord) {
                throw new Error('Token tidak valid');
            }

            // Verify JWT token
            const decoded = JwtHelper.verifyToken(token);

            return {
                user: tokenRecord.user,
                tokenData: decoded
            };
        } catch (error) {
            logger.error('Auth service verify token error:', error);
            throw error;
        }
    }
};

module.exports = AuthService; 