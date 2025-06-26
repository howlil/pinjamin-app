import React from 'react';
import { VStack, Icon, Box } from '@chakra-ui/react';
import { Receipt } from 'lucide-react';
import { H3, Text as CustomText } from '@shared/components/Typography';

const TransactionEmptyState = () => {
    const getContent = () => {
        return {
            title: 'Belum Ada Transaksi',
            description: 'Riwayat transaksi pembayaran Anda akan muncul di sini setelah melakukan pembayaran',
            icon: Receipt
        };
    };

    const content = getContent();

    return (
        <Box
            bg="rgba(255, 255, 255, 0.8)"
            backdropFilter="blur(15px)"
            borderRadius="24px"
            border="1px solid rgba(215, 215, 215, 0.5)"
            p={12}
            textAlign="center"
        >
            <VStack spacing={4}>
                <Box
                    bg="rgba(33, 209, 121, 0.1)"
                    borderRadius="50%"
                    p={6}
                >
                    <Icon as={content.icon} size={48} color="#21D179" />
                </Box>
                <VStack spacing={2}>
                    <H3 fontSize="lg" fontWeight="700" color="#2A2A2A">
                        {content.title}
                    </H3>
                    <CustomText
                        fontSize="sm"
                        color="#2A2A2A"
                        opacity={0.7}
                        textAlign="center"
                        maxW="300px"
                        lineHeight="1.5"
                    >
                        {content.description}
                    </CustomText>
                </VStack>
            </VStack>
        </Box>
    );
};

export default TransactionEmptyState; 