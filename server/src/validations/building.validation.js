const Joi = require('joi');
const moment = require('moment');

const BuildingValidation = {
    // Building params schema
    buildingParamsSchema: Joi.object({
        id: Joi.string()
            .uuid({ version: 'uuidv4' })
            .required()
            .messages({
                'string.guid': 'ID building harus berupa UUID yang valid',
                'any.required': 'ID building wajib diisi'
            })
    }),

    // Check availability schema
    checkAvailabilitySchema: Joi.object({
        date: Joi.string()
            .pattern(/^\d{2}-\d{2}-\d{4}$/)
            .required()
            .custom((value, helpers) => {
                // Validate if date is valid and not in the past
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
                'string.pattern.base': 'Format tanggal harus DD-MM-YYYY',
                'any.required': 'Tanggal wajib diisi',
                'custom.invalidDate': 'Tanggal tidak valid',
                'custom.pastDate': 'Tanggal tidak boleh di masa lalu'
            }),
        time: Joi.string()
            .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
            .required()
            .custom((value, helpers) => {
                // Validate time format and business hours
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
                'string.pattern.base': 'Format waktu harus HH:MM (24 jam)',
                'any.required': 'Waktu wajib diisi',
                'custom.invalidTime': 'Format waktu tidak valid',
                'custom.outsideBusinessHours': 'Waktu harus dalam jam operasional (07:00 - 21:00)'
            })
    }),

    // Get buildings query schema
    getBuildingsQuerySchema: Joi.object({
        search: Joi.string()
            .min(1)
            .max(100)
            .optional()
            .messages({
                'string.min': 'Keyword pencarian minimal 1 karakter',
                'string.max': 'Keyword pencarian maksimal 100 karakter'
            }),
        buildingType: Joi.string()
            .valid('CLASSROOM', 'PKM', 'LABORATORY', 'MULTIFUNCTION', 'SEMINAR')
            .optional()
            .messages({
                'any.only': 'Tipe building harus salah satu dari: CLASSROOM, PKM, LABORATORY, MULTIFUNCTION, SEMINAR'
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

    // Schedule query schema
    scheduleQuerySchema: Joi.object({
        month: Joi.number()
            .integer()
            .min(1)
            .max(12)
            .optional()
            .messages({
                'number.integer': 'Bulan harus berupa angka bulat',
                'number.min': 'Bulan minimal 1',
                'number.max': 'Bulan maksimal 12'
            }),
        year: Joi.number()
            .integer()
            .min(2020)
            .max(2030)
            .optional()
            .messages({
                'number.integer': 'Tahun harus berupa angka bulat',
                'number.min': 'Tahun minimal 2020',
                'number.max': 'Tahun maksimal 2030'
            })
    }),

    // ===== ADMIN VALIDATIONS =====

    // Create building validation
    createBuildingSchema: Joi.object({
        buildingName: Joi.string()
            .min(3)
            .max(100)
            .required()
            .messages({
                'string.min': 'Nama building minimal 3 karakter',
                'string.max': 'Nama building maksimal 100 karakter',
                'any.required': 'Nama building wajib diisi'
            }),
        description: Joi.string()
            .min(10)
            .max(500)
            .required()
            .messages({
                'string.min': 'Deskripsi minimal 10 karakter',
                'string.max': 'Deskripsi maksimal 500 karakter',
                'any.required': 'Deskripsi wajib diisi'
            }),
        rentalPrice: Joi.number()
            .integer()
            .min(1000)
            .required()
            .messages({
                'number.integer': 'Harga sewa harus berupa angka bulat',
                'number.min': 'Harga sewa minimal Rp 1.000',
                'any.required': 'Harga sewa wajib diisi'
            }),
        capacity: Joi.number()
            .integer()
            .min(1)
            .required()
            .messages({
                'number.integer': 'Kapasitas harus berupa angka bulat',
                'number.min': 'Kapasitas minimal 1 orang',
                'any.required': 'Kapasitas wajib diisi'
            }),
        location: Joi.string()
            .min(5)
            .max(200)
            .required()
            .messages({
                'string.min': 'Lokasi minimal 5 karakter',
                'string.max': 'Lokasi maksimal 200 karakter',
                'any.required': 'Lokasi wajib diisi'
            }),
        buildingType: Joi.string()
            .valid('CLASSROOM', 'PKM', 'LABORATORY', 'MULTIFUNCTION', 'SEMINAR')
            .required()
            .messages({
                'any.only': 'Tipe building harus salah satu dari: CLASSROOM, PKM, LABORATORY, MULTIFUNCTION, SEMINAR',
                'any.required': 'Tipe building wajib diisi'
            }),
        facilities: Joi.string()
            .optional()
            .messages({
                'string.base': 'Facilities harus berupa string JSON array valid'
            }),
        buildingManagers: Joi.string()
            .optional()
            .messages({
                'string.base': 'Building managers harus berupa string JSON array valid'
            })
    }),

    // Update building validation
    updateBuildingSchema: Joi.object({
        buildingName: Joi.string()
            .min(3)
            .max(100)
            .optional()
            .messages({
                'string.min': 'Nama building minimal 3 karakter',
                'string.max': 'Nama building maksimal 100 karakter'
            }),
        description: Joi.string()
            .min(10)
            .max(500)
            .optional()
            .messages({
                'string.min': 'Deskripsi minimal 10 karakter',
                'string.max': 'Deskripsi maksimal 500 karakter'
            }),
        rentalPrice: Joi.number()
            .integer()
            .min(1000)
            .optional()
            .messages({
                'number.integer': 'Harga sewa harus berupa angka bulat',
                'number.min': 'Harga sewa minimal Rp 1.000'
            }),
        capacity: Joi.number()
            .integer()
            .min(1)
            .optional()
            .messages({
                'number.integer': 'Kapasitas harus berupa angka bulat',
                'number.min': 'Kapasitas minimal 1 orang'
            }),
        location: Joi.string()
            .min(5)
            .max(200)
            .optional()
            .messages({
                'string.min': 'Lokasi minimal 5 karakter',
                'string.max': 'Lokasi maksimal 200 karakter'
            }),
        buildingType: Joi.string()
            .valid('CLASSROOM', 'PKM', 'LABORATORY', 'MULTIFUNCTION', 'SEMINAR')
            .optional()
            .messages({
                'any.only': 'Tipe building harus salah satu dari: CLASSROOM, PKM, LABORATORY, MULTIFUNCTION, SEMINAR'
            }),
        facilities: Joi.string()
            .optional()
            .messages({
                'string.base': 'Facilities harus berupa string JSON array valid'
            }),
        buildingManagers: Joi.string()
            .optional()
            .messages({
                'string.base': 'Building managers harus berupa string JSON array valid'
            })
    }),

    // Admin pagination query validation
    adminPaginationQuerySchema: Joi.object({
        search: Joi.string()
            .min(1)
            .max(100)
            .optional()
            .messages({
                'string.min': 'Keyword pencarian minimal 1 karakter',
                'string.max': 'Keyword pencarian maksimal 100 karakter'
            }),
        buildingType: Joi.string()
            .valid('CLASSROOM', 'PKM', 'LABORATORY', 'MULTIFUNCTION', 'SEMINAR')
            .optional()
            .messages({
                'any.only': 'Tipe building harus salah satu dari: CLASSROOM, PKM, LABORATORY, MULTIFUNCTION, SEMINAR'
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
    })
};

module.exports = BuildingValidation; 