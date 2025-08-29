import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  form?: string;
  'aria-label'?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className,
  disabled,
  onClick,
  type = 'button',
  form,
  'aria-label': ariaLabel,
}) => {
  const baseClasses = clsx(
    // Base styles
    'inline-flex items-center justify-center font-medium rounded-lg',
    'transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-dark',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    
    // Size variants
    {
      'px-3 py-1.5 text-sm gap-1': size === 'sm',
      'px-4 py-2 text-body gap-2': size === 'md', 
      'px-6 py-3 text-body-lg gap-3': size === 'lg',
    },
    
    // Variant styles
    {
      // Primary - Blue gradient with glassmorphism
      'bg-primary hover:bg-blue-600 text-white shadow-lg hover:shadow-xl focus:ring-primary': variant === 'primary',
      
      // Secondary - Neutral with subtle effects  
      'bg-neutral hover:bg-gray-600 text-white border border-gray-600 hover:border-gray-500 focus:ring-gray-500': variant === 'secondary',
      
      // Outline - Transparent with border
      'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary': variant === 'outline',
      
      // Ghost - Minimal styling
      'bg-transparent hover:bg-gray-700 text-gray-300 hover:text-white focus:ring-gray-400': variant === 'ghost',
      
      // Success - Green for profitable actions
      'bg-success hover:bg-green-500 text-white shadow-lg hover:shadow-green-500/20 focus:ring-success': variant === 'success',
      
      // Danger - Red for risky actions
      'bg-danger hover:bg-red-500 text-white shadow-lg hover:shadow-red-500/20 focus:ring-danger': variant === 'danger',
    },
    
    // Full width
    { 'w-full': fullWidth },
    
    className
  );  
  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileHover={{ scale: isDisabled ? 1 : 1.02 }}
      whileTap={{ scale: isDisabled ? 1 : 0.98 }}
      className={baseClasses}
      disabled={isDisabled}
      onClick={onClick}
      type={type}
      form={form}
      aria-label={ariaLabel}
    >
      {/* Loading spinner */}
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        />
      )}
      
      {/* Left icon */}
      {!loading && leftIcon && (
        <span className="flex-shrink-0">
          {leftIcon}
        </span>
      )}
      
      {/* Button text */}
      <span className={clsx({ 'opacity-0': loading })}>
        {children}
      </span>
      
      {/* Right icon */}
      {!loading && rightIcon && (
        <span className="flex-shrink-0">
          {rightIcon}
        </span>
      )}
    </motion.button>
  );
};

export default Button;