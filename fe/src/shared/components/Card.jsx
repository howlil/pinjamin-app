import React from 'react';
import { Box } from '@chakra-ui/react';
import { CORNER_RADIUS } from '@utils/designTokens';

const Card = ({
    children,
    variant = 'default',
    padding = 6,
    isClickable = false,
    onClick,
    ...props
}) => {
    const baseStyles = {
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(215, 215, 215, 0.5)",
        borderRadius: `${CORNER_RADIUS.components.cards}px`,
        p: padding,
        transition: "all 0.2s ease",
    };

    const clickableStyles = isClickable ? {
        cursor: "pointer",
        _hover: {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
        _active: {
            transform: "translateY(0)",
        }
    } : {};

    const variantStyles = {
        default: baseStyles,
        transparent: {
            ...baseStyles,
            background: "rgba(255, 255, 255, 0.6)",
        },
        solid: {
            ...baseStyles,
            background: "rgba(255, 255, 255, 0.95)",
        },
        error: {
            ...baseStyles,
            background: "rgba(255, 239, 239, 0.8)",
            border: "1px solid rgba(229, 62, 62, 0.3)",
        },
        success: {
            ...baseStyles,
            background: "rgba(240, 253, 244, 0.8)",
            border: "1px solid rgba(34, 197, 94, 0.3)",
        },
        warning: {
            ...baseStyles,
            background: "rgba(255, 251, 235, 0.8)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
        }
    };

    return (
        <Box
            {...variantStyles[variant]}
            {...clickableStyles}
            onClick={onClick}
            {...props}
        >
            {children}
        </Box>
    );
};

export const ErrorCard = (props) => <Card variant="error" {...props} />;
export const SuccessCard = (props) => <Card variant="success" {...props} />;
export const WarningCard = (props) => <Card variant="warning" {...props} />;
export const TransparentCard = (props) => <Card variant="transparent" {...props} />;
export const SolidCard = (props) => <Card variant="solid" {...props} />;

export default Card; 