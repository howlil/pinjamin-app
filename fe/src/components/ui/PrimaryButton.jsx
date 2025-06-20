import React from 'react';
import { Button, Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
    COLORS,
    RADII,
    SHADOWS,
    TRANSITIONS,
    ANIMATIONS
} from '../../utils/designTokens';

const PrimaryButton = ({
    children,
    variant = "solid",
    size = "md",
    isLoading = false,
    loadingText,
    ...rest
}) => {
    const heights = {
        sm: "36px",
        md: "44px",
        lg: "52px"
    };

    const padding = {
        sm: 6,
        md: 8,
        lg: 10
    };

    // Solid variant styles (default)
    const solidStyles = {
        bg: COLORS.primary,
        color: "white",
        border: "none",
        _hover: {
            bg: COLORS.primaryDark,
            transform: "translateY(-2px)",
            boxShadow: `0 8px 25px rgba(116, 156, 115, 0.4)`
        },
        _active: {
            bg: COLORS.primaryDark,
            transform: "translateY(0)",
            boxShadow: `0 4px 15px rgba(116, 156, 115, 0.3)`
        }
    };

    // Outline variant styles with glass effect
    const outlineStyles = {
        bg: "rgba(255, 255, 255, 0.1)",
        color: COLORS.primary,
        border: `2px solid ${COLORS.primary}`,
        backdropFilter: "blur(10px)",
        _hover: {
            bg: "rgba(255, 255, 255, 0.2)",
            transform: "translateY(-2px)",
            boxShadow: `0 8px 25px rgba(116, 156, 115, 0.3)`,
            borderColor: COLORS.primaryDark
        },
        _active: {
            bg: "rgba(255, 255, 255, 0.3)",
            transform: "translateY(0)"
        }
    };

    const variantStyles = variant === "outline" ? outlineStyles : solidStyles;

    return (
        <Button
            as={motion.button}
            borderRadius="full" // Always full border radius per context
            fontWeight="semibold"
            height={heights[size]}
            px={padding[size]}
            isLoading={isLoading}
            loadingText={loadingText}
            transition="all 0.3s ease"
            position="relative"
            overflow="hidden"
            {...variantStyles}
            {...ANIMATIONS.button}
            {...rest}
            // Add subtle gradient overlay for enhanced depth
            _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '50%',
                background: variant === "solid"
                    ? 'linear-gradient(180deg, rgba(255,255,255,0.2), transparent)'
                    : 'linear-gradient(180deg, rgba(255,255,255,0.1), transparent)',
                borderRadius: 'full',
                zIndex: 1,
                pointerEvents: 'none'
            }}
        >
            <Box position="relative" zIndex={2}>
                {children}
            </Box>
        </Button>
    );
};

export default PrimaryButton; 