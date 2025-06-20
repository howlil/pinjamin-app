import React from 'react';
import {
    HStack,
    Button,
    Text,
    Select,
    IconButton,
    Flex,
    Box
} from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassCard } from '@/components/ui';
import { COLORS } from '@/utils/designTokens';

const AdminPagination = ({
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    itemsPerPage = 10,
    onPageChange,
    onItemsPerPageChange,
    showSizeChanger = true,
    pageSizeOptions = [10, 25, 50, 100]
}) => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const generatePageNumbers = () => {
        const pages = [];
        const showPages = 5; // Show 5 page numbers at most

        let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
        let endPage = Math.min(totalPages, startPage + showPages - 1);

        // Adjust if we're near the end
        if (endPage - startPage < showPages - 1) {
            startPage = Math.max(1, endPage - showPages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    const pageNumbers = generatePageNumbers();

    const PaginationButton = ({ children, isActive = false, onClick, ...props }) => (
        <Button
            size="sm"
            h="36px"
            minW="36px"
            borderRadius="full"
            fontWeight="semibold"
            onClick={onClick}
            bg={isActive
                ? COLORS.primary
                : "rgba(255, 255, 255, 0.3)"
            }
            color={isActive ? "white" : COLORS.gray[600]}
            border={isActive
                ? "none"
                : `1px solid rgba(255, 255, 255, 0.4)`
            }
            backdropFilter="blur(10px)"
            _hover={{
                bg: isActive
                    ? COLORS.primaryDark
                    : "rgba(255, 255, 255, 0.5)",
                transform: "translateY(-1px)",
                color: isActive ? "white" : COLORS.primary
            }}
            _active={{
                transform: "translateY(0)"
            }}
            transition="all 0.2s ease"
            {...props}
        >
            {children}
        </Button>
    );

    return (
        <GlassCard p={4}>
            <Flex
                direction={{ base: 'column', md: 'row' }}
                justify="space-between"
                align="center"
                gap={4}
            >
                {/* Items Info */}
                <Text color={COLORS.gray[600]} fontSize="sm" fontWeight="medium">
                    Menampilkan {startItem}-{endItem} dari {totalItems} item
                </Text>

                {/* Pagination Controls */}
                <HStack spacing={2}>
                    {/* Previous Button */}
                    <IconButton
                        icon={<ChevronLeft size={16} />}
                        size="sm"
                        h="36px"
                        w="36px"
                        borderRadius="full"
                        bg="rgba(255, 255, 255, 0.3)"
                        color={COLORS.gray[600]}
                        border="1px solid rgba(255, 255, 255, 0.4)"
                        backdropFilter="blur(10px)"
                        onClick={() => onPageChange(currentPage - 1)}
                        isDisabled={currentPage === 1}
                        _hover={{
                            bg: "rgba(255, 255, 255, 0.5)",
                            color: COLORS.primary,
                            transform: "translateY(-1px)"
                        }}
                        _disabled={{
                            opacity: 0.4,
                            cursor: "not-allowed",
                            _hover: {
                                bg: "rgba(255, 255, 255, 0.3)",
                                transform: "none"
                            }
                        }}
                        transition="all 0.2s ease"
                    />

                    {/* Page Numbers */}
                    {pageNumbers.map((pageNum) => (
                        <PaginationButton
                            key={pageNum}
                            isActive={pageNum === currentPage}
                            onClick={() => onPageChange(pageNum)}
                        >
                            {pageNum}
                        </PaginationButton>
                    ))}

                    {/* Next Button */}
                    <IconButton
                        icon={<ChevronRight size={16} />}
                        size="sm"
                        h="36px"
                        w="36px"
                        borderRadius="full"
                        bg="rgba(255, 255, 255, 0.3)"
                        color={COLORS.gray[600]}
                        border="1px solid rgba(255, 255, 255, 0.4)"
                        backdropFilter="blur(10px)"
                        onClick={() => onPageChange(currentPage + 1)}
                        isDisabled={currentPage >= totalPages}
                        _hover={{
                            bg: "rgba(255, 255, 255, 0.5)",
                            color: COLORS.primary,
                            transform: "translateY(-1px)"
                        }}
                        _disabled={{
                            opacity: 0.4,
                            cursor: "not-allowed",
                            _hover: {
                                bg: "rgba(255, 255, 255, 0.3)",
                                transform: "none"
                            }
                        }}
                        transition="all 0.2s ease"
                    />
                </HStack>

                {/* Items Per Page Selector */}
                {showSizeChanger && (
                    <HStack spacing={2}>
                        <Text color={COLORS.gray[600]} fontSize="sm" whiteSpace="nowrap">
                            Items per page:
                        </Text>
                        <Select
                            value={itemsPerPage}
                            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                            size="sm"
                            w="80px"
                            h="36px"
                            borderRadius="full"
                            bg="rgba(255, 255, 255, 0.4)"
                            backdropFilter="blur(10px)"
                            border="1px solid rgba(255, 255, 255, 0.3)"
                            color={COLORS.gray[600]}
                            fontSize="sm"
                            _focus={{
                                borderColor: COLORS.primary,
                                boxShadow: `0 0 0 3px rgba(116, 156, 115, 0.1)`,
                                bg: "rgba(255, 255, 255, 0.6)"
                            }}
                            _hover={{
                                bg: "rgba(255, 255, 255, 0.5)"
                            }}
                        >
                            {pageSizeOptions.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </Select>
                    </HStack>
                )}
            </Flex>
        </GlassCard>
    );
};

export default AdminPagination; 