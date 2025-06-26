import React from 'react';
import { HStack, IconButton, Box, Icon } from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Text as CustomText } from './Typography';

const PaginationControls = ({
    currentPage,
    totalPages,
    onPageChange,
    totalItems = 0,
    itemsPerPage = 10
}) => {
    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <Box
            bg="rgba(255, 255, 255, 0.8)"
            backdropFilter="blur(15px)"
            borderRadius="24px"
            border="1px solid rgba(215, 215, 215, 0.5)"
            boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
            p={4}
        >
            <HStack justify="space-between" align="center">
                {/* Info */}
                <CustomText fontSize="sm" color="#2A2A2A" opacity={0.7}>
                    Menampilkan {startItem}-{endItem} dari {totalItems} item
                </CustomText>

                {/* Controls */}
                <HStack spacing={2}>
                    <IconButton
                        icon={<Icon as={ChevronLeft} size={16} />}
                        size="sm"
                        variant="ghost"
                        bg="rgba(33, 209, 121, 0.1)"
                        color="#21D179"
                        borderRadius="20px"
                        _hover={{
                            bg: "rgba(33, 209, 121, 0.2)",
                            transform: "translateY(-1px)"
                        }}
                        _active={{
                            bg: "rgba(33, 209, 121, 0.3)",
                            transform: "translateY(0)"
                        }}
                        onClick={() => onPageChange(currentPage - 1)}
                        isDisabled={currentPage <= 1}
                        aria-label="Previous page"
                    />

                    <HStack spacing={1}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(page => {
                                // Show first page, last page, current page, and adjacent pages
                                return (
                                    page === 1 ||
                                    page === totalPages ||
                                    Math.abs(page - currentPage) <= 1
                                );
                            })
                            .map((page, index, array) => (
                                <React.Fragment key={page}>
                                    {index > 0 && array[index - 1] !== page - 1 && (
                                        <CustomText fontSize="sm" color="#2A2A2A" opacity={0.5} px={2}>
                                            ...
                                        </CustomText>
                                    )}
                                    <Box
                                        as="button"
                                        minW="32px"
                                        h="32px"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        borderRadius="20px"
                                        fontSize="sm"
                                        fontWeight="600"
                                        transition="all 0.2s ease"
                                        bg={page === currentPage ? "#21D179" : "rgba(33, 209, 121, 0.1)"}
                                        color={page === currentPage ? "white" : "#21D179"}
                                        _hover={{
                                            bg: page === currentPage ? "#16B866" : "rgba(33, 209, 121, 0.2)",
                                            transform: "translateY(-1px)"
                                        }}
                                        _active={{
                                            transform: "translateY(0)"
                                        }}
                                        onClick={() => onPageChange(page)}
                                    >
                                        {page}
                                    </Box>
                                </React.Fragment>
                            ))}
                    </HStack>

                    <IconButton
                        icon={<Icon as={ChevronRight} size={16} />}
                        size="sm"
                        variant="ghost"
                        bg="rgba(33, 209, 121, 0.1)"
                        color="#21D179"
                        borderRadius="20px"
                        _hover={{
                            bg: "rgba(33, 209, 121, 0.2)",
                            transform: "translateY(-1px)"
                        }}
                        _active={{
                            bg: "rgba(33, 209, 121, 0.3)",
                            transform: "translateY(0)"
                        }}
                        onClick={() => onPageChange(currentPage + 1)}
                        isDisabled={currentPage >= totalPages}
                        aria-label="Next page"
                    />
                </HStack>
            </HStack>
        </Box>
    );
};

export default PaginationControls; 