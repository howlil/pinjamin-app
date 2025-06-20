import React from 'react';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const PageWrapper = ({ children }) => {
    return (
        <Box
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            bg="white"
            borderRadius="2xl"
            overflow="hidden"
            boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            border="1px solid rgba(0, 0, 0, 0.05)"
            p={6}
        >
            {children}
        </Box>
    );
};

export default PageWrapper; 