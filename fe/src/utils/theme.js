import { extendTheme } from '@chakra-ui/react';
import { COLORS, RADII } from './designTokens';


const theme = extendTheme({
    colors: {
        brand: {
            50: '#e9f1e8',
            100: '#d3e3d1',
            200: '#bdd4ba',
            300: '#a7c6a3',
            400: '#91b88c',
            500: '#749c73', // Primary color
            600: '#5f7e5e',
            700: '#4c6a4b',
            800: '#395238',
            900: '#263a25',
        },
    },
    fonts: {
        heading: 'var(--font-inter), sans-serif',
        body: 'var(--font-inter), sans-serif',
    },
    styles: {
        global: {
            body: {
                color: COLORS.black,
                bg: '#f7f8fa',
            },
        },
    },
    components: {
        Button: {
            baseStyle: {
                fontWeight: 'medium',
                borderRadius: 'full',
                transition: 'all 0.3s ease',
            },
            variants: {
                primary: {
                    bg: COLORS.primary,
                    color: COLORS.secondary,
                    _hover: {
                        bg: COLORS.primaryDark,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 25px rgba(116, 156, 115, 0.5)',
                    },
                    _active: {
                        bg: COLORS.primaryDark,
                        transform: 'translateY(0)',
                    },
                },
                outline: {
                    color: COLORS.primary,
                    borderColor: COLORS.primary,
                    _hover: {
                        bg: 'rgba(116, 156, 115, 0.1)',
                        transform: 'translateY(-2px)',
                    },
                },
                glass: {
                    bg: 'rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    _hover: {
                        bg: 'rgba(255, 255, 255, 0.4)',
                        transform: 'translateY(-2px)',
                    },
                },
            },
            defaultProps: {
                variant: 'primary',
            },
        },
        Input: {
            baseStyle: {
                field: {
                    borderRadius: 'full',
                    transition: 'all 0.3s ease',
                },
            },
            variants: {
                glass: {
                    field: {
                        bg: 'rgba(255, 255, 255, 0.4)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        _placeholder: { color: COLORS.black, opacity: 0.6 },
                        _focus: {
                            borderColor: COLORS.primary,
                            boxShadow: '0 0 0 3px rgba(116, 156, 115, 0.1)',
                        },
                    },
                },
            },
            defaultProps: {
                variant: 'glass',
            },
        },
        Card: {
            baseStyle: {
                container: {
                    bg: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: RADII.default,
                    boxShadow: '0 8px 32px rgba(116, 156, 115, 0.15)',
                    overflow: 'hidden',
                },
            },
        },
    },
});

export default theme; 