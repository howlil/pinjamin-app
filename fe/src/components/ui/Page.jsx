import React from 'react';
import { Box, Heading, Text, Flex, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { COLORS, ANIMATIONS } from '../../utils/designTokens';

const Page = ({
    title,
    subtitle,
    headerRight,
    children,
    withHeader = true,
    headerProps = {},
    contentProps = {},
    ...rest
}) => {
    return (
        <Box
            as={motion.div}
            {...ANIMATIONS.default}
            {...rest}
        >
            {withHeader && title && (
                <Box
                    as={motion.div}
                    mb={6}
                    {...ANIMATIONS.header}
                    {...headerProps}
                >
                    <Flex
                        direction={{ base: "column", md: "row" }}
                        justifyContent="space-between"
                        alignItems={{ base: "start", md: "center" }}
                        mb={subtitle ? 2 : 0}
                    >
                        <Heading
                            as="h1"
                            fontSize={{ base: "2xl", md: "3xl" }}
                            color={COLORS.black}
                            fontWeight="bold"
                        >
                            {title}
                        </Heading>

                        {headerRight && (
                            <Box mt={{ base: 4, md: 0 }}>
                                {headerRight}
                            </Box>
                        )}
                    </Flex>

                    {subtitle && (
                        <Text color={COLORS.black} opacity={0.7}>
                            {subtitle}
                        </Text>
                    )}
                </Box>
            )}

            <Box
                as={motion.div}
                {...ANIMATIONS.default}
                {...contentProps}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Page; 