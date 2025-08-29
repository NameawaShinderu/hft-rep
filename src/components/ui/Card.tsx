import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export interface CardProps {
  variant?: 'default' | 'glass' | 'elevated' | 'trading';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  hover = false,
  children,
  className,
  onClick,
}) => {
  const cardClasses = clsx(
    // Base styles
    'rounded-xl transition-all duration-200',
    
    // Variant styles
    {
      // Default - Standard dark card
      'bg-neutral border border-gray-700': variant === 'default',
      
      // Glass - Glassmorphism effect
      'bg-glass backdrop-blur-glass border border-gray-600/30 shadow-lg': variant === 'glass',
      
      // Elevated - Enhanced shadows and depth
      'bg-neutral border border-gray-700 shadow-xl shadow-black/20': variant === 'elevated',
      
      // Trading - Specialized for trading data
      'bg-neutral border border-gray-700 hover:border-primary/50': variant === 'trading',
    },
    
    // Padding variants
    {
      'p-0': padding === 'none',
      'p-3': padding === 'sm',
      'p-4': padding === 'md',
      'p-6': padding === 'lg',
    },
    
    // Hover effects
    {
      'hover:shadow-lg hover:border-gray-600 cursor-pointer': hover,
    },    
    className
  );

  const MotionCard = hover ? motion.div : 'div';
  const motionProps = hover ? {
    whileHover: { 
      scale: 1.02,
      y: -2,
    },
    transition: { duration: 0.2 },
  } : {};

  return (
    <MotionCard
      className={cardClasses}
      onClick={onClick}
      {...(hover ? motionProps : {})}
    >
      {children}
    </MotionCard>
  );
};

// Card sub-components for better composition
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={clsx('border-b border-gray-700 p-4', className)}>
    {children}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={clsx('p-4', className)}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={clsx('border-t border-gray-700 p-4', className)}>
    {children}
  </div>
);

export default Card;