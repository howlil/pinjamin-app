import React from 'react';
import { Box, Container, VStack, HStack, Text, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@chakra-ui/react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { H1 } from '@shared/components/Typography';
import { GlassButton } from '@shared/components/Button';
import BuildingDetail from './components/BuildingDetail';
import { COLORS } from '@utils/designTokens';

const BuildingDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <Container maxW="7xl" py={8}>
            <VStack spacing={6} align="stretch">
                {/* Header with Back Button and Breadcrumb */}
                <VStack spacing={4} align="start">
                    <HStack spacing={4}>
                        <GlassButton
                            size="sm"
                            leftIcon={<ChevronLeft size={16} />}
                            onClick={() => navigate(-1)}
                        >
                            Kembali
                        </GlassButton>
                    </HStack>

                    <Breadcrumb
                        spacing='8px'
                        separator={<BreadcrumbSeparator color="gray.500" />}
                        fontSize="sm"
                        color="gray.600"
                    >
                        <BreadcrumbItem>
                            <BreadcrumbLink as={RouterLink} to="/">
                                Beranda
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink color={COLORS.text} fontWeight="600">
                                Detail Gedung
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>

                    <H1 fontSize="2xl" color={COLORS.text} mb={0}>
                        Detail Gedung
                    </H1>
                </VStack>

                {/* Building Detail Content */}
                <Box>
                    {id ? (
                        <BuildingDetail buildingId={id} />
                    ) : (
                        <Box p={8} textAlign="center">
                            <Text color="red.500">ID gedung tidak valid</Text>
                        </Box>
                    )}
                </Box>
            </VStack>
        </Container>
    );
};

export default BuildingDetailPage; 