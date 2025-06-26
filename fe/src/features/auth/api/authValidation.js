export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || email.trim() === '') {
        return 'Email wajib diisi';
    }
    if (!emailRegex.test(email)) {
        return 'Format email tidak valid';
    }
    return null;
};

export const validatePassword = (password) => {
    if (!password || password.trim() === '') {
        return 'Password wajib diisi';
    }
    if (password.length < 6) {
        return 'Password harus minimal 6 karakter';
    }
    return null;
};

export const validateFullName = (fullName) => {
    if (!fullName || fullName.trim() === '') {
        return 'Nama lengkap wajib diisi';
    }
    if (fullName.length < 2) {
        return 'Nama lengkap minimal 2 karakter';
    }
    if (fullName.length > 100) {
        return 'Nama lengkap maksimal 100 karakter';
    }
    return null;
};

export const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneNumber || phoneNumber.trim() === '') {
        return 'Nomor telepon wajib diisi';
    }
    if (phoneNumber.length < 10) {
        return 'Nomor telepon minimal 10 karakter';
    }
    if (phoneNumber.length > 20) {
        return 'Nomor telepon maksimal 20 karakter';
    }
    if (!phoneRegex.test(phoneNumber)) {
        return 'Format nomor telepon tidak valid';
    }
    return null;
};

export const validateBankName = (bankName) => {
    if (!bankName || bankName.trim() === '') {
        return 'Nama bank wajib diisi';
    }
    if (bankName.length < 2) {
        return 'Nama bank minimal 2 karakter';
    }
    if (bankName.length > 50) {
        return 'Nama bank maksimal 50 karakter';
    }
    return null;
};

export const validateBankNumber = (bankNumber) => {
    if (!bankNumber || bankNumber.trim() === '') {
        return 'Nomor rekening wajib diisi';
    }
    if (!/^\d+$/.test(bankNumber)) {
        return 'Nomor rekening hanya boleh berisi angka';
    }
    if (bankNumber.length < 8) {
        return 'Nomor rekening minimal 8 digit';
    }
    if (bankNumber.length > 20) {
        return 'Nomor rekening maksimal 20 digit';
    }
    return null;
};

export const validateBorrowerType = (borrowerType) => {
    const validTypes = ['INTERNAL_UNAND', 'EXTERNAL_UNAND'];
    if (!borrowerType) {
        return 'Tipe peminjam wajib dipilih';
    }
    if (!validTypes.includes(borrowerType)) {
        return 'Tipe peminjam tidak valid';
    }
    return null;
};

export const validateToken = (token) => {
    if (!token || token.trim() === '') {
        return 'Token reset password wajib diisi';
    }
    return null;
};

// Validation untuk Login Form (POST operation)
export const validateLoginForm = (formData) => {
    const errors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Validation untuk Register Form (POST operation)
export const validateRegisterForm = (formData) => {
    const errors = {};

    const fullNameError = validateFullName(formData.fullName);
    if (fullNameError) errors.fullName = fullNameError;

    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;

    const phoneError = validatePhoneNumber(formData.phoneNumber);
    if (phoneError) errors.phoneNumber = phoneError;

    const bankNameError = validateBankName(formData.bankName);
    if (bankNameError) errors.bankName = bankNameError;

    const bankNumberError = validateBankNumber(formData.bankNumber);
    if (bankNumberError) errors.bankNumber = bankNumberError;

    const borrowerTypeError = validateBorrowerType(formData.borrowerType);
    if (borrowerTypeError) errors.borrowerType = borrowerTypeError;

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Validation untuk Update Profile (PATCH operation)
export const validateUpdateProfile = (formData) => {
    const errors = {};

    if (formData.fullName !== undefined) {
        const fullNameError = validateFullName(formData.fullName);
        if (fullNameError) errors.fullName = fullNameError;
    }

    if (formData.email !== undefined) {
        const emailError = validateEmail(formData.email);
        if (emailError) errors.email = emailError;
    }

    if (formData.phoneNumber !== undefined) {
        const phoneError = validatePhoneNumber(formData.phoneNumber);
        if (phoneError) errors.phoneNumber = phoneError;
    }

    if (formData.bankName !== undefined) {
        const bankNameError = validateBankName(formData.bankName);
        if (bankNameError) errors.bankName = bankNameError;
    }

    if (formData.bankNumber !== undefined) {
        const bankNumberError = validateBankNumber(formData.bankNumber);
        if (bankNumberError) errors.bankNumber = bankNumberError;
    }

    if (formData.borrowerType !== undefined) {
        const borrowerTypeError = validateBorrowerType(formData.borrowerType);
        if (borrowerTypeError) errors.borrowerType = borrowerTypeError;
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Validation untuk Change Password (POST operation)
export const validateChangePassword = (formData) => {
    const errors = {};

    if (!formData.currentPassword) {
        errors.currentPassword = 'Password saat ini wajib diisi';
    }

    const newPasswordError = validatePassword(formData.newPassword);
    if (newPasswordError) errors.newPassword = newPasswordError;

    if (!formData.confirmPassword) {
        errors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = 'Konfirmasi password tidak cocok';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateForgotPassword = (email) => {
    const errors = {};

    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateResetPassword = (formData) => {
    const errors = {};

    const tokenError = validateToken(formData.token);
    if (tokenError) errors.token = tokenError;

    const newPasswordError = validatePassword(formData.newPassword);
    if (newPasswordError) errors.newPassword = newPasswordError;

    if (!formData.confirmPassword) {
        errors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = 'Konfirmasi password tidak cocok';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export default {
    validateEmail,
    validatePassword,
    validateFullName,
    validatePhoneNumber,
    validateBankName,
    validateBankNumber,
    validateBorrowerType,
    validateToken,
    validateLoginForm,
    validateRegisterForm,
    validateUpdateProfile,
    validateChangePassword,
    validateForgotPassword,
    validateResetPassword
};
