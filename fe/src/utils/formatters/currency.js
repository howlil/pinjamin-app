// Format currency utility
export const formatCurrency = (amount, currency = 'IDR', locale = 'id-ID') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

// Format currency without symbol
export const formatNumber = (number, locale = 'id-ID') => {
    return new Intl.NumberFormat(locale).format(number);
};

// Format currency with custom options
export const formatCurrencyCustom = (amount, options = {}) => {
    const defaultOptions = {
        locale: 'id-ID',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    };

    const finalOptions = { ...defaultOptions, ...options };

    return new Intl.NumberFormat(finalOptions.locale, {
        style: 'currency',
        currency: finalOptions.currency,
        minimumFractionDigits: finalOptions.minimumFractionDigits,
        maximumFractionDigits: finalOptions.maximumFractionDigits,
    }).format(amount);
};

// Parse currency string to number
export const parseCurrency = (currencyString) => {
    return Number(currencyString.replace(/[^0-9,-]+/g, '').replace(',', '.'));
};

export default {
    formatCurrency,
    formatNumber,
    formatCurrencyCustom,
    parseCurrency
}; 