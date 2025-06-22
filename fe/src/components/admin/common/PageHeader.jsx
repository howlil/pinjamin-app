import React from 'react';
import { Box, Flex, Heading, Text, useBreakpointValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const PageHeader = ({
    title,
    subtitle,
    icon: Icon,
    action,
    children
}) => {
    const padding = useBreakpointValue({ base: 4, md: 6 });
    const iconSize = useBreakpointValue({ base: 12, md: 14 });

    return (
        <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            mb={6}
        >
            <Box
                bg="rgba(255, 255, 255, 0.08)"
                backdropFilter="blur(16px)"
                border="2px solid rgba(255, 255, 255, 0.12)"
                borderRadius="20px"
                p={padding}
                _hover={{
                    borderColor: "rgba(255, 255, 255, 0.15)",
                    boxShadow: "0 25px 80px rgba(116, 156, 115, 0.15)"
                }}
                transition="all 0.3s ease"
            >
                <Flex
                    justify="space-between"
                    align={{ base: 'start', md: 'center' }}
                    direction={{ base: 'column', md: 'row' }}
                    gap={4}
                >
                    <Flex align="center" gap={4}>
                        {Icon && (
                            <Box
                                w={iconSize}
                                h={iconSize}
                                borderRadius="16px"
                                bg="rgba(116, 156, 115, 0.15)"
                                border="1px solid rgba(116, 156, 115, 0.2)"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                position="relative"
                                _before={{
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    bg: 'linear-gradient(135deg, rgba(116, 156, 115, 0.2), rgba(116, 156, 115, 0.05))',
                                    borderRadius: '16px'
                                }}
                            >
                                <Icon
                                    size={24}
                                    color="#749C73"
                                    style={{ position: 'relative', zIndex: 1 }}
                                />
                            </Box>
                        )}
                        <Box>
                            <Heading
                                size={{ base: "md", md: "lg" }}
                                color="#444444"
                                fontWeight="bold"
                                mb={1}
                            >
                                {title}
                            </Heading>
                            {subtitle && (
                                <Text
                                    color="#666666"
                                    fontSize="sm"
                                    fontWeight="medium"
                                    lineHeight="1.5"
                                >
                                    {subtitle}
                                </Text>
                            )}
                        </Box>
                    </Flex>

                    {action && (
                        <Box>
                            {action}
                        </Box>
                    )}
                </Flex>

                {children && (
                    <Box mt={4}>
                        {children}
                    </Box>
                )}
            </Box>
        </MotionBox>
    );
};

export default PageHeader; 