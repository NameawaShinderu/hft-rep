import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export interface InputProps {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'search' | 'trading';
  loading?: boolean;
  className?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  size = 'md',
  variant = 'default',
  loading = false,
  className,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  type = 'text',
  disabled = false,
  required = false,
  name,
  id: providedId,
}, ref) => {
  const inputId = providedId || React.useId();
  const helperId = helper ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  const inputClasses = clsx(
    // Base styles
    'w-full bg-gray-800 border text-white placeholder-gray-400',
    'transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-dark',
    
    // Size variants
    {
      'px-3 py-1.5 text-sm rounded-md': size === 'sm',
      'px-4 py-2 text-body rounded-lg': size === 'md',
      'px-5 py-3 text-body-lg rounded-lg': size === 'lg',
    },
    
    // Icon padding adjustments
    {
      'pl-10': leftIcon && size === 'sm',
      'pl-11': leftIcon && size === 'md',
      'pl-12': leftIcon && size === 'lg',
      'pr-10': rightIcon && size === 'sm',
      'pr-11': rightIcon && size === 'md',
      'pr-12': rightIcon && size === 'lg',
    },    
    // State variants
    {
      'border-gray-600 focus:border-primary focus:ring-primary': !error && variant === 'default',
      'border-gray-600 focus:border-primary focus:ring-primary bg-gray-700': variant === 'search',
      'border-gray-600 focus:border-success focus:ring-success font-mono': variant === 'trading',
      'border-danger focus:border-danger focus:ring-danger': error,
    },
    
    className
  );

  return (
    <div className="space-y-1">
      {/* Label */}
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className={clsx(
            'absolute inset-y-0 left-0 flex items-center text-gray-400',
            {
              'pl-3': size === 'sm',
              'pl-4': size === 'md',
              'pl-5': size === 'lg',
            }
          )}>
            {leftIcon}
          </div>
        )}

        {/* Input Field */}
        <motion.input
          ref={ref}
          id={inputId}
          className={inputClasses}
          aria-describedby={clsx(helperId, errorId)}
          aria-invalid={!!error}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.15 }}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          type={type}
          disabled={disabled}
          required={required}
          name={name}
        />

        {/* Right Icon / Loading */}
        {(rightIcon || loading) && (
          <div className={clsx(
            'absolute inset-y-0 right-0 flex items-center text-gray-400',
            {
              'pr-3': size === 'sm',
              'pr-4': size === 'md', 
              'pr-5': size === 'lg',
            }
          )}>
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"
              />
            ) : rightIcon}
          </div>
        )}
      </div>

      {/* Helper Text */}
      {helper && !error && (
        <p id={helperId} className="text-xs text-gray-400">
          {helper}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          id={errorId}
          className="text-xs text-danger flex items-center gap-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;