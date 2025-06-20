import React from 'react';
import { HStack, Button, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '@/utils/designTokens';

const NavigationBar = () => {
    const navigate = useNavigate();

    return (
        <HStack spacing={4}>
            <Button
                variant="link"
                color={COLORS.primary}
                onClick={() => navigate('/')}
                fontWeight="medium"
            >
                Beranda
            </Button>
            <Text color={COLORS.black} opacity={0.6}>/</Text>
            <Button
                variant="link"
                color={COLORS.primary}
                onClick={() => navigate('/jadwal')}
                fontWeight="medium"
            >
                Jadwal
            </Button>
            <Text color={COLORS.black} opacity={0.6}>/</Text>
            <Button
                variant="link"
                color={COLORS.primary}
                onClick={() => navigate('/riwayat')}
                fontWeight="medium"
            >
                Riwayat
            </Button>
            <Text color={COLORS.black} opacity={0.6}>/</Text>
            <Button
                variant="link"
                color={COLORS.primary}
                onClick={() => navigate('/transaksi')}
                fontWeight="medium"
            >
                Transaksi
            </Button>
        </HStack>
    );
};

export default NavigationBar; 