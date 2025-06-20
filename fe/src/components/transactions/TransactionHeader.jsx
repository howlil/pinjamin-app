import React from 'react';
import {
    HStack,
    VStack,
    Heading,
    Text,
    Button
} from '@chakra-ui/react';
import { COLORS } from '@/utils/designTokens';

const TransactionHeader = ({ totalPending, formatCurrency, onPayNow }) => {
    return (
        <HStack justify="space-between" align="start">
            <VStack align="start" spacing={1}>
                <Heading size="lg" color="gray.800">
                    Transaksi
                </Heading>
                <Text color="gray.600">
                    Riwayat pembayaran dan denda
                </Text>
            </VStack>

            {totalPending > 0 && (
                <VStack align="end" spacing={1}>
                    <Text fontSize="sm" color="gray.600">Total yang harus dibayar:</Text>
                    <Text fontSize="xl" fontWeight="bold" color="red.500">
                        {formatCurrency(totalPending)}
                    </Text>
                    <Button
                        size="sm"
                        colorScheme="green"
                        onClick={onPayNow}
                        bg={COLORS.primary}
                        _hover={{ bg: COLORS.primaryDark }}
                    >
                        Bayar Sekarang
                    </Button>
                </VStack>
            )}
        </HStack>
    );
};

export default TransactionHeader; 