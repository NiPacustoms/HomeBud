'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import Header from '@/components/ui/Header'
import Sidebar from '@/components/navigation/Sidebar'

interface AppLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  showSidebar?: boolean
  className?: string
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showHeader = true,
  showSidebar = true,
  className = ''
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      {showHeader && (
        <Header />
      )}
      
      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <div className="hidden lg:block lg:w-64 lg:fixed lg:inset-y-0 lg:z-50">
            <Sidebar />
          </div>
        )}
        
        {/* Main Content */}
        <main className={cn(
          'flex-1 min-h-screen',
          showSidebar && 'lg:ml-64',
          className
        )}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppLayout
