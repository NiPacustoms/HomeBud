'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'

interface NavItem {
  id: string
  label: string
  icon: string
  path: string
}

const navItems: NavItem[] = [
  { id: 'settings', label: 'Einstellungen', icon: '⚙️', path: '/settings' }
]

export default function BottomNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 z-50 md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center py-2 px-3 min-w-0 flex-1 transition-colors ${
              isActive(item.path)
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <span className="text-lg mb-1">{item.icon}</span>
            <span className="text-xs font-medium truncate">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
