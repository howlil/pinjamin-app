const Joi = require('joi');

const TransactionValidation = {
    // Transaction history query validation
    historyQuerySchema: Joi.object({
        page: Joi.number()
            .integer()
            .min(1)
            .default(1)
            .messages({
                'number.integer': 'Page harus berupa angka bulat',
                'number.min': 'Page minimal 1'
            }),
        limit: Joi.number()
            .integer()
            .min(1)
            .max(100)
            .default(10)
            .messages({
                'number.integer': 'Limit harus berupa angka bulat',
                'number.min': 'Limit minimal 1',
                'number.max': 'Limit maksimal 100'
            })
    }),

    // Export query validation
    exportQuerySchema: Joi.object({
        month: Joi.number()
            .integer()
            .min(1)
            .max(12)
            .default(new Date().getMonth() + 1)
            .messages({
                'number.integer': 'Month harus berupa angka bulat',
                'number.min': 'Month minimal 1',
                'number.max': 'Month maksimal 12'
            }),
        year: Joi.number()
            .integer()
            .min(2020)
            .max(new Date().getFullYear() + 1)
            .default(new Date().getFullYear())
            .messages({
                'number.integer': 'Year harus berupa angka bulat',
                'number.min': 'Year minimal 2020'
            })
    }),

    // ===== ADMIN VALIDATIONS =====

    // Admin pagination query validation
    adminPaginationQuerySchema: Joi.object({
        page: Joi.number()
            .integer()
            .min(1)
            .default(1)
            .messages({
                'number.integer': 'Page harus berupa angka bulat',
                'number.min': 'Page minimal 1'
            }),
        limit: Joi.number()
            .integer()
            .min(1)
            .max(100)
            .default(10)
            .messages({
                'number.integer': 'Limit harus berupa angka bulat',
                'number.min': 'Limit minimal 1',
                'number.max': 'Limit maksimal 100'
            })
    })
};

module.exports = TransactionValidation; 