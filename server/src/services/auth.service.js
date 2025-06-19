const { prisma } = require('../configs');
const { BcryptUtil, JWTUtil, ErrorHandler } = require('../utils');

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
}

module.exports = AuthService; 