import React from 'react';
import { cn } from '../utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient';
  interactive?: boolean;
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', interactive = false, children, ...props }, ref) => {
    const baseClasses = 'rounded-xl p-6 transition-all duration-300';
    
    const variants = {
      default: 'card',
      glass: 'glass',
      gradient: 'bg-gradient-card border border-neutral-700'
    };

    const interactiveClasses = interactive ? 'card-interactive cursor-pointer' : '';

    return (
      <div
        className={cn(
          baseClasses,
          variants[variant],
          interactiveClasses,
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };