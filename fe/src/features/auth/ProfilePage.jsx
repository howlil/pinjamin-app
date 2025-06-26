import React from 'react';
import { Box, Container } from '@chakra-ui/react';
import { ProfileForm } from './components/ProfileForm';

const ProfilePage = () => {
    return (
        <Container maxW="container.md" py={8}>
            <ProfileForm />
        </Container>
    );
};

export default ProfilePage; 