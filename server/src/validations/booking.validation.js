const Joi = require('joi');
const moment = require('moment');

const BookingValidation = {
    // Create booking validation schema
    createBookingSchema: Joi.object({
        buildingId: Joi.string()
            .uuid()
            .required()
            .messages({
                'string.uuid': 'Building ID harus berformat UUID yang valid',
                'any.required': 'Building ID wajib diisi'
            }),
        activityName: Joi.string()
            .min(3)
            .max(200)
            .required()
            .messages({
                'string.min': 'Nama aktivitas minimal 3 karakter',
                'string.max': 'Nama aktivitas maksimal 200 karakter',
                'any.required': 'Nama aktivitas wajib diisi'
            }),
        startDate: Joi.string()
            .pattern(/^\d{2}-\d{2}-\d{4}$/)
            .required()
            .custom((value, helpers) => {
                const inputDate = moment(value, 'DD-MM-YYYY');
                const today = moment().startOf('day');

                if (!inputDate.isValid()) {
                    return helpers.error('custom.invalidDate');
                }

                if (inputDate.isBefore(today)) {
                    return helpers.error('custom.pastDate');
                }

                return value;
            })
            .messages({
                'string.pattern.base': 'Format tanggal mulai harus DD-MM-YYYY',
                'any.required': 'Tanggal mulai wajib diisi',
                'custom.invalidDate': 'Tanggal mulai tidak valid',
                'custom.pastDate': 'Tanggal mulai tidak boleh di masa lalu'
            }),
        endDate: Joi.string()
            .pattern(/^\d{2}-\d{2}-\d{4}$/)
            .optional()
            .allow('', null)
            .custom((value, helpers) => {
                // If endDate is empty or null, it's valid (optional)
                if (!value || value === '') {
                    return value;
                }

                const endDate = moment(value, 'DD-MM-YYYY');
                if (!endDate.isValid()) {
                    return helpers.error('custom.invalidDate');
                }

                // Get startDate from the same object being validated
                const startDateValue = helpers.state.ancestors[0].startDate;
                if (startDateValue) {
                    const startDate = moment(startDateValue, 'DD-MM-YYYY');
                    if (startDate.isValid() && endDate.isBefore(startDate)) {
                        return helpers.error('custom.beforeStartDate');
                    }
                }

                return value;
            })
            .messages({
                'string.pattern.base': 'Format tanggal selesai harus DD-MM-YYYY',
                'custom.invalidDate': 'Tanggal selesai tidak valid',
                'custom.beforeStartDate': 'Tanggal selesai tidak boleh sebelum tanggal mulai'
            }),
        startTime: Joi.string()
            .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
            .required()
            .custom((value, helpers) => {
                const time = moment(value, 'HH:mm');
                if (!time.isValid()) {
                    return helpers.error('custom.invalidTime');
                }

                const hour = time.hour();
                // Business hours: 07:00 - 21:00
                if (hour < 7 || hour >= 21) {
                    return helpers.error('custom.outsideBusinessHours');
                }

                return value;
            })
            .messages({
                'string.pattern.base': 'Format waktu mulai harus HH:MM (24 jam)',
                'any.required': 'Waktu mulai wajib diisi',
                'custom.invalidTime': 'Format waktu mulai tidak valid',
                'custom.outsideBusinessHours': 'Waktu mulai harus dalam jam operasional (07:00 - 21:00)'
            }),
        endTime: Joi.string()
            .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
            .required()
            .custom((value, helpers) => {
                const endTime = moment(value, 'HH:mm');
                if (!endTime.isValid()) {
                    return helpers.error('custom.invalidTime');
                }

                const hour = endTime.hour();
                // Business hours: 07:00 - 21:00
                if (hour < 7 || hour > 21) {
                    return helpers.error('custom.outsideBusinessHours');
                }

                // Check if endTime is after startTime
                const startTimeValue = helpers.state.ancestors[0].startTime;
                if (startTimeValue) {
                    const startTime = moment(startTimeValue, 'HH:mm');
                    if (startTime.isValid() && endTime.isSameOrBefore(startTime)) {
                        return helpers.error('custom.beforeStartTime');
                    }
                }

                return value;
            })
            .messages({
                'string.pattern.base': 'Format waktu selesai harus HH:MM (24 jam)',
                'any.required': 'Waktu selesai wajib diisi',
                'custom.invalidTime': 'Format waktu selesai tidak valid',
                'custom.outsideBusinessHours': 'Waktu selesai harus dalam jam operasional (07:00 - 21:00)',
                'custom.beforeStartTime': 'Waktu selesai harus setelah waktu mulai'
            })
    }),

    // Booking params validation
    bookingParamsSchema: Joi.object({
        id: Joi.string()
            .uuid()
            .required()
            .messages({
                'string.uuid': 'Booking ID harus berformat UUID yang valid',
                'any.required': 'Booking ID wajib diisi'
            })
    }),

    // Booking history query validation
    historyQuerySchema: Joi.object({
        status: Joi.string()
            .valid('PROCESSING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED')
            .optional()
            .allow('', null)
            .messages({
                'any.only': 'Status harus salah satu dari: PROCESSING, APPROVED, REJECTED, COMPLETED, CANCELLED'
            }),
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

    // Payment processing validation
    processPaymentSchema: Joi.object({
        bookingId: Joi.string()
            .uuid()
            .required()
            .messages({
                'string.uuid': 'Booking ID harus berformat UUID yang valid',
                'any.required': 'Booking ID wajib diisi'
            })
    }),

    // ===== ADMIN VALIDATIONS =====

    // Get bookings query validation (admin)
    adminGetBookingsQuerySchema: Joi.object({
        status: Joi.string()
            .valid('PROCESSING', 'APPROVED', 'REJECTED', 'COMPLETED')
            .optional()
            .allow('', null)
            .default('')
            .messages({
                'any.only': 'Status harus salah satu dari: PROCESSING, APPROVED, REJECTED, COMPLETED'
            }),
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

    // Booking approval validation
    bookingApprovalSchema: Joi.object({
        bookingStatus: Joi.string()
            .valid('APPROVED', 'REJECTED')
            .required()
            .messages({
                'any.only': 'Status booking harus APPROVED atau REJECTED',
                'any.required': 'Status booking wajib diisi'
            }),
        rejectionReason: Joi.string()
            .when('bookingStatus', {
                is: 'REJECTED',
                then: Joi.required(),
                otherwise: Joi.optional()
            })
            .min(10)
            .max(500)
            .messages({
                'string.min': 'Alasan penolakan minimal 10 karakter',
                'string.max': 'Alasan penolakan maksimal 500 karakter',
                'any.required': 'Alasan penolakan wajib diisi untuk booking yang ditolak'
            })
    }),

    // Booking history query validation (admin)
    adminBookingHistoryQuerySchema: Joi.object({
        buildingId: Joi.string()
            .uuid()
            .optional()
            .messages({
                'string.uuid': 'Building ID harus berformat UUID yang valid'
            }),
        startDate: Joi.string()
            .pattern(/^\d{2}-\d{2}-\d{4}$/)
            .optional()
            .messages({
                'string.pattern.base': 'Format tanggal mulai harus DD-MM-YYYY'
            }),
        endDate: Joi.string()
            .pattern(/^\d{2}-\d{2}-\d{4}$/)
            .optional()
            .allow('', null)
            .messages({
                'string.pattern.base': 'Format tanggal selesai harus DD-MM-YYYY'
            }),
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

    // Process refund validation
    processRefundSchema: Joi.object({
        refundReason: Joi.string()
            .min(10)
            .max(500)
            .required()
            .messages({
                'string.min': 'Alasan refund minimal 10 karakter',
                'string.max': 'Alasan refund maksimal 500 karakter',
                'any.required': 'Alasan refund wajib diisi'
            })
    })
};

module.exports = BookingValidation; 