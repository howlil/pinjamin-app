import React from 'react';
import {
    Box,
    HStack,
    Button,
    Text,
    Select,
    VStack,
    IconButton,
    Tooltip,
    Container
} from '@chakra-ui/react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { COLORS, GLASS, SHADOWS } from '../../utils/designTokens';
import { AnimatedGridPattern } from '../magicui/animated-grid-pattern';

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
        <Container maxW="6xl" px={0}>
            <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                position="relative"
                bg="rgba(255, 255, 255, 0.03)"
                backdropFilter="blur(12px)"
                border="1px solid rgba(255, 255, 255, 0.08)"
                borderRadius="12px"
                boxShadow="0 4px 20px rgba(0, 0, 0, 0.08)"
                p={3}
                mt={4}
                overflow="hidden"
                _before={{
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(116,156,115,0.05) 0%, rgba(116,156,115,0.02) 100%)',
                    borderRadius: '12px',
                    zIndex: -1
                }}
            >
                {/* Animated Grid Pattern Background */}
                <AnimatedGridPattern
                    numSquares={15}
                    maxOpacity={0.04}
                    duration={4}
                    repeatDelay={2}
                    className="absolute inset-0 h-full w-full fill-[#749c73]/8 stroke-[#749c73]/4"
                />

                <VStack spacing={2} position="relative" zIndex={1}>
                    {/* Ultra Compact Pagination Info */}
                    <Text fontSize="xs" color={COLORS.gray[600]} textAlign="center" opacity={0.7}>
                        {startItem}-{endItem} dari {totalItems}
                    </Text>

                    {/* Ultra Compact Pagination Controls */}
                    <HStack spacing={1} justify="center" flexWrap="wrap">
                        {/* Navigation Controls */}
                        <HStack spacing={0.5}>
                            <Tooltip label="Pertama">
                                <IconButton
                                    icon={<ChevronsLeft size={12} />}
                                    onClick={() => onPageChange(1)}
                                    isDisabled={currentPage === 1}
                                    variant="ghost"
                                    size="xs"
                                    minW="24px"
                                    h="24px"
                                    borderRadius="md"
                                    _hover={{ bg: `${COLORS.primary}10` }}
                                    _disabled={{ opacity: 0.2, cursor: 'not-allowed' }}
                                />
                            </Tooltip>

                            <Tooltip label="Sebelumnya">
                                <IconButton
                                    icon={<ChevronLeft size={12} />}
                                    onClick={() => onPageChange(currentPage - 1)}
                                    isDisabled={currentPage === 1}
                                    variant="ghost"
                                    size="xs"
                                    minW="24px"
                                    h="24px"
                                    borderRadius="md"
                                    _hover={{ bg: `${COLORS.primary}10` }}
                                    _disabled={{ opacity: 0.2, cursor: 'not-allowed' }}
                                />
                            </Tooltip>
                        </HStack>

                        {/* Page Numbers */}
                        <HStack spacing={0.5}>
                            {pageNumbers.map((page, index) => (
                                page === '...' ? (
                                    <Text key={index} color={COLORS.gray[500]} px={1} fontSize="xs">
                                        ...
                                    </Text>
                                ) : (
                                    <Button
                                        key={index}
                                        onClick={() => onPageChange(page)}
                                        variant={currentPage === page ? 'solid' : 'ghost'}
                                        bg={currentPage === page ? COLORS.primary : 'transparent'}
                                        color={currentPage === page ? 'white' : COLORS.black}
                                        size="xs"
                                        borderRadius="md"
                                        minW="24px"
                                        h="24px"
                                        fontSize="xs"
                                        _hover={{
                                            bg: currentPage === page ? COLORS.primary : `${COLORS.primary}10`
                                        }}
                                    >
                                        {page}
                                    </Button>
                                )
                            ))}
                        </HStack>

                        {/* Navigation Controls */}
                        <HStack spacing={0.5}>
                            <Tooltip label="Berikutnya">
                                <IconButton
                                    icon={<ChevronRight size={12} />}
                                    onClick={() => onPageChange(currentPage + 1)}
                                    isDisabled={currentPage === totalPages}
                                    variant="ghost"
                                    size="xs"
                                    minW="24px"
                                    h="24px"
                                    borderRadius="md"
                                    _hover={{ bg: `${COLORS.primary}10` }}
                                    _disabled={{ opacity: 0.2, cursor: 'not-allowed' }}
                                />
                            </Tooltip>

                            <Tooltip label="Terakhir">
                                <IconButton
                                    icon={<ChevronsRight size={12} />}
                                    onClick={() => onPageChange(totalPages)}
                                    isDisabled={currentPage === totalPages}
                                    variant="ghost"
                                    size="xs"
                                    minW="24px"
                                    h="24px"
                                    borderRadius="md"
                                    _hover={{ bg: `${COLORS.primary}10` }}
                                    _disabled={{ opacity: 0.2, cursor: 'not-allowed' }}
                                />
                            </Tooltip>
                        </HStack>
                    </HStack>

                    {/* Ultra Compact Items per page selector */}
                    <HStack spacing={1} align="center">
                        <Text fontSize="xs" color={COLORS.gray[600]} opacity={0.7}>
                            Per halaman:
                        </Text>
                        <Select
                            value={itemsPerPage}
                            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                            size="xs"
                            width="80px"
                            bg="rgba(255, 255, 255, 0.6)"
                            borderRadius="md"
                            border="1px solid"
                            borderColor={`${COLORS.primary}15`}
                            fontSize="xs"
                            _focus={{
                                borderColor: COLORS.primary,
                                boxShadow: `0 0 0 1px ${COLORS.primary}20`
                            }}
                        >
                            <option value={8}>8</option>
                            <option value={12}>12</option>
                            <option value={16}>16</option>
                            <option value={20}>20</option>
                        </Select>
                    </HStack>
                </VStack>
            </MotionBox>
        </Container>
    );
};

export default BuildingPagination; 