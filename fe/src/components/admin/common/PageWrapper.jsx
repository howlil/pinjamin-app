import React from 'react';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const PageWrapper = ({ children }) => {
    const padding = useBreakpointValue({ base: 4, md: 6 });
    const borderRadius = useBreakpointValue({ base: "16px", md: "24px" });

    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            bg="rgba(255, 255, 255, 0.08)"
            backdropFilter="blur(16px)"
            border="1px solid rgba(255, 255, 255, 0.12)"
            borderRadius={borderRadius}
            overflow="hidden"
            p={padding}
            _hover={{
                borderColor: "rgba(255, 255, 255, 0.15)",
                boxShadow: "0 25px 80px rgba(116, 156, 115, 0.15)"
            }}
            transition="all 0.3s ease"
        >
            {children}
        </MotionBox>
    );
};

export default PageWrapper; 