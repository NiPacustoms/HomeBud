'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

interface ToastContextType {
  showToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void
  hideToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeout(() => onClose(id), 300) // Wait for exit animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, id, onClose])

  const typeConfig = {
    success: {
      icon: '✅',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      textColor: 'text-green-800 dark:text-green-200',
      iconColor: 'text-green-500'
    },
    error: {
      icon: '❌',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      textColor: 'text-red-800 dark:text-red-200',
      iconColor: 'text-red-500'
    },
    warning: {
      icon: '⚠️',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      textColor: 'text-yellow-800 dark:text-yellow-200',
      iconColor: 'text-yellow-500'
    },
    info: {
      icon: 'ℹ️',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-800 dark:text-blue-200',
      iconColor: 'text-blue-500'
    }
  }

  const config = typeConfig[type]

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'flex items-start space-x-3 p-4 rounded-lg border shadow-lg max-w-sm',
        config.bgColor,
        config.borderColor
      )}
    >
      <div className={cn('text-lg', config.iconColor)}>
        {config.icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className={cn('text-sm font-medium', config.textColor)}>
          {title}
        </h4>
        {message && (
          <p className={cn('text-sm mt-1', config.textColor)}>
            {message}
          </p>
        )}
      </div>
      
      <button
        onClick={() => {
          setTimeout(() => onClose(id), 300)
        }}
        className={cn(
          'p-1 rounded-md hover:bg-black/10 transition-colors',
          config.textColor
        )}
        aria-label="Toast schließen"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  )
}

export const ToastContainer: React.FC = () => {
  if (typeof window === 'undefined') return null

  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {/* Toasts will be rendered here when needed */}
      </AnimatePresence>
    </div>,
    document.body
  )
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ToastContext.Provider value={{ showToast: () => {}, hideToast: () => {} }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

export default Toast
