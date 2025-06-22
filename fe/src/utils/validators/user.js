import { validateEmail } from './email.js';
import { validatePhone } from './phone.js';

// Regex patterns
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
const NAME_PATTERN = /^[a-zA-Z\s.'-]+$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9_.-]+$/;
const TIME_PATTERN = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

// Helper function to validate string length
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

// Helper function to validate required field
const validateRequired = (value, fieldName) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
        return `${fieldName} wajib diisi`;
    }
    return null;
};

// Password validation
export const validatePassword = (password) => {
    const lengthError = validateStringLength(password, 8, 128, 'Password');
    if (lengthError) {
        return {
            isValid: false,
            value: null,
            error: lengthError
        };
    }

    const isValid = PASSWORD_PATTERN.test(password);
    return {
        isValid,
        value: isValid ? password : null,
        error: isValid ? null : 'Password harus mengandung setidaknya 1 huruf kecil, 1 huruf besar, 1 angka, dan 1 karakter khusus'
    };
};

// Simple password validation (less strict)
export const validateSimplePassword = (password) => {
    const lengthError = validateStringLength(password, 6, 128, 'Password');
    if (lengthError) {
        return {
            isValid: false,
            value: null,
            error: lengthError
        };
    }

    return {
        isValid: true,
        value: password,
        error: null
    };
};

// Name validation
export const validateName = (name) => {
    const lengthError = validateStringLength(name, 2, 50, 'Nama');
    if (lengthError) {
        return {
            isValid: false,
            value: null,
            error: lengthError
        };
    }

    const isValid = NAME_PATTERN.test(name);
    return {
        isValid,
        value: isValid ? name : null,
        error: isValid ? null : 'Nama hanya boleh mengandung huruf, spasi, titik, tanda kutip, dan tanda hubung'
    };
};

// Username validation
export const validateUsername = (username) => {
    const lengthError = validateStringLength(username, 3, 30, 'Username');
    if (lengthError) {
        return {
            isValid: false,
            value: null,
            error: lengthError
        };
    }

    const isValid = USERNAME_PATTERN.test(username);
    return {
        isValid,
        value: isValid ? username : null,
        error: isValid ? null : 'Username hanya boleh mengandung huruf, angka, underscore, titik, dan tanda hubung'
    };
};

// User registration validation
export const validateUserRegistration = (data) => {
    const errors = [];

    // Validate firstName
    const requiredError = validateRequired(data.firstName, 'First Name');
    if (requiredError) {
        errors.push({ field: 'firstName', message: requiredError });
    } else {
        const nameResult = validateName(data.firstName);
        if (!nameResult.isValid) {
            errors.push({ field: 'firstName', message: nameResult.error });
        }
    }

    // Validate lastName (optional)
    if (data.lastName) {
        const nameResult = validateName(data.lastName);
        if (!nameResult.isValid) {
            errors.push({ field: 'lastName', message: nameResult.error });
        }
    }

    // Validate username
    const usernameRequired = validateRequired(data.username, 'Username');
    if (usernameRequired) {
        errors.push({ field: 'username', message: usernameRequired });
    } else {
        const usernameResult = validateUsername(data.username);
        if (!usernameResult.isValid) {
            errors.push({ field: 'username', message: usernameResult.error });
        }
    }

    // Validate email
    const emailRequired = validateRequired(data.email, 'Email');
    if (emailRequired) {
        errors.push({ field: 'email', message: emailRequired });
    } else {
        const emailResult = validateEmail(data.email);
        if (!emailResult.isValid) {
            errors.push({ field: 'email', message: emailResult.error });
        }
    }

    // Validate phone (optional)
    if (data.phone && data.phone.trim()) {
        const phoneResult = validatePhone(data.phone);
        if (!phoneResult.isValid) {
            errors.push({ field: 'phone', message: phoneResult.error });
        }
    }

    // Validate password
    const passwordRequired = validateRequired(data.password, 'Password');
    if (passwordRequired) {
        errors.push({ field: 'password', message: passwordRequired });
    } else {
        const passwordResult = validatePassword(data.password);
        if (!passwordResult.isValid) {
            errors.push({ field: 'password', message: passwordResult.error });
        }
    }

    // Validate confirmPassword
    const confirmPasswordRequired = validateRequired(data.confirmPassword, 'Konfirmasi Password');
    if (confirmPasswordRequired) {
        errors.push({ field: 'confirmPassword', message: confirmPasswordRequired });
    } else if (data.password !== data.confirmPassword) {
        errors.push({ field: 'confirmPassword', message: 'Konfirmasi password tidak sesuai' });
    }

    // Validate role
    const validRoles = ['USER', 'ADMIN', 'MANAGER'];
    if (data.role && !validRoles.includes(data.role)) {
        errors.push({ field: 'role', message: 'Role tidak valid' });
    }

    // Validate terms
    if (!data.terms) {
        errors.push({ field: 'terms', message: 'Anda harus menyetujui syarat dan ketentuan' });
    }

    return {
        isValid: errors.length === 0,
        value: errors.length === 0 ? data : null,
        errors
    };
};

// User login validation
export const validateUserLogin = (data) => {
    const errors = [];

    const identifierRequired = validateRequired(data.identifier, 'Email atau username');
    if (identifierRequired) {
        return {
            isValid: false,
            value: null,
            error: identifierRequired
        };
    }

    const passwordRequired = validateRequired(data.password, 'Password');
    if (passwordRequired) {
        return {
            isValid: false,
            value: null,
            error: passwordRequired
        };
    }

    return {
        isValid: true,
        value: {
            identifier: data.identifier,
            password: data.password,
            rememberMe: data.rememberMe || false
        },
        error: null
    };
};

// User profile update validation
export const validateUserProfileUpdate = (data) => {
    const errors = [];

    // Validate firstName (optional)
    if (data.firstName) {
        const nameResult = validateName(data.firstName);
        if (!nameResult.isValid) {
            errors.push({ field: 'firstName', message: nameResult.error });
        }
    }

    // Validate lastName (optional)
    if (data.lastName) {
        const nameResult = validateName(data.lastName);
        if (!nameResult.isValid) {
            errors.push({ field: 'lastName', message: nameResult.error });
        }
    }

    // Validate phone (optional)
    if (data.phone && data.phone.trim()) {
        const phoneResult = validatePhone(data.phone);
        if (!phoneResult.isValid) {
            errors.push({ field: 'phone', message: phoneResult.error });
        }
    }

    // Validate bio (optional)
    if (data.bio && data.bio.length > 500) {
        errors.push({ field: 'bio', message: 'Bio maksimal 500 karakter' });
    }

    // Validate dateOfBirth (optional)
    if (data.dateOfBirth) {
        const birthDate = new Date(data.dateOfBirth);
        const now = new Date();
        if (birthDate > now) {
            errors.push({ field: 'dateOfBirth', message: 'Tanggal lahir tidak boleh di masa depan' });
        }
    }

    // Validate gender (optional)
    if (data.gender) {
        const validGenders = ['MALE', 'FEMALE', 'OTHER'];
        if (!validGenders.includes(data.gender)) {
            errors.push({ field: 'gender', message: 'Gender tidak valid' });
        }
    }

    // Validate address (optional)
    if (data.address && data.address.length > 200) {
        errors.push({ field: 'address', message: 'Alamat maksimal 200 karakter' });
    }

    return {
        isValid: errors.length === 0,
        value: errors.length === 0 ? data : null,
        errors
    };
};

// Change password validation
export const validateChangePassword = (data) => {
    const errors = [];

    const currentPasswordRequired = validateRequired(data.currentPassword, 'Password saat ini');
    if (currentPasswordRequired) {
        errors.push({ field: 'currentPassword', message: currentPasswordRequired });
    }

    const newPasswordRequired = validateRequired(data.newPassword, 'Password baru');
    if (newPasswordRequired) {
        errors.push({ field: 'newPassword', message: newPasswordRequired });
    } else {
        const passwordResult = validatePassword(data.newPassword);
        if (!passwordResult.isValid) {
            errors.push({ field: 'newPassword', message: passwordResult.error });
        }
    }

    const confirmPasswordRequired = validateRequired(data.confirmNewPassword, 'Konfirmasi password baru');
    if (confirmPasswordRequired) {
        errors.push({ field: 'confirmNewPassword', message: confirmPasswordRequired });
    } else if (data.newPassword !== data.confirmNewPassword) {
        errors.push({ field: 'confirmNewPassword', message: 'Konfirmasi password baru tidak sesuai' });
    }

    return {
        isValid: errors.length === 0,
        value: errors.length === 0 ? data : null,
        errors
    };
};

// Reset password validation
export const validateResetPassword = (data) => {
    const errors = [];

    const tokenRequired = validateRequired(data.token, 'Token reset password');
    if (tokenRequired) {
        errors.push({ field: 'token', message: tokenRequired });
    }

    const newPasswordRequired = validateRequired(data.newPassword, 'Password baru');
    if (newPasswordRequired) {
        errors.push({ field: 'newPassword', message: newPasswordRequired });
    } else {
        const passwordResult = validatePassword(data.newPassword);
        if (!passwordResult.isValid) {
            errors.push({ field: 'newPassword', message: passwordResult.error });
        }
    }

    const confirmPasswordRequired = validateRequired(data.confirmNewPassword, 'Konfirmasi password');
    if (confirmPasswordRequired) {
        errors.push({ field: 'confirmNewPassword', message: confirmPasswordRequired });
    } else if (data.newPassword !== data.confirmNewPassword) {
        errors.push({ field: 'confirmNewPassword', message: 'Konfirmasi password tidak sesuai' });
    }

    return {
        isValid: errors.length === 0,
        value: errors.length === 0 ? data : null,
        errors
    };
};

export default {
    validateUserRegistration,
    validateUserLogin,
    validateUserProfileUpdate,
    validateChangePassword,
    validateResetPassword,
    validatePassword,
    validateSimplePassword,
    validateName,
    validateUsername
}; 