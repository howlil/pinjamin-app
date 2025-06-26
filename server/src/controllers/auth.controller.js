const AuthService = require('../services/auth.service');
const ResponseHelper = require('../libs/response.lib');
const logger = require('../libs/logger.lib');
const JwtHelper = require('../libs/jwt.lib');

const AuthController = {
    // Get API information
    async getApiInfo(req, res) {
        try {
            const data = {
                name: "Building Rental API",
                version: "1.0.0",
                description: "RESTful API for Building Rental Management System",
                timestamp: new Date().toISOString()
            };

            return ResponseHelper.success(res, 'API information retrieved successfully', data);
        } catch (error) {
            logger.error('Get API info controller error:', error);
            return ResponseHelper.error(res, 'Terjadi kesalahan saat mengambil informasi API', 500);
        }
    },

    // Login user
    async login(req, res) {
        try {
            const { email, password } = req.body;

            const result = await AuthService.login(email, password);

            return ResponseHelper.success(res, 'Login berhasil', result);
        } catch (error) {
            logger.error('Login controller error:', error);

            if (error.message === 'Email atau password salah') {
                return ResponseHelper.unauthorized(res, error.message);
            }

            return ResponseHelper.error(res, 'Terjadi kesalahan saat login', 500);
        }
    },

    // Register new user
    async register(req, res) {
        try {
            const userData = req.body;

            const result = await AuthService.register(userData);

            return ResponseHelper.success(res, 'Registrasi berhasil', result, 201);
        } catch (error) {
            logger.error('Register controller error:', error);

            if (error.message === 'Email sudah terdaftar') {
                return ResponseHelper.conflict(res, error.message);
            }

            return ResponseHelper.error(res, 'Terjadi kesalahan saat registrasi', 500);
        }
    },

    // Get user profile
    async getProfile(req, res) {
        try {
            const userId = req.user.id;

            const profile = await AuthService.getProfile(userId);

            return ResponseHelper.success(res, 'Profile berhasil diambil', profile);
        } catch (error) {
            logger.error('Get profile controller error:', error);

            if (error.message === 'User tidak ditemukan') {
                return ResponseHelper.notFound(res, error.message);
            }

            return ResponseHelper.error(res, 'Terjadi kesalahan saat mengambil profile', 500);
        }
    },

    // Update user profile
    async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const updateData = req.body;

            const result = await AuthService.updateProfile(userId, updateData);

            return ResponseHelper.success(res, 'Profile berhasil diupdate', result);
        } catch (error) {
            logger.error('Update profile controller error:', error);

            if (error.message === 'User tidak ditemukan') {
                return ResponseHelper.notFound(res, error.message);
            }

            if (error.message === 'Email sudah digunakan') {
                return ResponseHelper.conflict(res, error.message);
            }

            return ResponseHelper.error(res, 'Terjadi kesalahan saat mengupdate profile', 500);
        }
    },

    // Logout user
    async logout(req, res) {
        try {
            const userId = req.user.id;
            const token = JwtHelper.extractTokenFromHeader(req.headers.authorization);

            await AuthService.logout(userId, token);

            return ResponseHelper.success(res, 'Logout berhasil', { success: true });
        } catch (error) {
            logger.error('Logout controller error:', error);
            return ResponseHelper.error(res, 'Terjadi kesalahan saat logout', 500);
        }
    },

    // Change password
    async changePassword(req, res) {
        try {
            const userId = req.user.id;
            const { currentPassword, newPassword } = req.body;

            await AuthService.changePassword(userId, currentPassword, newPassword);

            return ResponseHelper.success(res, 'Password berhasil diubah', { success: true });
        } catch (error) {
            logger.error('Change password controller error:', error);

            if (error.message === 'Password lama tidak sesuai') {
                return ResponseHelper.badRequest(res, error.message);
            }

            if (error.message === 'User tidak ditemukan') {
                return ResponseHelper.notFound(res, error.message);
            }

            return ResponseHelper.error(res, 'Terjadi kesalahan saat mengubah password', 500);
        }
    },

    // Forgot password
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            const result = await AuthService.forgotPassword(email);

            return ResponseHelper.success(res, result.message, result);
        } catch (error) {
            logger.error('Forgot password controller error:', error);

            if (error.message === 'User tidak ditemukan') {
                return ResponseHelper.notFound(res, 'Email tidak ditemukan');
            }

            if (error.message.includes('Layanan email sedang tidak tersedia')) {
                return ResponseHelper.error(res, error.message, 503);
            }

            if (error.message.includes('Email service error')) {
                return ResponseHelper.error(res, 'Layanan email sedang bermasalah. Silakan coba lagi nanti.', 503);
            }

            return ResponseHelper.error(res, 'Terjadi kesalahan saat memproses permintaan reset password', 500);
        }
    },

    // Reset password
    async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;

            await AuthService.resetPassword(token, newPassword);

            return ResponseHelper.success(res, 'Password berhasil direset', { success: true });
        } catch (error) {
            logger.error('Reset password controller error:', error);

            if (error.message === 'Token tidak valid atau sudah expired') {
                return ResponseHelper.badRequest(res, error.message);
            }

            return ResponseHelper.error(res, 'Terjadi kesalahan saat mereset password', 500);
        }
    }
};

module.exports = AuthController; 