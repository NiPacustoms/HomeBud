'use client'

import React, { useState } from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/navigation/Sidebar'
import BackButton from '@/components/ui/BackButton'
import AnimatedBackground, { FloatingIcons } from '@/components/landing/AnimatedBackground'
import GrowCalendar from '@/components/planner/GrowCalendar'
import { mockGrowCycles, mockCalendarNotes, mockGrowthPhases, CalendarNote, GrowthPhase } from '@/components/planner/mockData'



export default function PlannerPage() {



  const [activeTab, setActiveTab] = useState<'overview' | 'cycles' | 'tasks' | 'calendar'>('overview')
  const [calendarNotes, setCalendarNotes] = useState<CalendarNote[]>(mockCalendarNotes)
  const [growthPhases, setGrowthPhases] = useState<GrowthPhase[]>(mockGrowthPhases)

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'planning': return 'from-gray-500 to-gray-600'
      case 'seedling': return 'from-blue-500 to-cyan-600'
      case 'vegetative': return 'from-green-500 to-emerald-600'
      case 'flowering': return 'from-purple-500 to-pink-600'
      case 'harvest': return 'from-yellow-500 to-orange-600'
      case 'completed': return 'from-green-600 to-emerald-700'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getStageName = (stage: string) => {
    switch (stage) {
      case 'planning': return 'Planung'
      case 'seedling': return 'Keimling'
      case 'vegetative': return 'Vegetativ'
      case 'flowering': return 'Blüte'
      case 'harvest': return 'Ernte'
      case 'completed': return 'Abgeschlossen'
      default: return stage
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'from-green-500 to-emerald-600'
      case 'medium': return 'from-yellow-500 to-orange-600'
      case 'high': return 'from-red-500 to-pink-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'watering': return '💧'
      case 'nutrients': return '🌿'
      case 'pruning': return '✂️'
      case 'monitoring': return '📊'
      case 'other': return '📝'
      default: return '📋'
    }
  }

  const getNoteColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500'
      case 'green': return 'bg-green-500'
      case 'yellow': return 'bg-yellow-500'
      case 'red': return 'bg-red-500'
      case 'purple': return 'bg-purple-500'
      case 'gray': return 'bg-gray-500'
      default: return 'bg-blue-500'
    }
  }



  const handleCreateCycle = () => {
    
  }

  const handleNoteSave = (noteData: Omit<CalendarNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: CalendarNote = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setCalendarNotes(prev => [...prev, newNote])
  }

  const handleNoteDelete = (noteId: string) => {
    setCalendarNotes(prev => prev.filter(note => note.id !== noteId))
  }

  const handlePhaseSave = (phases: Omit<GrowthPhase, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    const newPhases: GrowthPhase[] = phases.map(phase => ({
      ...phase,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))
    setGrowthPhases(prev => [...prev, ...newPhases])
  }

  const upcomingTasks = mockGrowCycles
    .flatMap(cycle => cycle.tasks)
    .filter(task => !task.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-t from-emerald-600/30 to-black text-white">
      {/* Animated Backgrounds */}
      <AnimatedBackground />
      <FloatingIcons />
      
      <Sidebar />
      
      {/* Main Content */}
      <div className="pl-64 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <BackButton href="/dashboard" />
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Grow-Planer 📅
              </h1>
              <p className="text-white/60 text-lg">
                Planen und verwalten Sie Ihre Grow-Zyklen systematisch.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateCycle}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Neuer Zyklus</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-1">
            {[
              { id: 'overview', label: 'Übersicht', icon: '📊' },
              { id: 'cycles', label: 'Grow-Zyklen', icon: '🌱' },
              { id: 'tasks', label: 'Aufgaben', icon: '📋' },
              { id: 'calendar', label: 'Kalender', icon: '📅' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Stats Overview */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-6"
              >
                {[
                  { label: 'Aktive Zyklen', value: mockGrowCycles.filter(c => c.stage !== 'completed').length, color: 'from-green-500 to-emerald-600' },
                  { label: 'Offene Aufgaben', value: upcomingTasks.length, color: 'from-blue-500 to-cyan-600' },
                  { label: 'Kalender-Notizen', value: calendarNotes.length, color: 'from-purple-500 to-pink-600' },
                  { label: 'Wachstumsphasen', value: growthPhases.length, color: 'from-orange-500 to-red-600' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className={`bg-gradient-to-r ${stat.color} p-6 rounded-2xl text-white`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  >
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-white/80">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Active Cycles */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Aktive Grow-Zyklen</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockGrowCycles.filter(c => c.stage !== 'completed').map((cycle, index) => (
                    <motion.div
                      key={cycle.id}
                      whileHover={{ y: -4, scale: 1.02 }}

                      className="bg-white/5 border border-white/10 rounded-xl p-6 cursor-pointer hover:bg-white/10 transition-all duration-300"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">{cycle.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStageColor(cycle.stage)} text-white`}>
                          {getStageName(cycle.stage)}
                        </span>
                      </div>
                      
                      <p className="text-white/60 mb-4">{cycle.plantName}</p>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-white/60 mb-2">
                          <span>Fortschritt</span>
                          <span>{cycle.progress}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${getStageColor(cycle.stage)}`}
                            style={{ width: `${cycle.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm text-white/60">
                        <span>Start: {new Date(cycle.startDate).toLocaleDateString('de-DE')}</span>
                        <span>Ende: {new Date(cycle.endDate).toLocaleDateString('de-DE')}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Upcoming Tasks */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Nächste Aufgaben</h2>
                {upcomingTasks.length === 0 ? (
                  <div className="text-center py-8 text-white/40">
                    <div className="text-4xl mb-4">✅</div>
                    <p>Alle Aufgaben sind erledigt!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingTasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                        className="flex items-center space-x-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300"
                      >
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getPriorityColor(task.priority)}`}></div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-lg">{getCategoryIcon(task.category)}</span>
                            <h4 className="font-medium text-white">{task.title}</h4>
                          </div>
                          <p className="text-white/60 text-sm">{task.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-white/60">
                            {new Date(task.dueDate).toLocaleDateString('de-DE')}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getPriorityColor(task.priority)} text-white`}>
                            {task.priority === 'high' ? 'Hoch' : task.priority === 'medium' ? 'Mittel' : 'Niedrig'}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Recent Notes */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Aktuelle Notizen</h2>
                {calendarNotes.length === 0 ? (
                  <div className="text-center py-8 text-white/40">
                    <div className="text-4xl mb-4">📝</div>
                    <p>Noch keine Notizen vorhanden.</p>
                    <p className="text-sm mt-2">Klicken Sie auf "Notiz" im Kalender, um eine neue Notiz zu erstellen.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {calendarNotes.slice(0, 3).map((note, index) => (
                      <motion.div
                        key={note.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                        className="flex items-center space-x-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300"
                      >
                        <div className={`w-3 h-3 rounded-full ${getNoteColor(note.color)}`}></div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-lg">📝</span>
                            <h4 className="font-medium text-white">{note.title}</h4>
                          </div>
                          <p className="text-white/60 text-sm">{note.content}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-white/60">
                            {new Date(note.date).toLocaleDateString('de-DE')}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            note.priority === 'high' ? 'bg-red-500' : 
                            note.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          } text-white`}>
                            {note.priority === 'high' ? 'Hoch' : note.priority === 'medium' ? 'Mittel' : 'Niedrig'}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Growth Phases Overview */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Aktuelle Wachstumsphasen</h2>
                {growthPhases.length === 0 ? (
                  <div className="text-center py-8 text-white/40">
                    <div className="text-4xl mb-4">🌱</div>
                    <p>Noch keine Wachstumsphasen geplant.</p>
                    <p className="text-sm mt-2">Klicken Sie auf "Phasen" im Kalender, um Wachstumsphasen zu planen.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {growthPhases.slice(0, 3).map((phase, index) => {
                      const cycle = mockGrowCycles.find(c => c.id === phase.cycleId)
                      return (
                        <motion.div
                          key={phase.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                          className="flex items-center space-x-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300"
                        >
                          <div className={`w-3 h-3 rounded-full ${getStageColor(phase.stage)}`}></div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-lg">🌱</span>
                              <h4 className="font-medium text-white">{getStageName(phase.stage)}</h4>
                            </div>
                            <p className="text-white/60 text-sm">{cycle?.name} - {cycle?.plantName}</p>
                            {phase.notes && (
                              <p className="text-white/80 text-sm mt-1">{phase.notes}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-white/60">
                              {new Date(phase.startDate).toLocaleDateString('de-DE')} - {new Date(phase.endDate).toLocaleDateString('de-DE')}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(phase.stage)} text-white`}>
                              {getStageName(phase.stage)}
                            </span>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'cycles' && (
            <motion.div
              key="cycles"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Alle Grow-Zyklen</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreateCycle}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                >
                  Neuer Zyklus
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockGrowCycles.map((cycle, index) => (
                  <motion.div
                    key={cycle.id}
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 transition-all duration-300"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">{cycle.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStageColor(cycle.stage)} text-white`}>
                        {getStageName(cycle.stage)}
                      </span>
                    </div>
                    
                    <p className="text-white/60 mb-4">{cycle.plantName}</p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-white/60 mb-2">
                        <span>Fortschritt</span>
                        <span>{cycle.progress}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${getStageColor(cycle.stage)}`}
                          style={{ width: `${cycle.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-white/60">
                      <div className="flex justify-between">
                        <span>Start:</span>
                        <span>{new Date(cycle.startDate).toLocaleDateString('de-DE')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ende:</span>
                        <span>{new Date(cycle.endDate).toLocaleDateString('de-DE')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Aufgaben:</span>
                        <span>{cycle.tasks.length}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'tasks' && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white">Alle Aufgaben</h2>
              
              <div className="space-y-4">
                {mockGrowCycles.flatMap(cycle => 
                  cycle.tasks.map(task => ({ ...task, cycleName: cycle.name }))
                ).map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getCategoryIcon(task.category)}</span>
                        <div>
                          <h3 className="font-semibold text-white">{task.title}</h3>
                          <p className="text-white/60 text-sm">{task.cycleName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getPriorityColor(task.priority)} text-white`}>
                          {task.priority === 'high' ? 'Hoch' : task.priority === 'medium' ? 'Mittel' : 'Niedrig'}
                        </span>
                        <span className="text-white/40 text-sm">
                          {new Date(task.dueDate).toLocaleDateString('de-DE')}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-white/80 mb-4">{task.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`task-${task.id}`}
                          checked={task.completed}
                          onChange={() => {}}
                          className="w-4 h-4 text-green-500 bg-white/10 border-white/20 rounded focus:ring-green-500 focus:ring-2"
                          aria-label={`Aufgabe ${task.title} als erledigt markieren`}
                        />
                        <span className="text-sm text-white/60">
                          {task.completed ? 'Erledigt' : 'Offen'}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="text-green-400 hover:text-green-300 text-sm font-medium"
                      >
                        Bearbeiten
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <GrowCalendar 
                growCycles={mockGrowCycles}
                calendarNotes={calendarNotes}
                growthPhases={growthPhases}
                onTaskClick={(task) => {
                  console.log('Task clicked:', task)
                  // Hier könnte eine Modal oder Detailansicht geöffnet werden
                }}
                onCycleClick={(cycle) => {
                  console.log('Cycle clicked:', cycle)
                  // Hier könnte eine Modal oder Detailansicht geöffnet werden
                }}
                onNoteSave={handleNoteSave}
                onNoteDelete={handleNoteDelete}
                onPhaseSave={handlePhaseSave}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
