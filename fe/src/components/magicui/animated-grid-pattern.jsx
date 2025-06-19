import { useEffect, useId, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function AnimatedGridPattern({
    className,
    width = 40,
    height = 40,
    x = -1,
    y = -1,
    strokeDasharray = 0,
    numSquares = 200,
    maxOpacity = 0.5,
    duration = 1,
    repeatDelay = 0.5,
    ...props
}) {
    const id = useId();
    const [squares, setSquares] = useState(() => generateSquares(numSquares));

    function generateSquares(count) {
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            pos: Math.random() * 10 + 1,
        }));
    }

    const updateSquares = () => {
        setSquares(generateSquares(numSquares));
    };

    useEffect(() => {
        const interval = setInterval(
            updateSquares,
            (duration + repeatDelay) * 1000
        );
        return () => clearInterval(interval);
    }, [duration, repeatDelay, numSquares]);

    return (
        <svg
            aria-hidden="true"
            className={cn(
                'pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30',
                className
            )}
            {...props}
        >
            <defs>
                <pattern
                    id={id}
                    width={width}
                    height={height}
                    patternUnits="userSpaceOnUse"
                    x={x}
                    y={y}
                >
                    <path
                        d={`M.5 ${height}V.5H${width}`}
                        fill="none"
                        strokeDasharray={strokeDasharray}
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${id})`} />
            <svg x={x} y={y} className="overflow-visible">
                {squares.map(({ pos, id: squareId }, index) => (
                    <motion.rect
                        key={`${index}-${squareId}`}
                        width={width - 1}
                        height={height - 1}
                        x={pos * width + 1}
                        y={pos * height + 1}
                        fill="currentColor"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: maxOpacity }}
                        transition={{
                            duration,
                            repeat: 0,
                            ease: 'easeInOut',
                            delay: index * 0.1,
                        }}
                    />
                ))}
            </svg>
        </svg>
    );
} 