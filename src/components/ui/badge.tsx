import React from 'react'
import { motion } from 'framer-motion'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'premium'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className = '', variant = 'default', size = 'md', children }, ref) => {
    const baseClasses = "inline-flex items-center rounded-full font-medium transition-colors"
    
    const variantClasses = {
      default: "bg-white/10 text-white border border-white/20",
      success: "bg-green-500/20 text-green-400 border border-green-500/30",
      warning: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
      error: "bg-red-500/20 text-red-400 border border-red-500/30",
      info: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
      premium: "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border border-amber-500/30"
    }
    
    const sizeClasses = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-3 py-1 text-sm",
      lg: "px-4 py-2 text-base"
    }
    
    return (
      <motion.div
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}

      >
        {children}
      </motion.div>
    )
  }
)

Badge.displayName = 'Badge'
