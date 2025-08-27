'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { GeminiDiagnosisService } from '@/services/geminiService'

export default function GeminiDemo() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'valid' | 'invalid'>('checking')

  // API Key Status prüfen
  React.useEffect(() => {
    const checkApiKey = async () => {
      try {
        const isValid = await GeminiDiagnosisService.validateApiKey()
        setApiKeyStatus(isValid ? 'valid' : 'invalid')
      } catch (error) {
        setApiKeyStatus('invalid')
      }
    }
    
    checkApiKey()
  }, [])

  const handleDemoAnalysis = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      // Demo-Symptome für Test
      const demoSymptoms = `
        Die unteren Blätter meiner Pflanze werden gelb und fallen ab. 
        Das Wachstum ist verlangsamt und die Blätter sehen schlaff aus. 
        Die Pflanze steht in der Blütephase.
      `

      const analysis = await GeminiDiagnosisService.analyzeSymptoms(
        demoSymptoms,
        'flowering',
        { temperature: 24, humidity: 65, lightLevel: 'medium' }
      )

      setResult(analysis)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unbekannter Fehler')
    } finally {
      setIsLoading(false)
    }
  }

  const getApiKeyStatusColor = () => {
    switch (apiKeyStatus) {
      case 'valid': return 'text-green-400'
      case 'invalid': return 'text-red-400'
      default: return 'text-yellow-400'
    }
  }

  const getApiKeyStatusText = () => {
    switch (apiKeyStatus) {
      case 'valid': return '✅ API Key gültig'
      case 'invalid': return '❌ API Key ungültig oder nicht konfiguriert'
      default: return '⏳ Prüfe API Key...'
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">🤖 Gemini KI-Diagnose Demo</h2>
        <p className="text-white/60">
          Testen Sie die Gemini-Integration mit einer Demo-Analyse
        </p>
      </div>

      {/* API Key Status */}
      <div className="mb-6 p-4 bg-white/5 rounded-xl">
        <h3 className="font-semibold text-white mb-2">API Key Status</h3>
        <div className={`flex items-center space-x-2 ${getApiKeyStatusColor()}`}>
          <span className="text-sm">{getApiKeyStatusText()}</span>
        </div>
        
        {apiKeyStatus === 'invalid' && (
          <div className="mt-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm">
              Bitte konfigurieren Sie Ihren Gemini API Key in der .env.local Datei:
            </p>
            <code className="text-red-200 text-xs mt-2 block">
              NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
            </code>
          </div>
        )}
      </div>

      {/* Demo Button */}
      <div className="text-center mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDemoAnalysis}
          disabled={isLoading || apiKeyStatus !== 'valid'}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
            isLoading || apiKeyStatus !== 'valid'
              ? 'bg-white/10 text-white/40 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/25'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Analysiere...</span>
            </div>
          ) : (
            'Demo-Analyse starten'
          )}
        </motion.button>
      </div>

      {/* Demo-Symptome */}
      <div className="mb-6 p-4 bg-white/5 rounded-xl">
        <h3 className="font-semibold text-white mb-2">Demo-Symptome</h3>
        <p className="text-white/80 text-sm">
          "Die unteren Blätter meiner Pflanze werden gelb und fallen ab. Das Wachstum ist verlangsamt 
          und die Blätter sehen schlaff aus. Die Pflanze steht in der Blütephase."
        </p>
      </div>

      {/* Ergebnisse */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="font-semibold text-white">Gemini-Analyse Ergebnisse</h3>
          
          {/* Primäres Problem */}
          <div className="p-4 bg-white/5 rounded-xl">
            <h4 className="font-medium text-white mb-2">Primäres Problem</h4>
            <div className="flex items-center justify-between">
              <span className="text-white/80">{result.primaryIssue}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                result.severity === 'low' ? 'bg-green-500/20 text-green-300' :
                result.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                result.severity === 'high' ? 'bg-orange-500/20 text-orange-300' :
                'bg-red-500/20 text-red-300'
              }`}>
                {result.severity}
              </span>
            </div>
          </div>

          {/* Konfidenz */}
          <div className="p-4 bg-white/5 rounded-xl">
            <h4 className="font-medium text-white mb-2">KI-Konfidenz</h4>
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
              <span className="text-white/80 text-sm">{result.confidence}%</span>
            </div>
          </div>

          {/* Maßnahmen */}
          {result.immediateActions && result.immediateActions.length > 0 && (
            <div className="p-4 bg-white/5 rounded-xl">
              <h4 className="font-medium text-white mb-2">Sofortmaßnahmen</h4>
              <ul className="space-y-1">
                {result.immediateActions.map((action: string, index: number) => (
                  <li key={index} className="flex items-center space-x-2 text-white/80 text-sm">
                    <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mögliche Ursachen */}
          {result.possibleCauses && result.possibleCauses.length > 0 && (
            <div className="p-4 bg-white/5 rounded-xl">
              <h4 className="font-medium text-white mb-2">Mögliche Ursachen</h4>
              <ul className="space-y-1">
                {result.possibleCauses.map((cause: string, index: number) => (
                  <li key={index} className="flex items-center space-x-2 text-white/80 text-sm">
                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Präventionsmaßnahmen */}
          {result.preventionMeasures && result.preventionMeasures.length > 0 && (
            <div className="p-4 bg-white/5 rounded-xl">
              <h4 className="font-medium text-white mb-2">Präventionsmaßnahmen</h4>
              <ul className="space-y-1">
                {result.preventionMeasures.map((measure: string, index: number) => (
                  <li key={index} className="flex items-center space-x-2 text-white/80 text-sm">
                    <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                    <span>{measure}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      {/* Fehleranzeige */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl"
        >
          <h4 className="font-medium text-red-300 mb-2">Fehler</h4>
          <p className="text-red-200 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Features Übersicht */}
      <div className="mt-6 p-4 bg-white/5 rounded-xl">
        <h3 className="font-semibold text-white mb-3">Gemini Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2 text-white/80">
            <span>🤖</span>
            <span>Foto-basierte Analyse</span>
          </div>
          <div className="flex items-center space-x-2 text-white/80">
            <span>📝</span>
            <span>Symptom-Analyse</span>
          </div>
          <div className="flex items-center space-x-2 text-white/80">
            <span>📋</span>
            <span>Behandlungspläne</span>
          </div>
          <div className="flex items-center space-x-2 text-white/80">
            <span>📊</span>
            <span>Fortschrittsvergleich</span>
          </div>
          <div className="flex items-center space-x-2 text-white/80">
            <span>🎯</span>
            <span>Personalisierte Empfehlungen</span>
          </div>
          <div className="flex items-center space-x-2 text-white/80">
            <span>❓</span>
            <span>Intelligente Follow-up Fragen</span>
          </div>
        </div>
      </div>
    </div>
  )
}
