import { ReactNode } from 'react'
import { Card } from './Card'

interface StatusCardProps {
  title: string
  value: string
  subtitle?: string
  status?: 'good' | 'excellent' | 'warning' | 'critical'
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: ReactNode
  className?: string
}

export function StatusCard({ 
  title, 
  value, 
  subtitle,
  status,
  change, 
  changeType = 'neutral', 
  icon, 
  className = '' 
}: StatusCardProps) {
  const changeColorClasses = {
    positive: 'text-success-600 dark:text-success-400',
    negative: 'text-error-600 dark:text-error-400',
    neutral: 'text-neutral-600 dark:text-neutral-400',
  }

  const changeBgClasses = {
    positive: 'bg-success-50 dark:bg-success-900/20',
    negative: 'bg-error-50 dark:bg-error-900/20',
    neutral: 'bg-neutral-50 dark:bg-neutral-800',
  }

  const statusColorClasses = {
    excellent: 'text-green-600 dark:text-green-400',
    good: 'text-blue-600 dark:text-blue-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    critical: 'text-red-600 dark:text-red-400',
  }

  return (
    <Card className={className}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              {title}
            </p>
            <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {value}
            </p>
            {subtitle && (
              <p className={`text-sm font-medium mt-1 ${status ? statusColorClasses[status] : 'text-neutral-600 dark:text-neutral-400'}`}>
                {subtitle}
              </p>
            )}
            {change && (
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${changeBgClasses[changeType]} ${changeColorClasses[changeType]}`}>
                <span className="mr-1">
                  {changeType === 'positive' && '↗'}
                  {changeType === 'negative' && '↘'}
                  {changeType === 'neutral' && '→'}
                </span>
                {change}
              </div>
            )}
          </div>
          {icon && (
            <div className="flex-shrink-0 text-primary-500 dark:text-primary-400">
              {icon}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
