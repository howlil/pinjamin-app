import React from 'react';
import {
    HStack,
    Button,
    Text,
    Select,
    IconButton,
    Flex,
    Box,
    useBreakpointValue
} from '@chakra-ui/react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { COLORS } from '../../../utils/designTokens';

const MotionBox = motion(Box);

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
    const padding = useBreakpointValue({ base: 3, md: 4 });
    const buttonSize = useBreakpointValue({ base: "32px", md: "36px" });

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const generatePageNumbers = () => {
        const pages = [];
        const showPages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
        let endPage = Math.min(totalPages, startPage + showPages - 1);

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
            h={buttonSize}
            minW={buttonSize}
            borderRadius="10px"
            fontWeight="bold"
            fontSize="sm"
            onClick={onClick}
            bg={isActive
                ? COLORS.primary
                : "rgba(255, 255, 255, 0.1)"
            }
            color={isActive ? "white" : "#444444"}
            border={isActive
                ? `1px solid ${COLORS.primary}`
                : "1px solid rgba(255, 255, 255, 0.15)"
            }
            backdropFilter="blur(8px)"
            _hover={{
                bg: isActive
                    ? COLORS.primary
                    : "rgba(255, 255, 255, 0.15)",
                transform: "translateY(-1px)",
                color: isActive ? "white" : COLORS.primary,
                borderColor: isActive ? COLORS.primary : "rgba(116, 156, 115, 0.3)"
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
        <MotionBox
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <Box
                bg="rgba(255, 255, 255, 0.08)"
                backdropFilter="blur(16px)"
                border="1px solid rgba(255, 255, 255, 0.12)"
                borderRadius="16px"
                boxShadow="0 8px 32px rgba(116, 156, 115, 0.08)"
                p={padding}
            >
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    justify="space-between"
                    align="center"
                    gap={4}
                >
                    {/* Info Section */}
                    <HStack spacing={3} color="#666666" fontSize="sm">
                        <Box
                            w={8}
                            h={8}
                            borderRadius="8px"
                            bg="rgba(116, 156, 115, 0.15)"
                            border="1px solid rgba(116, 156, 115, 0.2)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Info size={14} color={COLORS.primary} />
                        </Box>
                        <Text fontWeight="medium">
                            {totalItems > 0 ? `${startItem}-${endItem}` : '0'} dari {totalItems} item
                        </Text>
                    </HStack>

                    {/* Pagination Controls */}
                    <HStack spacing={2}>
                        {/* Previous Button */}
                        <IconButton
                            icon={<ChevronLeft size={16} />}
                            size="sm"
                            h={buttonSize}
                            w={buttonSize}
                            borderRadius="10px"
                            bg="rgba(255, 255, 255, 0.1)"
                            color="#444444"
                            border="1px solid rgba(255, 255, 255, 0.15)"
                            backdropFilter="blur(8px)"
                            onClick={() => onPageChange(currentPage - 1)}
                            isDisabled={currentPage === 1}
                            _hover={{
                                bg: "rgba(255, 255, 255, 0.15)",
                                color: COLORS.primary,
                                transform: "translateY(-1px)",
                                borderColor: "rgba(116, 156, 115, 0.3)"
                            }}
                            _disabled={{
                                opacity: 0.3,
                                cursor: "not-allowed",
                                _hover: {
                                    bg: "rgba(255, 255, 255, 0.1)",
                                    transform: "none",
                                    color: "#444444",
                                    borderColor: "rgba(255, 255, 255, 0.15)"
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
                            h={buttonSize}
                            w={buttonSize}
                            borderRadius="10px"
                            bg="rgba(255, 255, 255, 0.1)"
                            color="#444444"
                            border="1px solid rgba(255, 255, 255, 0.15)"
                            backdropFilter="blur(8px)"
                            onClick={() => onPageChange(currentPage + 1)}
                            isDisabled={currentPage >= totalPages}
                            _hover={{
                                bg: "rgba(255, 255, 255, 0.15)",
                                color: COLORS.primary,
                                transform: "translateY(-1px)",
                                borderColor: "rgba(116, 156, 115, 0.3)"
                            }}
                            _disabled={{
                                opacity: 0.3,
                                cursor: "not-allowed",
                                _hover: {
                                    bg: "rgba(255, 255, 255, 0.1)",
                                    transform: "none",
                                    color: "#444444",
                                    borderColor: "rgba(255, 255, 255, 0.15)"
                                }
                            }}
                            transition="all 0.2s ease"
                        />
                    </HStack>

                    {/* Items Per Page Selector */}
                    {showSizeChanger && (
                        <HStack spacing={3}>
                            <Text color="#666666" fontSize="sm" fontWeight="medium" whiteSpace="nowrap">
                                Per halaman:
                            </Text>
                            <Select
                                value={itemsPerPage}
                                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                                size="sm"
                                w="80px"
                                h={buttonSize}
                                borderRadius="10px"
                                bg="rgba(255, 255, 255, 0.1)"
                                backdropFilter="blur(8px)"
                                border="1px solid rgba(255, 255, 255, 0.15)"
                                color="#444444"
                                fontSize="sm"
                                fontWeight="medium"
                                _focus={{
                                    borderColor: COLORS.primary,
                                    boxShadow: `0 0 0 3px rgba(116, 156, 115, 0.1)`,
                                    bg: "rgba(255, 255, 255, 0.15)"
                                }}
                                _hover={{
                                    bg: "rgba(255, 255, 255, 0.15)",
                                    borderColor: "rgba(116, 156, 115, 0.3)"
                                }}
                                transition="all 0.2s ease"
                            >
                                {pageSizeOptions.map((size) => (
                                    <option key={size} value={size} style={{ background: '#ffffff', color: '#444444' }}>
                                        {size}
                                    </option>
                                ))}
                            </Select>
                        </HStack>
                    )}
                </Flex>
            </Box>
        </MotionBox>
    );
};

export default AdminPagination; 