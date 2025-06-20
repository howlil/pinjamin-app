import React from 'react';
import { Flex, Text, HStack, IconButton } from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BookingPagination = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPrevPage,
    onNextPage
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <Flex justify="space-between" align="center" w="100%" pt={4}>
            <Text fontSize="sm" color="gray.600">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}-{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
            </Text>
            <HStack>
                <IconButton
                    icon={<ChevronLeft size={16} />}
                    onClick={onPrevPage}
                    isDisabled={currentPage === 1}
                    size="sm"
                    variant="outline"
                    aria-label="Previous page"
                />
                <IconButton
                    icon={<ChevronRight size={16} />}
                    onClick={onNextPage}
                    isDisabled={currentPage === totalPages}
                    size="sm"
                    variant="outline"
                    aria-label="Next page"
                />
            </HStack>
        </Flex>
    );
};

export default BookingPagination; 