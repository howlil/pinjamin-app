// Re-export modular utilities for backward compatibility
export { showToast } from './ui/toast';
export { formatDate, formatDateTime } from './formatters/date';
export { formatCurrency } from './formatters/currency';
export { isValidEmail, validateEmail } from './validators/email';
export { isValidPhone, validatePhone } from './validators/phone';
export { storage } from './storage/localStorage';

// New Joi-based validators
export { 
    validateUserRegistration, 
    validateUserLogin, 
    validateUserProfileUpdate, 
    validateChangePassword 
} from './validators/user';
export { 
    validateBuilding, 
    validateBooking 
} from './validators/business';

// Utility functions that don't fit in specific modules

// Generate random ID
export const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
};

// Debounce function
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Higher order function for async operations with loading state
export const withLoading = (asyncFn, setLoading) => {
    return async (...args) => {
        try {
            setLoading(true);
            const result = await asyncFn(...args);
            return result;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };
};

// Higher order function for error handling
export const withErrorHandling = (fn, onError) => {
    return async (...args) => {
        try {
            return await fn(...args);
        } catch (error) {
            if (onError) {
                onError(error);
            } else {
                // Import showToast from modular location
                const { showToast } = await import('./ui/toast');
                showToast.error(error.message || 'Terjadi kesalahan');
            }
            throw error;
        }
    };
}; 