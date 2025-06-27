import React from 'react';
import {
    Modal as ChakraModal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    useDisclosure,
    Text,
    Box
} from '@chakra-ui/react';
import Button from './Button';


const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    showCloseButton = true,
    closeOnOverlayClick = true,
    closeOnEsc = true,
    centered = true,
    ...props
}) => {
    return (
        <ChakraModal
            isOpen={isOpen}
            onClose={onClose}
            size={size}
            closeOnOverlayClick={closeOnOverlayClick}
            closeOnEsc={closeOnEsc}
            isCentered={centered}
            {...props}
        >
            <ModalOverlay />
            <ModalContent>
                {title && (
                    <ModalHeader>
                        <Text fontSize="lg" fontWeight="semibold">
                            {title}
                        </Text>
                    </ModalHeader>
                )}

                {showCloseButton && <ModalCloseButton />}

                <ModalBody py={6}>
                    {children}
                </ModalBody>

                {footer && (
                    <ModalFooter>
                        {footer}
                    </ModalFooter>
                )}
            </ModalContent>
        </ChakraModal>
    );
};

// Hook untuk modal management
export const useModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return {
        isOpen,
        onOpen,
        onClose,
        toggle: isOpen ? onClose : onOpen,
    };
};

// Preset modal components
export const ConfirmModal = ({
    isOpen,
    onClose,
    title = "Konfirmasi",
    message,
    onConfirm,
    confirmText = "Ya",
    cancelText = "Batal",
    isLoading = false,
    ...props
}) => {
    const isDelete = props.isDelete || false;
    return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm" {...props}>
        <Text mb={6}>{message}</Text>
        <Box display="flex" gap={3} justifyContent="space-between">
            <Button
                variant={`${isDelete ? 'primary' : 'outline'}`}
                w="100%"
                onClick={onClose}
                disabled={isLoading}
            >
                {cancelText}
            </Button>
            <Button
                variant={`${isDelete ? 'outline' : 'primary'}`}
                w="100%"
                onClick={onConfirm}
                isLoading={isLoading}
            >
                {confirmText}
            </Button>
        </Box>
    </Modal>
    );
};


export const AlertModal = ({
    isOpen,
    onClose,
    title = "Peringatan",
    message,
    buttonText = "OK",
    ...props
}) => (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm" {...props}>
        <Text mb={6}>{message}</Text>
        <Box display="flex" justifyContent="flex-end">
            <Button variant="primary" onClick={onClose}>
                {buttonText}
            </Button>
        </Box>
    </Modal>
);

export default Modal; 