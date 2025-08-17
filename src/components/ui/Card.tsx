// src/components/ui/Card.tsx
import React from 'react';
import { motion } from 'framer-motion';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({
    className = '',
    variant = 'default',
    padding = 'md',
    hoverable = false,
    children,
    ...props
  }, ref) => {
    const baseClasses = 'bg-white dark:bg-gray-800 rounded-lg transition-all duration-200';
    
    const variants = {
      default: 'border border-gray-200 dark:border-gray-700',
      elevated: 'shadow-md hover:shadow-lg',
      outlined: 'border-2 border-gray-200 dark:border-gray-700'
    };

    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-4 sm:p-6',
      lg: 'p-6 sm:p-8'
    };

    const hoverClasses = hoverable ? 'hover:shadow-lg cursor-pointer' : '';

    const classes = [
      baseClasses,
      variants[variant],
      paddings[padding],
      hoverClasses,
      className
    ].join(' ');

    const Component = hoverable ? motion.div : 'div';
    const motionProps = hoverable ? { whileHover: { y: -2 } } : {};

    return (
      <Component
        ref={ref}
        className={classes}
        {...motionProps}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';
export { Card };