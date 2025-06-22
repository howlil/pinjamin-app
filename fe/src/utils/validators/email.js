// Manual email validation with regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const STRICT_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Single email validation
export const validateEmail = (email) => {
    if (!email || typeof email !== 'string') {
        return {
            isValid: false,
            value: null,
            error: 'Email harus berupa string'
        };
    }

    const trimmedEmail = email.trim();
    const isValid = EMAIL_REGEX.test(trimmedEmail);

    return {
        isValid,
        value: isValid ? trimmedEmail : null,
        error: isValid ? null : 'Format email tidak valid'
    };
};

// Backward compatibility - simple boolean check
export const isValidEmail = (email) => {
    const result = validateEmail(email);
    return result.isValid;
};

// Strict email validation with more comprehensive regex
export const validateEmailStrict = (email) => {
    if (!email || typeof email !== 'string') {
        return {
            isValid: false,
            value: null,
            error: 'Email harus berupa string'
        };
    }

    const trimmedEmail = email.trim();
    const isValid = STRICT_EMAIL_REGEX.test(trimmedEmail);

    return {
        isValid,
        value: isValid ? trimmedEmail : null,
        error: isValid ? null : 'Format email tidak valid'
    };
};

// Backward compatibility for strict validation
export const isValidEmailStrict = (email) => {
    const result = validateEmailStrict(email);
    return result.isValid;
};

// Domain validation
export const isAllowedDomain = (email, allowedDomains = []) => {
    if (!allowedDomains.length) return isValidEmail(email);

    const emailResult = validateEmail(email);
    if (!emailResult.isValid) return false;

    const domain = email.split('@')[1]?.toLowerCase();
    return allowedDomains.map(d => d.toLowerCase()).includes(domain);
};

// Multiple emails validation
export const validateEmails = (emails) => {
    if (!Array.isArray(emails)) {
        return {
            isValid: false,
            emails: [],
            error: 'Input harus berupa array'
        };
    }

    if (emails.length === 0) {
        return {
            isValid: false,
            emails: [],
            error: 'Array email tidak boleh kosong'
        };
    }

    const results = emails.map(email => ({
        email,
        ...validateEmail(email)
    }));

    return {
        isValid: results.every(result => result.isValid),
        emails: results,
        error: null
    };
};

// Email with custom options validation
export const validateEmailWithOptions = (email, options = {}) => {
    const {
        allowTlds = true,
        minDomainSegments = 2,
        maxDomainSegments = undefined,
        allowUnicode = true
    } = options;

    if (!email || typeof email !== 'string') {
        return {
            isValid: false,
            value: null,
            error: 'Email harus berupa string'
        };
    }

    const trimmedEmail = email.trim();

    // Basic email validation
    let regex = allowUnicode ?
        /^[a-zA-Z0-9._%+-\u00A0-\uFFFF]+@[a-zA-Z0-9.-\u00A0-\uFFFF]+\.[a-zA-Z\u00A0-\uFFFF]{2,}$/ :
        EMAIL_REGEX;

    if (!regex.test(trimmedEmail)) {
        return {
            isValid: false,
            value: null,
            error: 'Format email tidak valid'
        };
    }

    // Check domain segments
    const domain = trimmedEmail.split('@')[1];
    const domainSegments = domain.split('.');

    if (domainSegments.length < minDomainSegments) {
        return {
            isValid: false,
            value: null,
            error: `Domain harus memiliki minimal ${minDomainSegments} segmen`
        };
    }

    if (maxDomainSegments && domainSegments.length > maxDomainSegments) {
        return {
            isValid: false,
            value: null,
            error: `Domain tidak boleh memiliki lebih dari ${maxDomainSegments} segmen`
        };
    }

    return {
        isValid: true,
        value: trimmedEmail,
        error: null
    };
};

// Business email validation (excludes common free email providers)
const freeEmailDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
    'live.com', 'aol.com', 'icloud.com', 'protonmail.com'
];

export const validateBusinessEmail = (email) => {
    const emailResult = validateEmail(email);

    if (!emailResult.isValid) {
        return emailResult;
    }

    const domain = email.split('@')[1]?.toLowerCase();
    const isFreeEmail = freeEmailDomains.includes(domain);

    return {
        isValid: emailResult.isValid && !isFreeEmail,
        value: emailResult.value,
        error: isFreeEmail ? 'Email bisnis tidak boleh menggunakan domain email gratis' : emailResult.error
    };
};

export default {
    validateEmail,
    isValidEmail,
    validateEmailStrict,
    isValidEmailStrict,
    isAllowedDomain,
    validateEmails,
    validateEmailWithOptions,
    validateBusinessEmail
}; 