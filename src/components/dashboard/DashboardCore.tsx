'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ValueVisualization from '../ui/ValueVisualization';
import ActionRecommendations from '../ui/ActionRecommendations';
import { FieldHelp } from '../ui/HelpSystem';
import { ClientOnly } from '../ui/ClientOnly';

// Client-seitige Komponente für Zeitstempel
function TimeDisplay({ date }: { date: Date }) {
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    setTimeString(date.toLocaleTimeString('de-DE'));
  }, [date]);

  return <span>{timeString}</span>;
}

// Client-seitige Komponente für Datums-Anzeigen
function DateDisplay({ date }: { date: Date }) {
  const [dateString, setDateString] = useState('');

  useEffect(() => {
    setDateString(date.toLocaleDateString('de-DE'));
  }, [date]);

  return <span>{dateString}</span>;
}

interface GrowProject {
  id: string;
  strainName: string;
  phase: 'seedling' | 'vegetative' | 'flowering' | 'harvest';
  phaseProgress: number;
  startDate: Date;
  estimatedHarvest: Date;
  plantCount: number;
}

interface MonitoringValue {
  id: string;
  label: string;
  value: number;
  unit: string;
  target: { min: number; max: number; optimal?: { min: number; max: number } };
  status: 'good' | 'warning' | 'error' | 'neutral';
  icon: string;
  lastUpdated: Date;
}

interface TodoItem {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  completed: boolean;
}

interface KIRecommendation {
  id: string;
  message: string;
  action: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

interface PerformanceData {
  yieldForecast: number; // g/Pflanze
  growthRate: number; // cm/Tag
  height: number; // cm
  lightDistribution: number[][]; // Heatmap-Daten
}

interface PhotoEntry {
  id: string;
  url: string;
  date: Date;
  note?: string;
}

interface DashboardCoreProps {
  growProject: GrowProject;
  monitoringValues: MonitoringValue[];
  todoItems: TodoItem[];
  kiRecommendations: KIRecommendation[];
  performanceData: PerformanceData;
  photos: PhotoEntry[];
}

export default function DashboardCore({
  growProject,
  monitoringValues,
  todoItems,
  kiRecommendations,
  performanceData,
  photos
}: DashboardCoreProps) {
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  const getPhaseName = (phase: string) => {
    switch (phase) {
      case 'seedling': return 'Keimling';
      case 'vegetative': return 'Wachstum';
      case 'flowering': return 'Blüte';
      case 'harvest': return 'Ernte';
      default: return phase;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'seedling': return 'from-green-500 to-emerald-600';
      case 'vegetative': return 'from-blue-500 to-cyan-600';
      case 'flowering': return 'from-purple-500 to-pink-600';
      case 'harvest': return 'from-amber-500 to-orange-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  const handleTodoToggle = (todoId: string) => {
    // TODO: Implement todo toggle logic
    console.log('Toggle todo:', todoId);
  };

  const handleQuickAction = (action: string) => {
    // TODO: Implement quick action logic
    console.log('Quick action:', action);
  };

  const handlePhotoUpload = () => {
    setShowPhotoUpload(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. Projektübersicht */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">🌱 Aktuelles Grow-Projekt</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getPhaseColor(growProject.phase)} text-white`}>
            {getPhaseName(growProject.phase)}
          </span>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">{growProject.strainName}</h3>
            <p className="text-white/70 text-sm">
              {growProject.plantCount} Pflanzen • Gestartet <ClientOnly fallback="--.--.----"><DateDisplay date={growProject.startDate} /></ClientOnly>
            </p>
          </div>
          
          <div>
            <div className="flex justify-between text-sm text-white/70 mb-2">
              <span>Fortschritt {getPhaseName(growProject.phase)}</span>
              <span>{growProject.phaseProgress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <motion.div
                className={`h-3 rounded-full bg-gradient-to-r ${getPhaseColor(growProject.phase)}`}
                initial={{ width: 0 }}
                animate={{ width: `${growProject.phaseProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Echtzeit-Monitoring-Kacheln */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4">📊 Echtzeit-Monitoring</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {monitoringValues.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 border border-white/10 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium text-white">{item.label}</span>
                </div>
                <FieldHelp 
                  content={`Zielbereich: ${item.target.min}-${item.target.max}${item.unit}`}
                  title={item.label}
                >
                  <span className="text-white/50 text-xs">ⓘ</span>
                </FieldHelp>
              </div>
              
              <div className="text-2xl font-bold text-white mb-2">
                {item.value}{item.unit}
              </div>
              
              <ValueVisualization
                value={item.value}
                range={item.target}
                unit={item.unit}
                label=""
                size="small"
                showBar={true}
                showStatus={false}
              />
              
              <div className="text-xs text-white/50 mt-2">
                Letzte Aktualisierung: <ClientOnly fallback="--:--:--"><TimeDisplay date={item.lastUpdated} /></ClientOnly>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 3. To-Do & Erinnerungen */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4">✅ To-Do & Erinnerungen</h2>
        <div className="space-y-3">
          {todoItems.slice(0, 5).map((todo) => (
            <motion.div
              key={todo.id}
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleTodoToggle(todo.id)}
                  className="w-5 h-5 text-green-600 bg-white/10 border-white/20 rounded focus:ring-green-500 focus:ring-2"
                  aria-label={`Aufgabe "${todo.title}" als erledigt markieren`}
                />
                <div>
                  <h4 className={`font-medium ${todo.completed ? 'line-through text-white/50' : 'text-white'}`}>
                    {todo.title}
                  </h4>
                  <p className="text-sm text-white/70">{todo.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-white/50">
                  <ClientOnly fallback="--.--.----"><DateDisplay date={todo.dueDate} /></ClientOnly>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  todo.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                  todo.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                  todo.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {todo.priority}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 4. Modul-Quicklinks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4">🚀 Schnellzugriff</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { id: 'strain-db', name: 'Strain-DB', icon: '🌿', action: 'strain-search' },
            { id: 'diagnosis', name: 'Diagnose', icon: '🔍', action: 'diagnosis' },
            { id: 'planner', name: 'Planner', icon: '📅', action: 'planner' },
            { id: 'mycorrhiza', name: 'Mykorrhiza', icon: '🍄', action: 'mycorrhiza' },
            { id: 'tissue-culture', name: 'Tissue Culture', icon: '🧬', action: 'tissue-culture' },
            { id: 'analytics', name: 'Analytics', icon: '📊', action: 'analytics' }
          ].map((module) => (
            <motion.button
              key={module.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickAction(module.action)}
              className="flex flex-col items-center space-y-2 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
            >
              <span className="text-2xl">{module.icon}</span>
              <span className="text-sm font-medium text-white">{module.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* 5. KI-Empfehlungen */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4">🤖 KI-Empfehlungen</h2>
        <div className="space-y-3">
          {kiRecommendations.slice(0, 3).map((rec) => (
            <motion.div
              key={rec.id}
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">🤖</span>
                <div>
                  <p className="text-white font-medium">{rec.message}</p>
                  <p className="text-sm text-white/70">{rec.action}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                rec.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {rec.priority}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 6. Performance & Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4">📈 Performance & Trends</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Ertragsprognose</h3>
            <div className="text-3xl font-bold text-green-400 mb-1">
              {performanceData.yieldForecast}g
            </div>
            <p className="text-white/70 text-sm">pro Pflanze</p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Wachstumsrate</h3>
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {performanceData.growthRate}cm
            </div>
            <p className="text-white/70 text-sm">pro Tag</p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Aktuelle Höhe</h3>
            <div className="text-3xl font-bold text-purple-400 mb-1">
              {performanceData.height}cm
            </div>
            <p className="text-white/70 text-sm">Durchschnitt</p>
          </div>
        </div>
        
        {/* Heatmap der Lichtverteilung */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">Lichtverteilung</h3>
          <div className="grid grid-cols-8 gap-1">
            {performanceData.lightDistribution.flat().map((value, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded"
                style={{
                  backgroundColor: `rgba(34, 197, 94, ${value / 100})`,
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                title={`${value}% Lichtintensität`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* 7. Foto-Tagebuch */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">📸 Foto-Tagebuch</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePhotoUpload}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            📷 Neues Foto
          </motion.button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {photos.slice(0, 3).map((photo) => (
            <motion.div
              key={photo.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 border border-white/10 rounded-lg overflow-hidden"
            >
              <div className="w-full h-32 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                <span className="text-4xl">📸</span>
              </div>
              <div className="p-3">
                <div className="text-sm text-white/70 mb-1">
                  <ClientOnly fallback="--.--.----"><DateDisplay date={photo.date} /></ClientOnly>
                </div>
                {photo.note && (
                  <p className="text-sm text-white truncate">{photo.note}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
