// Authentication hooks
export * from './auth';

// Building hooks
export * from './building';

// Booking hooks
export * from './booking';

// Transaction hooks
export * from './transaction';

// Facility hooks
export * from './facility';

// Dashboard hooks
export * from './dashboard';

// Notification hooks
export * from './notification';

// Profile hooks
export * from './profile';

// Custom hook untuk debounce
import { useState, useEffect } from 'react';

export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}; 