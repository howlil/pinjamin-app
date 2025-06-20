import toast from 'react-hot-toast';

// Toast helpers
export const showToast = {
    success: (message) => toast.success(message),
    error: (message) => {
        // Handle array messages - show each in separate stacked card
        if (Array.isArray(message)) {
            // Show multiple toast notifications for each error with stacking
            message.forEach((msg, index) => {
                setTimeout(() => {
                    toast.error(msg, {
                        id: `error-${Date.now()}-${index}`, // Unique ID for each toast
                        duration: 6000,
                        position: 'top-right',
                        style: {
                            background: '#fee2e2',
                            border: '1px solid #fecaca',
                            color: '#dc2626',
                            fontWeight: '500',
                            maxWidth: '400px',
                            marginBottom: '8px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        },
                        // Custom icon for error
                        icon: '❌',
                    });
                }, index * 150); // Reduced stagger time for better stacking effect
            });
            return;
        }
        return toast.error(message, {
            style: {
                whiteSpace: 'pre-line' // Allow line breaks
            }
        });
    },
    loading: (message) => toast.loading(message),
    promise: (promise, messages) => toast.promise(promise, messages),
};

// Format date utility
export const formatDate = (date, locale = 'id-ID') => {
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date));
};

// Format currency utility
export const formatCurrency = (amount, currency = 'IDR', locale = 'id-ID') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

// Validate email
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate phone number (Indonesian format)
export const isValidPhone = (phone) => {
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
    return phoneRegex.test(phone);
};

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
                showToast.error(error.message || 'Terjadi kesalahan');
            }
            throw error;
        }
    };
};

// Local storage helpers
export const storage = {
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch {
            return null;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    },
    clear: () => {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    },
}; 