import React from 'react';
import { Box, Button, Text, VStack, HStack, Badge, Alert, AlertIcon } from '@chakra-ui/react';
import {
    RoleGuard,
    AdminOnly,
    UserOnly,
    AuthenticatedOnly,
    GuestOnly,
    PermissionGuard,
    RoleSwitch
} from './RoleGuard';
import { useAuth, useRole } from '../../hooks/useAuth';

// Example component demonstrating role-based authorization usage
const AuthExamples = () => {
    const { user, isAuthenticated, logout, redirectToDashboard } = useAuth();
    const { isAdmin, isUser, currentRole } = useRole();

    return (
        <Box p={6} maxW="800px" mx="auto">
            <VStack spacing={6} align="stretch">
                {/* Current User Info */}
                <Box p={4} borderWidth={1} borderRadius="md">
                    <Text fontSize="lg" fontWeight="bold" mb={2}>
                        Current User Status
                    </Text>
                    <HStack spacing={4}>
                        <Badge colorScheme={isAuthenticated ? 'green' : 'red'}>
                            {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                        </Badge>
                        {currentRole && (
                            <Badge colorScheme="blue">
                                Role: {currentRole}
                            </Badge>
                        )}
                    </HStack>
                    {user && (
                        <Text mt={2}>
                            Welcome, {user.fullName || user.name}!
                        </Text>
                    )}
                </Box>

                {/* Basic Role Guard Examples */}
                <Box p={4} borderWidth={1} borderRadius="md">
                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                        Basic Role Guard Examples
                    </Text>

                    <VStack spacing={3} align="stretch">
                        {/* Admin Only Content */}
                        <AdminOnly
                            fallback={
                                <Alert status="warning">
                                    <AlertIcon />
                                    This content is only visible to admins
                                </Alert>
                            }
                        >
                            <Alert status="success">
                                <AlertIcon />
                                🎉 You are an admin! You can see this content.
                            </Alert>
                        </AdminOnly>

                        {/* User Only Content */}
                        <UserOnly
                            fallback={
                                <Alert status="info">
                                    <AlertIcon />
                                    This content is only visible to regular users
                                </Alert>
                            }
                        >
                            <Alert status="success">
                                <AlertIcon />
                                👋 You are a regular user! Welcome!
                            </Alert>
                        </UserOnly>

                        {/* Authenticated Only Content */}
                        <AuthenticatedOnly
                            fallback={
                                <Alert status="warning">
                                    <AlertIcon />
                                    Please login to see this content
                                </Alert>
                            }
                        >
                            <Alert status="info">
                                <AlertIcon />
                                🔐 This content is visible to all authenticated users
                            </Alert>
                        </AuthenticatedOnly>

                        {/* Guest Only Content */}
                        <GuestOnly>
                            <Alert status="info">
                                <AlertIcon />
                                👤 This content is only visible to guests (not logged in)
                            </Alert>
                        </GuestOnly>
                    </VStack>
                </Box>

                {/* Advanced Role Guard Examples */}
                <Box p={4} borderWidth={1} borderRadius="md">
                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                        Advanced Role Guard Examples
                    </Text>

                    <VStack spacing={3} align="stretch">
                        {/* Multiple Roles */}
                        <RoleGuard
                            requiredRoles={['ADMIN', 'MODERATOR']}
                            fallback={<Text color="gray.500">Need admin or moderator role</Text>}
                        >
                            <Alert status="success">
                                <AlertIcon />
                                You have admin or moderator privileges!
                            </Alert>
                        </RoleGuard>

                        {/* Require All Roles */}
                        <RoleGuard
                            requiredRoles={['ADMIN', 'SUPERUSER']}
                            requireAll={true}
                            fallback={<Text color="gray.500">Need both admin AND superuser roles</Text>}
                        >
                            <Alert status="success">
                                <AlertIcon />
                                You have both admin AND superuser roles!
                            </Alert>
                        </RoleGuard>
                    </VStack>
                </Box>

                {/* Permission-Based Examples */}
                <Box p={4} borderWidth={1} borderRadius="md">
                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                        Permission-Based Examples
                    </Text>

                    <VStack spacing={3} align="stretch">
                        <PermissionGuard
                            resource="bookings"
                            action="create"
                            fallback={<Text color="gray.500">No permission to create bookings</Text>}
                        >
                            <Button colorScheme="green" size="sm">
                                Create New Booking
                            </Button>
                        </PermissionGuard>

                        <PermissionGuard
                            resource="users"
                            action="delete"
                            fallback={<Text color="gray.500">No permission to delete users</Text>}
                        >
                            <Button colorScheme="red" size="sm">
                                Delete User (Admin Only)
                            </Button>
                        </PermissionGuard>
                    </VStack>
                </Box>

                {/* Role Switch Example */}
                <Box p={4} borderWidth={1} borderRadius="md">
                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                        Role Switch Example
                    </Text>

                    <RoleSwitch
                        admin={
                            <Alert status="info">
                                <AlertIcon />
                                🔧 Admin Dashboard: Manage users, settings, and system configuration
                            </Alert>
                        }
                        user={
                            <Alert status="info">
                                <AlertIcon />
                                📱 User Dashboard: View your bookings, profile, and history
                            </Alert>
                        }
                        guest={
                            <Alert status="warning">
                                <AlertIcon />
                                🚪 Please login to access your dashboard
                            </Alert>
                        }
                        fallback={
                            <Alert status="error">
                                <AlertIcon />
                                ❌ Unknown user role
                            </Alert>
                        }
                    />
                </Box>

                {/* Action Buttons */}
                <Box p={4} borderWidth={1} borderRadius="md">
                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                        Actions
                    </Text>

                    <HStack spacing={4}>
                        <AuthenticatedOnly>
                            <Button onClick={logout} colorScheme="red">
                                Logout
                            </Button>
                            <Button onClick={redirectToDashboard} colorScheme="blue">
                                Go to Dashboard
                            </Button>
                        </AuthenticatedOnly>

                        <GuestOnly>
                            <Button as="a" href="/login" colorScheme="blue">
                                Login
                            </Button>
                            <Button as="a" href="/register" colorScheme="green">
                                Register
                            </Button>
                        </GuestOnly>
                    </HStack>
                </Box>

                {/* Code Examples */}
                <Box p={4} borderWidth={1} borderRadius="md" bg="gray.50">
                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                        Usage Examples
                    </Text>

                    <VStack spacing={3} align="stretch">
                        <Box>
                            <Text fontWeight="semibold" mb={2}>Basic Usage:</Text>
                            <Text fontSize="sm" fontFamily="mono" bg="white" p={2} borderRadius="md">
                                {`<AdminOnly>Content for admins only</AdminOnly>`}
                            </Text>
                        </Box>

                        <Box>
                            <Text fontWeight="semibold" mb={2}>With Fallback:</Text>
                            <Text fontSize="sm" fontFamily="mono" bg="white" p={2} borderRadius="md">
                                {`<UserOnly fallback={<Text>Not authorized</Text>}>
  User content here
</UserOnly>`}
                            </Text>
                        </Box>

                        <Box>
                            <Text fontWeight="semibold" mb={2}>Multiple Roles:</Text>
                            <Text fontSize="sm" fontFamily="mono" bg="white" p={2} borderRadius="md">
                                {`<RoleGuard requiredRoles={['ADMIN', 'MODERATOR']}>
  Content for admins or moderators
</RoleGuard>`}
                            </Text>
                        </Box>

                        <Box>
                            <Text fontWeight="semibold" mb={2}>Permission-Based:</Text>
                            <Text fontSize="sm" fontFamily="mono" bg="white" p={2} borderRadius="md">
                                {`<PermissionGuard resource="users" action="delete">
  <Button>Delete User</Button>
</PermissionGuard>`}
                            </Text>
                        </Box>
                    </VStack>
                </Box>
            </VStack>
        </Box>
    );
};

export default AuthExamples; 