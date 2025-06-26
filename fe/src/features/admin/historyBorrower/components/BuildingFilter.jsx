import React, { useState, useEffect } from 'react';
import {
    Select,
    HStack,
    Text,
    Badge,
    Box,
    Spinner
} from '@chakra-ui/react';
import { useBuildings } from '../../../home/api/useBuildings';

const BuildingFilter = ({ selectedBuildingId, onBuildingChange }) => {
    const { buildings, loading: buildingsLoading } = useBuildings();

    const selectedBuilding = buildings?.find(building => building.id === selectedBuildingId);

    return (
        <Box>
            <Text mb={2} fontWeight="medium" fontSize="sm" color="#2A2A2A" opacity={0.8}>
                Filter Gedung:
            </Text>
            <Select
                value={selectedBuildingId}
                onChange={(e) => onBuildingChange(e.target.value)}
                placeholder={buildingsLoading ? "Memuat gedung..." : "Pilih gedung..."}
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
                maxW="250px"
                isDisabled={buildingsLoading}
                zIndex={100}
            >
                <option value="">Semua Gedung</option>
                {buildings?.map((building) => (
                    <option key={building.id} value={building.id}>
                        {building.buildingName}
                    </option>
                ))}
            </Select>

            {buildingsLoading && (
                <HStack mt={2} spacing={2}>
                    <Spinner size="xs" color="#21D179" />
                    <Text fontSize="sm" color="#2A2A2A" opacity={0.7}>Memuat daftar gedung...</Text>
                </HStack>
            )}

            {selectedBuilding && (
                <HStack mt={2} spacing={2}>
                    <Text fontSize="sm" color="#2A2A2A" opacity={0.7}>Filter aktif:</Text>
                    <Badge
                        bg="rgba(147, 51, 234, 0.1)"
                        color="#9333EA"
                        borderRadius="9999px"
                        px={3}
                        py={1}
                        fontSize="xs"
                        border="1px solid rgba(147, 51, 234, 0.3)"
                    >
                        {selectedBuilding.buildingName}
                    </Badge>
                </HStack>
            )}
        </Box>
    );
};

export default BuildingFilter; 