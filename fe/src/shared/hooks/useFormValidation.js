import { useState, useCallback } from 'react';
import { debounce } from '../utils/helpers';


export const useFormValidation = (initialData = {}, validationRules = {}) => {
    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isValidating, setIsValidating] = useState(false);

    // Simplified debounced field validation
    const debouncedValidateField = useCallback(
        debounce((fieldName, value, rules) => {
            setIsValidating(true);

            // Simple required validation
            if (rules.required && (!value || value.trim() === '')) {
                setErrors(prev => ({ ...prev, [fieldName]: `${rules.label || fieldName} wajib diisi.` }));
            } else {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[fieldName];
                    return newErrors;
                });
            }

            setIsValidating(false);
        }, 300),
        []
    );

    // Handle input change
    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({ ...prev, [name]: fieldValue }));

        // Real-time validation untuk field yang sudah pernah di-touch
        if (touched[name] && validationRules[name]) {
            debouncedValidateField(name, fieldValue, validationRules[name]);
        }
    }, [touched, validationRules, debouncedValidateField]);

    // Handle input blur
    const handleBlur = useCallback((e) => {
        const { name, value } = e.target;

        setTouched(prev => ({ ...prev, [name]: true }));

        // Validate field on blur
        if (validationRules[name]) {
            debouncedValidateField(name, value, validationRules[name]);
        }
    }, [validationRules, debouncedValidateField]);

    // Simplified form validation
    const validateAll = useCallback(() => {
        const newErrors = {};

        Object.keys(validationRules).forEach(field => {
            const rules = validationRules[field];
            const value = formData[field];

            if (rules.required && (!value || value.trim() === '')) {
                newErrors[field] = `${rules.label || field} wajib diisi.`;
            }
        });

        setErrors(newErrors);

        // Mark all fields as touched
        const allTouched = Object.keys(validationRules).reduce((acc, field) => {
            acc[field] = true;
            return acc;
        }, {});
        setTouched(allTouched);

        return Object.keys(newErrors).length === 0;
    }, [formData, validationRules]);

    // Clear specific field error
    const clearError = useCallback((fieldName) => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });
    }, []);

    // Clear all errors
    const clearAllErrors = useCallback(() => {
        setErrors({});
    }, []);

    // Reset form
    const resetForm = useCallback(() => {
        setFormData(initialData);
        setErrors({});
        setTouched({});
    }, [initialData]);

    // Set form data programmatically
    const setFieldValue = useCallback((fieldName, value) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
    }, []);

    // Check if form is valid
    const isValid = Object.keys(errors).length === 0 &&
        Object.keys(touched).length > 0;

    // Check if field has error
    const getFieldError = useCallback((fieldName) => {
        return touched[fieldName] ? errors[fieldName] : undefined;
    }, [errors, touched]);

    // Check if field is invalid
    const isFieldInvalid = useCallback((fieldName) => {
        return touched[fieldName] && !!errors[fieldName];
    }, [errors, touched]);

    return {
        // Form state
        formData,
        errors,
        touched,
        isValid,
        isValidating,

        // Form handlers
        handleChange,
        handleBlur,

        // Validation methods
        validateAll,
        clearError,
        clearAllErrors,

        // Utility methods
        resetForm,
        setFieldValue,
        getFieldError,
        isFieldInvalid,
    };
};

export default useFormValidation; 