const { AuthService } = require('../services');
const { Response } = require('../utils');

class AuthController {
    static async register(req, res, next) {
        try {
            const { fullName, email, password, borrowerType, phoneNumber, bankName, bankNumber } = req.body;

            const user = await AuthService.register({
                fullName,
                email,
                password,
                borrowerType,
                phoneNumber,
                bankName,
                bankNumber
            });

            return Response.success(res, user, 'User registered successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await AuthService.login(email, password);
            return Response.success(res, result, 'Login successful');
        } catch (error) {
            next(error);
        }
    }

    static async getProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const profile = await AuthService.getProfile(userId);
            return Response.success(res, profile, 'Profile retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    static async updateProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const updateData = req.body;
            const updatedProfile = await AuthService.updateProfile(userId, updateData);
            return Response.success(res, updatedProfile, 'Profile updated successfully');
        } catch (error) {
            next(error);
        }
    }

    static async logout(req, res, next) {
        try {
            const userId = req.user.id;
            const token = req.token;
            await AuthService.logout(userId, token);
            return Response.success(res, null, 'Logout successful');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController; 