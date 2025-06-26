import React from 'react';
import {
    Input as ChakraInput,
    FormControl,
    FormLabel,
    FormErrorMessage,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Box
} from '@chakra-ui/react';
import { COLORS, CORNER_RADIUS } from '@utils/designTokens';

const Input = ({
    label,
    error,
    leftIcon,
    rightIcon,
    rightElement,
    isRequired = false,
    variant = 'glassmorphism',
    ...props
}) => {
    const glassmorphismStyles = {
        background: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(215, 215, 215, 0.5)",
        borderRadius: `${CORNER_RADIUS.components.input}px`,
        h: "48px",
        fontSize: "sm",
        pr: rightElement ? "48px" : "16px",
        _focus: {
            borderColor: COLORS.primary,
            background: "rgba(255, 255, 255, 0.8)",
            boxShadow: `0 0 0 1px ${COLORS.primary}`,
        },
        _hover: {
            borderColor: COLORS.primary,
            background: "rgba(255, 255, 255, 0.7)",
        },
        _placeholder: {
            color: "gray.500"
        }
    };

    const inputElement = (
        <InputGroup>
            {leftIcon && (
                <InputLeftElement h="48px" color="gray.500">
                    {leftIcon}
                </InputLeftElement>
            )}
            <ChakraInput
                {...glassmorphismStyles}
                {...props}
            />
            {rightIcon && (
                <InputRightElement h="48px" color="gray.500">
                    {rightIcon}
                </InputRightElement>
            )}
            {rightElement && (
                <InputRightElement h="48px">
                    {rightElement}
                </InputRightElement>
            )}
        </InputGroup>
    );

    if (label || error) {
        return (
            <FormControl isRequired={isRequired} isInvalid={!!error}>
                {label && (
                    <FormLabel
                        fontSize="sm"
                        fontWeight="600"
                        color={COLORS.text}
                        mb={2}
                    >
                        {label}
                    </FormLabel>
                )}
                {inputElement}
                {error && (
                    <FormErrorMessage fontSize="xs" mt={1}>
                        {error}
                    </FormErrorMessage>
                )}
            </FormControl>
        );
    }

    return inputElement;
};

export const DateInput = (props) => (
    <Input type="date" {...props} />
);

export const TimeInput = (props) => (
    <Input type="time" {...props} />
);

export const EmailInput = (props) => (
    <Input type="email" {...props} />
);

export const PasswordInput = (props) => (
    <Input type="password" {...props} />
);

export const SearchInput = (props) => (
    <Input type="text" {...props} />
);

export default Input; 