import React from 'react';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { GLASS_EFFECT, ANIMATIONS, TRANSITIONS, SHADOWS } from '../../utils/designTokens';


const GlassCard = ({
    children,
    bg = GLASS_EFFECT.bg,
    borderRadius = GLASS_EFFECT.borderRadius,
    shadowColor = SHADOWS.soft,
    borderColor = GLASS_EFFECT.border.split(' ')[2],
    animation = null,
    hoverEffect = true,
    ...rest
}) => {
    // Default hover effect
    const hoverStyles = hoverEffect ? {
        _hover: {
            transform: "translateY(-5px)",
            boxShadow: SHADOWS.medium,
        }
    } : {};

    // Use provided animation or default
    const animationProps = animation || ANIMATIONS.card;

    return (
        <Box
            as={motion.div}
            bg={bg}
            backdropFilter={GLASS_EFFECT.backdropFilter}
            border={`1px solid ${borderColor}`}
            borderRadius={borderRadius}
            boxShadow={shadowColor}
            overflow="hidden"
            position="relative"
            transition={TRANSITIONS.default}
            {...hoverStyles}
            {...animationProps}
            {...rest}
            _before={GLASS_EFFECT.beforeProps}
        >
            {children}
        </Box>
    );
};

export default GlassCard; 