// Design Tokens berdasarkan context.json
export const COLORS = {
    primary: '#21D179FF',
    secondary: '#21D179FF',
    background: '#FFFFFFFF',
    text: '#2A2A2AFF',
    black: '#2A2A2AFF',
    white: '#FFFFFF',
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
        900: '#111827'
    },
    accent: {
        blue: '#C8E4FF',
        green: '#C8FFDB',
        yellow: '#FFEBC8',
    },
    glass: {
        background: '#D7D7D7FF',
        backgroundOpacity: 0.5,
        outline: {
            color: '#D7D7D7FF',
            width: 1,
            style: 'solid'
        },
        blur: {
            radius: 10,
            opacity: 0.5
        }
    }
};

export const TYPOGRAPHY = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '1rem',
    fontWeight: 'normal'
};

export const SPACING = {
    unit: 4,
    scale: [0, 4, 8, 12, 16]
};

// Corner radius rules berdasarkan context.json
export const CORNER_RADIUS = {
    // Default 24px untuk cards, modal, form, table
    default: 24,
    // Full 9999px untuk input, button 
    full: 9999,
    components: {
        cards: 24,
        modal: 24,
        form: 24,
        table: 24,
        input: 9999,
        button: 9999
    }
};

// Glassmorphism utilities berdasarkan context.json
export const GLASSMORPHISM = {
    consistentBlur: true,
    blurRadius: 10,
    blurOpacity: 0.5,
    blurBackground: '#D7D7D7FF',
    blurBackgroundOpacity: 0.5,
    outline: {
        color: '#D7D7D7FF',
        width: 1,
        style: 'solid'
    },
    // Pre-defined glassmorphism styles untuk Chakra UI
    styles: {
        // Card glassmorphism
        card: {
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(215, 215, 215, 0.5)',
            borderRadius: '24px',
        },
        // Input glassmorphism
        input: {
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(215, 215, 215, 0.5)',
            borderRadius: '9999px',
        },
        // Button glassmorphism
        button: {
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(215, 215, 215, 0.5)',
            borderRadius: '9999px',
        },
        // Modal glassmorphism
        modal: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(215, 215, 215, 0.5)',
            borderRadius: '24px',
        }
    }
};

export const ANIMATIONS = {
    normal: '0.3s',
    fast: '0.15s',
    slow: '0.5s',
    easing: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    variants: {
        fadeIn: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
        },
        scaleIn: {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.9 },
        },
        slideUp: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 20 },
        },
    },
};

export default {
    COLORS,
    TYPOGRAPHY,
    SPACING,
    CORNER_RADIUS,
    GLASSMORPHISM,
    ANIMATIONS,
}; 