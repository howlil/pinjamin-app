import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function AnimatedList({
    className,
    children,
    delay = 1000,
}) {
    const [index, setIndex] = useState(0);
    const items = React.Children.toArray(children);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % items.length);
        }, delay);

        return () => clearInterval(interval);
    }, [items.length, delay]);

    const itemsToShow = 3;
    const visibleItems = [];

    for (let i = 0; i < itemsToShow; i++) {
        const itemIndex = (index - i + items.length) % items.length;
        visibleItems.unshift(items[itemIndex]);
    }

    return (
        <div className={cn('relative flex flex-col gap-2 overflow-hidden', className)}>
            <AnimatePresence>
                {visibleItems.map((item, idx) => (
                    <motion.div
                        key={`${index}-${idx}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: idx === 0 ? 0 : 1,
                            y: 0,
                            transition: {
                                duration: 0.3,
                                delay: idx * 0.05,
                            }
                        }}
                        exit={{
                            opacity: 0,
                            y: -20,
                            transition: { duration: 0.3 }
                        }}
                    >
                        {item}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
} 