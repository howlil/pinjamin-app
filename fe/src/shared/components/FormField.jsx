import React from 'react';
import {
    VStack,
    HStack,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Text
} from '@chakra-ui/react';
import { COLORS } from '@utils/designTokens';
import Input, { DateInput, TimeInput, EmailInput, PasswordInput } from './Input';

const FormField = ({
    label,
    error,
    isRequired = false,
    children,
    orientation = 'vertical',
    labelWidth,
    ...props
}) => {
    const getInputComponent = () => {
        switch (props.type) {
            case 'date':
                return <DateInput {...props} />;
            case 'time':
                return <TimeInput {...props} />;
            case 'email':
                return <EmailInput {...props} />;
            case 'password':
                return <PasswordInput {...props} />;
            default:
                return <Input type={props.type} {...props} />;
        }
    };

    const labelElement = label && (
        <FormLabel
            fontSize="sm"
            fontWeight="600"
            color={error ? 'red.500' : COLORS.text}
            mb={1}
            w={labelWidth}
        >
            {label}{isRequired && ' *'}
        </FormLabel>
    );

    const inputElement = children || getInputComponent();

    const errorElement = error && (
        <Text
            fontSize="xs"
            color="red.500"
            mt={1}
        >
            {error}
        </Text>
    );

    if (orientation === 'horizontal') {
        return (
            <FormControl isRequired={isRequired} isInvalid={!!error}>
                <HStack spacing={4} align="start">
                    {labelElement}
                    <VStack spacing={1} align="stretch" flex={1}>
                        {inputElement}
                        {errorElement}
                    </VStack>
                </HStack>
            </FormControl>
        );
    }

    return (
        <FormControl isRequired={isRequired} isInvalid={!!error}>
            <VStack spacing={1} align="stretch">
                {labelElement}
                {inputElement}
                {errorElement}
            </VStack>
        </FormControl>
    );
};

export const EmailField = (props) => (
    <FormField type="email" {...props} />
);

export const PasswordField = (props) => (
    <FormField type="password" {...props} />
);

export const DateField = (props) => (
    <FormField type="date" {...props} />
);

export const TimeField = (props) => (
    <FormField type="time" {...props} />
);

export default FormField; 