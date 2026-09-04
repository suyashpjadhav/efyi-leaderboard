import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  prefix = '₹',
  className = '',
}) => {
  const spring = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.01,
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  const displayValue = useTransform(spring, (latest) => {
    return Math.floor(latest).toLocaleString('en-IN');
  });

  return (
    <span className={`inline-flex items-center tabular-nums ${className}`}>
      {prefix}
      <motion.span>{displayValue}</motion.span>
    </span>
  );
};
