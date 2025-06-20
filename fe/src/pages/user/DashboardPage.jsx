import React from 'react';
import { Box, Container, VStack } from '@chakra-ui/react';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import UserStatsGrid from '@/components/dashboard/UserStatsGrid';
import BorrowedBooksCard from '@/components/dashboard/BorrowedBooksCard';
import { useUserDashboard } from '@/hooks/useUserDashboard';

const DashboardPage = () => {
    const { user, stats, recentBooks } = useUserDashboard();

    return (
        <Box py={8}>
            <Container maxW="7xl">
                <VStack spacing={8} align="stretch">
                    <WelcomeHeader userName={user?.name} />
                    <UserStatsGrid stats={stats} />
                    <BorrowedBooksCard books={recentBooks} />
                </VStack>
            </Container>
        </Box>
    );
};

export default DashboardPage; 