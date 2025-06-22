const Joi = require('joi');
const moment = require('moment');

// Custom validation untuk tanggal
const validateDate = (value, helpers) => {
    const date = moment(value, 'DD-MM-YYYY', true);
    if (!date.isValid()) {
        return helpers.error('date.invalid');
    }
    return value;
};

// Custom validation untuk waktu  
const validateTime = (value, helpers) => {
    const time = moment(value, 'HH:mm', true);
    if (!time.isValid()) {
        return helpers.error('time.invalid');
    }

    const hour = parseInt(value.split(':')[0]);
    const minute = parseInt(value.split(':')[1]);

    if (hour < 0 || hour > 23) {
        return helpers.error('time.hour');
    }

    if (minute < 0 || minute > 59) {
        return helpers.error('time.minute');
    }

    return value;
};

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
            .trim()
            .messages({
                'string.min': 'Activity name must be at least 3 characters',
                'string.max': 'Activity name must not exceed 200 characters',
                'any.required': 'Activity name is required',
                'string.empty': 'Activity name cannot be empty'
            }),
        startDate: Joi.string()
            .pattern(/^\d{2}-\d{2}-\d{4}$/)
            .custom(validateDate)
            .required()
            .messages({
                'string.pattern.base': 'Start date must be in DD-MM-YYYY format (e.g., 25-12-2024)',
                'any.required': 'Start date is required',
                'date.invalid': 'Start date is not a valid date. Use DD-MM-YYYY format'
            }),
        endDate: Joi.string()
            .pattern(/^\d{2}-\d{2}-\d{4}$/)
            .custom(validateDate)
            .optional()
            .allow('', null)
            .messages({
                'string.pattern.base': 'End date must be in DD-MM-YYYY format (e.g., 25-12-2024)',
                'date.invalid': 'End date is not a valid date. Use DD-MM-YYYY format'
            }),
        startTime: Joi.string()
            .pattern(/^\d{2}:\d{2}$/)
            .custom(validateTime)
            .required()
            .messages({
                'string.pattern.base': 'Start time must be in HH:MM format (e.g., 08:30)',
                'any.required': 'Start time is required',
                'time.invalid': 'Start time is not a valid time. Use HH:MM format',
                'time.hour': 'Hour must be between 00-23',
                'time.minute': 'Minute must be between 00-59'
            }),
        endTime: Joi.string()
            .pattern(/^\d{2}:\d{2}$/)
            .custom(validateTime)
            .required()
            .messages({
                'string.pattern.base': 'End time must be in HH:MM format (e.g., 17:30)',
                'any.required': 'End time is required',
                'time.invalid': 'End time is not a valid time. Use HH:MM format',
                'time.hour': 'Hour must be between 00-23',
                'time.minute': 'Minute must be between 00-59'
            })
    }).custom((value, helpers) => {
        // Cross-field validation
        const { startDate, endDate, startTime, endTime } = value;

        if (startDate && endDate) {
            const start = moment(startDate, 'DD-MM-YYYY');
            const end = moment(endDate, 'DD-MM-YYYY');

            if (start.isAfter(end)) {
                return helpers.error('date.range');
            }

            // Jika tanggal sama, cek waktu
            if (start.isSame(end, 'day') && startTime && endTime) {
                const startTimeObj = moment(startTime, 'HH:mm');
                const endTimeObj = moment(endTime, 'HH:mm');

                if (startTimeObj.isSameOrAfter(endTimeObj)) {
                    return helpers.error('time.range');
                }
            }
        }

        return value;
    }).messages({
        'date.range': 'Start date must be before or equal to end date',
        'time.range': 'Start time must be before end time when booking on the same day'
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
    }),

    refund: Joi.object({
        refundReason: Joi.string()
            .min(3)
            .max(500)
            .required()
            .messages({
                'string.min': 'Refund reason must be at least 3 characters',
                'string.max': 'Refund reason must not exceed 500 characters',
                'any.required': 'Refund reason is required'
            })
    }),

    params: Joi.object({
        id: Joi.string()
            .uuid()
            .required()
            .messages({
                'string.guid': 'Booking ID must be a valid UUID',
                'any.required': 'Booking ID is required'
            })
    })
};

module.exports = BookingValidation; 