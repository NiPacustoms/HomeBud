import React from 'react'
import { motion } from 'framer-motion'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'premium'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'md', children, disabled, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    
    const variantClasses = {
      default: "bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30 focus:ring-white/50",
      primary: "bg-gradient-to-r from-green-500 to-emerald-600 text-white border border-green-500/30 hover:from-green-600 hover:to-emerald-700 focus:ring-green-500/50 shadow-lg shadow-green-500/25",
      secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 focus:ring-white/30",
      outline: "bg-transparent text-white border-2 border-white/20 hover:bg-white/10 hover:border-white/30 focus:ring-white/50",
      ghost: "bg-transparent text-white hover:bg-white/10 focus:ring-white/30",
      premium: "bg-gradient-to-r from-amber-500 to-yellow-600 text-white border border-amber-500/30 hover:from-amber-600 hover:to-yellow-700 focus:ring-amber-500/50 shadow-lg shadow-amber-500/25"
    }
    
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg"
    }
    
    return (
      <motion.button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
