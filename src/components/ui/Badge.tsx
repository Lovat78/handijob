// src/components/ui/Badge.tsx
import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({
    className = '',
    variant = 'default',
    size = 'md',
    dot = false,
    children,
    ...props
  }, ref) => {
    const baseClasses = 'inline-flex items-center font-medium rounded-full';
    
    const variants = {
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      success: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-300',
      warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-300',
      error: 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-300',
      info: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300'
    };

    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-2.5 py-1.5 text-sm',
      lg: 'px-3 py-2 text-base'
    };

    const classes = [
      baseClasses,
      variants[variant],
      sizes[size],
      className
    ].join(' ');

    return (
      <span ref={ref} className={classes} {...props}>
        {dot && <span className="w-1 h-1 bg-current rounded-full mr-1" />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
export { Badge };
