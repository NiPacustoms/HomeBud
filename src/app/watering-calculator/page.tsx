'use client'

import React from 'react'
import Sidebar from '@/components/navigation/Sidebar'
import BackButton from '@/components/ui/BackButton'
import CannabisWateringCalculator from '@/components/plants/CannabisWateringCalculator'
import AnimatedBackground from '@/components/landing/AnimatedBackground'

export default function WateringCalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <Sidebar />
        
        <main className="ml-0 lg:ml-64 p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <BackButton />
            
            <div className="mt-6">
              <CannabisWateringCalculator />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
