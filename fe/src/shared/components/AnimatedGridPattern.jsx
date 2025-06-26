"use client";;
import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';

// Fallback import untuk framer-motion
let motion;
try {
    motion = require('framer-motion').motion;
} catch (error) {
    // Fallback jika framer-motion tidak tersedia
    motion = {
        rect: ({ children, initial, animate, transition, onAnimationComplete, ...props }) => (
            <rect {...props}>{children}</rect>
        )
    };
}

import { cn } from "@/lib/utils";

const AnimatedGridPattern = ({
    className = '',
    width = 40,
    height = 40,
    x = -1,
    y = -1,
    strokeDasharray = 0,
    numSquares = 50,
    maxOpacity = 0.1,
    duration = 100,
    repeatDelay = 0,
    changeInterval = 1000, // Interval untuk mengubah posisi (1 detik)
    ...props
}) => {
    const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
    const [squares, setSquares] = useState([]);
    const id = React.useId();

    // Generate random positions for animated squares
    const generateSquares = (cols, rows) => {
        return Array.from({ length: Math.min(numSquares, cols * rows) }, (_, i) => {
            const col = Math.floor(Math.random() * cols);
            const row = Math.floor(Math.random() * rows);
            return { id: i, col, row };
        });
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });

            const handleResize = () => {
                setDimensions({
                    width: window.innerWidth,
                    height: window.innerHeight
                });
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    // Update squares saat dimensions berubah
    useEffect(() => {
        if (dimensions.width && dimensions.height) {
            const cols = Math.floor(dimensions.width / width);
            const rows = Math.floor(dimensions.height / height);
            setSquares(generateSquares(cols, rows));
        }
    }, [dimensions, width, height, numSquares]);

    // Interval untuk mengubah posisi squares setiap detik
    useEffect(() => {
        if (dimensions.width && dimensions.height) {
            const cols = Math.floor(dimensions.width / width);
            const rows = Math.floor(dimensions.height / height);

            const interval = setInterval(() => {
                setSquares(generateSquares(cols, rows));
            }, changeInterval);

            return () => clearInterval(interval);
        }
    }, [dimensions, width, height, numSquares, changeInterval]);

    const cols = Math.floor(dimensions.width / width);
    const rows = Math.floor(dimensions.height / height);

    return (
        <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            overflow="hidden"
            pointerEvents="none"
            zIndex={0}
            className={cn(
                "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
                className
            )}
            {...props}>
            <svg
                width="100%"
                height="100%"
                style={{
                    background: 'transparent',
                }}>
                <defs>
                    <pattern
                        id={id}
                        width={width}
                        height={height}
                        patternUnits="userSpaceOnUse"
                        x={x}
                        y={y}>
                        <path
                            d={`M.5 ${height}V.5H${width}`}
                            fill="none"
                            stroke={`#E2E2E261`}
                            strokeWidth="0.5"
                            strokeDasharray={strokeDasharray} />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${id})`} />

                {/* Animated squares */}
                {squares.map((square, index) => (
                    <motion.rect
                        key={`${id}-${square.id}-${square.col}-${square.row}`} // Key unik untuk re-render
                        width={width - 2}
                        height={height - 2}
                        x={square.col * width + 1}
                        y={square.row * height + 1}
                        fill={`#C8FFDB2D`}
                        strokeWidth="0"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0, maxOpacity, 0],
                            scale: [0, 1, 0],
                        }}
                        transition={{
                            duration: duration / 1000, // Convert to seconds
                            repeat: Infinity,
                            delay: index * 0.05, // Stagger animation
                            repeatDelay,
                            ease: "easeInOut",
                        }} />
                ))}
            </svg>
        </Box>
    );
};

export default AnimatedGridPattern;
