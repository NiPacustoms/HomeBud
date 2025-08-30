'use client'

import dynamic from 'next/dynamic'
import React from 'react'

// Dynamischer Import der Hauptkomponente, um SSR-Probleme zu vermeiden
const MeasurementsPageContent = dynamic(() => import('@/components/measurements/MeasurementsPageContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Lade Messungen...</p>
      </div>
    </div>
  )
})

export default function MeasurementsPage() {
  return <MeasurementsPageContent />
}
