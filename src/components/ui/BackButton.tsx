'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface BackButtonProps {
  href?: string
  className?: string
  children?: any
}

export default function BackButton({ href, className = '', children }: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05, x: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleBack}
      className={`flex items-center space-x-2 text-white/60 hover:text-white transition-colors duration-300 ${className}`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <span className="font-medium">
        {children || 'Zurück'}
      </span>
    </motion.button>
  )
}
