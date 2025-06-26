const Joi = require('joi');

const FacilityValidation = {
    // Pagination query schema
    paginationQuerySchema: Joi.object({
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

    // Facility params schema
    facilityParamsSchema: Joi.object({
        id: Joi.string()
            .uuid()
            .required()
            .messages({
                'string.uuid': 'ID fasilitas harus berupa UUID yang valid',
                'any.required': 'ID fasilitas wajib diisi'
            })
    }),

    // Create facility validation
    createFacilitySchema: Joi.object({
        facilityName: Joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                'string.min': 'Nama fasilitas minimal 2 karakter',
                'string.max': 'Nama fasilitas maksimal 50 karakter',
                'any.required': 'Nama fasilitas wajib diisi'
            }),
        iconUrl: Joi.string()
            .uri()
            .optional()
            .allow(null, '')
            .messages({
                'string.uri': 'Icon URL harus berupa URL yang valid'
            })
    }),

    // Update facility validation
    updateFacilitySchema: Joi.object({
        facilityName: Joi.string()
            .min(2)
            .max(50)
            .optional()
            .messages({
                'string.min': 'Nama fasilitas minimal 2 karakter',
                'string.max': 'Nama fasilitas maksimal 50 karakter'
            }),
        iconUrl: Joi.string()
            .uri()
            .optional()
            .allow(null, '')
            .messages({
                'string.uri': 'Icon URL harus berupa URL yang valid'
            })
    }).min(1).messages({
        'object.min': 'Minimal satu field harus diisi untuk update'
    })
};

module.exports = FacilityValidation; 