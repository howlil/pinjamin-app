import React from 'react';
import { Flex, Text, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { COLORS, ANIMATIONS } from '@/utils/designTokens';

const LoginLink = () => {
    return (
        <Flex justify="center" as={motion.div} {...ANIMATIONS.default}>
            <Text color={COLORS.black}>
                Sudah punya akun?{' '}
                <Link
                    as={RouterLink}
                    to="/login"
                    color={COLORS.primary}
                    fontWeight="medium"
                    _hover={{ textDecoration: 'none', color: COLORS.primaryDark }}
                >
                    Masuk
                </Link>
            </Text>
        </Flex>
    );
};

export default LoginLink; 