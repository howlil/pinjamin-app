import React from 'react';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { COLORS, ANIMATIONS, TRANSITIONS } from '../../utils/designTokens';

const GlassCard = ({
    children,
    animation = null,
    hoverEffect = true,
    p = 4,
    variant = 'default', // 'default', 'frosted', 'minimal'
    ...rest
}) => {
    // Enhanced glassmorphism variants
    const variants = {
        default: {
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '16px',
            boxShadow: `
                0 8px 32px 0 rgba(31, 38, 135, 0.37),
                inset 0 1px 0 0 rgba(255, 255, 255, 0.5)
            `,
        },
        frosted: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.125)',
            borderRadius: '20px',
            boxShadow: `
                0 25px 45px rgba(0, 0, 0, 0.1),
                0 0 0 1px rgba(255, 255, 255, 0.05),
                inset 0 1px 1px rgba(255, 255, 255, 0.15)
            `,
        },
        minimal: {
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
        }
    };

    const glassMorphismStyles = {
        ...variants[variant],
        position: 'relative',
        overflow: 'hidden'
    };

    // Enhanced hover effect styles
    const hoverStyles = hoverEffect ? {
        _hover: {
            transform: "translateY(-4px)",
            boxShadow: variant === 'frosted'
                ? `0 35px 60px rgba(0, 0, 0, 0.15),
                   0 0 0 1px rgba(255, 255, 255, 0.1),
                   inset 0 1px 1px rgba(255, 255, 255, 0.25)`
                : `0 12px 40px 0 rgba(31, 38, 135, 0.5),
                   inset 0 1px 0 0 rgba(255, 255, 255, 0.6),
                   0 2px 0 0 rgba(255, 255, 255, 0.4)`,
            background: variant === 'frosted'
                ? 'rgba(255, 255, 255, 0.15)'
                : 'rgba(255, 255, 255, 0.35)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
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
            // Subtle light reflections for glassmorphism
            _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                zIndex: 1
            }}
            _after={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '1px',
                height: '100%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.6), transparent)',
                zIndex: 1
            }}
        >
            {/* Subtle gradient overlay for depth */}
            <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                background={`linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.1) 0%, 
                    rgba(255, 255, 255, 0.5) 50%, 
                    rgba(116, 156, 115, 0.05) 100%)`}
                borderRadius="inherit"
                zIndex={1}
                pointerEvents="none"
            />

            {/* Content wrapper */}
            <Box position="relative" zIndex={2}>
                {children}
            </Box>
        </Box>
    );
};

export default GlassCard; 