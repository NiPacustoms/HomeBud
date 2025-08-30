'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'outlined' | 'filled'
  inputSize?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  inputSize = 'md',
  fullWidth = false,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  const hasError = !!error

  const baseClasses = cn(
    'block w-full border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    fullWidth && 'w-full'
  )

  const variantClasses = {
    default: cn(
      'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
      'focus:border-green-500 focus:ring-green-500/20',
      hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
    ),
    outlined: cn(
      'border-2 border-gray-300 dark:border-gray-600 bg-transparent',
      'focus:border-green-500 focus:ring-green-500/20',
      hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
    ),
    filled: cn(
      'border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white',
      'focus:bg-white dark:focus:bg-gray-800 focus:border-green-500 focus:ring-green-500/20',
      hasError && 'bg-red-50 dark:bg-red-900/20 focus:bg-white dark:focus:bg-gray-800'
    )
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  }

  const iconClasses = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  return (
    <div className={cn('space-y-1', fullWidth && 'w-full')}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <div className={iconClasses[inputSize]}>
              {leftIcon}
            </div>
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={cn(
            baseClasses,
            variantClasses[variant],
            sizeClasses[inputSize],
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            className
          )}
          aria-describedby={
            hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <div className={iconClasses[inputSize]}>
              {rightIcon}
            </div>
          </div>
        )}
      </div>
      
      {hasError && (
        <p
          id={`${inputId}-error`}
          className="text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
      
      {helperText && !hasError && (
        <p
          id={`${inputId}-helper`}
          className="text-sm text-gray-500 dark:text-gray-400"
        >
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
