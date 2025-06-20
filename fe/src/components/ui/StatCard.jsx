import React from 'react';
import { Box, Text, Flex, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import { COLORS } from '../../utils/designTokens';


const StatCard = ({
    title,
    value,
    icon,
    trend = null,
    trendValue,
    iconBg = COLORS.primary,
    iconColor = COLORS.secondary,
    ...rest
}) => {
    // Determine trend color based on direction
    const getTrendColor = () => {
        if (trend === 'up') return 'green.500';
        if (trend === 'down') return 'red.500';
        return COLORS.black;
    };

    // Get trend icon based on direction
    const getTrendIcon = () => {
        if (trend === 'up') return '↑';
        if (trend === 'down') return '↓';
        return '';
    };

    return (
        <GlassCard p={6} {...rest}>
            <Flex justify="space-between" align="flex-start">
                <Box>
                    <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color={COLORS.black}
                        opacity={0.7}
                        mb={1}
                    >
                        {title}
                    </Text>
                    <Box as={motion.div} initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                        <Text fontSize="2xl" fontWeight="bold" color={COLORS.black}>
                            {value}
                        </Text>
                    </Box>

                    {trend && (
                        <Flex align="center" mt={1}>
                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color={getTrendColor()}
                                display="flex"
                                alignItems="center"
                            >
                                {getTrendIcon()} {trendValue}
                            </Text>
                        </Flex>
                    )}
                </Box>

                <Flex
                    bg={iconBg}
                    color={iconColor}
                    p={3}
                    borderRadius="12px"
                    justify="center"
                    align="center"
                    boxShadow={`0 4px 10px ${iconBg}40`}
                >
                    <Icon as={icon} boxSize={5} />
                </Flex>
            </Flex>
        </GlassCard>
    );
};

export default StatCard; 