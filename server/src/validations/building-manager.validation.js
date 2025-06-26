const Joi = require('joi');

const BuildingManagerValidation = {
    // Building manager query schema
    buildingManagerQuerySchema: Joi.object({
        buildingId: Joi.string()
            .uuid()
            .optional()
            .messages({
                'string.uuid': 'Building ID harus berupa UUID yang valid'
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

    // Building manager params schema
    buildingManagerParamsSchema: Joi.object({
        id: Joi.string()
            .uuid()
            .required()
            .messages({
                'string.uuid': 'ID building manager harus berupa UUID yang valid',
                'any.required': 'ID building manager wajib diisi'
            })
    }),

    // Create building manager validation
    createBuildingManagerSchema: Joi.object({
        managerName: Joi.string()
            .min(2)
            .max(100)
            .required()
            .messages({
                'string.min': 'Nama manager minimal 2 karakter',
                'string.max': 'Nama manager maksimal 100 karakter',
                'any.required': 'Nama manager wajib diisi'
            }),
        phoneNumber: Joi.string()
            .pattern(/^08[0-9]{8,16}$/)
            .required()
            .messages({
                'string.pattern.base': 'Nomor HP harus diawali dengan 08 dan berisi 10-18 digit angka',
                'any.required': 'Nomor HP wajib diisi'
            }),
        buildingId: Joi.string()
            .uuid()
            .optional()
            .allow(null)
            .messages({
                'string.uuid': 'Building ID harus berupa UUID yang valid'
            })
    }),

    // Assign building manager validation
    assignBuildingManagerSchema: Joi.object({
        managerId: Joi.string()
            .uuid()
            .required()
            .messages({
                'string.uuid': 'Manager ID harus berupa UUID yang valid',
                'any.required': 'Manager ID wajib diisi'
            }),
        buildingId: Joi.string()
            .uuid()
            .required()
            .messages({
                'string.uuid': 'Building ID harus berupa UUID yang valid',
                'any.required': 'Building ID wajib diisi'
            })
    }),

    // Update building manager validation
    updateBuildingManagerSchema: Joi.object({
        managerName: Joi.string()
            .min(2)
            .max(100)
            .optional()
            .messages({
                'string.min': 'Nama manager minimal 2 karakter',
                'string.max': 'Nama manager maksimal 100 karakter'
            }),
        phoneNumber: Joi.string()
            .pattern(/^08[0-9]{8,16}$/)
            .optional()
            .messages({
                'string.pattern.base': 'Nomor HP harus diawali dengan 08 dan berisi 10-18 digit angka'
            }),
        buildingId: Joi.string()
            .uuid()
            .optional()
            .allow(null)
            .messages({
                'string.uuid': 'Building ID harus berupa UUID yang valid'
            })
    }).min(1).messages({
        'object.min': 'Minimal satu field harus diisi untuk update'
    })
};

module.exports = BuildingManagerValidation; 