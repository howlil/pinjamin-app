import React from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  COLORS,
  RADII,
  SHADOWS,
  TRANSITIONS,
  ANIMATIONS,
  GLASS_EFFECT
} from '../../utils/designTokens';

/**
 * GlassInput - A stylized input component with glass effect
 * 
 * @param {object} props - Component props
 * @param {string} props.name - Input name
 * @param {string} props.label - Input label
 * @param {string} props.value - Input value
 * @param {function} props.onChange - Change handler
 * @param {string} props.type - Input type (text, email, password, etc.)
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.isRequired - Whether the input is required
 * @param {React.ReactNode} props.rightElement - Element to render on the right side
 * @param {boolean} props.isInvalid - Whether the input is invalid
 * @param {string} props.errorMessage - Error message to display
 */
const GlassInput = ({
  name,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  isRequired = false,
  rightElement = null,
  isInvalid = false,
  errorMessage = "",
  ...rest
}) => {
  return (
    <FormControl isRequired={isRequired} isInvalid={isInvalid}>
      {label && (
        <FormLabel
          fontSize="sm"
          fontWeight="medium"
          color={COLORS.black}
        >
          {label}
          {isRequired && <Text as="span" color={COLORS.primary}>*</Text>}
        </FormLabel>
      )}
      <InputGroup>
        <Input
          as={motion.input}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          bg={GLASS_EFFECT.bg}
          backdropFilter={GLASS_EFFECT.backdropFilter}
          border={GLASS_EFFECT.border}
          borderRadius={RADII.buttonAndInput}
          color={COLORS.black}
          fontSize="sm"
          py={6}
          _placeholder={{ color: COLORS.black, opacity: 0.6 }}
          _focus={{
            borderColor: COLORS.primary,
            boxShadow: SHADOWS.focus
          }}
          _hover={{
            borderColor: "rgba(116, 156, 115, 0.5)"
          }}
          {...ANIMATIONS.input}
          transition={TRANSITIONS.default}
          {...rest}
        />
        {rightElement && <InputRightElement>{rightElement}</InputRightElement>}
      </InputGroup>
      {isInvalid && errorMessage && (
        <Text color="red.500" mt={1} fontSize="sm">
          {errorMessage}
        </Text>
      )}
    </FormControl>
  );
};

export default GlassInput; 