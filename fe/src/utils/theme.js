import { extendTheme } from '@chakra-ui/react';

const colors = {
    primary: {
        50: '#f0f7f0',
        100: '#d9e8d9',
        200: '#b8d6b8',
        300: '#93c293',
        400: '#749C73',
        500: '#749C73', // Main primary color
        600: '#5a7a59',
        700: '#455b44',
        800: '#2f3d2f',
        900: '#1a201a',
    },
    white: '#FFFFFF',
    black: '#444444',
    gray: {
        50: '#f9f9f9',
        100: '#f0f0f0',
        200: '#e2e2e2',
        300: '#d4d4d4',
        400: '#a8a8a8',
        500: '#8c8c8c',
        600: '#666666',
        700: '#4a4a4a',
        800: '#444444',
        900: '#2d2d2d',
    }
};

const components = {
    Button: {
        baseStyle: {
            borderRadius: 'full',
            fontWeight: '500',
            _focus: {
                boxShadow: '0 0 0 3px rgba(116, 156, 115, 0.2)',
            },
        },
        variants: {
            solid: {
                bg: 'primary.500',
                color: 'white',
                _hover: {
                    bg: 'primary.600',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 8px 25px rgba(116, 156, 115, 0.3)',
                },
                _active: {
                    bg: 'primary.700',
                    transform: 'translateY(0)',
                },
            },
            outline: {
                borderColor: 'primary.500',
                color: 'primary.500',
                _hover: {
                    bg: 'primary.50',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 8px 25px rgba(116, 156, 115, 0.15)',
                },
            },
            ghost: {
                color: 'primary.500',
                _hover: {
                    bg: 'primary.50',
                    transform: 'translateY(-1px)',
                },
            },
        },
    },
    Input: {
        variants: {
            outline: {
                field: {
                    borderRadius: 'full',
                    borderColor: 'gray.200',
                    _focus: {
                        borderColor: 'primary.500',
                        boxShadow: '0 0 0 1px rgba(116, 156, 115, 0.2)',
                    },
                    _hover: {
                        borderColor: 'gray.300',
                    },
                },
            },
        },
    },
    Card: {
        baseStyle: {
            container: {
                borderRadius: '20px',
                bg: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                _dark: {
                    bg: 'rgba(68, 68, 68, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                },
            },
        },
    },
    Modal: {
        baseStyle: {
            overlay: {
                backdropFilter: 'blur(8px)',
                bg: 'rgba(0, 0, 0, 0.4)',
            },
            dialog: {
                borderRadius: '20px',
                bg: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            },
        },
    },
};

const shadows = {
    soft: '0 4px 20px rgba(0, 0, 0, 0.08)',
    medium: '0 8px 25px rgba(0, 0, 0, 0.12)',
    large: '0 12px 40px rgba(0, 0, 0, 0.15)',
    glow: '0 0 20px rgba(116, 156, 115, 0.3)',
};

const styles = {
    global: {
        body: {
            bg: 'gray.50',
            color: 'black',
            fontFamily: 'system-ui, -apple-system, sans-serif',
        },
        '*': {
            scrollBehavior: 'smooth',
        },
    },
};

const theme = extendTheme({
    colors,
    components,
    shadows,
    styles,
    config: {
        initialColorMode: 'light',
        useSystemColorMode: false,
    },
    radii: {
        base: '20px',
        md: '20px',
        lg: '20px',
        xl: '20px',
    },
});

export default theme; 