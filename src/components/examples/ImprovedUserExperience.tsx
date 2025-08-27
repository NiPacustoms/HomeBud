'use client';

import React, { useState } from 'react';
import GuidedInput from '../ui/GuidedInput';
import ValueVisualization from '../ui/ValueVisualization';
import ActionRecommendations from '../ui/ActionRecommendations';
import GlossaryFAQ from '../ui/GlossaryFAQ';
import { FieldHelp, InfoIcon } from '../ui/HelpSystem';
import { generateRecommendations } from '../ui/ActionRecommendations';

export default function ImprovedUserExperience() {
  const [showGuidedInput, setShowGuidedInput] = useState(false);
  const [measurements, setMeasurements] = useState({
    temperature: 24,
    humidity: 65,
    ph: 6.2,
    ec: 1.2,
    co2: 800
  });

  const guidedInputSteps = [
    {
      id: 'temperature',
      label: 'Temperatur',
      type: 'number' as const,
      helpText: 'Die Raumtemperatur in Grad Celsius. Ideal sind 20-28°C für Cannabis-Pflanzen.',
      exampleValue: 24,
      unit: '°C',
      validation: { required: true, min: 15, max: 35 },
      optimalRange: { min: 20, max: 28 }
    },
    {
      id: 'humidity',
      label: 'Luftfeuchtigkeit',
      type: 'range' as const,
      helpText: 'Die relative Luftfeuchtigkeit in Prozent. Wichtig für die Transpiration der Pflanzen.',
      range: { min: 30, max: 90, step: 5 },
      unit: '%',
      optimalRange: { min: 50, max: 70 }
    },
    {
      id: 'ph',
      label: 'pH-Wert',
      type: 'number' as const,
      helpText: 'Der Säuregrad der Nährlösung. Bestimmt die Verfügbarkeit von Nährstoffen.',
      exampleValue: 6.0,
      validation: { required: true, min: 4, max: 8 },
      optimalRange: { min: 5.5, max: 6.5 }
    },
    {
      id: 'growingMethod',
      label: 'Anbaumethode',
      type: 'radio' as const,
      helpText: 'Wählen Sie Ihre Anbaumethode. Dies beeinflusst die optimalen Parameter.',
      options: [
        { value: 'soil', label: 'Erde', description: 'Traditionelle Anbaumethode mit Blumenerde' },
        { value: 'coco', label: 'Kokos', description: 'Kokosfaser-Substrat für bessere Belüftung' },
        { value: 'hydro', label: 'Hydrokultur', description: 'Nährlösung ohne Substrat' }
      ]
    }
  ];

  const handleGuidedInputComplete = (values: Record<string, any>) => {
    setMeasurements(prev => ({ ...prev, ...values }));
    setShowGuidedInput(false);
  };

  const recommendations = generateRecommendations(measurements);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verbesserte Benutzerführung
          </h1>
          <p className="text-gray-600">
            Demonstration der neuen UI-Komponenten für eine benutzerfreundlichere Erfahrung
          </p>
        </div>

        {/* Guided Input Example */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Schritt-für-Schritt Eingabe
            </h2>
            <button
              onClick={() => setShowGuidedInput(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Eingabe starten
            </button>
          </div>
          <p className="text-gray-600 mb-4">
            Geführte Eingabe mit kontextabhängigen Hilfetexten und Beispielwerten
          </p>
        </div>

        {/* Value Visualizations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Temperatur</h3>
            <ValueVisualization
              value={measurements.temperature}
              range={{ min: 15, max: 35, optimal: { min: 20, max: 28 } }}
              unit="°C"
              label="Raumtemperatur"
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Luftfeuchtigkeit</h3>
            <ValueVisualization
              value={measurements.humidity}
              range={{ min: 30, max: 90, optimal: { min: 50, max: 70 } }}
              unit="%"
              label="Relative Luftfeuchtigkeit"
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">pH-Wert</h3>
            <ValueVisualization
              value={measurements.ph}
              range={{ min: 4, max: 8, optimal: { min: 5.5, max: 6.5 } }}
              unit=""
              label="pH-Wert"
            />
          </div>
        </div>

        {/* Action Recommendations */}
        <ActionRecommendations
          items={recommendations}
          title="Handlungsempfehlungen basierend auf Ihren Messwerten"
        />

        {/* Help System Examples */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Hilfesystem & Tooltips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Info-Icons</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span>PPFD</span>
                  <InfoIcon 
                    content="Photosynthetic Photon Flux Density - misst die Anzahl der Photosynthese-aktiven Photonen pro Quadratmeter und Sekunde."
                    title="PPFD"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span>VPD</span>
                  <InfoIcon 
                    content="Vapor Pressure Deficit - beschreibt den Unterschied zwischen maximalem und tatsächlichem Wasserdampfgehalt der Luft."
                    title="VPD"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Feld-Hilfe</h3>
              <div className="space-y-2">
                <FieldHelp 
                  content="Geben Sie die aktuelle Raumtemperatur ein. Ideal sind 20-28°C für Cannabis-Pflanzen."
                  title="Temperatur"
                >
                  <input
                    type="number"
                    placeholder="Temperatur eingeben"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </FieldHelp>
              </div>
            </div>
          </div>
        </div>

        {/* Glossary & FAQ */}
        <GlossaryFAQ />

        {/* Modal for Guided Input */}
        {showGuidedInput && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-2xl">
              <GuidedInput
                title="Pflanzen-Parameter eingeben"
                description="Geben Sie die wichtigsten Parameter Ihrer Anbauumgebung ein. Wir helfen Ihnen dabei!"
                steps={guidedInputSteps}
                onComplete={handleGuidedInputComplete}
                onCancel={() => setShowGuidedInput(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
