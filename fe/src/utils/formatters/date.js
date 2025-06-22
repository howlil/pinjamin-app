// Format date utility
export const formatDate = (date, locale = 'id-ID') => {
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date));
};

// Format date with time
export const formatDateTime = (date, locale = 'id-ID') => {
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
};

// Format date to ISO string
export const formatToISO = (date) => {
    return new Date(date).toISOString();
};

// Format relative time
export const formatRelativeTime = (date, locale = 'id-ID') => {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    const daysDiff = Math.round((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));

    if (Math.abs(daysDiff) < 1) return 'hari ini';
    if (Math.abs(daysDiff) < 7) return rtf.format(daysDiff, 'day');
    if (Math.abs(daysDiff) < 30) return rtf.format(Math.round(daysDiff / 7), 'week');
    if (Math.abs(daysDiff) < 365) return rtf.format(Math.round(daysDiff / 30), 'month');
    return rtf.format(Math.round(daysDiff / 365), 'year');
};

export default {
    formatDate,
    formatDateTime,
    formatToISO,
    formatRelativeTime
}; 