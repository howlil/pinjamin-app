import React from 'react';
import {
    Select,
    HStack
} from '@chakra-ui/react';
import { Calendar } from 'lucide-react';
import { GlassCard } from '../../ui';
import { COLORS } from '../../../utils/designTokens';

const DashboardFilters = ({
    selectedMonth,
    selectedYear,
    onMonthChange,
    onYearChange,
    monthOptions = [],
    yearOptions = []
}) => {
    return (
        <GlassCard p={4} minW="300px">
            <HStack spacing={3} align="center">
                <Calendar size={18} color={COLORS.primary} />
                <Select
                    value={selectedMonth}
                    onChange={(e) => onMonthChange(Number(e.target.value))}
                    size="sm"
                    bg="white"
                    borderColor={`${COLORS.primary}30`}
                    _focus={{
                        borderColor: COLORS.primary,
                        boxShadow: `0 0 0 1px ${COLORS.primary}`
                    }}
                    borderRadius="full"
                >
                    <option value="">Semua Bulan</option>
                    {monthOptions.map(month => (
                        <option key={month.value} value={month.value}>
                            {month.label}
                        </option>
                    ))}
                </Select>

                <Select
                    value={selectedYear}
                    onChange={(e) => onYearChange(Number(e.target.value))}
                    size="sm"
                    bg="white"
                    borderColor={`${COLORS.primary}30`}
                    _focus={{
                        borderColor: COLORS.primary,
                        boxShadow: `0 0 0 1px ${COLORS.primary}`
                    }}
                    borderRadius="full"
                    minW="100px"
                >
                    {yearOptions.map(year => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </Select>
            </HStack>
        </GlassCard>
    );
};

export default DashboardFilters; 