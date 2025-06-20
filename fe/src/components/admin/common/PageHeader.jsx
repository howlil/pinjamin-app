import React from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const PageHeader = ({ 
    title, 
    subtitle, 
    icon: Icon,
    action,
    children 
}) => {
    return (
        <Box mb={4}>
            <Flex 
                justify="space-between" 
                align={{ base: 'start', md: 'center' }}
                direction={{ base: 'column', md: 'row' }}
                gap={3}
            >
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Flex align="center" gap={3}>
                        {Icon && (
                            <Box
                                p={2}
                                bg="rgba(116, 156, 115, 0.1)"
                                borderRadius="lg"
                                color="#749C73"
                            >
                                <Icon size={24} />
                            </Box>
                        )}
                        <Box>
                            <Heading size="lg" color="gray.800">
                                {title}
                            </Heading>
                            {subtitle && (
                                <Text color="gray.500" fontSize="sm" mt={1}>
                                    {subtitle}
                                </Text>
                            )}
                        </Box>
                    </Flex>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    {action}
                </motion.div>
            </Flex>
            {children}
        </Box>
    );
};

export default PageHeader; 