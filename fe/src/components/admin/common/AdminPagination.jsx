import React from 'react';
import {
    Flex,
    HStack,
    Button,
    Text,
    Select
} from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { COLORS } from '@/utils/designTokens';

const AdminPagination = ({
    currentPage,
    totalPages,
    onPageChange,
    totalItems = 0,
    itemsPerPage = 10,
    onItemsPerPageChange,
    showItemsPerPage = false
}) => {
    if (totalPages <= 1 && !showItemsPerPage) return null;

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    return (
        <Flex
            justify="space-between"
            align="center"
            mt={6}
            direction={{ base: 'column', md: 'row' }}
            gap={4}
        >
            {/* Items per page selector */}
            {showItemsPerPage && (
                <HStack spacing={2}>
                    <Text fontSize="sm" color={COLORS.gray[600]}>
                        Show:
                    </Text>
                    <Select
                        size="sm"
                        value={itemsPerPage}
                        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                        width="80px"
                        borderColor={`${COLORS.primary}30`}
                        _focus={{
                            borderColor: COLORS.primary,
                            boxShadow: `0 0 0 1px ${COLORS.primary}`
                        }}
                        borderRadius="lg"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </Select>
                    <Text fontSize="sm" color={COLORS.gray[600]}>
                        per page
                    </Text>
                </HStack>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <HStack spacing={2}>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onPageChange(currentPage - 1)}
                        isDisabled={currentPage === 1}
                        borderRadius="lg"
                        borderColor={`${COLORS.primary}30`}
                        leftIcon={<ChevronLeft size={14} />}
                        _hover={{
                            bg: `${COLORS.primary}10`,
                            borderColor: COLORS.primary
                        }}
                    >
                        Previous
                    </Button>

                    {getVisiblePages().map((page, index) => (
                        page === '...' ? (
                            <Text key={`dots-${index}`} px={2} color={COLORS.gray[400]}>
                                ...
                            </Text>
                        ) : (
                            <Button
                                key={page}
                                size="sm"
                                variant={currentPage === page ? "solid" : "outline"}
                                bg={currentPage === page ? COLORS.primary : "transparent"}
                                color={currentPage === page ? "white" : COLORS.primary}
                                borderColor={`${COLORS.primary}30`}
                                onClick={() => onPageChange(page)}
                                borderRadius="lg"
                                minW="40px"
                                _hover={{
                                    bg: currentPage === page ? COLORS.primaryDark : `${COLORS.primary}10`,
                                    borderColor: COLORS.primary
                                }}
                            >
                                {page}
                            </Button>
                        )
                    ))}

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onPageChange(currentPage + 1)}
                        isDisabled={currentPage === totalPages}
                        borderRadius="lg"
                        borderColor={`${COLORS.primary}30`}
                        rightIcon={<ChevronRight size={14} />}
                        _hover={{
                            bg: `${COLORS.primary}10`,
                            borderColor: COLORS.primary
                        }}
                    >
                        Next
                    </Button>
                </HStack>
            )}

            {/* Results info */}
            <Text fontSize="sm" color={COLORS.gray[600]}>
                {totalItems > 0 && (
                    <>
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
                    </>
                )}
            </Text>
        </Flex>
    );
};

export default AdminPagination; 