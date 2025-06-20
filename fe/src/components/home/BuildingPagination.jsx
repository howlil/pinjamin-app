import React from 'react';
import {
    Box,
    HStack,
    Button,
    Text,
    Select,
    VStack,
    IconButton,
    Tooltip
} from '@chakra-ui/react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { COLORS, GLASS, SHADOWS } from '@/utils/designTokens';

const MotionBox = motion(Box);

const BuildingPagination = ({
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    itemsPerPage = 10,
    onPageChange,
    onItemsPerPageChange
}) => {
    if (totalPages <= 1) return null;

    const generatePageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const pageNumbers = generatePageNumbers();
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            bg={GLASS.background}
            backdropFilter={GLASS.backdropFilter}
            border={GLASS.border}
            borderRadius="20px"
            boxShadow={SHADOWS.glass}
            p={6}
            mt={8}
        >
            <VStack spacing={4}>
                {/* Pagination Info */}
                <Text fontSize="sm" color={COLORS.gray[600]} textAlign="center">
                    Menampilkan {startItem}-{endItem} dari {totalItems} gedung
                </Text>

                {/* Pagination Controls */}
                <HStack spacing={2} justify="center" flexWrap="wrap">
                    {/* First Page */}
                    <Tooltip label="Halaman Pertama">
                        <IconButton
                            icon={<ChevronsLeft size={16} />}
                            onClick={() => onPageChange(1)}
                            isDisabled={currentPage === 1}
                            variant="ghost"
                            size="sm"
                            borderRadius="lg"
                            _hover={{ bg: `${COLORS.primary}20` }}
                            _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
                        />
                    </Tooltip>

                    {/* Previous Page */}
                    <Tooltip label="Halaman Sebelumnya">
                        <IconButton
                            icon={<ChevronLeft size={16} />}
                            onClick={() => onPageChange(currentPage - 1)}
                            isDisabled={currentPage === 1}
                            variant="ghost"
                            size="sm"
                            borderRadius="lg"
                            _hover={{ bg: `${COLORS.primary}20` }}
                            _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
                        />
                    </Tooltip>

                    {/* Page Numbers */}
                    {pageNumbers.map((page, index) => (
                        page === '...' ? (
                            <Text key={index} color={COLORS.gray[500]} px={2}>
                                ...
                            </Text>
                        ) : (
                            <Button
                                key={index}
                                onClick={() => onPageChange(page)}
                                variant={currentPage === page ? 'solid' : 'ghost'}
                                bg={currentPage === page ? COLORS.primary : 'transparent'}
                                color={currentPage === page ? 'white' : COLORS.black}
                                size="sm"
                                borderRadius="lg"
                                minW="40px"
                                _hover={{
                                    bg: currentPage === page ? COLORS.primary : `${COLORS.primary}20`
                                }}
                            >
                                {page}
                            </Button>
                        )
                    ))}

                    {/* Next Page */}
                    <Tooltip label="Halaman Berikutnya">
                        <IconButton
                            icon={<ChevronRight size={16} />}
                            onClick={() => onPageChange(currentPage + 1)}
                            isDisabled={currentPage === totalPages}
                            variant="ghost"
                            size="sm"
                            borderRadius="lg"
                            _hover={{ bg: `${COLORS.primary}20` }}
                            _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
                        />
                    </Tooltip>

                    {/* Last Page */}
                    <Tooltip label="Halaman Terakhir">
                        <IconButton
                            icon={<ChevronsRight size={16} />}
                            onClick={() => onPageChange(totalPages)}
                            isDisabled={currentPage === totalPages}
                            variant="ghost"
                            size="sm"
                            borderRadius="lg"
                            _hover={{ bg: `${COLORS.primary}20` }}
                            _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
                        />
                    </Tooltip>
                </HStack>

                {/* Items per page selector */}
                <HStack spacing={2} align="center">
                    <Text fontSize="sm" color={COLORS.gray[600]}>
                        Tampilkan:
                    </Text>
                    <Select
                        value={itemsPerPage}
                        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                        size="sm"
                        width="auto"
                        bg="rgba(255, 255, 255, 0.8)"
                        borderRadius="lg"
                        border="1px solid"
                        borderColor={`${COLORS.primary}30`}
                        _focus={{
                            borderColor: COLORS.primary,
                            boxShadow: `0 0 0 1px ${COLORS.primary}`
                        }}
                    >
                        <option value={8}>8 per halaman</option>
                        <option value={12}>12 per halaman</option>
                        <option value={16}>16 per halaman</option>
                        <option value={20}>20 per halaman</option>
                    </Select>
                </HStack>
            </VStack>
        </MotionBox>
    );
};

export default BuildingPagination; 