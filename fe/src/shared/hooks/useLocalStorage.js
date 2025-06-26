import { useState, useEffect, useCallback } from 'react';


export const useLocalStorage = (key, initialValue) => {
    // State untuk menyimpan value
    const [storedValue, setStoredValue] = useState(() => {
        try {
            // Ambil value dari localStorage
            const item = window.localStorage.getItem(key);
            // Parse JSON atau return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // Jika error parsing, return initialValue
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Function untuk set value
    const setValue = useCallback((value) => {
        try {
            // Allow value to be a function untuk update berdasarkan nilai sebelumnya
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            // Update state
            setStoredValue(valueToStore);

            // Save ke localStorage
            if (valueToStore === undefined || valueToStore === null) {
                window.localStorage.removeItem(key);
            } else {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    // Function untuk remove value
    const removeValue = useCallback(() => {
        try {
            setStoredValue(initialValue);
            window.localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
        }
    }, [key, initialValue]);

    // Listen untuk perubahan localStorage dari tab/window lain
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    setStoredValue(JSON.parse(e.newValue));
                } catch (error) {
                    console.error(`Error parsing localStorage change for key "${key}":`, error);
                }
            } else if (e.key === key && e.newValue === null) {
                setStoredValue(initialValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue];
};

export default useLocalStorage;

// Auth Store Hook untuk mengelola authentication state
export const useAuthStore = () => {
    const [authData, setAuthData, removeAuthData] = useLocalStorage('auth-storage', {
        token: null,
        user: null,
        isAuthenticated: false
    });

    // Login function
    const login = useCallback((user, token) => {
        setAuthData({
            token,
            user,
            isAuthenticated: true
        });
    }, [setAuthData]);

    // Logout function
    const logout = useCallback(() => {
        removeAuthData();
    }, [removeAuthData]);

    // Update user data
    const updateUser = useCallback((userData) => {
        setAuthData(prev => ({
            ...prev,
            user: { ...prev.user, ...userData }
        }));
    }, [setAuthData]);

    // Check if user has specific role
    const hasRole = useCallback((role) => {
        return authData.isAuthenticated && authData.user?.role === role;
    }, [authData.isAuthenticated, authData.user?.role]);

    // Check authentication status
    const checkAuth = useCallback(() => {
        return authData.isAuthenticated && authData.token && authData.user;
    }, [authData.isAuthenticated, authData.token, authData.user]);

    return {
        // State
        token: authData.token,
        user: authData.user,
        isAuthenticated: authData.isAuthenticated,

        // Actions
        login,
        logout,
        updateUser,
        hasRole,
        checkAuth
    };
}; 