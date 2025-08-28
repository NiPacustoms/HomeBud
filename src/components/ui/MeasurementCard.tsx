'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MeasurementCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'sm' | 'md' | 'lg'
  hover?: boolean
  onClick?: () => void
}

const variants = {
  default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
  elevated: 'bg-white dark:bg-gray-800 shadow-lg border-0',
  outlined: 'bg-transparent border-2 border-gray-200 dark:border-gray-700'
}

const paddingVariants = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
}

export const MeasurementCard: React.FC<MeasurementCardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick
}) => {
  const baseClasses = cn(
    'rounded-xl transition-all duration-200',
    variants[variant],
    paddingVariants[padding],
    hover && 'hover:shadow-lg hover:scale-[1.02] cursor-pointer',
    className
  )

  const Component = onClick ? motion.button : motion.div

  return (
    <Component
      className={baseClasses}
      onClick={onClick}
      whileHover={hover ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {children}
    </Component>
  )
}

export default MeasurementCard
