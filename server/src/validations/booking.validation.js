const Joi = require('joi');

const BookingValidation = {
    create: Joi.object({
        buildingId: Joi.string()
            .uuid()
            .required()
            .messages({
                'string.guid': 'Building ID must be a valid UUID',
                'any.required': 'Building ID is required'
            }),
        activityName: Joi.string()
            .min(3)
            .max(200)
            .required()
            .messages({
                'string.min': 'Activity name must be at least 3 characters',
                'string.max': 'Activity name must not exceed 200 characters',
                'any.required': 'Activity name is required'
            }),
        startDate: Joi.string()
            .pattern(/^\d{2}-\d{2}-\d{4}$/)
            .required()
            .messages({
                'string.pattern.base': 'Start date must be in DD-MM-YYYY format',
                'any.required': 'Start date is required'
            }),
        endDate: Joi.string()
            .pattern(/^\d{2}-\d{2}-\d{4}$/)
            .optional()
            .allow('')
            .messages({
                'string.pattern.base': 'End date must be in DD-MM-YYYY format'
            }),
        startTime: Joi.string()
            .pattern(/^\d{2}:\d{2}$/)
            .required()
            .messages({
                'string.pattern.base': 'Start time must be in HH:MM format',
                'any.required': 'Start time is required'
            }),
        endTime: Joi.string()
            .pattern(/^\d{2}:\d{2}$/)
            .required()
            .messages({
                'string.pattern.base': 'End time must be in HH:MM format',
                'any.required': 'End time is required'
            }),
        proposalLetter: Joi.any()
            .required()
            .messages({
                'any.required': 'Proposal letter file is required'
            })
    }),

    approveReject: Joi.object({
        bookingStatus: Joi.string()
            .valid('APPROVED', 'REJECTED')
            .required()
            .messages({
                'any.only': 'Booking status must be either APPROVED or REJECTED',
                'any.required': 'Booking status is required'
            }),
        rejectionReason: Joi.string()
            .when('bookingStatus', {
                is: 'REJECTED',
                then: Joi.required(),
                otherwise: Joi.optional()
            })
            .messages({
                'any.required': 'Rejection reason is required when rejecting a booking'
            })
    })
};

module.exports = BookingValidation; 