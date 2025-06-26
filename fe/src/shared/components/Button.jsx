import React from 'react';
import { Button as ChakraButton } from '@chakra-ui/react';
import { COLORS, CORNER_RADIUS } from '@utils/designTokens';

/**
 * Reusable Button Component sesuai context.json
 * Location: shared/components/Button.jsx
 * Features: ["reusable"]
 */
const Button = ({
    children,
    variant = 'glassmorphism',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    onClick,
    disabled = false,
    ...props
}) => {
    const getVariantStyles = (variant) => {
        switch (variant) {
            case 'primary':
                return {
                    bg: COLORS.primary,
                    color: 'white',
                    borderRadius: `${CORNER_RADIUS.components.button}px`,
                    border: 'none',
                    _hover: {
                        bg: '#16B866',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s',
                    },
                    _active: {
                        bg: '#129752',
                        transform: 'translateY(0)',
                    },
                    _disabled: {
                        bg: 'gray.300',
                        color: 'gray.500',
                        _hover: {
                            bg: 'gray.300',
                            transform: 'none',
                        }
                    }
                };
            case 'outline':
                return {
                    bg: 'transparent',
                    color: COLORS.primary,
                    border: `2px solid ${COLORS.primary}`,
                    borderRadius: `${CORNER_RADIUS.components.button}px`,
                    _hover: {
                        bg: COLORS.primary,
                        color: 'white',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s',
                    },
                    _active: {
                        transform: 'translateY(0)',
                    }
                };
            case 'glassmorphism':
            default:
                return {
                    bg: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(215, 215, 215, 0.5)',
                    borderRadius: `${CORNER_RADIUS.components.button}px`,
                    color: COLORS.text,
                    _hover: {
                        bg: 'rgba(255, 255, 255, 0.9)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s',
                    },
                    _active: {
                        bg: 'rgba(255, 255, 255, 1)',
                        transform: 'translateY(0)',
                    }
                };
        }
    };

    return (
        <ChakraButton
            size={size}
            isLoading={isLoading}
            leftIcon={leftIcon}
            rightIcon={rightIcon}
            onClick={onClick}
            disabled={disabled}
            fontWeight="600"
            {...getVariantStyles(variant)}
            {...props}
        >
            {children}
        </ChakraButton>
    );
};

// Export variants untuk kemudahan penggunaan
const PrimaryButton = (props) => <Button variant="primary" {...props} />;
const SecondaryButton = (props) => <Button variant="outline" {...props} />;
const GlassButton = (props) => <Button variant="glassmorphism" {...props} />;
const OutlineButton = (props) => <Button variant="outline" {...props} />;

export { PrimaryButton, SecondaryButton, GlassButton, OutlineButton };
export default Button; 