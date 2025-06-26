const Joi = require('joi');

const DashboardValidation = {
    // Statistics query validation
    statisticsQuerySchema: Joi.object({
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
    })
};

module.exports = DashboardValidation; 