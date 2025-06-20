import React from 'react';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const ContentWrapper = ({ children }) => {
    return (
        <Box
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            bg="white"
            borderRadius="xl"
            overflow="hidden"
            boxShadow="0 1px 3px rgba(0, 0, 0, 0.1)"
            border="1px solid rgba(0, 0, 0, 0.05)"
        >
            {children}
        </Box>
    );
};

export default ContentWrapper; 