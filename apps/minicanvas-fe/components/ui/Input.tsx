import React from 'react';
import { cn } from '../utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-neutral-200">
            {label}
          </label>
        )}
        <div className="relative">
           {icon && (
             <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
               {icon}
             </div>
           )}
           <input
              className={cn(
                'w-full rounded-md border border-neutral-600 bg-neutral-900 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2', // default padding
                icon ? 'pl-10' : '', // leave space for icon
                error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '',
                className
              )}
              ref={ref}
              {...props}
            />
         </div>
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };