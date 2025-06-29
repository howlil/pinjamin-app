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
import { CheckCircle, Calendar, CreditCard, Download, Home, FileText } from 'lucide-react';

const PaymentSuccessPage = () => {
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

        setPaymentData({
            bookingId,
            amount: amount ? parseInt(amount) : null,
            paymentMethod,
            invoiceNumber,
            transactionId,
            paymentDate: new Date().toLocaleDateString('id-ID', {
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

    const handleViewBookings = () => {
        navigate('/user/history');
    };

    const handleDownloadReceipt = () => {
        // TODO: Implement download receipt functionality
        console.log('Download receipt for:', paymentData?.invoiceNumber);
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
                        {/* Success Icon */}
                        <Box
                            bg="rgba(33, 209, 121, 0.1)"
                            borderRadius="50%"
                            p={6}
                            display="inline-flex"
                        >
                            <CheckCircle size={80} color="#21D179" />
                        </Box>

                        {/* Success Message */}
                        <VStack spacing={3}>
                            <Text
                                fontSize="3xl"
                                fontWeight="700"
                                color="#21D179"
                                fontFamily="Inter, sans-serif"
                            >
                                Pembayaran Berhasil!
                            </Text>
                            <Text
                                fontSize="lg"
                                color="#2A2A2A"
                                fontFamily="Inter, sans-serif"
                                maxW="500px"
                                lineHeight="1.6"
                            >
                                Terima kasih! Pembayaran Anda telah berhasil diproses.
                                Peminjaman gedung Anda sudah dikonfirmasi.
                            </Text>
                        </VStack>

                        {/* Payment Details */}
                        {paymentData && (
                            <Box
                                bg="rgba(215, 215, 215, 0.5)"
                                backdropFilter="blur(10px)"
                                borderRadius="24px"
                                p={6}
                                border="1px solid #D7D7D7FF"
                                w="full"
                                textAlign="left"
                            >
                                <VStack spacing={4} align="stretch">
                                    <Text
                                        fontSize="lg"
                                        fontWeight="600"
                                        color="#2A2A2A"
                                        fontFamily="Inter, sans-serif"
                                        textAlign="center"
                                        mb={2}
                                    >
                                        Detail Pembayaran
                                    </Text>

                                    <Divider borderColor="#D7D7D7FF" />

                                    {/* Payment Amount */}
                                    <HStack justify="space-between" align="center">
                                        <HStack>
                                            <Icon as={CreditCard} color="#21D179" size={20} />
                                            <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                                Total Pembayaran
                                            </Text>
                                        </HStack>
                                        <Text
                                            fontSize="xl"
                                            fontWeight="700"
                                            color="#21D179"
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
                                                bg="#21D179"
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

                                    {/* Invoice Number */}
                                    {paymentData.invoiceNumber && (
                                        <HStack justify="space-between" align="center">
                                            <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                                Nomor Invoice
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                fontWeight="600"
                                                color="#2A2A2A"
                                                fontFamily="monospace"
                                            >
                                                {paymentData.invoiceNumber}
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

                                    {/* Payment Date */}
                                    <HStack justify="space-between" align="center">
                                        <HStack>
                                            <Icon as={Calendar} color="#21D179" size={16} />
                                            <Text fontSize="sm" color="#666" fontFamily="Inter, sans-serif">
                                                Tanggal Pembayaran
                                            </Text>
                                        </HStack>
                                        <Text
                                            fontSize="sm"
                                            fontWeight="600"
                                            color="#2A2A2A"
                                            fontFamily="Inter, sans-serif"
                                        >
                                            {paymentData.paymentDate}
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
                                leftIcon={<Download size={20} />}
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
                                onClick={handleDownloadReceipt}
                            >
                                Download Bukti Pembayaran
                            </Button>

                            <HStack spacing={3} w="full">
                                <Button
                                    leftIcon={<FileText size={20} />}
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
                                    onClick={handleViewBookings}
                                >
                                    Lihat Riwayat
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

                        {/* Additional Info */}
                        <Box
                            bg="rgba(33, 209, 121, 0.05)"
                            borderRadius="16px"
                            p={4}
                            border="1px solid rgba(33, 209, 121, 0.2)"
                            w="full"
                        >
                            <Text
                                fontSize="sm"
                                color="#21D179"
                                fontFamily="Inter, sans-serif"
                                fontWeight="600"
                                textAlign="center"
                            >
                                💡 Simpan bukti pembayaran ini untuk keperluan administrasi
                            </Text>
                        </Box>
                    </VStack>
                </Box>
            </Container>
        </Box>
    );
};

export default PaymentSuccessPage; 