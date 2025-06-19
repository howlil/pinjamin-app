const Joi = require('joi');

class BuildingValidation {
    static create = Joi.object({
        buildingName: Joi.string()
            .min(2)
            .max(100)
            .required()
            .messages({
                'string.empty': 'Building name is required',
                'string.min': 'Building name must be at least 2 characters',
                'string.max': 'Building name must not exceed 100 characters'
            }),

        description: Joi.string()
            .min(10)
            .max(500)
            .required()
            .messages({
                'string.empty': 'Description is required',
                'string.min': 'Description must be at least 10 characters',
                'string.max': 'Description must not exceed 500 characters'
            }),

        rentalPrice: Joi.number()
            .positive()
            .required()
            .messages({
                'number.positive': 'Rental price must be a positive number',
                'number.base': 'Rental price must be a number',
                'any.required': 'Rental price is required'
            }),

        capacity: Joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.integer': 'Capacity must be an integer',
                'number.positive': 'Capacity must be a positive number',
                'any.required': 'Capacity is required'
            }),

        location: Joi.string()
            .min(5)
            .max(200)
            .required()
            .messages({
                'string.empty': 'Location is required',
                'string.min': 'Location must be at least 5 characters',
                'string.max': 'Location must not exceed 200 characters'
            }),

        buildingType: Joi.string()
            .valid('CLASSROOM', 'PKM', 'LABORATORY', 'MULTIFUNCTION', 'SEMINAR')
            .required()
            .messages({
                'any.only': 'Building type must be one of: CLASSROOM, PKM, LABORATORY, MULTIFUNCTION, SEMINAR',
                'string.empty': 'Building type is required'
            }),

        facilities: Joi.array()
            .items(
                Joi.object({
                    facilityName: Joi.string().min(2).max(50).required(),
                    iconUrl: Joi.string().uri().optional()
                })
            )
            .optional()
            .default([]),

        buildingManagers: Joi.array()
            .items(
                Joi.object({
                    managerName: Joi.string().min(2).max(100).required(),
                    phoneNumber: Joi.string().pattern(/^[0-9+\-\s()]+$/).min(10).max(20).required()
                })
            )
            .optional()
            .default([])
    });

    static update = Joi.object({
        buildingName: Joi.string()
            .min(2)
            .max(100)
            .optional()
            .messages({
                'string.min': 'Building name must be at least 2 characters',
                'string.max': 'Building name must not exceed 100 characters'
            }),

        description: Joi.string()
            .min(10)
            .max(500)
            .optional()
            .messages({
                'string.min': 'Description must be at least 10 characters',
                'string.max': 'Description must not exceed 500 characters'
            }),

        rentalPrice: Joi.number()
            .positive()
            .optional()
            .messages({
                'number.positive': 'Rental price must be a positive number',
                'number.base': 'Rental price must be a number'
            }),

        capacity: Joi.number()
            .integer()
            .positive()
            .optional()
            .messages({
                'number.integer': 'Capacity must be an integer',
                'number.positive': 'Capacity must be a positive number'
            }),

        location: Joi.string()
            .min(5)
            .max(200)
            .optional()
            .messages({
                'string.min': 'Location must be at least 5 characters',
                'string.max': 'Location must not exceed 200 characters'
            }),

        buildingType: Joi.string()
            .valid('CLASSROOM', 'PKM', 'LABORATORY', 'MULTIFUNCTION', 'SEMINAR')
            .optional()
            .messages({
                'any.only': 'Building type must be one of: CLASSROOM, PKM, LABORATORY, MULTIFUNCTION, SEMINAR'
            }),

        facilities: Joi.array()
            .items(
                Joi.object({
                    id: Joi.string().uuid().optional(),
                    facilityName: Joi.string().min(2).max(50).required(),
                    iconUrl: Joi.string().uri().optional()
                })
            )
            .optional(),

        buildingManagers: Joi.array()
            .items(
                Joi.object({
                    id: Joi.string().uuid().optional(),
                    managerName: Joi.string().min(2).max(100).required(),
                    phoneNumber: Joi.string().pattern(/^[0-9+\-\s()]+$/).min(10).max(20).required()
                })
            )
            .optional()
    }).min(1).messages({
        'object.min': 'At least one field must be provided for update'
    });

    static checkAvailability = Joi.object({
        date: Joi.string()
            .pattern(/^\d{2}-\d{2}-\d{4}$/)
            .required()
            .messages({
                'string.pattern.base': 'Date must be in DD-MM-YYYY format',
                'string.empty': 'Date is required'
            }),

        time: Joi.string()
            .pattern(/^\d{2}:\d{2}$/)
            .required()
            .messages({
                'string.pattern.base': 'Time must be in HH:MM format',
                'string.empty': 'Time is required'
            })
    });

    static getBuildings = Joi.object({
        search: Joi.string().min(1).max(100).optional(),
        buildingType: Joi.string()
            .valid('CLASSROOM', 'PKM', 'LABORATORY', 'MULTIFUNCTION', 'SEMINAR')
            .optional(),
        page: Joi.number().integer().min(1).default(1).optional(),
        limit: Joi.number().integer().min(1).max(100).default(10).optional()
    });

    static getBuildingSchedule = Joi.object({
        month: Joi.number().integer().min(1).max(12).optional(),
        year: Joi.number().integer().min(2020).max(2030).optional()
    });

    static params = Joi.object({
        id: Joi.string()
            .uuid()
            .required()
            .messages({
                'string.guid': 'Invalid building ID format',
                'string.empty': 'Building ID is required'
            })
    });
}

module.exports = BuildingValidation; 