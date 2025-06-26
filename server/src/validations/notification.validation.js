const Joi = require('joi');

const NotificationValidation = {
    // Notification query validation
    notificationQuerySchema: Joi.object({
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

    // Notification params validation
    notificationParamsSchema: Joi.object({
        id: Joi.string()
            .uuid()
            .required()
            .messages({
                'string.uuid': 'Notification ID harus berformat UUID yang valid',
                'any.required': 'Notification ID wajib diisi'
            })
    })
};

module.exports = NotificationValidation; 