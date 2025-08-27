import { ReactNode } from 'react'

interface QuickActionCardProps {
  title: string
  description: string
  icon: ReactNode
  color: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
  onClick: () => void
  className?: string
}

export function QuickActionCard({ 
  title, 
  description, 
  icon, 
  color, 
  onClick, 
  className = '' 
}: QuickActionCardProps) {
  const colorClasses = {
    primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30',
    secondary: 'bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-900/30',
    accent: 'bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 hover:bg-accent-100 dark:hover:bg-accent-900/30',
    info: 'bg-info-50 dark:bg-info-900/20 text-info-600 dark:text-info-400 hover:bg-info-100 dark:hover:bg-info-900/30',
    success: 'bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400 hover:bg-success-100 dark:hover:bg-success-900/30',
    warning: 'bg-warning-50 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400 hover:bg-warning-100 dark:hover:bg-warning-900/30',
    error: 'bg-error-50 dark:bg-error-900/20 text-error-600 dark:text-error-400 hover:bg-error-100 dark:hover:bg-error-900/30',
  }

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-xl transition-all duration-200 hover-lift ${colorClasses[color]} ${className}`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 p-2 rounded-lg bg-white/50 dark:bg-black/20">
          {icon}
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-medium text-sm mb-1">{title}</h3>
          <p className="text-xs opacity-80">{description}</p>
        </div>
        <div className="flex-shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  )
}
