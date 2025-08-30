'use client';

import React, { useState } from 'react';
import { UserPreferences, StrainRecommendation } from '../../types/strain';
import StrainCard from './StrainCard';
import '../../styles/performance.css';



interface StrainRecommendationWizardProps {
  onGetRecommendations: (preferences: UserPreferences) => void;
  recommendations: StrainRecommendation[];
  loading: boolean;
  onStrainSelect: (strainId: string) => void;
  selectedStrains: string[];
}

export default function StrainRecommendationWizard({
  onGetRecommendations,
  recommendations,
  loading,
  onStrainSelect,
  selectedStrains
}: StrainRecommendationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [preferences, setPreferences] = useState<UserPreferences>({
    location: {
      climate: 'temperate',
      growingSeason: 6,
      averageTemperature: 20,
      averageHumidity: 60
    },
    experience: 'beginner',
    growingSpace: 'indoor',
    desiredEffects: [],
    avoidEffects: [],
    yieldPriority: 'medium',
    difficultyPreference: 'easy'
  });

  const totalSteps = 5;

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleLocationChange = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [key]: value
      }
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onGetRecommendations(preferences);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Wo möchten Sie anbauen?
              </h3>
              <p className="text-gray-600 mb-6">
                Diese Informationen helfen uns, Strains zu finden, die zu Ihrem Klima passen.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Klima
                </label>
                <select
                  value={preferences.location.climate}
                  onChange={(e) => handleLocationChange('climate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  aria-label="Klima auswählen"
                >
                  <option value="temperate">Gemäßigt</option>
                  <option value="tropical">Tropisch</option>
                  <option value="arid">Trocken</option>
                  <option value="cold">Kalt</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anbausaison (Monate)
                </label>
                                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={preferences.location.growingSeason}
                    onChange={(e) => handleLocationChange('growingSeason', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    aria-label="Anbausaison in Monaten"
                    placeholder="6"
                  />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durchschnittstemperatur (°C)
                  </label>
                                      <input
                      type="number"
                      min="0"
                      max="40"
                      value={preferences.location.averageTemperature}
                      onChange={(e) => handleLocationChange('averageTemperature', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      aria-label="Durchschnittstemperatur in Grad Celsius"
                      placeholder="20"
                    />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durchschnittsluftfeuchtigkeit (%)
                  </label>
                                      <input
                      type="number"
                      min="0"
                      max="100"
                      value={preferences.location.averageHumidity}
                      onChange={(e) => handleLocationChange('averageHumidity', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      aria-label="Durchschnittsluftfeuchtigkeit in Prozent"
                      placeholder="60"
                    />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Was ist Ihre Anbauerfahrung?
              </h3>
              <p className="text-gray-600 mb-6">
                Wir empfehlen Strains, die zu Ihrem Erfahrungslevel passen.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Erfahrungslevel
                </label>
                <div className="space-y-3">
                  {[
                    { value: 'beginner', label: 'Anfänger', description: 'Erste Anbauversuche' },
                    { value: 'intermediate', label: 'Fortgeschritten', description: 'Bereits einige Ernten' },
                    { value: 'advanced', label: 'Experte', description: 'Viele Jahre Erfahrung' }
                  ].map(({ value, label, description }) => (
                    <label key={value} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="experience"
                        value={value}
                        checked={preferences.experience === value}
                        onChange={(e) => handlePreferenceChange('experience', e.target.value)}
                        className="mt-1 mr-3 text-green-600 focus:ring-green-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{label}</div>
                        <div className="text-sm text-gray-600">{description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anbauumgebung
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'indoor', label: 'Indoor' },
                    { value: 'outdoor', label: 'Outdoor' },
                    { value: 'greenhouse', label: 'Gewächshaus' }
                  ].map(({ value, label }) => (
                    <label key={value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="growingSpace"
                        value={value}
                        checked={preferences.growingSpace === value}
                        onChange={(e) => handlePreferenceChange('growingSpace', e.target.value)}
                        className="mr-2 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Welche Effekte wünschen Sie?
              </h3>
              <p className="text-gray-600 mb-6">
                Wählen Sie die Effekte aus, die Sie von Ihren Strains erwarten.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gewünschte Effekte (mehrfach wählbar)
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {[
                    'Entspannung', 'Energie', 'Kreativität', 'Fokus', 'Schlaf',
                    'Schmerzlinderung', 'Appetit', 'Euphorie', 'Meditation', 'Sozialisierung'
                  ].map((effect) => (
                    <label key={effect} className="flex items-center p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.desiredEffects.includes(effect)}
                        onChange={(e) => {
                          const current = preferences.desiredEffects;
                          const newEffects = e.target.checked
                            ? [...current, effect]
                            : current.filter(e => e !== effect);
                          handlePreferenceChange('desiredEffects', newEffects);
                        }}
                        className="mr-2 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm">{effect}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zu vermeidende Effekte (optional)
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {[
                    'Angst', 'Paranoia', 'Schläfrigkeit', 'Trockener Mund', 'Kopfschmerzen'
                  ].map((effect) => (
                    <label key={effect} className="flex items-center p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.avoidEffects?.includes(effect) || false}
                        onChange={(e) => {
                          const current = preferences.avoidEffects || [];
                          const newEffects = e.target.checked
                            ? [...current, effect]
                            : current.filter(e => e !== effect);
                          handlePreferenceChange('avoidEffects', newEffects);
                        }}
                        className="mr-2 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm">{effect}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Anbaubeschränkungen
              </h3>
              <p className="text-gray-600 mb-6">
                Gibt es Einschränkungen für Ihren Anbau?
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximale Pflanzenhöhe (cm, optional)
                </label>
                <input
                  type="number"
                  min="50"
                  max="300"
                  value={preferences.maxHeight || ''}
                  onChange={(e) => handlePreferenceChange('maxHeight', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Keine Beschränkung"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximale Blütezeit (Tage, optional)
                </label>
                <input
                  type="number"
                  min="30"
                  max="120"
                  value={preferences.maxFloweringTime || ''}
                  onChange={(e) => handlePreferenceChange('maxFloweringTime', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Keine Beschränkung"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ertragspriorität
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'low', label: 'Niedrig', description: 'Qualität über Quantität' },
                    { value: 'medium', label: 'Mittel', description: 'Ausgewogen' },
                    { value: 'high', label: 'Hoch', description: 'Maximaler Ertrag' }
                  ].map(({ value, label, description }) => (
                    <label key={value} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="yieldPriority"
                        value={value}
                        checked={preferences.yieldPriority === value}
                        onChange={(e) => handlePreferenceChange('yieldPriority', e.target.value)}
                        className="mt-1 mr-3 text-green-600 focus:ring-green-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{label}</div>
                        <div className="text-sm text-gray-600">{description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Zusammenfassung
              </h3>
              <p className="text-gray-600 mb-6">
                Überprüfen Sie Ihre Auswahl, bevor wir Ihre personalisierten Empfehlungen generieren.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Klima:</span>
                  <span className="ml-2 text-gray-900 capitalize">{preferences.location.climate}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Erfahrung:</span>
                  <span className="ml-2 text-gray-900 capitalize">{preferences.experience}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Anbauumgebung:</span>
                  <span className="ml-2 text-gray-900 capitalize">{preferences.growingSpace}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Ertragspriorität:</span>
                  <span className="ml-2 text-gray-900 capitalize">{preferences.yieldPriority}</span>
                </div>
              </div>

              {preferences.desiredEffects.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700 text-sm">Gewünschte Effekte:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {preferences.desiredEffects.map((effect) => (
                      <span key={effect} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {effect}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {preferences.avoidEffects && preferences.avoidEffects.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700 text-sm">Zu vermeidende Effekte:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {preferences.avoidEffects.map((effect) => (
                      <span key={effect} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                        {effect}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (recommendations.length > 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ihre personalisierten Empfehlungen
          </h2>
          <p className="text-gray-600 mb-6">
            Basierend auf Ihren Präferenzen haben wir {recommendations.length} passende Strains gefunden.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {recommendations.slice(0, 9).map((recommendation) => (
            <div key={recommendation.strain.id} className="relative">
              <StrainCard
                strain={recommendation.strain}
                isSelected={selectedStrains.includes(recommendation.strain.id)}
                onSelect={() => onStrainSelect(recommendation.strain.id)}
                showDetails={true}
              />
              
              {/* Match Score Badge */}
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                {recommendation.matchPercentage}% Match
              </div>
              
              {/* Match Reasons */}
              <div className="mt-2 p-3 bg-green-50 rounded-lg">
                <div className="text-xs text-green-800 font-medium mb-1">Warum empfohlen:</div>
                <ul className="text-xs text-green-700 space-y-1">
                  {recommendation.reasons.slice(0, 2).map((reason, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-1">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => setCurrentStep(1)}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Neue Empfehlungen generieren
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Schritt {currentStep} von {totalSteps}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 progress-bar"
            data-progress={Math.round((currentStep / totalSteps) * 100)}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-6">
        {getStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Zurück
        </button>

        <button
          onClick={handleNext}
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Empfehlungen werden generiert...
            </div>
          ) : currentStep === totalSteps ? (
            'Empfehlungen generieren'
          ) : (
            'Weiter'
          )}
        </button>
      </div>
    </div>
  );
}
