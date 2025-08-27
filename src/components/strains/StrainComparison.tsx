'use client';

import React, { useState, useEffect } from 'react';
import { Strain } from '../../types/strain';
import { strainDatabaseService } from '../../services/strainDatabaseService';

interface StrainComparisonProps {
  strainIds: string[];
  onBack: () => void;
}

export default function StrainComparison({ strainIds, onBack }: StrainComparisonProps) {
  const [strains, setStrains] = useState<Strain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStrains();
  }, [strainIds]);

  const loadStrains = async () => {
    try {
      setLoading(true);
      const strainData = await strainDatabaseService.compareStrains(strainIds);
      setStrains(strainData);
    } catch (error) {
      console.error('Fehler beim Laden der Strains:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vergleichsdaten werden geladen...</p>
        </div>
      </div>
    );
  }

  if (strains.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Keine Strains zum Vergleichen gefunden.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Zurück zur Übersicht
        </button>
      </div>
    );
  }

  const getGeneticsColor = (type: string) => {
    switch (type) {
      case 'indica': return 'bg-purple-100 text-purple-800';
      case 'sativa': return 'bg-orange-100 text-orange-800';
      case 'hybrid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Strain-Vergleich
            </h2>
            <p className="text-gray-600">
              Vergleichen Sie {strains.length} ausgewählte Strains
            </p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Zurück zur Übersicht
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b">
                  Eigenschaft
                </th>
                {strains.map((strain) => (
                  <th key={strain.id} className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b min-w-[200px]">
                    <div className="flex items-center space-x-2">
                      {strain.metadata.imageUrl ? (
                        <img
                          src={strain.metadata.imageUrl}
                          alt={strain.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                          🌿
                        </div>
                      )}
                      <div>
                        <div className="font-semibold">{strain.name}</div>
                        {strain.breeder && (
                          <div className="text-xs text-gray-500">von {strain.breeder}</div>
                        )}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Genetics */}
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                  Genetik
                </td>
                {strains.map((strain) => (
                  <td key={strain.id} className="px-4 py-3 text-sm text-gray-900">
                    <div className="space-y-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGeneticsColor(strain.genetics.type)}`}>
                        {strain.genetics.type.charAt(0).toUpperCase() + strain.genetics.type.slice(1)}
                      </span>
                      {strain.genetics.indicaPercentage && (
                        <div className="text-xs text-gray-600">
                          Indica: {strain.genetics.indicaPercentage}%
                        </div>
                      )}
                      {strain.genetics.sativaPercentage && (
                        <div className="text-xs text-gray-600">
                          Sativa: {strain.genetics.sativaPercentage}%
                        </div>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Cannabinoids */}
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                  Cannabinoide
                </td>
                {strains.map((strain) => (
                  <td key={strain.id} className="px-4 py-3 text-sm text-gray-900">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">THC:</span>
                        <span className="font-medium text-purple-600">{strain.cannabinoids.thc.average}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">CBD:</span>
                        <span className="font-medium text-green-600">{strain.cannabinoids.cbd.average}%</span>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Growing Info */}
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                  Anbau
                </td>
                {strains.map((strain) => (
                  <td key={strain.id} className="px-4 py-3 text-sm text-gray-900">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Blütezeit:</span>
                        <span className="font-medium">{strain.growing.floweringTime.average} Tage</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ertrag Indoor:</span>
                        <span className="font-medium">{strain.growing.yield.indoor.average}g/m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Höhe Indoor:</span>
                        <span className="font-medium">{strain.growing.height.indoor.average}cm</span>
                      </div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(strain.growing.difficulty)}`}>
                          {strain.growing.difficulty === 'beginner' ? 'Anfänger' :
                           strain.growing.difficulty === 'intermediate' ? 'Fortgeschritten' : 'Experte'}
                        </span>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Environment */}
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                  Umwelt
                </td>
                {strains.map((strain) => (
                  <td key={strain.id} className="px-4 py-3 text-sm text-gray-900">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Klima:</span>
                        <span className="font-medium capitalize">{strain.environment.climate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Substrat:</span>
                        <span className="font-medium capitalize">{strain.environment.soilType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Licht:</span>
                        <span className="font-medium capitalize">{strain.environment.lightRequirements}</span>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Effects */}
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                  Haupteffekte
                </td>
                {strains.map((strain) => (
                  <td key={strain.id} className="px-4 py-3 text-sm text-gray-900">
                    <div className="flex flex-wrap gap-1">
                      {strain.characteristics.effects.primary.slice(0, 3).map((effect, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                        >
                          {effect}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Aromas */}
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                  Aromen
                </td>
                {strains.map((strain) => (
                  <td key={strain.id} className="px-4 py-3 text-sm text-gray-900">
                    <div className="flex flex-wrap gap-1">
                      {strain.characteristics.aroma.slice(0, 3).map((aroma, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-xs"
                        >
                          {aroma}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Resistance */}
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                  Resistenzen
                </td>
                {strains.map((strain) => (
                  <td key={strain.id} className="px-4 py-3 text-sm text-gray-900">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Schädlinge:</span>
                        <span className={`font-medium ${
                          strain.care.pestResistance === 'high' ? 'text-green-600' :
                          strain.care.pestResistance === 'medium' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {strain.care.pestResistance}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Schimmel:</span>
                        <span className={`font-medium ${
                          strain.care.moldResistance === 'high' ? 'text-green-600' :
                          strain.care.moldResistance === 'medium' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {strain.care.moldResistance}
                        </span>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Care */}
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                  Pflege
                </td>
                {strains.map((strain) => (
                  <td key={strain.id} className="px-4 py-3 text-sm text-gray-900">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bewässerung:</span>
                        <span className="font-medium capitalize">{strain.care.watering.frequency}</span>
                      </div>
                      {strain.care.watering.tips.length > 0 && (
                        <div className="text-xs text-gray-600 italic">
                          "{strain.care.watering.tips[0]}"
                        </div>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Price & Availability */}
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                  Verfügbarkeit
                </td>
                {strains.map((strain) => (
                  <td key={strain.id} className="px-4 py-3 text-sm text-gray-900">
                    <div className="space-y-2">
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          strain.metadata.priceRange === 'budget' ? 'bg-green-100 text-green-800' :
                          strain.metadata.priceRange === 'mid' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {strain.metadata.priceRange === 'budget' ? 'Günstig' :
                           strain.metadata.priceRange === 'mid' ? 'Mittel' : 'Premium'}
                        </span>
                      </div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          strain.metadata.availability === 'common' ? 'bg-green-100 text-green-800' :
                          strain.metadata.availability === 'rare' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {strain.metadata.availability === 'common' ? 'Verfügbar' :
                           strain.metadata.availability === 'rare' ? 'Selten' : 'Limitiert'}
                        </span>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
