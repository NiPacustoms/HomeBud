'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface HeaderProps {
  title?: string
  breadcrumbs?: BreadcrumbItem[]
  showUserMenu?: boolean
  className?: string
}

export const Header: React.FC<HeaderProps> = ({
  title,
  breadcrumbs = [],
  showUserMenu = true,
  className = ''
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const getPageTitle = () => {
    if (title) return title
    
    // Automatische Titel-Generierung basierend auf Route
    const pathMap: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/plants': 'Pflanzen',
      '/measurements': 'Messungen',
      '/diagnose': 'Diagnose',
      '/planner': 'Planer',
      '/settings': 'Einstellungen'
    }
    
    return pathMap[pathname] || 'HomeBud'
  }

  const handleBreadcrumbClick = (href?: string) => {
    if (href) {
      router.push(href)
    }
  }

  return (
    <header className={cn(
      'bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40',
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  <button
                    onClick={() => handleBreadcrumbClick(item.href)}
                    className={cn(
                      'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors',
                      !item.href && 'font-medium text-gray-900 dark:text-white cursor-default'
                    )}
                    disabled={!item.href}
                  >
                    {item.label}
                  </button>
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Page Title */}
          <div className="flex-1 text-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {getPageTitle()}
            </h1>
          </div>

          {/* User Menu */}
          {showUserMenu && (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">U</span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1"
                  >
                    <button
                      onClick={() => router.push('/settings')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      ⚙️ Einstellungen
                    </button>
                    <button
                      onClick={() => router.push('/profile')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      👤 Profil
                    </button>
                    <hr className="my-1 border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={() => {
                        // TODO: Implement logout
                        console.log('Logout')
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      🚪 Abmelden
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
