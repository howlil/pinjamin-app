import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box } from '@chakra-ui/react';

export function AnimatedListItem({
    children,
    position
}) {
    const animations = {
        initial: { y: -50, opacity: 0 },
        animate: {
            y: position * 90,
            opacity: 1
        },
        exit: { y: 400, opacity: 0 },
        transition: { type: "spring", stiffness: 350, damping: 40 },
    };

    return (
        <motion.div
            {...animations}
            style={{
                margin: "0 auto",
                width: "100%",
                position: "absolute",
                top: 0
            }}
        >
            {children}
        </motion.div>
    );
}

export const AnimatedList = React.memo(({
    children,
    className,
    delay = 3000,
    ...props
}) => {
    const [activeIndices, setActiveIndices] = useState([0]);
    const childrenArray = useMemo(() => React.Children.toArray(children), [children]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setActiveIndices(prev => {
                const nextIndex = (prev[0] + 1) % childrenArray.length;
                return [nextIndex, ...prev].slice(0, childrenArray.length);
            });
        }, delay);

        return () => clearTimeout(timeout);
    }, [activeIndices, delay, childrenArray.length]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            position="relative"
            height="24rem"
            className={className}
            {...props}
        >
            <AnimatePresence mode="popLayout">
                {activeIndices.map((itemIndex, position) => (
                    <AnimatedListItem
                        key={childrenArray[itemIndex].key}
                        position={position}
                    >
                        {childrenArray[itemIndex]}
                    </AnimatedListItem>
                ))}
            </AnimatePresence>
        </Box>
    );
});

AnimatedList.displayName = "AnimatedList";

export default AnimatedList; 