'use client'

import React from 'react'
import { motion } from 'framer-motion'
import VPDChart from '@/components/vpd/VPDChart'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function VPDChartPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Zurück</span>
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              VPD-Chart
            </h1>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Der professionelle VPD-Chart basierend auf Dimlux Lighting Standards. 
              Finde die optimalen Klimabedingungen für deine Pflanzen.
            </p>
          </motion.div>
        </div>

        {/* VPD Chart Component */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <VPDChart />
        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-3">🎯 Was ist VPD?</h3>
            <p className="text-white/60 text-sm">
              VPD (Vapor Pressure Deficit) ist der Unterschied zwischen dem maximalen 
              Wasserdampf, den die Luft aufnehmen kann, und dem tatsächlichen Wasserdampfgehalt.
              Dimlux Lighting verwendet diese präzise Methode für professionelles Cannabis-Growing.
            </p>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-3">🌱 Warum ist VPD wichtig?</h3>
            <p className="text-white/60 text-sm">
              VPD beeinflusst direkt die Transpiration der Pflanzen und damit 
              die Nährstoffaufnahme und das Wachstum. Optimale VPD-Werte führen 
              zu gesünderen Pflanzen und höheren Erträgen. Dimlux-Standards sind 
              der Goldstandard in der professionellen Zucht.
            </p>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-3">📊 Wie nutze ich den Chart?</h3>
            <p className="text-white/60 text-sm">
              Bewege die Schieberegler für Temperatur und Luftfeuchte. 
              Der Chart zeigt dir sofort, ob deine Bedingungen optimal sind 
              und gibt dir professionelle Dimlux-Empfehlungen zur Anpassung.
            </p>
          </div>
        </motion.div>

        {/* Dimlux Standards Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl"
        >
          <h3 className="text-xl font-semibold text-white mb-4 text-center">
            🌟 Dimlux Lighting Standards
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="text-blue-400 font-medium mb-2">Vegetationsphase (18/6)</h4>
              <ul className="text-white/80 space-y-1">
                <li>• VPD: 0.8 - 1.2 kPa</li>
                <li>• Temperatur: 22 - 26°C</li>
                <li>• Luftfeuchte: 60 - 70%</li>
                <li>• Fördert vegetatives Wachstum</li>
              </ul>
            </div>
            <div>
              <h4 className="text-purple-400 font-medium mb-2">Blütephase (12/12)</h4>
              <ul className="text-white/80 space-y-1">
                <li>• VPD: 1.2 - 1.6 kPa</li>
                <li>• Temperatur: 20 - 28°C</li>
                <li>• Luftfeuchte: 40 - 60%</li>
                <li>• Optimiert Trichombildung</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-400 text-xs text-center">
              <strong>Dimlux Professional Tipp:</strong> Halte VPD über 24 Stunden konstant. 
              Schwankungen von mehr als ±0.3 kPa können Stress verursachen und die Erträge reduzieren.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
