const Joi = require('joi');

class AuthValidation {
    static register = Joi.object({
        fullName: Joi.string()
            .min(2)
            .max(100)
            .required()
            .messages({
                'string.empty': 'Full name is required',
                'string.min': 'Full name must be at least 2 characters',
                'string.max': 'Full name must not exceed 100 characters'
            }),

        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.empty': 'Email is required',
                'string.email': 'Please provide a valid email address'
            }),

        password: Joi.string()
            .min(6)
            .required()
            .messages({
                'string.empty': 'Password is required',
                'string.min': 'Password must be at least 6 characters'
            }),

        borrowerType: Joi.string()
            .valid('INTERNAL_UNAND', 'EXTERNAL_UNAND')
            .required()
            .messages({
                'any.only': 'Borrower type must be either INTERNAL_UNAND or EXTERNAL_UNAND',
                'string.empty': 'Borrower type is required'
            }),

        phoneNumber: Joi.string()
            .pattern(/^[0-9+\-\s()]+$/)
            .min(10)
            .max(20)
            .required()
            .messages({
                'string.empty': 'Phone number is required',
                'string.pattern.base': 'Please provide a valid phone number',
                'string.min': 'Phone number must be at least 10 characters',
                'string.max': 'Phone number must not exceed 20 characters'
            }),

        bankName: Joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                'string.empty': 'Bank name is required',
                'string.min': 'Bank name must be at least 2 characters',
                'string.max': 'Bank name must not exceed 50 characters'
            }),

        bankNumber: Joi.string()
            .pattern(/^[0-9]+$/)
            .min(8)
            .max(20)
            .required()
            .messages({
                'string.empty': 'Bank number is required',
                'string.pattern.base': 'Bank number must contain only numbers',
                'string.min': 'Bank number must be at least 8 digits',
                'string.max': 'Bank number must not exceed 20 digits'
            })
    });

    static login = Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.empty': 'Email is required',
                'string.email': 'Please provide a valid email address'
            }),

        password: Joi.string()
            .required()
            .messages({
                'string.empty': 'Password is required'
            })
    });

    static updateProfile = Joi.object({
        fullName: Joi.string()
            .min(2)
            .max(100)
            .optional()
            .messages({
                'string.min': 'Full name must be at least 2 characters',
                'string.max': 'Full name must not exceed 100 characters'
            }),

        email: Joi.string()
            .email()
            .optional()
            .messages({
                'string.email': 'Please provide a valid email address'
            }),

        phoneNumber: Joi.string()
            .pattern(/^[0-9+\-\s()]+$/)
            .min(10)
            .max(20)
            .optional()
            .messages({
                'string.pattern.base': 'Please provide a valid phone number',
                'string.min': 'Phone number must be at least 10 characters',
                'string.max': 'Phone number must not exceed 20 characters'
            }),

        borrowerType: Joi.string()
            .valid('INTERNAL_UNAND', 'EXTERNAL_UNAND')
            .optional()
            .messages({
                'any.only': 'Borrower type must be either INTERNAL_UNAND or EXTERNAL_UNAND'
            }),

        bankName: Joi.string()
            .min(2)
            .max(50)
            .optional()
            .messages({
                'string.min': 'Bank name must be at least 2 characters',
                'string.max': 'Bank name must not exceed 50 characters'
            }),

        bankNumber: Joi.string()
            .pattern(/^[0-9]+$/)
            .min(8)
            .max(20)
            .optional()
            .messages({
                'string.pattern.base': 'Bank number must contain only numbers',
                'string.min': 'Bank number must be at least 8 digits',
                'string.max': 'Bank number must not exceed 20 digits'
            })
    }).min(1).messages({
        'object.min': 'At least one field must be provided for update'
    });
}

module.exports = AuthValidation; 