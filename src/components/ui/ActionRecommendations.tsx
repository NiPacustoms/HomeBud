'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'measurement' | 'maintenance' | 'adjustment' | 'check';
  completed?: boolean;
  dueDate?: string;
  estimatedTime?: string;
}

interface ActionRecommendationsProps {
  items: ActionItem[];
  title?: string;
  showCompleted?: boolean;
  onItemToggle?: (id: string, completed: boolean) => void;
}

export default function ActionRecommendations({
  items,
  title = "Handlungsempfehlungen",
  showCompleted = false,
  onItemToggle
}: ActionRecommendationsProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'critical': return 'Kritisch';
      case 'high': return 'Hoch';
      case 'medium': return 'Mittel';
      case 'low': return 'Niedrig';
      default: return 'Unbekannt';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'measurement': return '📊';
      case 'maintenance': return '🔧';
      case 'adjustment': return '⚙️';
      case 'check': return '✅';
      default: return '📝';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'measurement': return 'Messung';
      case 'maintenance': return 'Wartung';
      case 'adjustment': return 'Anpassung';
      case 'check': return 'Kontrolle';
      default: return 'Aufgabe';
    }
  };

  const filteredItems = showCompleted ? items : items.filter(item => !item.completed);

  if (filteredItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🎉</div>
          <p className="text-gray-600">Alle Aufgaben erledigt!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="space-y-3">
        <AnimatePresence>
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className={`border-l-4 rounded-r-lg p-4 ${getPriorityColor(item.priority)} ${
                item.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <input
                    type="checkbox"
                    checked={item.completed || false}
                    onChange={(e) => onItemToggle?.(item.id, e.target.checked)}
                    className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    aria-label={`Aufgabe "${item.title}" als erledigt markieren`}
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg">{getCategoryIcon(item.category)}</span>
                      <h4 className={`font-medium ${item.completed ? 'line-through' : ''}`}>
                        {item.title}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        item.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {getPriorityText(item.priority)}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {getCategoryText(item.category)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      {item.estimatedTime && (
                        <span>⏱️ {item.estimatedTime}</span>
                      )}
                      {item.dueDate && (
                        <span>📅 {new Date(item.dueDate).toLocaleDateString('de-DE')}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Details anzeigen/verstecken"
                  title="Details anzeigen/verstecken"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <AnimatePresence>
                {expandedItem === item.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 pt-3 border-t border-gray-200"
                  >
                    <div className="text-sm text-gray-700 space-y-2">
                      <div>
                        <strong>Beschreibung:</strong> {item.description}
                      </div>
                      {item.estimatedTime && (
                        <div>
                          <strong>Geschätzte Zeit:</strong> {item.estimatedTime}
                        </div>
                      )}
                      {item.dueDate && (
                        <div>
                          <strong>Fälligkeitsdatum:</strong> {new Date(item.dueDate).toLocaleDateString('de-DE')}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Hilfsfunktion zur Generierung von Handlungsempfehlungen basierend auf Messwerten
export function generateRecommendations(measurements: any): ActionItem[] {
  const recommendations: ActionItem[] = [];

  // Beispiel-Logik für pH-Wert
  if (measurements.ph) {
    if (measurements.ph < 5.5) {
      recommendations.push({
        id: 'ph-low',
        title: 'pH-Wert erhöhen',
        description: 'Der pH-Wert ist zu niedrig. Fügen Sie pH-Up hinzu oder verwenden Sie basische Nährstoffe.',
        priority: 'high',
        category: 'adjustment',
        estimatedTime: '10-15 Min'
      });
    } else if (measurements.ph > 6.5) {
      recommendations.push({
        id: 'ph-high',
        title: 'pH-Wert senken',
        description: 'Der pH-Wert ist zu hoch. Fügen Sie pH-Down hinzu oder verwenden Sie saure Nährstoffe.',
        priority: 'high',
        category: 'adjustment',
        estimatedTime: '10-15 Min'
      });
    }
  }

  // Beispiel-Logik für Temperatur
  if (measurements.temperature) {
    if (measurements.temperature > 30) {
      recommendations.push({
        id: 'temp-high',
        title: 'Temperatur senken',
        description: 'Die Temperatur ist zu hoch. Überprüfen Sie die Belüftung und reduzieren Sie die Heizung.',
        priority: 'critical',
        category: 'adjustment',
        estimatedTime: '30-60 Min'
      });
    } else if (measurements.temperature < 18) {
      recommendations.push({
        id: 'temp-low',
        title: 'Temperatur erhöhen',
        description: 'Die Temperatur ist zu niedrig. Erhöhen Sie die Heizung oder verwenden Sie zusätzliche Wärmequellen.',
        priority: 'high',
        category: 'adjustment',
        estimatedTime: '30-60 Min'
      });
    }
  }

  // Beispiel-Logik für Luftfeuchtigkeit
  if (measurements.humidity) {
    if (measurements.humidity > 80) {
      recommendations.push({
        id: 'humidity-high',
        title: 'Luftfeuchtigkeit reduzieren',
        description: 'Die Luftfeuchtigkeit ist zu hoch. Erhöhen Sie die Belüftung oder verwenden Sie einen Luftentfeuchter.',
        priority: 'high',
        category: 'adjustment',
        estimatedTime: '15-30 Min'
      });
    } else if (measurements.humidity < 40) {
      recommendations.push({
        id: 'humidity-low',
        title: 'Luftfeuchtigkeit erhöhen',
        description: 'Die Luftfeuchtigkeit ist zu niedrig. Verwenden Sie einen Luftbefeuchter oder reduzieren Sie die Belüftung.',
        priority: 'medium',
        category: 'adjustment',
        estimatedTime: '15-30 Min'
      });
    }
  }

  // Regelmäßige Wartungsaufgaben
  recommendations.push({
    id: 'daily-check',
    title: 'Tägliche Kontrolle',
    description: 'Überprüfen Sie alle Messwerte und den allgemeinen Zustand der Pflanzen.',
    priority: 'medium',
    category: 'check',
    estimatedTime: '5-10 Min'
  });

  return recommendations;
}
