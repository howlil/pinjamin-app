import { extendTheme } from '@chakra-ui/react'
import { COLORS, TYPOGRAPHY, SPACING, CORNER_RADIUS, GLASSMORPHISM } from './designTokens'

const theme = extendTheme({
    config: {
        initialColorMode: 'light',
        useSystemColorMode: false,
    },
    fonts: {
        heading: TYPOGRAPHY.fontFamily,
        body: TYPOGRAPHY.fontFamily,
    },
    colors: {
        primary: {
            50: '#E6FFF1',
            100: '#B3FFD4',
            200: '#80FFB7',
            300: '#4DFF9A',
            400: '#1AD97A',
            500: COLORS.primary,
            600: '#16B866',
            700: '#129752',
            800: '#0E763E',
            900: '#0A552A',
        },
        background: COLORS.background,
        text: COLORS.text,
        accent: COLORS.accent,
        glass: {
            background: `rgba(215, 215, 215, ${GLASSMORPHISM.blurBackgroundOpacity})`,
            border: GLASSMORPHISM.outline.color,
        },
    },
    styles: {
        global: {
            body: {
                bg: 'background',
                color: 'text',
                fontFamily: TYPOGRAPHY.fontFamily,
                fontSize: TYPOGRAPHY.fontSize,
                fontWeight: TYPOGRAPHY.fontWeight,
            },
        },
    },
    components: {
        Button: {
            baseStyle: {
                borderRadius: CORNER_RADIUS.default,
                fontWeight: TYPOGRAPHY.fontWeight,
                fontFamily: TYPOGRAPHY.fontFamily,
                _focus: {
                    boxShadow: 'none',
                },
            },
            variants: {
                glassmorphism: {
                    background: `rgba(215, 215, 215, ${GLASSMORPHISM.blurBackgroundOpacity})`,
                    backdropFilter: `blur(${GLASSMORPHISM.blurRadius}px)`,
                    border: `${GLASSMORPHISM.outline.width}px ${GLASSMORPHISM.outline.style}`,
                    borderColor: GLASSMORPHISM.outline.color,
                    borderRadius: CORNER_RADIUS.full,
                    color: COLORS.text,
                    _hover: {
                        background: `rgba(215, 215, 215, ${GLASSMORPHISM.blurBackgroundOpacity + 0.2})`,
                        transform: 'translateY(-1px)',
                    },
                    _active: {
                        background: `rgba(215, 215, 215, ${GLASSMORPHISM.blurBackgroundOpacity + 0.3})`,
                        transform: 'translateY(0px)',
                    },
                },
                primary: {
                    background: COLORS.primary,
                    color: 'white',
                    borderRadius: CORNER_RADIUS.full,
                    border: 'none',
                    _hover: {
                        background: 'primary.600',
                        transform: 'translateY(-1px)',
                    },
                    _active: {
                        background: 'primary.700',
                        transform: 'translateY(0px)',
                    },
                },
            },
            defaultProps: {
                variant: 'glassmorphism',
            },
        },
        Modal: {
            baseStyle: {
                dialog: {
                    background: `rgba(215, 215, 215, ${GLASSMORPHISM.blurBackgroundOpacity})`,
                    backdropFilter: `blur(${GLASSMORPHISM.blurRadius}px)`,
                    border: `${GLASSMORPHISM.outline.width}px ${GLASSMORPHISM.outline.style}`,
                    borderColor: GLASSMORPHISM.outline.color,
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                },
                overlay: {
                    background: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(4px)',
                },
            },
        },
        Card: {
            baseStyle: {
                container: {
                    background: `rgba(215, 215, 215, ${GLASSMORPHISM.blurBackgroundOpacity})`,
                    backdropFilter: `blur(${GLASSMORPHISM.blurRadius}px)`,
                    border: `${GLASSMORPHISM.outline.width}px ${GLASSMORPHISM.outline.style}`,
                    borderColor: GLASSMORPHISM.outline.color,
                    borderRadius: '20px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        Input: {
            variants: {
                glassmorphism: {
                    field: {
                        background: `rgba(255, 255, 255, 0.8)`,
                        backdropFilter: `blur(${GLASSMORPHISM.blurRadius}px)`,
                        border: `${GLASSMORPHISM.outline.width}px ${GLASSMORPHISM.outline.style}`,
                        borderColor: GLASSMORPHISM.outline.color,
                        borderRadius: CORNER_RADIUS.full,
                        _focus: {
                            borderColor: COLORS.primary,
                            boxShadow: `0 0 0 1px ${COLORS.primary}`,
                        },
                        _hover: {
                            borderColor: COLORS.primary,
                        },
                    },
                },
            },
            defaultProps: {
                variant: 'glassmorphism',
            },
        },
        Select: {
            variants: {
                glassmorphism: {
                    field: {
                        background: `rgba(255, 255, 255, 0.8)`,
                        backdropFilter: `blur(${GLASSMORPHISM.blurRadius}px)`,
                        border: `${GLASSMORPHISM.outline.width}px ${GLASSMORPHISM.outline.style}`,
                        borderColor: GLASSMORPHISM.outline.color,
                        borderRadius: CORNER_RADIUS.full,
                        _focus: {
                            borderColor: COLORS.primary,
                            boxShadow: `0 0 0 1px ${COLORS.primary}`,
                        },
                        _hover: {
                            borderColor: COLORS.primary,
                        },
                    },
                },
            },
            defaultProps: {
                variant: 'glassmorphism',
            },
        },
    },
    radii: {
        none: '0',
        sm: `${CORNER_RADIUS.full}px`,
        base: `${CORNER_RADIUS.full}px`,
        md: `${CORNER_RADIUS.full}px`,
        lg: `${CORNER_RADIUS.full}px`,
        xl: `${CORNER_RADIUS.full}px`,
        '2xl': `${CORNER_RADIUS.full}px`,
        '3xl': `${CORNER_RADIUS.full}px`,
        full: `${CORNER_RADIUS.full}px`,
    },
    space: {
        0: '0',
        1: `${SPACING.scale[1]}px`,
        2: `${SPACING.scale[2]}px`,
        3: `${SPACING.scale[3]}px`,
        4: `${SPACING.scale[4]}px`,
        5: '20px',
        6: '24px',
        7: '28px',
        8: '32px',
    },
})

export default theme 