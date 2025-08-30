'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MeasurementButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  className?: string
  fullWidth?: boolean
}

const variants = {
  primary: 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white shadow-lg hover:shadow-xl',
  secondary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white shadow-lg hover:shadow-xl',
  outline: 'border-2 border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500',
  ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white shadow-lg hover:shadow-xl'
}

const sizes = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg'
}

export const MeasurementButton: React.FC<MeasurementButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  fullWidth = false
}) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className
  )

  const iconClasses = cn(
    'transition-transform duration-200',
    loading && 'animate-spin'
  )

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={baseClasses}
      {...(!disabled && !loading && {
        whileHover: { scale: 1.02, y: -1 },
        whileTap: { scale: 0.98 }
      })}
      transition={{ duration: 0.2 }}
    >
      {icon && iconPosition === 'left' && (
        <span className={cn('mr-2', iconClasses)}>
          {loading ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            icon
          )}
        </span>
      )}
      
      <span className={loading ? 'opacity-70' : ''}>
        {children}
      </span>
      
      {icon && iconPosition === 'right' && (
        <span className={cn('ml-2', iconClasses)}>
          {icon}
        </span>
      )}
    </motion.button>
  )
}

export default MeasurementButton
