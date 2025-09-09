import React from 'react';
import { cn } from '../utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, disabled, children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus-ring-primary disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-gradient-primary text-white hover:shadow-glow btn-hover-lift',
      secondary: 'bg-gradient-secondary text-white hover:shadow-glow btn-hover-lift',
      outline: 'border border-neutral-600 text-neutral-200 hover:bg-neutral-800 hover:border-neutral-500',
      ghost: 'text-neutral-300 hover:bg-neutral-800 hover:text-white',
      danger: 'bg-red-600 text-white hover:bg-red-700 btn-hover-lift'
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg'
    };

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <div className="spinner mr-2" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };