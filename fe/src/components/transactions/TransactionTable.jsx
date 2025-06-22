import React from 'react';
import {
    Box,
    Badge,
    Button,
    HStack,
    Text,
    VStack,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useBreakpointValue,
    Container,
    Spinner,
    Tooltip
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FileText, Calendar, DollarSign, CreditCard, AlertCircle } from 'lucide-react';
import { AdminPagination } from '../admin/common';
import { COLORS } from '../../utils/designTokens';
import { AnimatedGridPattern } from '../magicui/animated-grid-pattern';

const MotionBox = motion(Box);
const MotionTr = motion.tr;

const TransactionTable = ({
    transactions = [],
    formatCurrency,
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    onPageChange,
    onPayNow,
    onGenerateInvoice,
    generatingInvoice = false
}) => {
    // Responsive values
    const containerPadding = useBreakpointValue({ base: 4, sm: 5, md: 6 });
    const tableSize = useBreakpointValue({ base: "sm", md: "md" });
    const showDesktop = useBreakpointValue({ base: false, md: true });

    // Helper functions for status and payment method display
    const getStatusBadge = (status) => {
        const statusColors = {
            'PENDING': 'orange',
            'PAID': 'green',
            'FAILED': 'red',
            'CANCELLED': 'gray',
            'REFUNDED': 'blue'
        };
        return statusColors[status] || 'gray';
    };

    const getStatusText = (status) => {
        const statusTexts = {
            'PENDING': 'Menunggu',
            'PAID': 'Lunas',
            'FAILED': 'Gagal',
            'CANCELLED': 'Dibatalkan',
            'REFUNDED': 'Dikembalikan'
        };
        return statusTexts[status] || status;
    };

    const getStatusColor = (status) => {
        const statusColors = {
            'PENDING': { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
            'PAID': { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: 'rgba(16, 185, 129, 0.3)' },
            'FAILED': { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' },
            'CANCELLED': { bg: 'rgba(107, 114, 128, 0.15)', color: '#6b7280', border: 'rgba(107, 114, 128, 0.3)' },
            'REFUNDED': { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)' }
        };
        return statusColors[status] || statusColors['CANCELLED'];
    };

    if (!transactions || transactions.length === 0) {
        return (
            <Container maxW="6xl" px={{ base: 3, sm: 4, md: 6 }}>
                <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    bg="rgba(255, 255, 255, 0.08)"
                    backdropFilter="blur(16px)"
                    border="1px solid rgba(255, 255, 255, 0.12)"
                    borderRadius="20px"
                    boxShadow="0 20px 60px rgba(116, 156, 115, 0.1)"
                    p={8}
                    textAlign="center"
                    position="relative"
                    overflow="hidden"
                >
                    <AnimatedGridPattern
                        numSquares={25}
                        maxOpacity={0.03}
                        duration={4}
                        repeatDelay={2}
                        className="absolute inset-0 h-full w-full fill-[#749c73]/6 stroke-[#749c73]/3"
                    />
                    <VStack spacing={4} position="relative" zIndex={1}>
                        <MotionBox
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            w={16}
                            h={16}
                            bg="rgba(116, 156, 115, 0.15)"
                            borderRadius="16px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            border="1px solid rgba(116, 156, 115, 0.2)"
                        >
                            <CreditCard size={32} color={COLORS.primary} />
                        </MotionBox>
                        <VStack spacing={2}>
                            <Text fontSize="lg" fontWeight="semibold" color="#444444">
                                Tidak ada transaksi
                            </Text>
                            <Text color="#666666" fontSize="sm">
                                Transaksi Anda akan muncul di sini
                            </Text>
                        </VStack>
                    </VStack>
                </MotionBox>
            </Container>
        );
    }

    return (
        <Container maxW="6xl" px={{ base: 3, sm: 4, md: 6 }}>
            <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                bg="rgba(255, 255, 255, 0.08)"
                backdropFilter="blur(16px)"
                border="1px solid rgba(255, 255, 255, 0.12)"
                borderRadius="20px"
                boxShadow="0 20px 60px rgba(116, 156, 115, 0.1)"
                overflow="hidden"
                position="relative"
            >
                {/* Animated Grid Pattern Background */}
                <AnimatedGridPattern
                    numSquares={30}
                    maxOpacity={0.04}
                    duration={4}
                    repeatDelay={2}
                    className="absolute inset-0 h-full w-full fill-[#749c73]/8 stroke-[#749c73]/4"
                />

                {/* Header */}
                <Box
                    p={containerPadding}
                    borderBottom="1px solid rgba(255, 255, 255, 0.12)"
                    position="relative"
                    zIndex={1}
                >
                    <HStack spacing={3}>
                        <Box
                            w={8}
                            h={8}
                            bg="rgba(116, 156, 115, 0.15)"
                            borderRadius="10px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            border="1px solid rgba(116, 156, 115, 0.2)"
                        >
                            <FileText size={16} color={COLORS.primary} />
                        </Box>
                        <VStack align="start" spacing={0}>
                            <Text fontSize="lg" fontWeight="bold" color="#444444">
                                Daftar Transaksi
                            </Text>
                            <Text fontSize="sm" color="#666666">
                                Total {totalItems} transaksi
                            </Text>
                        </VStack>
                    </HStack>
                </Box>

                {/* Table */}
                <Box overflowX="auto" position="relative" zIndex={1}>
                    <Table variant="simple" size={tableSize}>
                        <Thead>
                            <Tr>
                                <Th
                                    color="#444444"
                                    fontWeight="bold"
                                    fontSize="xs"
                                    bg="rgba(116, 156, 115, 0.08)"
                                    borderColor="rgba(255, 255, 255, 0.1)"
                                >
                                    No
                                </Th>
                                <Th
                                    color="#444444"
                                    fontWeight="bold"
                                    fontSize="xs"
                                    bg="rgba(116, 156, 115, 0.08)"
                                    borderColor="rgba(255, 255, 255, 0.1)"
                                >
                                    Tanggal
                                </Th>
                                <Th
                                    color="#444444"
                                    fontWeight="bold"
                                    fontSize="xs"
                                    bg="rgba(116, 156, 115, 0.08)"
                                    borderColor="rgba(255, 255, 255, 0.1)"
                                >
                                    Gedung
                                </Th>
                                {showDesktop && (
                                    <Th
                                        color="#444444"
                                        fontWeight="bold"
                                        fontSize="xs"
                                        bg="rgba(116, 156, 115, 0.08)"
                                        borderColor="rgba(255, 255, 255, 0.1)"
                                    >
                                        Metode
                                    </Th>
                                )}
                                <Th
                                    color="#444444"
                                    fontWeight="bold"
                                    fontSize="xs"
                                    bg="rgba(116, 156, 115, 0.08)"
                                    borderColor="rgba(255, 255, 255, 0.1)"
                                    textAlign="right"
                                >
                                    Total
                                </Th>
                                <Th
                                    color="#444444"
                                    fontWeight="bold"
                                    fontSize="xs"
                                    bg="rgba(116, 156, 115, 0.08)"
                                    borderColor="rgba(255, 255, 255, 0.1)"
                                >
                                    Status
                                </Th>
                                <Th
                                    color="#444444"
                                    fontWeight="bold"
                                    fontSize="xs"
                                    bg="rgba(116, 156, 115, 0.08)"
                                    borderColor="rgba(255, 255, 255, 0.1)"
                                    textAlign="center"
                                >
                                    Aksi
                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {transactions.map((transaction, index) => {
                                const statusColor = getStatusColor(transaction.paymentStatus);
                                return (
                                    <MotionTr
                                        key={transaction.transactionId}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        style={{
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.05)'
                                            }
                                        }}
                                    >
                                        <Td borderColor="rgba(255, 255, 255, 0.08)" py={4}>
                                            <Text fontSize="sm" color="#444444" fontWeight="medium">
                                                {(currentPage - 1) * 10 + index + 1}
                                            </Text>
                                        </Td>
                                        <Td borderColor="rgba(255, 255, 255, 0.08)" py={4}>
                                            <HStack spacing={2}>
                                                <Calendar size={14} color="#999999" />
                                                <Text fontSize="sm" color="#444444">
                                                    {transaction.paymentDate || '-'}
                                                </Text>
                                            </HStack>
                                        </Td>
                                        <Td borderColor="rgba(255, 255, 255, 0.08)" py={4}>
                                            <Text fontSize="sm" color="#444444" noOfLines={2} maxW="200px">
                                                {transaction.buildingName || 'N/A'}
                                            </Text>
                                        </Td>
                                        {showDesktop && (
                                            <Td borderColor="rgba(255, 255, 255, 0.08)" py={4}>
                                                <HStack spacing={2}>
                                                    <CreditCard size={14} color={COLORS.primary} />
                                                    <Text fontSize="sm" color="#444444">
                                                        {transaction.paymentMethod || '-'}
                                                    </Text>
                                                </HStack>
                                            </Td>
                                        )}
                                        <Td borderColor="rgba(255, 255, 255, 0.08)" py={4} textAlign="right">
                                            <HStack spacing={2} justify="flex-end">
                                                <DollarSign size={14} color={COLORS.primary} />
                                                <Text fontSize="sm" fontWeight="semibold" color="#444444">
                                                    {formatCurrency(transaction.totalAmount || 0)}
                                                </Text>
                                            </HStack>
                                        </Td>
                                        <Td borderColor="rgba(255, 255, 255, 0.08)" py={4}>
                                            <Badge
                                                bg={statusColor.bg}
                                                color={statusColor.color}
                                                borderRadius="full"
                                                px={3}
                                                py={1}
                                                fontSize="xs"
                                                fontWeight="semibold"
                                                border={`1px solid ${statusColor.border}`}
                                            >
                                                {getStatusText(transaction.paymentStatus)}
                                            </Badge>
                                        </Td>
                                        <Td borderColor="rgba(255, 255, 255, 0.08)" py={4} textAlign="center">
                                            <HStack spacing={2} justify="center">
                                                {/* Tombol Bayar untuk status PENDING */}
                                                {transaction.paymentStatus === 'PENDING' && onPayNow && (
                                                    <Tooltip label="Bayar sekarang">
                                                        <Button
                                                            size="sm"
                                                            bg="rgba(16, 185, 129, 0.15)"
                                                            color="#10b981"
                                                            border="1px solid rgba(16, 185, 129, 0.3)"
                                                            borderRadius="8px"
                                                            leftIcon={<DollarSign size={14} />}
                                                            onClick={() => onPayNow(transaction.transactionId)}
                                                            _hover={{
                                                                bg: "rgba(16, 185, 129, 0.2)",
                                                                borderColor: "rgba(16, 185, 129, 0.4)"
                                                            }}
                                                        >
                                                            Bayar
                                                        </Button>
                                                    </Tooltip>
                                                )}

                                                {/* Tombol Cetak Invoice untuk status PAID */}
                                                {transaction.paymentStatus === 'PAID' && onGenerateInvoice && (
                                                    <Tooltip label="Cetak invoice">
                                                        <Button
                                                            size="sm"
                                                            bg="rgba(59, 130, 246, 0.15)"
                                                            color="#3b82f6"
                                                            border="1px solid rgba(59, 130, 246, 0.3)"
                                                            borderRadius="8px"
                                                            leftIcon={<FileText size={14} />}
                                                            onClick={() => onGenerateInvoice(
                                                                transaction.bookingId || transaction.transactionId,
                                                                transaction.buildingName
                                                            )}
                                                            isLoading={generatingInvoice}
                                                            loadingText="Membuat..."
                                                            _hover={{
                                                                bg: "rgba(59, 130, 246, 0.2)",
                                                                borderColor: "rgba(59, 130, 246, 0.4)"
                                                            }}
                                                        >
                                                            Invoice
                                                        </Button>
                                                    </Tooltip>
                                                )}

                                                {/* Text untuk status lainnya */}
                                                {!['PENDING', 'PAID'].includes(transaction.paymentStatus) && (
                                                    <Text fontSize="sm" color="#666666">
                                                        -
                                                    </Text>
                                                )}
                                            </HStack>
                                        </Td>
                                    </MotionTr>
                                );
                            })}
                        </Tbody>
                    </Table>
                </Box>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Box
                        p={containerPadding}
                        borderTop="1px solid rgba(255, 255, 255, 0.12)"
                        position="relative"
                        zIndex={1}
                    >
                        <AdminPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                            totalItems={totalItems}
                            itemsPerPage={10}
                            itemLabel="transaksi"
                        />
                    </Box>
                )}
            </MotionBox>
        </Container>
    );
};

export default TransactionTable; 