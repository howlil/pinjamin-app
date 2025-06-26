import React from 'react';
import {
    Select,
    HStack,
    Text,
    Badge,
    Box
} from '@chakra-ui/react';

const StatusFilter = ({ selectedStatus, onStatusChange }) => {
    const statusOptions = [
        { value: '', label: 'Semua Status' },
        { value: 'APPROVED', label: 'Disetujui', color: 'green' },
        { value: 'REJECTED', label: 'Ditolak', color: 'red' },
        { value: 'COMPLETED', label: 'Selesai', color: 'blue' }
    ];

    return (
        <Box>
            <Text mb={2} fontWeight="medium" fontSize="sm" color="#2A2A2A" opacity={0.8}>
                Filter Status:
            </Text>
            <Select
                value={selectedStatus}
                onChange={(e) => onStatusChange(e.target.value)}
                placeholder="Pilih status..."
                bg="rgba(255, 255, 255, 0.8)"
                borderRadius="9999px"
                border="1px solid rgba(215, 215, 215, 0.5)"
                color="#2A2A2A"
                _hover={{
                    bg: "rgba(255, 255, 255, 0.9)",
                    transform: "translateY(-1px)"
                }}
                _focus={{
                    borderColor: '#21D179',
                    boxShadow: '0 0 0 1px #21D179',
                    bg: "rgba(255, 255, 255, 0.9)"
                }}
                size="md"
                maxW="200px"
                zIndex={100}
            >
                {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </Select>

            {selectedStatus && (
                <HStack mt={2} spacing={2}>
                    <Text fontSize="sm" color="#2A2A2A" opacity={0.7}>Filter aktif:</Text>
                    <Badge
                        bg={`rgba(${statusOptions.find(opt => opt.value === selectedStatus)?.color === 'green' ? '34, 197, 94' :
                            statusOptions.find(opt => opt.value === selectedStatus)?.color === 'red' ? '239, 68, 68' :
                                '59, 130, 246'}, 0.1)`}
                        color={statusOptions.find(opt => opt.value === selectedStatus)?.color === 'green' ? '#22C55E' :
                            statusOptions.find(opt => opt.value === selectedStatus)?.color === 'red' ? '#EF4444' :
                                '#3B82F6'}
                        borderRadius="9999px"
                        px={3}
                        py={1}
                        fontSize="xs"
                        border={`1px solid rgba(${statusOptions.find(opt => opt.value === selectedStatus)?.color === 'green' ? '34, 197, 94' :
                            statusOptions.find(opt => opt.value === selectedStatus)?.color === 'red' ? '239, 68, 68' :
                                '59, 130, 246'}, 0.3)`}
                    >
                        {statusOptions.find(opt => opt.value === selectedStatus)?.label}
                    </Badge>
                </HStack>
            )}
        </Box>
    );
};

export default StatusFilter; 