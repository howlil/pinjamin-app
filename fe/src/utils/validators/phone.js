// Indonesian phone number patterns
const PHONE_PATTERNS = {
    mobile: /^(\+62|62|0)8[1-9][0-9]{6,9}$/,
    landline: /^(\+62|62|0)[2-9][0-9]{6,8}$/,
    international: /^\+[1-9]\d{1,14}$/
};

// Single phone validation
export const validatePhone = (phone) => {
    if (!phone || typeof phone !== 'string') {
        return {
            isValid: false,
            value: null,
            error: 'Nomor telepon harus berupa string',
            formatted: null
        };
    }

    const trimmedPhone = phone.trim();
    const isValid = PHONE_PATTERNS.mobile.test(trimmedPhone);

    return {
        isValid,
        value: isValid ? trimmedPhone : null,
        error: isValid ? null : 'Nomor telepon harus berformat Indonesia yang valid (08xxxxxxxxx atau +628xxxxxxxxx)',
        formatted: isValid ? formatPhoneNumber(trimmedPhone) : null
    };
};

// Backward compatibility - simple boolean check
export const isValidPhone = (phone) => {
    const result = validatePhone(phone);
    return result.isValid;
};

// International phone validation
export const validateInternationalPhone = (phone) => {
    if (!phone || typeof phone !== 'string') {
        return {
            isValid: false,
            value: null,
            error: 'Nomor telepon harus berupa string'
        };
    }

    const trimmedPhone = phone.trim();
    const isValid = PHONE_PATTERNS.international.test(trimmedPhone);

    return {
        isValid,
        value: isValid ? trimmedPhone : null,
        error: isValid ? null : 'Nomor telepon internasional harus dimulai dengan + dan kode negara'
    };
};

// Backward compatibility for international validation
export const isValidInternationalPhone = (phone) => {
    const result = validateInternationalPhone(phone);
    return result.isValid;
};

// Format phone number to international format
export const formatPhoneNumber = (phone) => {
    // Remove all non-numeric characters
    let cleaned = phone.replace(/\D/g, '');

    // Handle different formats
    if (cleaned.startsWith('62')) {
        return `+${cleaned}`;
    } else if (cleaned.startsWith('0')) {
        return `+62${cleaned.substring(1)}`;
    }
    return `+62${cleaned}`;
};

// Parse phone number with detailed information
export const parsePhoneNumber = (phone) => {
    const result = validatePhone(phone);

    if (!result.isValid) {
        return {
            isValid: false,
            error: result.error,
            countryCode: null,
            number: null,
            formatted: null,
            type: null
        };
    }

    const cleaned = phone.replace(/\D/g, '');
    let countryCode, number;

    if (cleaned.startsWith('62')) {
        countryCode = '62';
        number = cleaned.substring(2);
    } else if (cleaned.startsWith('0')) {
        countryCode = '62';
        number = cleaned.substring(1);
    } else {
        countryCode = '62';
        number = cleaned;
    }

    // Determine phone type
    let type = 'unknown';
    if (PHONE_PATTERNS.mobile.test(phone)) {
        type = 'mobile';
    } else if (PHONE_PATTERNS.landline.test(phone)) {
        type = 'landline';
    }

    return {
        isValid: true,
        countryCode,
        number,
        formatted: formatPhoneNumber(phone),
        type,
        error: null
    };
};

// Multiple phones validation
export const validatePhones = (phones) => {
    if (!Array.isArray(phones)) {
        return {
            isValid: false,
            phones: [],
            error: 'Input harus berupa array'
        };
    }

    if (phones.length === 0) {
        return {
            isValid: false,
            phones: [],
            error: 'Array nomor telepon tidak boleh kosong'
        };
    }

    const results = phones.map(phone => ({
        phone,
        ...validatePhone(phone)
    }));

    return {
        isValid: results.every(result => result.isValid),
        phones: results,
        error: null
    };
};

// Phone validation with carrier detection (Indonesia)
const carrierPrefixes = {
    'Telkomsel': ['0811', '0812', '0813', '0821', '0822', '0852', '0853'],
    'Indosat': ['0814', '0815', '0816', '0855', '0856', '0857', '0858'],
    'XL': ['0817', '0818', '0819', '0859', '0877', '0878'],
    'Tri': ['0895', '0896', '0897', '0898', '0899'],
    'Smartfren': ['0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888']
};

export const validatePhoneWithCarrier = (phone) => {
    const result = validatePhone(phone);

    if (!result.isValid) {
        return { ...result, carrier: null };
    }

    const formatted = formatPhoneNumber(phone);
    const prefix = formatted.replace('+62', '0').substring(0, 4);

    let carrier = 'Unknown';
    for (const [carrierName, prefixes] of Object.entries(carrierPrefixes)) {
        if (prefixes.includes(prefix)) {
            carrier = carrierName;
            break;
        }
    }

    return {
        ...result,
        carrier,
        prefix
    };
};

// Landline phone validation
export const validateLandlinePhone = (phone) => {
    if (!phone || typeof phone !== 'string') {
        return {
            isValid: false,
            value: null,
            error: 'Nomor telepon harus berupa string',
            type: 'landline'
        };
    }

    const trimmedPhone = phone.trim();
    const isValid = PHONE_PATTERNS.landline.test(trimmedPhone);

    return {
        isValid,
        value: isValid ? trimmedPhone : null,
        error: isValid ? null : 'Nomor telepon rumah harus berformat Indonesia yang valid',
        type: 'landline'
    };
};

// Universal phone validation (mobile or landline)
export const validateAnyPhone = (phone) => {
    // Try mobile first
    const mobileResult = validatePhone(phone);
    if (mobileResult.isValid) {
        return { ...mobileResult, type: 'mobile' };
    }

    // Try landline
    const landlineResult = validateLandlinePhone(phone);
    if (landlineResult.isValid) {
        return { ...landlineResult, type: 'landline' };
    }

    // Try international
    const internationalResult = validateInternationalPhone(phone);
    if (internationalResult.isValid) {
        return { ...internationalResult, type: 'international' };
    }

    return {
        isValid: false,
        value: null,
        error: 'Nomor telepon tidak valid untuk format mobile, landline, atau internasional',
        type: null
    };
};

export default {
    validatePhone,
    isValidPhone,
    validateInternationalPhone,
    isValidInternationalPhone,
    formatPhoneNumber,
    parsePhoneNumber,
    validatePhones,
    validatePhoneWithCarrier,
    validateLandlinePhone,
    validateAnyPhone
}; 