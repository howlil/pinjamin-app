import React from 'react';
import { Button } from '@chakra-ui/react';
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
    bg = COLORS.primary,
    color = COLORS.secondary,
    size = "md",
    isLoading = false,
    loadingText,
    ...rest
}) => {
    const heights = {
        sm: "36px",
        md: "42px",
        lg: "50px"
    };

    return (
        <Button
            as={motion.button}
            bg={bg}
            color={color}
            borderRadius={RADII.buttonAndInput}
            boxShadow={SHADOWS.button}
            fontWeight="medium"
            height={heights[size]}
            px={size === "sm" ? 6 : size === "md" ? 8 : 10}
            isLoading={isLoading}
            loadingText={loadingText}
            transition="all 0.3s ease"
            _hover={{
                bg: bg,
                transform: "translateY(-2px)",
                boxShadow: "0 6px 25px rgba(116, 156, 115, 0.5)"
            }}
            _active={{
                bg: "#5f7e5e",
                transform: "translateY(0)"
            }}
            {...ANIMATIONS.button}
            {...rest}
        >
            {children}
        </Button>
    );
};

export default PrimaryButton; 