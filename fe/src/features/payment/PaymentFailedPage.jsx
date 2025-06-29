import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    VStack,
    HStack,
    Text,
    Button,
    Divider,
    Badge,
    Icon
} from '@chakra-ui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, Calendar, CreditCard, RefreshCw, Home, AlertTriangle } from 'lucide-react';

const PaymentFailedPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [paymentData, setPaymentData] = useState(null);

    // Extract payment parameters from URL
    useEffect(() => {
        const bookingId = searchParams.get('booking_id');
        const amount = searchParams.get('amount');
        const paymentMethod = searchParams.get('payment_method');
        const invoiceNumber = searchParams.get('invoice_number');
        const transactionId = searchParams.get('transaction_id');
        const errorMessage = searchParams.get('error_message');
        const errorCode = searchParams.get('error_code');

        setPaymentData({
            bookingId,
            amount: amount ? parseInt(amount) : null,
            paymentMethod,
            invoiceNumber,
            transactionId,
            errorMessage: errorMessage || 'Pembayaran tidak dapat diproses',
            errorCode,
            attemptDate: new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        });
    }, [searchParams]);

    const formatCurrency = (amount) => {
        if (!amount) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const handleGoHome = () => {
        navigate('/');
    };

    const handleRetryPayment = () => {
        // Navigate back to booking detail with payment retry
        if (paymentData?.bookingId) {
            navigate(`/booking/${paymentData.bookingId}?retry=true`);
        } else {
            navigate('/user/history');
        }
    };

    const handleContactSupport = () => {
        // TODO: Implement contact support functionality
        window.open('mailto:support@example.com?subject=Bantuan Pembayaran&body=Saya mengalami masalah dengan pembayaran. ID Transaksi: ' + paymentData?.transactionId, '_blank');
    };

    return (
        <Box
            minH="100vh"
            bg="linear-gradient(135deg, #EDFFF4 0%, #C8FFDB 100%)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={4}
        >
            <Container maxW="lg">
                <Box
                    bg="rgba(255, 255, 255, 0.5)"
                    backdropFilter="blur(10px)"
                    borderRadius="24px"
                    border="1px solid #D7D7D7FF"
                    boxShadow="0 8px 32px rgba(215, 215, 215, 0.5)"
                    p={8}
                    textAlign="center"
                >
                    <VStack spacing={6}>
                        {/* Failed Icon */}
                        <Box
                            bg="rgba(239, 68, 68, 0.1)"
                            borderRadius="50%"
                            p={6}
                            display="inline-flex"
                        >
                            <XCircle size={80} color="#EF4444" />
                        </Box>

                        {/* Failed Message */}
                        <VStack spacing={3}>
                            <Text
                                fontSize="3xl"
                                fontWeight="700"
                                color="#EF4444"
                                fontFamily="Inter, sans-serif"
                            >
                                Pembayaran Gagal
                            </Text>
                            <Text
                                fontSize="lg"
                                color="#2A2A2A"
                                fontFamily="Inter, sans-serif"
                                maxW="500px"
                                lineHeight="1.6"
                            >
                                Maaf, pembayaran Anda tidak dapat diproses.
                                Silakan coba lagi atau hubungi customer service.
                            </Text>
                        </VStack>

                        {/* Error Details */}
                        {paymentData && (
                            <Box
                                bg="rgba(239, 68, 68, 0.05)"
                                backdropFilter="blur(10px)"
                                borderRadius="24px"
                                p={6}
                                border="1px solid rgba(239, 68, 68, 0.2)"
                                w="full"
                                textAlign="left"
                            >
                                <VStack spacing={4} align="stretch">
                                    <HStack justify="center" spacing={2}>
                                        <Icon as={AlertTriangle} color="#EF4444" size={20} />
                                        <Text
                                            fontSize="lg"
                                            fontWeight="600"
                                            color="#EF4444"
                                            fontFamily="Inter, sans-serif"
                                        >
                                            Detail Error
                                        </Text>
                                    </HStack>

                                    <Divider borderColor="rgba(239, 68, 68, 0.2)" />

                                    {/* Error Message */}
                                    <Box
                                        bg="rgba(239, 68, 68, 0.1)"
                                        borderRadius="12px"
                                        p={4}
                                        border="1px solid rgba(239, 68, 68, 0.3)"
                                    >
                                        <Text
                                            fontSize="sm"
                                            color="#EF4444"
                                            fontFamily="Inter, sans-serif"
                                            fontWeight="600"
                                            textAlign="center"
                                        >
                                            {paymentData.errorMessage}
                                        </Text>
                                    </Box>

                                    {/* Payment Amount */}
                                    <HStack justify="space-between" align="center">
                                        <HStack>
                                            <Icon as={CreditCard} color="#666" size={20} />
                                            <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                                Jumlah Pembayaran
                                            </Text>
                                        </HStack>
                                        <Text
                                            fontSize="lg"
                                            fontWeight="700"
                                            color="#2A2A2A"
                                            fontFamily="Inter, sans-serif"
                                        >
                                            {formatCurrency(paymentData.amount)}
                                        </Text>
                                    </HStack>

                                    {/* Payment Method */}
                                    {paymentData.paymentMethod && (
                                        <HStack justify="space-between" align="center">
                                            <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                                Metode Pembayaran
                                            </Text>
                                            <Badge
                                                bg="#666"
                                                color="white"
                                                borderRadius="20px"
                                                px={3}
                                                py={1}
                                                fontSize="xs"
                                            >
                                                {paymentData.paymentMethod}
                                            </Badge>
                                        </HStack>
                                    )}

                                    {/* Error Code */}
                                    {paymentData.errorCode && (
                                        <HStack justify="space-between" align="center">
                                            <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                                Kode Error
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                fontWeight="600"
                                                color="#EF4444"
                                                fontFamily="monospace"
                                            >
                                                {paymentData.errorCode}
                                            </Text>
                                        </HStack>
                                    )}

                                    {/* Transaction ID */}
                                    {paymentData.transactionId && (
                                        <HStack justify="space-between" align="center">
                                            <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                                ID Transaksi
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                fontWeight="600"
                                                color="#2A2A2A"
                                                fontFamily="monospace"
                                            >
                                                {paymentData.transactionId}
                                            </Text>
                                        </HStack>
                                    )}

                                    {/* Attempt Date */}
                                    <HStack justify="space-between" align="center">
                                        <HStack>
                                            <Icon as={Calendar} color="#666" size={16} />
                                            <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                                Waktu Percobaan
                                            </Text>
                                        </HStack>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="600"
                                            color="#2A2A2A"
                                            fontFamily="Inter, sans-serif"
                                        >
                                            {paymentData.attemptDate}
                                        </Text>
                                    </HStack>

                                    {/* Booking ID */}
                                    {paymentData.bookingId && (
                                        <HStack justify="space-between" align="center">
                                            <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                                ID Peminjaman
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                fontWeight="600"
                                                color="#2A2A2A"
                                                fontFamily="monospace"
                                            >
                                                {paymentData.bookingId}
                                            </Text>
                                        </HStack>
                                    )}
                                </VStack>
                            </Box>
                        )}

                        {/* Action Buttons */}
                        <VStack spacing={3} w="full">
                            <Button
                                leftIcon={<RefreshCw size={20} />}
                                bg="#21D179"
                                color="white"
                                size="lg"
                                borderRadius="9999px"
                                fontFamily="Inter, sans-serif"
                                fontWeight="600"
                                w="full"
                                h="48px"
                                _hover={{
                                    bg: "#1BAE66",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 4px 12px rgba(33, 209, 121, 0.3)"
                                }}
                                _active={{
                                    transform: "translateY(0)"
                                }}
                                transition="all 0.2s ease"
                                onClick={handleRetryPayment}
                            >
                                Coba Lagi Pembayaran
                            </Button>

                            <HStack spacing={3} w="full">
                                <Button
                                    bg="#F59E0B"
                                    color="white"
                                    size="lg"
                                    borderRadius="9999px"
                                    fontFamily="Inter, sans-serif"
                                    fontWeight="600"
                                    flex={1}
                                    h="48px"
                                    _hover={{
                                        bg: "#D97706",
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)"
                                    }}
                                    _active={{
                                        transform: "translateY(0)"
                                    }}
                                    transition="all 0.2s ease"
                                    onClick={handleContactSupport}
                                >
                                    Hubungi Support
                                </Button>

                                <Button
                                    leftIcon={<Home size={20} />}
                                    bg="rgba(215, 215, 215, 0.5)"
                                    backdropFilter="blur(10px)"
                                    color="#2A2A2A"
                                    size="lg"
                                    borderRadius="9999px"
                                    fontFamily="Inter, sans-serif"
                                    fontWeight="600"
                                    flex={1}
                                    h="48px"
                                    border="1px solid #D7D7D7FF"
                                    _hover={{
                                        bg: "rgba(215, 215, 215, 0.8)",
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                                    }}
                                    _active={{
                                        transform: "translateY(0)"
                                    }}
                                    transition="all 0.2s ease"
                                    onClick={handleGoHome}
                                >
                                    Beranda
                                </Button>
                            </HStack>
                        </VStack>

                        {/* Common Error Solutions */}
                        <Box
                            bg="rgba(59, 130, 246, 0.05)"
                            borderRadius="16px"
                            p={4}
                            border="1px solid rgba(59, 130, 246, 0.2)"
                            w="full"
                        >
                            <VStack spacing={3}>
                                <Text
                                    fontSize="sm"
                                    color="#3B82F6"
                                    fontFamily="Inter, sans-serif"
                                    fontWeight="600"
                                    textAlign="center"
                                >
                                    💡 Tips Mengatasi Masalah Pembayaran
                                </Text>
                                <VStack spacing={2} align="start" w="full">
                                    <Text fontSize="xs" color="#666" fontFamily="Inter, sans-serif">
                                        • Pastikan saldo rekening mencukupi
                                    </Text>
                                    <Text fontSize="xs" color="#666" fontFamily="Inter, sans-serif">
                                        • Periksa koneksi internet yang stabil
                                    </Text>
                                    <Text fontSize="xs" color="#666" fontFamily="Inter, sans-serif">
                                        • Verifikasi data kartu/rekening benar
                                    </Text>
                                    <Text fontSize="xs" color="#666" fontFamily="Inter, sans-serif">
                                        • Hubungi bank untuk aktivasi transaksi online
                                    </Text>
                                </VStack>
                            </VStack>
                        </Box>
                    </VStack>
                </Box>
            </Container>
        </Box>
    );
};

export default PaymentFailedPage; 