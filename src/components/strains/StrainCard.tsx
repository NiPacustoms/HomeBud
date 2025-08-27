'use client';

import React, { useState } from 'react';
import { Strain } from '../../types/strain';
import { motion } from 'framer-motion';

interface StrainCardProps {
  strain: Strain;
  isSelected?: boolean;
  onSelect?: () => void;
  showDetails?: boolean;
}

export default function StrainCard({ 
  strain, 
  isSelected = false, 
  onSelect,
  showDetails = false 
}: StrainCardProps) {
  const [isExpanded, setIsExpanded] = useState(showDetails);

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

  const getResistanceColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-xl ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="relative">
        {strain.metadata.imageUrl ? (
          <img
            src={strain.metadata.imageUrl}
            alt={strain.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-4xl mb-2">🌿</div>
              <div className="text-lg font-semibold">{strain.name}</div>
            </div>
          </div>
        )}
        
        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {/* Genetics Badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGeneticsColor(strain.genetics.type)}`}>
            {strain.genetics.type.charAt(0).toUpperCase() + strain.genetics.type.slice(1)}
          </span>
        </div>

        {/* Popularity Badge */}
        <div className="absolute bottom-2 left-2">
          <div className="flex items-center bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
            <span>★</span>
            <span className="ml-1">{strain.metadata.popularity}/10</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Breeder */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{strain.name}</h3>
          {strain.breeder && (
            <p className="text-sm text-gray-600">von {strain.breeder}</p>
          )}
        </div>

        {/* Cannabinoids */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              {strain.cannabinoids.thc.average}%
            </div>
            <div className="text-xs text-gray-500">THC</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {strain.cannabinoids.cbd.average}%
            </div>
            <div className="text-xs text-gray-500">CBD</div>
          </div>
        </div>

        {/* Key Info */}
        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Blütezeit:</span>
            <span className="font-medium">{strain.growing.floweringTime.average} Tage</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Ertrag Indoor:</span>
            <span className="font-medium">{strain.growing.yield.indoor.average}g/m²</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Höhe Indoor:</span>
            <span className="font-medium">{strain.growing.height.indoor.average}cm</span>
          </div>
        </div>

        {/* Difficulty */}
        <div className="mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(strain.growing.difficulty)}`}>
            {strain.growing.difficulty === 'beginner' ? 'Anfänger' :
             strain.growing.difficulty === 'intermediate' ? 'Fortgeschritten' : 'Experte'}
          </span>
        </div>

        {/* Effects Preview */}
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-1">Haupteffekte:</div>
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
        </div>

        {/* Aromas Preview */}
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-1">Aromen:</div>
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
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {isExpanded ? 'Weniger anzeigen' : 'Mehr Details'}
        </button>

        {/* Expanded Details */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-gray-200 space-y-3"
          >
            {/* Genetics Details */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Genetik</h4>
              <div className="text-xs text-gray-600 space-y-1">
                {strain.genetics.indicaPercentage && (
                  <div>Indica: {strain.genetics.indicaPercentage}%</div>
                )}
                {strain.genetics.sativaPercentage && (
                  <div>Sativa: {strain.genetics.sativaPercentage}%</div>
                )}
                {strain.genetics.parentStrains && strain.genetics.parentStrains.length > 0 && (
                  <div>Eltern: {strain.genetics.parentStrains.join(' × ')}</div>
                )}
              </div>
            </div>

            {/* Growing Details */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Anbau</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Wuchsform: {strain.growing.growthPattern}</div>
                <div>Substrat: {strain.environment.soilType}</div>
                <div>Licht: {strain.environment.lightRequirements}</div>
                <div>Nährstoffe: {strain.environment.nutrients}</div>
              </div>
            </div>

            {/* Resistance */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Resistenzen</h4>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Schädlinge:</span>
                  <span className={getResistanceColor(strain.care.pestResistance)}>
                    {strain.care.pestResistance}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Krankheiten:</span>
                  <span className={getResistanceColor(strain.care.diseaseResistance)}>
                    {strain.care.diseaseResistance}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Schimmel:</span>
                  <span className={getResistanceColor(strain.care.moldResistance)}>
                    {strain.care.moldResistance}
                  </span>
                </div>
              </div>
            </div>

            {/* Care Tips */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Pflegetipps</h4>
              <div className="text-xs text-gray-600">
                <div className="mb-1">
                  <strong>Bewässerung:</strong> {strain.care.watering.frequency}
                </div>
                {strain.care.watering.tips.length > 0 && (
                  <div className="text-gray-500 italic">
                    "{strain.care.watering.tips[0]}"
                  </div>
                )}
              </div>
            </div>

            {/* Price and Availability */}
            <div className="flex justify-between text-xs">
              <span className={`px-2 py-1 rounded-full ${
                strain.metadata.priceRange === 'budget' ? 'bg-green-100 text-green-800' :
                strain.metadata.priceRange === 'mid' ? 'bg-yellow-100 text-yellow-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {strain.metadata.priceRange === 'budget' ? 'Günstig' :
                 strain.metadata.priceRange === 'mid' ? 'Mittel' : 'Premium'}
              </span>
              <span className={`px-2 py-1 rounded-full ${
                strain.metadata.availability === 'common' ? 'bg-green-100 text-green-800' :
                strain.metadata.availability === 'rare' ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              }`}>
                {strain.metadata.availability === 'common' ? 'Verfügbar' :
                 strain.metadata.availability === 'rare' ? 'Selten' : 'Limitiert'}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
