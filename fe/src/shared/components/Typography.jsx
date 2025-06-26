import React from 'react';
import { Heading, Text as ChakraText } from '@chakra-ui/react';
import { COLORS } from '@utils/designTokens';

const Typography = {
    Heading: ({
        level = 1,
        variant = 'default',
        color = COLORS.text,
        children,
        ...props
    }) => {
        const sizeMap = {
            1: '2xl',
            2: 'xl',
            3: 'lg',
            4: 'md',
            5: 'sm',
            6: 'xs'
        };

        const variantStyles = {
            default: {},
            hero: {
                fontWeight: 'bold',
                lineHeight: '1.2',
            },
            section: {
                fontWeight: '600',
                mb: 4,
            },
            primary: {
                color: COLORS.primary,
            }
        };

        return (
            <Heading
                as={`h${level}`}
                size={sizeMap[level]}
                color={color}
                {...variantStyles[variant]}
                {...props}
            >
                {children}
            </Heading>
        );
    },

    Text: ({
        variant = 'default',
        size = 'md',
        color = COLORS.text,
        children,
        ...props
    }) => {
        const variantStyles = {
            default: {},
            subtitle: {
                color: 'gray.600',
                lineHeight: '1.6',
            },
            caption: {
                fontSize: 'sm',
                color: 'gray.500',
            },
            label: {
                fontSize: 'sm',
                fontWeight: '600',
            },
            primary: {
                color: COLORS.primary,
                fontWeight: '500',
            },
            error: {
                color: 'red.500',
                fontSize: 'sm',
            },
            success: {
                color: 'green.500',
                fontSize: 'sm',
            },
            muted: {
                color: 'gray.400',
                fontSize: 'sm',
            }
        };

        return (
            <ChakraText
                fontSize={size}
                color={color}
                {...variantStyles[variant]}
                {...props}
            >
                {children}
            </ChakraText>
        );
    }
};

export const { Heading: H, Text } = Typography;

export const H1 = (props) => <H level={1} variant="hero" {...props} />;
export const H2 = (props) => <H level={2} variant="section" {...props} />;
export const H3 = (props) => <H level={3} {...props} />;
export const H4 = (props) => <H level={4} {...props} />;
export const H5 = (props) => <H level={5} {...props} />;
export const H6 = (props) => <H level={6} {...props} />;

export const Subtitle = (props) => <Text variant="subtitle" {...props} />;
export const Caption = (props) => <Text variant="caption" {...props} />;
export const Label = (props) => <Text variant="label" {...props} />;
export const PrimaryText = (props) => <Text variant="primary" {...props} />;
export const ErrorText = (props) => <Text variant="error" {...props} />;
export const SuccessText = (props) => <Text variant="success" {...props} />;
export const MutedText = (props) => <Text variant="muted" {...props} />;

export default Typography; 