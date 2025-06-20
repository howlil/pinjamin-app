
export const COLORS = {
    primary: '#749C73',
    primaryLight: '#8aad89',
    primaryDark: '#5f7e5e',
    secondary: '#FFFFFF',
    black: '#444444',
    gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
    }
};

export const SHADOWS = {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    primary: '0 4px 15px rgba(116, 156, 115, 0.3)',
    primaryHover: '0 6px 20px rgba(116, 156, 115, 0.4)',
};

export const GLASS = {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
};

export const BORDER_RADIUS = {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '1rem',
    full: '9999px',
};

export const ANIMATIONS = {
    default: {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.5 } },
        exit: { opacity: 0, transition: { duration: 0.5 } }
    },
    card: {
        initial: { y: 50, opacity: 0 },
        animate: { y: 0, opacity: 1, transition: { duration: 0.5 } },
        exit: { y: -50, opacity: 0, transition: { duration: 0.3 } }
    },
    header: {
        initial: { x: -100, opacity: 0 },
        animate: { x: 0, opacity: 1, transition: { duration: 0.4 } }
    },
    sidebar: {
        initial: { x: -200, opacity: 0 },
        animate: { x: 0, opacity: 1, transition: { duration: 0.4 } }
    },
    button: {
        initial: { scale: 0.9 },
        animate: { scale: 1, transition: { duration: 0.3 } }
    }
};

export const TRANSITIONS = {
    default: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.5s ease',
};

export const SPACING = {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
};

export const RADII = {
    default: '20px',
    buttonAndInput: 'full'
};

export const GLASS_EFFECT = {
    bg: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: RADII.default,
    boxShadow: SHADOWS.soft,

    beforeProps: {
        content: '""',
        position: 'absolute',
        inset: 0,
        borderRadius: RADII.default,
        padding: '1px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(116, 156, 115, 0.1))',
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
        zIndex: -1
    }
};

export default {
    COLORS,
    RADII,
    SHADOWS,
    TRANSITIONS,
    ANIMATIONS,
    GLASS_EFFECT
}; 