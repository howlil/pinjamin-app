const Joi = require('joi');

const AuthValidation = {
    // Register validation
    registerSchema: Joi.object({
        fullName: Joi.string()
            .min(3)
            .max(100)
            .required()
            .messages({
                'string.min': 'Full name must be at least 3 characters',
                'string.max': 'Full name cannot exceed 100 characters',
                'any.required': 'Full name is required'
            }),

        email: Joi.string()
            .email()
            .required()
            .when('borrowerType', {
                is: 'INTERNAL_UNAND',
                then: Joi.string().pattern(/@unand\.id$/).messages({
                    'string.pattern.base': 'Email untuk INTERNAL_UNAND harus menggunakan domain @unand.id'
                })
            })
            .messages({
                'string.email': 'Please provide a valid email address',
                'any.required': 'Email is required'
            }),

        password: Joi.string()
            .min(8)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])'))
            .required()
            .messages({
                'string.min': 'Password must be at least 8 characters',
                'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
                'any.required': 'Password is required'
            }),

        borrowerType: Joi.string()
            .valid('INTERNAL_UNAND', 'EXTERNAL_UNAND')
            .required()
            .messages({
                'any.only': 'Borrower type must be either INTERNAL_UNAND or EXTERNAL_UNAND',
                'any.required': 'Borrower type is required'
            }),

        phoneNumber: Joi.string()
            .pattern(/^08[0-9]{8,16}$/)
            .required()
            .messages({
                'string.pattern.base': 'Nomor HP harus diawali dengan 08 dan berisi 10-18 digit angka',
                'any.required': 'Phone number is required'
            }),

        bankName: Joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                'string.min': 'Bank name must be at least 2 characters',
                'string.max': 'Bank name cannot exceed 50 characters',
                'any.required': 'Bank name is required'
            }),

        bankNumber: Joi.string()
            .pattern(/^[0-9]+$/)
            .min(8)
            .max(20)
            .required()
            .messages({
                'string.pattern.base': 'Bank number must contain only numbers',
                'string.min': 'Bank number must be at least 8 characters',
                'string.max': 'Bank number cannot exceed 20 characters',
                'any.required': 'Bank number is required'
            })
    }),

    // Login validation
    loginSchema: Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please provide a valid email address',
                'any.required': 'Email is required'
            }),

        password: Joi.string()
            .required()
            .messages({
                'any.required': 'Password is required'
            })
    }),

    // Update profile validation
    updateProfileSchema: Joi.object({
        fullName: Joi.string()
            .min(2)
            .max(100)
            .optional(),

        email: Joi.string()
            .email()
            .when('borrowerType', {
                is: 'INTERNAL_UNAND',
                then: Joi.string().pattern(/@unand\.id$/).messages({
                    'string.pattern.base': 'Email untuk INTERNAL_UNAND harus menggunakan domain @unand.id'
                })
            })
            .optional(),

        phoneNumber: Joi.string()
            .pattern(/^08[0-9]{8,16}$/)
            .messages({
                'string.pattern.base': 'Nomor HP harus diawali dengan 08 dan berisi 10-18 digit angka'
            })
            .optional(),

        borrowerType: Joi.string()
            .valid('INTERNAL_UNAND', 'EXTERNAL_UNAND')
            .optional(),

        bankName: Joi.string()
            .min(2)
            .max(50)
            .optional(),

        bankNumber: Joi.string()
            .pattern(/^[0-9]+$/)
            .min(8)
            .max(20)
            .optional()
    }).min(1).messages({
        'object.min': 'At least one field must be provided for update'
    }),

    // Change password validation
    changePasswordSchema: Joi.object({
        currentPassword: Joi.string()
            .required()
            .messages({
                'any.required': 'Current password is required'
            }),

        newPassword: Joi.string()
            .min(8)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])'))
            .required()
            .messages({
                'string.min': 'New password must be at least 8 characters',
                'string.pattern.base': 'New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
                'any.required': 'New password is required'
            }),

        confirmPassword: Joi.string()
            .valid(Joi.ref('newPassword'))
            .required()
            .messages({
                'any.only': 'Confirm password must match new password',
                'any.required': 'Confirm password is required'
            })
    }),

    // Forgot password validation
    forgotPasswordSchema: Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please provide a valid email address',
                'any.required': 'Email is required'
            })
    }),

    // Reset password validation
    resetPasswordSchema: Joi.object({
        token: Joi.string()
            .required()
            .messages({
                'any.required': 'Reset token is required'
            }),

        newPassword: Joi.string()
            .min(8)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])'))
            .required()
            .messages({
                'string.min': 'New password must be at least 8 characters',
                'string.pattern.base': 'New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
                'any.required': 'New password is required'
            }),

        confirmPassword: Joi.string()
            .valid(Joi.ref('newPassword'))
            .required()
            .messages({
                'any.only': 'Confirm password must match new password',
                'any.required': 'Confirm password is required'
            })
    })
};

module.exports = AuthValidation; 