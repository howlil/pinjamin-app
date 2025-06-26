import React from 'react';
import { Box, VStack, Text, Button, Icon } from '@chakra-ui/react';
import { AlertTriangle, RefreshCw, XCircle, Wifi } from 'lucide-react';
import { ErrorCard } from './Card';
import { COLORS, CORNER_RADIUS } from '@utils/designTokens';

const ErrorState = ({
    title = "Terjadi Kesalahan",
    message,
    variant = 'default',
    onRetry,
    retryText = "Coba Lagi",
    showRetryButton = true,
    icon: CustomIcon,
    ...props
}) => {
    const getVariantConfig = () => {
        switch (variant) {
            case 'network':
                return {
                    icon: Wifi,
                    title: "Koneksi Bermasalah",
                    defaultMessage: "Periksa koneksi internet Anda dan coba lagi."
                };
            case 'notFound':
                return {
                    icon: XCircle,
                    title: "Data Tidak Ditemukan",
                    defaultMessage: "Data yang Anda cari tidak tersedia."
                };
            case 'permission':
                return {
                    icon: AlertTriangle,
                    title: "Akses Ditolak",
                    defaultMessage: "Anda tidak memiliki izin untuk mengakses data ini."
                };
            default:
                return {
                    icon: AlertTriangle,
                    title: title,
                    defaultMessage: "Terjadi kesalahan yang tidak diketahui."
                };
        }
    };

    const config = getVariantConfig();
    const IconComponent = CustomIcon || config.icon;
    const displayTitle = title || config.title;
    const displayMessage = message || config.defaultMessage;

    return (
        <ErrorCard textAlign="center" py={6} {...props}>
            <VStack spacing={4}>
                <Icon
                    as={IconComponent}
                    boxSize={12}
                    color="red.500"
                />

                <VStack spacing={2}>
                    <Text
                        fontSize="md"
                        fontWeight="600"
                        color={COLORS.text}
                    >
                        {displayTitle}
                    </Text>

                    {displayMessage && (
                        <Text
                            fontSize="sm"
                            color="gray.600"
                            textAlign="center"
                            maxW="300px"
                        >
                            {displayMessage}
                        </Text>
                    )}
                </VStack>

                {showRetryButton && onRetry && (
                    <Button
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        leftIcon={<Icon as={RefreshCw} size={16} />}
                        onClick={onRetry}
                        borderRadius={`${CORNER_RADIUS.components.button}px`}
                        _hover={{
                            bg: "red.50",
                            borderColor: "red.400"
                        }}
                    >
                        {retryText}
                    </Button>
                )}
            </VStack>
        </ErrorCard>
    );
};

export const NetworkError = (props) => <ErrorState variant="network" {...props} />;
export const NotFoundError = (props) => <ErrorState variant="notFound" {...props} />;
export const PermissionError = (props) => <ErrorState variant="permission" {...props} />;

export default ErrorState; 