import React, { useState } from 'react';
import {
    Box,
    Container,
    Grid,
    GridItem,
    VStack,
    HStack,
    Image,
    Select,
    useColorModeValue
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Users, Clock } from 'lucide-react';
import Card from '@shared/components/Card';
import { SearchInput } from '@shared/components/Input';
import { CardSkeleton } from '@shared/components/LoadingSkeleton';
import ErrorState from '@shared/components/ErrorState';
import { BuildingsEmptyState, SearchEmptyState } from '@shared/components/EmptyState';
import { H1, H2, Subtitle, Label, MutedText, PrimaryText } from '@shared/components/Typography';
import { PrimaryButton } from '@shared/components/Button';
import { COLORS } from '@utils/designTokens';

let motion;
try {
    motion = require('framer-motion').motion;
} catch (error) {
    motion = {
        div: ({ children, initial, animate, transition, ...props }) => (
            <div {...props}>{children}</div>
        )
    };
}

const BuildingCard = ({ building, index, onCardClick }) => {

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Card
                isClickable
                padding={0}
                overflow="hidden"
                h="100%"
                cursor="pointer"
                onClick={() => onCardClick(building)}
                _hover={{
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
                }}
            >
                <Box position="relative">
                    <Image
                        src={building.image || building.buildingPhoto || '/placeholder-building.jpg'}
                        alt={building.name || building.buildingName}
                        w="100%"
                        h="200px"
                        objectFit="cover"
                        fallbackSrc="https://via.placeholder.com/400x200/e2e8f0/a0aec0?text=Gedung"
                    />

                </Box>

                <VStack spacing={3} align="start" p={4}>
                    <VStack spacing={1} align="start" w="100%">
                        <H2 fontSize="lg" mb={0} noOfLines={1}>
                            {building.name || building.buildingName}
                        </H2>
                        <HStack spacing={1}>
                            <MapPin size={14} color="gray" />
                            <MutedText fontSize="sm" noOfLines={1}>
                                {building.location}
                            </MutedText>
                        </HStack>
                    </VStack>

                    <HStack spacing={4} w="100%">
                        <VStack spacing={0} align="start" flex={1}>
                            <HStack spacing={1}>
                                <Users size={14} color="gray" />
                                <MutedText fontSize="xs">Kapasitas</MutedText>
                            </HStack>
                            <Label fontSize="sm">{building.capacity} orang</Label>
                        </VStack>

                        <VStack spacing={0} align="start" flex={1}>
                            <HStack spacing={1}>
                                <Clock size={14} color="gray" />
                                <MutedText fontSize="xs">Harga Sewa</MutedText>
                            </HStack>
                            <PrimaryText fontSize="sm" fontWeight="600">
                                Rp. {(building.pricePerHour || building.rentalPrice || 0)?.toLocaleString('id-ID')}
                            </PrimaryText>
                        </VStack>
                    </HStack>

                    <PrimaryButton
                        size="sm"
                        w="100%"
                        mt={2}
                        onClick={(e) => {
                            e.stopPropagation();
                            onCardClick(building);
                        }}
                    >
                        Detail Gedung
                    </PrimaryButton>
                </VStack>
            </Card>
        </motion.div>
    );
};

const BuildingGrid = ({
    buildings = [],
    loading = false,
    error = null,
    onSearch,
    onFilterChange
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBy, setFilterBy] = useState('all');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    const handleFilterChange = (e) => {
        const value = e.target.value;
        setFilterBy(value);
        if (onFilterChange) {
            onFilterChange(value);
        }
    };

    const handleCardClick = (building) => {
        // Navigate to building detail page
        navigate(`/building/${building.id}`);
    };

    const filteredBuildings = buildings.filter((building) => {
        const buildingName = building.name || building.buildingName || '';
        const buildingLocation = building.location || '';

        const matchesSearch = buildingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            buildingLocation.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        // Menghapus filter berdasarkan isAvailable karena tidak ada di swagger.yml
        switch (filterBy) {
            case 'small':
                return building.capacity < 100;
            case 'medium':
                return building.capacity >= 100 && building.capacity <= 300;
            case 'large':
                return building.capacity > 300;
            case 'classroom':
                return building.buildingType === 'CLASSROOM';
            case 'laboratory':
                return building.buildingType === 'LABORATORY';
            case 'seminar':
                return building.buildingType === 'SEMINAR';
            default:
                return true;
        }
    });

    return (
        <Box py={16}>
            <Container maxW="7xl">
                <VStack spacing={8} align="stretch">
                    <VStack spacing={4} textAlign="center">
                        <H1>Daftar Gedung Tersedia</H1>
                        <Subtitle maxW="600px">
                            Temukan gedung dengan fasilitas terbaik untuk mendukung kesuksesan acara akademik maupun non-akademik Anda.
                        </Subtitle>
                    </VStack>

                    <HStack spacing={4} justify="center">
                        <SearchInput
                            placeholder="Cari gedung..."
                            leftIcon={<Search size={18} />}
                            value={searchTerm}
                            onChange={handleSearch}
                            maxW="400px"
                            w={{ base: '100%', md: '300px' }}
                        />

                        <Select
                            placeholder="Filter By"
                            value={filterBy}
                            onChange={handleFilterChange}
                            maxW="200px"
                            w={{ base: '100%', md: '250px' }}
                            bg="rgba(255, 255, 255, 0.6)"
                            backdropFilter="blur(10px)"
                            border="1px solid rgba(215, 215, 215, 0.5)"
                            borderRadius="full"
                            h="48px"
                            fontSize="sm"
                            _focus={{
                                borderColor: COLORS.primary,
                                bg: "rgba(255, 255, 255, 0.8)",
                            }}
                        >
                            <option value="all">Semua</option>
                            <option value="small">Kapasitas Kecil (&lt;100)</option>
                            <option value="medium">Kapasitas Sedang (100-300)</option>
                            <option value="large">Kapasitas Besar (&gt;300)</option>
                            <option value="classroom">Ruang Kelas</option>
                            <option value="laboratory">Laboratorium</option>
                            <option value="seminar">Ruang Seminar</option>
                        </Select>
                    </HStack>

                    {loading ? (
                        <Grid
                            templateColumns={{
                                base: "1fr",
                                md: "repeat(2, 1fr)",
                                lg: "repeat(3, 1fr)",
                                xl: "repeat(4, 1fr)"
                            }}
                            gap={6}
                        >
                            {Array.from({ length: 8 }).map((_, i) => (
                                <GridItem key={i}>
                                    <CardSkeleton count={1} height="300px" />
                                </GridItem>
                            ))}
                        </Grid>
                    ) : error ? (
                        <ErrorState
                            variant="default"
                            message={error}
                            onRetry={() => window.location.reload()}
                        />
                    ) : filteredBuildings && filteredBuildings.length > 0 ? (
                        <Grid
                            templateColumns={{
                                base: "1fr",
                                md: "repeat(2, 1fr)",
                                lg: "repeat(3, 1fr)",
                                xl: "repeat(4, 1fr)"
                            }}
                            gap={6}
                        >
                            {filteredBuildings.map((building, index) => (
                                <GridItem key={building.id}>
                                    <BuildingCard
                                        building={building}
                                        index={index}
                                        onCardClick={handleCardClick}
                                    />
                                </GridItem>
                            ))}
                        </Grid>
                    ) : searchTerm || filterBy !== 'all' ? (
                        <SearchEmptyState />
                    ) : (
                        <BuildingsEmptyState />
                    )}
                </VStack>
            </Container>
        </Box>
    );
};

export default BuildingGrid; 