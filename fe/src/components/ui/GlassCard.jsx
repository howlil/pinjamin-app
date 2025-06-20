import React from 'react';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { COLORS, ANIMATIONS, TRANSITIONS } from '../../utils/designTokens';

const GlassCard = ({
    children,
    animation = null,
    hoverEffect = true,
    p = 4,
    ...rest
}) => {
    // Enhanced glamorphism styles
    const glassMorphismStyles = {
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '20px',
        boxShadow: `
            0 8px 32px 0 rgba(31, 38, 135, 0.15),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.3),
            0 1px 0 0 rgba(255, 255, 255, 0.3)
        `,
        position: 'relative',
        overflow: 'hidden'
    };

    // Hover effect styles
    const hoverStyles = hoverEffect ? {
        _hover: {
            transform: "translateY(-2px)",
            boxShadow: `
                0 12px 40px 0 rgba(31, 38, 135, 0.2),
                inset 0 1px 0 0 rgba(255, 255, 255, 0.4),
                0 2px 0 0 rgba(255, 255, 255, 0.4)
            `,
            background: 'rgba(255, 255, 255, 0.25)',
        }
    } : {};

    // Use provided animation or default card animation
    const animationProps = animation || ANIMATIONS.card;

    return (
        <Box
            as={motion.div}
            {...glassMorphismStyles}
            transition={TRANSITIONS.default}
            p={p}
            {...hoverStyles}
            {...animationProps}
            {...rest}
            // Add subtle gradient overlay for enhanced glass effect
            _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                zIndex: 1
            }}
            _after={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '1px',
                height: '100%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.4), transparent)',
                zIndex: 1
            }}
        >
            <Box position="relative" zIndex={2}>
                {children}
            </Box>
        </Box>
    );
};

export default GlassCard; 