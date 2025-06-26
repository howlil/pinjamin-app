const express = require('express');
const AuthController = require('../controllers/auth.controller');
const ValidationMiddleware = require('../middlewares/validation.middleware');
const AuthValidation = require('../validations/auth.validation');
const AuthMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// API Information
router.get('/', AuthController.getApiInfo);

// Public routes
router.post('/auth/login',
    ValidationMiddleware.validate(AuthValidation.loginSchema),
    AuthController.login
);

router.post('/auth/register',
    ValidationMiddleware.validate(AuthValidation.registerSchema),
    AuthController.register
);

router.post('/auth/forgot-password',
    ValidationMiddleware.validate(AuthValidation.forgotPasswordSchema),
    AuthController.forgotPassword
);

router.post('/auth/reset-password',
    ValidationMiddleware.validate(AuthValidation.resetPasswordSchema),
    AuthController.resetPassword
);

// Protected routes
router.get('/auth/profile',
    AuthMiddleware.authenticate,
    AuthController.getProfile
);

router.patch('/auth/profile',
    AuthMiddleware.authenticate,
    ValidationMiddleware.validate(AuthValidation.updateProfileSchema),
    AuthController.updateProfile
);

router.post('/auth/logout',
    AuthMiddleware.authenticate,
    AuthController.logout
);

router.post('/auth/change-password',
    AuthMiddleware.authenticate,
    ValidationMiddleware.validate(AuthValidation.changePasswordSchema),
    AuthController.changePassword
);

module.exports = router; 