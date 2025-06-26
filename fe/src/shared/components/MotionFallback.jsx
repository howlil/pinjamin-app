import React from 'react';

// Fallback untuk motion.div jika framer-motion tidak tersedia
export const MotionDiv = ({ children, initial, animate, transition, ...props }) => {
    // Jika framer-motion tersedia, gunakan motion.div
    try {
        const { motion } = require('framer-motion');
        return (
            <motion.div
                initial={initial}
                animate={animate}
                transition={transition}
                {...props}
            >
                {children}
            </motion.div>
        );
    } catch (error) {
        // Fallback ke div biasa jika framer-motion tidak tersedia
        return <div {...props}>{children}</div>;
    }
};

// Helper untuk mengecek apakah framer-motion tersedia
export const isFramerMotionAvailable = () => {
    try {
        require('framer-motion');
        return true;
    } catch (error) {
        return false;
    }
};

export default MotionDiv; 