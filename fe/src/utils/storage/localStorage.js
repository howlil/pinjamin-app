// Local storage utilities

// Get item from localStorage
export const get = (key) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error getting item ${key} from localStorage:`, error);
        return null;
    }
};

// Set item to localStorage
export const set = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error setting item ${key} to localStorage:`, error);
        return false;
    }
};

// Remove item from localStorage
export const remove = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing item ${key} from localStorage:`, error);
        return false;
    }
};

// Clear all localStorage
export const clear = () => {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
};

// Check if key exists in localStorage
export const has = (key) => {
    return localStorage.getItem(key) !== null;
};

// Get all keys from localStorage
export const getAllKeys = () => {
    return Object.keys(localStorage);
};

// Get localStorage size
export const getSize = () => {
    let size = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            size += localStorage[key].length + key.length;
        }
    }
    return size;
};

// Storage with expiry
export const setWithExpiry = (key, value, ttl) => {
    const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + ttl
    };
    set(key, item);
};

export const getWithExpiry = (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
        const item = JSON.parse(itemStr);
        const now = new Date();

        if (now.getTime() > item.expiry) {
            remove(key);
            return null;
        }
        return item.value;
    } catch (error) {
        return null;
    }
};

// Get authentication token from persisted auth storage
export const getToken = () => {
    try {
        const authStorage = localStorage.getItem('auth-storage');
        if (!authStorage) return null;

        const parsedStorage = JSON.parse(authStorage);
        return parsedStorage?.state?.token || null;
    } catch (error) {
        console.error('Error getting token from localStorage:', error);
        return null;
    }
};

// Get user data from persisted auth storage
export const getUser = () => {
    try {
        const authStorage = localStorage.getItem('auth-storage');
        if (!authStorage) return null;

        const parsedStorage = JSON.parse(authStorage);
        return parsedStorage?.state?.user || null;
    } catch (error) {
        console.error('Error getting user from localStorage:', error);
        return null;
    }
};

// Check if user is authenticated
export const isAuthenticated = () => {
    try {
        const authStorage = localStorage.getItem('auth-storage');
        if (!authStorage) return false;

        const parsedStorage = JSON.parse(authStorage);
        return parsedStorage?.state?.isAuthenticated || false;
    } catch (error) {
        console.error('Error checking authentication status:', error);
        return false;
    }
};

// Clear auth data (logout helper)
export const clearAuth = () => {
    try {
        localStorage.removeItem('auth-storage');
        return true;
    } catch (error) {
        console.error('Error clearing auth data:', error);
        return false;
    }
};

// Export as storage object for backward compatibility
export const storage = {
    get,
    set,
    remove,
    clear,
    has,
    getAllKeys,
    getSize,
    setWithExpiry,
    getWithExpiry,
    // Auth helpers
    getToken,
    getUser,
    isAuthenticated,
    clearAuth
};

export default storage; 