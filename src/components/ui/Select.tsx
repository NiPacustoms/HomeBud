'use client'

import React, { forwardRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[]
  label?: string
  error?: string
  helperText?: string
  placeholder?: string
  variant?: 'default' | 'outlined' | 'filled'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  onChange?: (value: string) => void
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  options,
  label,
  error,
  helperText,
  placeholder = 'Bitte wählen...',
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = '',
  id,
  value,
  onChange,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`
  const hasError = !!error
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find(opt => opt.value === value)

  const baseClasses = cn(
    'block w-full border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0',
    'disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
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

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value
    onChange?.(newValue)
  }

  return (
    <div className={cn('space-y-1', fullWidth && 'w-full')}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          value={value}
          onChange={handleSelectChange}
          className={cn(
            baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            'appearance-none',
            className
          )}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={
            hasError ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
          }
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {hasError && (
        <p
          id={`${selectId}-error`}
          className="text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
      
      {helperText && !hasError && (
        <p
          id={`${selectId}-helper`}
          className="text-sm text-gray-500 dark:text-gray-400"
        >
          {helperText}
        </p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select
