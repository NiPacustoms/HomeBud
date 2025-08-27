'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/navigation/Sidebar';
import AnimatedBackground, { FloatingIcons } from '@/components/landing/AnimatedBackground';
import DashboardCore from '@/components/dashboard/DashboardCore';

export default function DashboardCorePage() {
  // Mock-Daten für die Dashboard-Kernansicht
  const mockGrowProject = {
    id: 'project-1',
    strainName: 'Northern Lights Auto',
    phase: 'flowering' as const,
    phaseProgress: 65,
    startDate: new Date('2024-01-15'),
    estimatedHarvest: new Date('2024-03-15'),
    plantCount: 4
  };

  const mockMonitoringValues = [
    {
      id: 'temperature',
      label: 'Temperatur',
      value: 24.5,
      unit: '°C',
      target: { min: 20, max: 28, optimal: { min: 22, max: 26 } },
      status: 'good' as const,
      icon: '🌡️',
      lastUpdated: new Date()
    },
    {
      id: 'humidity',
      label: 'Luftfeuchtigkeit',
      value: 58,
      unit: '%',
      target: { min: 40, max: 70, optimal: { min: 50, max: 65 } },
      status: 'good' as const,
      icon: '💧',
      lastUpdated: new Date()
    },
    {
      id: 'ppfd',
      label: 'PPFD',
      value: 650,
      unit: 'μmol/m²/s',
      target: { min: 400, max: 1000, optimal: { min: 600, max: 800 } },
      status: 'good' as const,
      icon: '💡',
      lastUpdated: new Date()
    },
    {
      id: 'vpd',
      label: 'VPD',
      value: 1.2,
      unit: 'kPa',
      target: { min: 0.8, max: 1.6, optimal: { min: 1.0, max: 1.4 } },
      status: 'good' as const,
      icon: '🌡️',
      lastUpdated: new Date()
    },
    {
      id: 'ph',
      label: 'pH-Wert',
      value: 6.1,
      unit: '',
      target: { min: 5.5, max: 6.5, optimal: { min: 5.8, max: 6.2 } },
      status: 'good' as const,
      icon: '🧪',
      lastUpdated: new Date()
    },
    {
      id: 'co2',
      label: 'CO₂',
      value: 850,
      unit: 'ppm',
      target: { min: 400, max: 1200, optimal: { min: 800, max: 1000 } },
      status: 'good' as const,
      icon: '🌬️',
      lastUpdated: new Date()
    }
  ];

  const mockTodoItems = [
    {
      id: 'todo-1',
      title: 'pH-Wert messen',
      description: 'Tägliche pH-Kontrolle der Nährlösung',
      dueDate: new Date(),
      priority: 'high' as const,
      category: 'monitoring',
      completed: false
    },
    {
      id: 'todo-2',
      title: 'Mykorrhiza-Dosierung',
      description: 'Wöchentliche Mykorrhiza-Anwendung',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      priority: 'medium' as const,
      category: 'biological',
      completed: false
    },
    {
      id: 'todo-3',
      title: 'Tissue Culture Subkultur',
      description: 'Klone in neue Petrischalen übertragen',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      priority: 'critical' as const,
      category: 'tissue-culture',
      completed: false
    },
    {
      id: 'todo-4',
      title: 'Lichtintensität erhöhen',
      description: 'PPFD um 10% erhöhen für besseres Wachstum',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      priority: 'medium' as const,
      category: 'lighting',
      completed: false
    },
    {
      id: 'todo-5',
      title: 'Fotos machen',
      description: 'Wöchentliche Dokumentation des Wachstums',
      dueDate: new Date(),
      priority: 'low' as const,
      category: 'documentation',
      completed: true
    }
  ];

  const mockKIRecommendations = [
    {
      id: 'rec-1',
      message: 'Erhöhe PPFD um 10%',
      action: 'Lichtintensität von 650 auf 715 μmol/m²/s erhöhen',
      priority: 'medium' as const,
      category: 'lighting'
    },
    {
      id: 'rec-2',
      message: 'pH leicht senken',
      action: 'pH-Wert von 6.1 auf 5.9 reduzieren für optimale Nährstoffaufnahme',
      priority: 'high' as const,
      category: 'nutrients'
    },
    {
      id: 'rec-3',
      message: 'VPD optimieren',
      action: 'Luftfeuchtigkeit auf 55% reduzieren für bessere Transpiration',
      priority: 'low' as const,
      category: 'climate'
    }
  ];

  const mockPerformanceData = {
    yieldForecast: 85, // g/Pflanze
    growthRate: 2.3, // cm/Tag
    height: 45, // cm
    lightDistribution: [
      [85, 90, 95, 100, 95, 90, 85, 80],
      [80, 85, 90, 95, 90, 85, 80, 75],
      [75, 80, 85, 90, 85, 80, 75, 70],
      [70, 75, 80, 85, 80, 75, 70, 65],
      [65, 70, 75, 80, 75, 70, 65, 60],
      [60, 65, 70, 75, 70, 65, 60, 55],
      [55, 60, 65, 70, 65, 60, 55, 50],
      [50, 55, 60, 65, 60, 55, 50, 45]
    ]
  };

  const mockPhotos = [
    {
      id: 'photo-1',
      url: '/mock-photo-1.jpg',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      note: 'Tag 45 - Blüte beginnt'
    },
    {
      id: 'photo-2',
      url: '/mock-photo-2.jpg',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      note: 'Tag 42 - Trichome sichtbar'
    },
    {
      id: 'photo-3',
      url: '/mock-photo-3.jpg',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      note: 'Tag 40 - Wachstum stabil'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-t from-emerald-600/30 to-black text-white">
      {/* Animated Backgrounds */}
      <AnimatedBackground />
      <FloatingIcons />
      
      <Sidebar />
      
      {/* Main Content */}
      <div className="pl-0 lg:pl-64 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Dashboard-Kernansicht
          </h1>
          <p className="text-white/70 text-lg">
            Zentrale Steuerzentrale mit den wichtigsten täglichen Informationen
          </p>
        </motion.div>

        {/* Dashboard Core Component */}
        <DashboardCore
          growProject={mockGrowProject}
          monitoringValues={mockMonitoringValues}
          todoItems={mockTodoItems}
          kiRecommendations={mockKIRecommendations}
          performanceData={mockPerformanceData}
          photos={mockPhotos}
        />
      </div>
    </div>
  );
}
