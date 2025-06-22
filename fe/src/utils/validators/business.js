// Helper function to convert time string to minutes
function timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

// Time pattern regex
const TIME_PATTERN = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

// Helper functions
const validateRequired = (value, fieldName) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
        return `${fieldName} wajib diisi`;
    }
    return null;
};

const validateStringLength = (value, min, max, fieldName) => {
    if (!value || typeof value !== 'string') {
        return `${fieldName} harus berupa string`;
    }
    if (value.length < min) {
        return `${fieldName} harus minimal ${min} karakter`;
    }
    if (value.length > max) {
        return `${fieldName} maksimal ${max} karakter`;
    }
    return null;
};

const validateNumber = (value, min, max, fieldName) => {
    if (typeof value !== 'number' || isNaN(value)) {
        return `${fieldName} harus berupa angka`;
    }
    if (value < min) {
        return `${fieldName} minimal ${min}`;
    }
    if (value > max) {
        return `${fieldName} maksimal ${max}`;
    }
    return null;
};

const validateUri = (value, fieldName) => {
    if (!value) return null; // Optional field
    try {
        new URL(value);
        return null;
    } catch {
        return `${fieldName} harus berformat URL yang valid`;
    }
};

const validateEmail = (value, fieldName) => {
    if (!value) return null; // Optional field
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value) ? null : `Format ${fieldName} tidak valid`;
};

// Building validation
export const validateBuilding = (data) => {
    const errors = [];

    // Validate buildingName
    const nameRequired = validateRequired(data.buildingName, 'Nama gedung');
    if (nameRequired) {
        errors.push({ field: 'buildingName', message: nameRequired });
    } else {
        const lengthError = validateStringLength(data.buildingName, 2, 100, 'Nama gedung');
        if (lengthError) {
            errors.push({ field: 'buildingName', message: lengthError });
        }
    }

    // Validate description (optional)
    if (data.description && data.description.length > 1000) {
        errors.push({ field: 'description', message: 'Deskripsi maksimal 1000 karakter' });
    }

    // Validate location
    const locationRequired = validateRequired(data.location, 'Lokasi');
    if (locationRequired) {
        errors.push({ field: 'location', message: locationRequired });
    } else {
        const lengthError = validateStringLength(data.location, 5, 200, 'Lokasi');
        if (lengthError) {
            errors.push({ field: 'location', message: lengthError });
        }
    }

    // Validate capacity
    const capacityRequired = validateRequired(data.capacity, 'Kapasitas');
    if (capacityRequired) {
        errors.push({ field: 'capacity', message: capacityRequired });
    } else {
        const numberError = validateNumber(data.capacity, 1, 10000, 'Kapasitas');
        if (numberError) {
            errors.push({ field: 'capacity', message: numberError });
        } else if (!Number.isInteger(data.capacity)) {
            errors.push({ field: 'capacity', message: 'Kapasitas harus berupa bilangan bulat' });
        }
    }

    // Validate rentalPrice
    const priceRequired = validateRequired(data.rentalPrice, 'Harga sewa');
    if (priceRequired) {
        errors.push({ field: 'rentalPrice', message: priceRequired });
    } else {
        const numberError = validateNumber(data.rentalPrice, 0, 100000000, 'Harga sewa');
        if (numberError) {
            errors.push({ field: 'rentalPrice', message: numberError });
        }
    }

    // Validate buildingType
    const typeRequired = validateRequired(data.buildingType, 'Tipe gedung');
    if (typeRequired) {
        errors.push({ field: 'buildingType', message: typeRequired });
    } else {
        const validTypes = ['CLASSROOM', 'LABORATORY', 'SEMINAR', 'PKM', 'AUDITORIUM', 'MEETING', 'MULTIFUNCTION'];
        if (!validTypes.includes(data.buildingType)) {
            errors.push({ field: 'buildingType', message: 'Tipe gedung tidak valid' });
        }
    }

    return {
        isValid: errors.length === 0,
        value: errors.length === 0 ? data : null,
        errors
    };
};

// Facility validation
export const validateFacility = (data) => {
    const errors = [];

    // Validate facilityName
    const nameRequired = validateRequired(data.facilityName, 'Nama fasilitas');
    if (nameRequired) {
        errors.push({ field: 'facilityName', message: nameRequired });
    } else {
        const lengthError = validateStringLength(data.facilityName, 2, 50, 'Nama fasilitas');
        if (lengthError) {
            errors.push({ field: 'facilityName', message: lengthError });
        }
    }

    // Validate iconUrl (optional)
    const uriError = validateUri(data.iconUrl, 'URL icon');
    if (uriError) {
        errors.push({ field: 'iconUrl', message: uriError });
    }

    // Validate description (optional)
    if (data.description && data.description.length > 500) {
        errors.push({ field: 'description', message: 'Deskripsi fasilitas maksimal 500 karakter' });
    }

    return {
        isValid: errors.length === 0,
        value: errors.length === 0 ? data : null,
        errors
    };
};

// Building Manager validation
export const validateBuildingManager = (data) => {
    const errors = [];

    // Validate managerName
    const nameRequired = validateRequired(data.managerName, 'Nama pengelola');
    if (nameRequired) {
        errors.push({ field: 'managerName', message: nameRequired });
    } else {
        const lengthError = validateStringLength(data.managerName, 2, 50, 'Nama pengelola');
        if (lengthError) {
            errors.push({ field: 'managerName', message: lengthError });
        }
    }

    // Validate phoneNumber
    const phoneRequired = validateRequired(data.phoneNumber, 'Nomor telepon');
    if (phoneRequired) {
        errors.push({ field: 'phoneNumber', message: phoneRequired });
    } else {
        const lengthError = validateStringLength(data.phoneNumber, 10, 15, 'Nomor telepon');
        if (lengthError) {
            errors.push({ field: 'phoneNumber', message: lengthError });
        }
    }

    // Validate email (optional)
    const emailError = validateEmail(data.email, 'email');
    if (emailError) {
        errors.push({ field: 'email', message: emailError });
    }

    return {
        isValid: errors.length === 0,
        value: errors.length === 0 ? data : null,
        errors
    };
};

// Booking validation
export const validateBooking = (data) => {
    const errors = [];

    // Validate buildingId
    const buildingRequired = validateRequired(data.buildingId, 'Gedung');
    if (buildingRequired) {
        errors.push({ field: 'buildingId', message: 'Gedung wajib dipilih' });
    }

    // Validate activityName
    const activityRequired = validateRequired(data.activityName, 'Nama kegiatan');
    if (activityRequired) {
        errors.push({ field: 'activityName', message: activityRequired });
    } else {
        const lengthError = validateStringLength(data.activityName, 3, 100, 'Nama kegiatan');
        if (lengthError) {
            errors.push({ field: 'activityName', message: lengthError });
        }
    }

    // Validate startDate
    const dateRequired = validateRequired(data.startDate, 'Tanggal mulai');
    if (dateRequired) {
        errors.push({ field: 'startDate', message: dateRequired });
    } else {
        const startDate = new Date(data.startDate);
        const now = new Date();
        if (startDate < now) {
            errors.push({ field: 'startDate', message: 'Tanggal mulai tidak boleh di masa lalu' });
        }
    }

    // Validate startTime
    const startTimeRequired = validateRequired(data.startTime, 'Waktu mulai');
    if (startTimeRequired) {
        errors.push({ field: 'startTime', message: startTimeRequired });
    } else if (!TIME_PATTERN.test(data.startTime)) {
        errors.push({ field: 'startTime', message: 'Format waktu mulai tidak valid (HH:MM)' });
    }

    // Validate endTime
    const endTimeRequired = validateRequired(data.endTime, 'Waktu selesai');
    if (endTimeRequired) {
        errors.push({ field: 'endTime', message: endTimeRequired });
    } else if (!TIME_PATTERN.test(data.endTime)) {
        errors.push({ field: 'endTime', message: 'Format waktu selesai tidak valid (HH:MM)' });
    }

    // Custom validation for time sequence
    if (data.startTime && data.endTime && TIME_PATTERN.test(data.startTime) && TIME_PATTERN.test(data.endTime)) {
        const startMinutes = timeToMinutes(data.startTime);
        const endMinutes = timeToMinutes(data.endTime);

        if (endMinutes <= startMinutes) {
            errors.push({ field: 'endTime', message: 'Waktu selesai harus setelah waktu mulai' });
        }
    }

    return {
        isValid: errors.length === 0,
        value: errors.length === 0 ? data : null,
        errors
    };
};

// Availability check validation
export const validateAvailabilityCheck = (data) => {
    const errors = [];

    // Validate buildingId
    const buildingRequired = validateRequired(data.buildingId, 'Building ID');
    if (buildingRequired) {
        errors.push({ field: 'buildingId', message: buildingRequired });
    }

    // Validate startDate
    const dateRequired = validateRequired(data.startDate, 'Tanggal mulai');
    if (dateRequired) {
        errors.push({ field: 'startDate', message: dateRequired });
    } else {
        const startDate = new Date(data.startDate);
        const now = new Date();
        if (startDate < now) {
            errors.push({ field: 'startDate', message: 'Tanggal mulai tidak boleh di masa lalu' });
        }
    }

    // Validate endDate (optional)
    if (data.endDate) {
        const endDate = new Date(data.endDate);
        const startDate = new Date(data.startDate);
        if (endDate < startDate) {
            errors.push({ field: 'endDate', message: 'Tanggal selesai tidak boleh sebelum tanggal mulai' });
        }
    }

    // Validate startTime
    const startTimeRequired = validateRequired(data.startTime, 'Waktu mulai');
    if (startTimeRequired) {
        errors.push({ field: 'startTime', message: startTimeRequired });
    } else if (!TIME_PATTERN.test(data.startTime)) {
        errors.push({ field: 'startTime', message: 'Format waktu mulai tidak valid (HH:MM)' });
    }

    // Validate endTime
    const endTimeRequired = validateRequired(data.endTime, 'Waktu selesai');
    if (endTimeRequired) {
        errors.push({ field: 'endTime', message: endTimeRequired });
    } else if (!TIME_PATTERN.test(data.endTime)) {
        errors.push({ field: 'endTime', message: 'Format waktu selesai tidak valid (HH:MM)' });
    }

    // Custom validation for time sequence
    if (data.startTime && data.endTime && TIME_PATTERN.test(data.startTime) && TIME_PATTERN.test(data.endTime)) {
        const startMinutes = timeToMinutes(data.startTime);
        const endMinutes = timeToMinutes(data.endTime);

        if (endMinutes <= startMinutes) {
            errors.push({ field: 'endTime', message: 'Waktu selesai harus setelah waktu mulai' });
        }
    }

    return {
        isValid: errors.length === 0,
        value: errors.length === 0 ? data : null,
        errors
    };
};

// Business rule validations
export const validateBookingTimeSlot = (startTime, endTime, minDuration = 60, maxDuration = 480) => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const duration = endMinutes - startMinutes;

    const errors = [];

    if (duration < minDuration) {
        errors.push(`Durasi minimal peminjaman adalah ${minDuration} menit`);
    }

    if (duration > maxDuration) {
        errors.push(`Durasi maksimal peminjaman adalah ${maxDuration} menit`);
    }

    // Business hours check (e.g., 07:00 - 22:00)
    if (startMinutes < 420 || endMinutes > 1320) { // 7:00 AM to 10:00 PM
        errors.push('Peminjaman hanya diperbolehkan antara jam 07:00 - 22:00');
    }

    return {
        isValid: errors.length === 0,
        errors,
        duration
    };
};

export const validateBookingDateRange = (startDate, endDate = null) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : start;
    const now = new Date();
    const maxAdvanceBooking = new Date();
    maxAdvanceBooking.setDate(now.getDate() + 30); // 30 days advance booking

    const errors = [];

    if (start < now) {
        errors.push('Tanggal booking tidak boleh di masa lalu');
    }

    if (start > maxAdvanceBooking) {
        errors.push('Booking hanya dapat dilakukan maksimal 30 hari ke depan');
    }

    if (endDate && end < start) {
        errors.push('Tanggal selesai tidak boleh sebelum tanggal mulai');
    }

    // Maximum booking duration (e.g., 7 days)
    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (daysDiff > 7) {
        errors.push('Durasi booking maksimal 7 hari');
    }

    return {
        isValid: errors.length === 0,
        errors,
        daysDiff
    };
};

export default {
    validateBuilding,
    validateFacility,
    validateBuildingManager,
    validateBooking,
    validateAvailabilityCheck,
    validateBookingTimeSlot,
    validateBookingDateRange
}; 