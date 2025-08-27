'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import WeekView from './WeekView'
import DayView from './DayView'
import CalendarNoteModal from './CalendarNoteModal'
import PhasePlanningModal from './PhasePlanningModal'

interface GrowCycle {
  id: string
  name: string
  plantName: string
  startDate: string
  endDate: string
  stage: 'planning' | 'seedling' | 'vegetative' | 'flowering' | 'harvest' | 'completed'
  progress: number
  tasks: Task[]
  notes: string
}

interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: 'watering' | 'nutrients' | 'pruning' | 'monitoring' | 'other'
}

interface CalendarNote {
  id: string
  date: string
  title: string
  content: string
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
}

interface GrowthPhase {
  id: string
  cycleId: string
  stage: 'planning' | 'seedling' | 'vegetative' | 'flowering' | 'harvest' | 'completed'
  startDate: string
  endDate: string
  notes: string
  createdAt: string
  updatedAt: string
}

interface GrowCalendarProps {
  growCycles: GrowCycle[]
  calendarNotes?: CalendarNote[]
  growthPhases?: GrowthPhase[]
  onTaskClick?: (task: Task) => void
  onCycleClick?: (cycle: GrowCycle) => void
  onNoteSave?: (note: Omit<CalendarNote, 'id' | 'createdAt' | 'updatedAt'>) => void
  onNoteDelete?: (noteId: string) => void
  onPhaseSave?: (phases: Omit<GrowthPhase, 'id' | 'createdAt' | 'updatedAt'>[]) => void
}

export default function GrowCalendar({ 
  growCycles, 
  calendarNotes = [], 
  growthPhases = [],
  onTaskClick, 
  onCycleClick, 
  onNoteSave, 
  onNoteDelete,
  onPhaseSave
}: GrowCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [isPhaseModalOpen, setIsPhaseModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedNote, setSelectedNote] = useState<CalendarNote | null>(null)

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'planning': return 'bg-gray-500'
      case 'seedling': return 'bg-blue-500'
      case 'vegetative': return 'bg-green-500'
      case 'flowering': return 'bg-purple-500'
      case 'harvest': return 'bg-yellow-500'
      case 'completed': return 'bg-green-600'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'border-green-500'
      case 'medium': return 'border-yellow-500'
      case 'high': return 'border-red-500'
      default: return 'border-gray-500'
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

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setSelectedNote(null)
    setIsNoteModalOpen(true)
  }

  const handleNoteClick = (note: CalendarNote, event: React.MouseEvent) => {
    event.stopPropagation()
    setSelectedDate(new Date(note.date))
    setSelectedNote(note)
    setIsNoteModalOpen(true)
  }

  const handleNoteSave = (noteData: Omit<CalendarNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (onNoteSave) {
      onNoteSave(noteData)
    }
  }

  const handleNoteDelete = (noteId: string) => {
    if (onNoteDelete) {
      onNoteDelete(noteId)
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

  // Kalender-Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Kalender-Daten generieren
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const currentDay = new Date(startDate)
    
    while (currentDay <= lastDay || days.length < 42) {
      days.push(new Date(currentDay))
      currentDay.setDate(currentDay.getDate() + 1)
    }
    
    return days
  }, [currentDate])

  // Events für einen bestimmten Tag finden
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    const events = []

    // Grow-Zyklen finden
    growCycles.forEach(cycle => {
      const startDate = new Date(cycle.startDate)
      const endDate = new Date(cycle.endDate)
      
      if (date >= startDate && date <= endDate) {
        events.push({
          type: 'cycle',
          data: cycle,
          color: getStageColor(cycle.stage),
          title: `${cycle.name} (${getStageName(cycle.stage)})`
        })
      }
    })

    // Aufgaben finden
    growCycles.forEach(cycle => {
      cycle.tasks.forEach(task => {
        const taskDate = new Date(task.dueDate)
        if (taskDate.toDateString() === date.toDateString()) {
          events.push({
            type: 'task',
            data: task,
            cycleName: cycle.name,
            color: getPriorityColor(task.priority),
            icon: getCategoryIcon(task.category),
            title: task.title
          })
        }
      })
    })

    // Notizen finden
    calendarNotes.forEach(note => {
      if (note.date === dateStr) {
        events.push({
          type: 'note',
          data: note,
          color: getNoteColor(note.color),
          title: note.title
        })
      }
    })

    // Wachstumsphasen finden
    growthPhases.forEach(phase => {
      const phaseStart = new Date(phase.startDate)
      const phaseEnd = new Date(phase.endDate)
      
      if (date >= phaseStart && date <= phaseEnd) {
        const cycle = growCycles.find(c => c.id === phase.cycleId)
        events.push({
          type: 'phase',
          data: phase,
          cycleName: cycle?.name || 'Unbekannter Zyklus',
          color: getStageColor(phase.stage),
          title: `${getStageName(phase.stage)} - ${cycle?.plantName || ''}`
        })
      }
    })

    return events
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  return (
    <div className="space-y-6">
      {/* Kalender-Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-white">
            {viewMode === 'month' && currentDate.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
            {viewMode === 'week' && `Woche ${Math.ceil((currentDate.getDate() + new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()) / 7)}`}
            {viewMode === 'day' && currentDate.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h2>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={viewMode === 'month' ? goToPreviousMonth : () => {
                const newDate = new Date(currentDate)
                if (viewMode === 'week') {
                  newDate.setDate(newDate.getDate() - 7)
                } else if (viewMode === 'day') {
                  newDate.setDate(newDate.getDate() - 1)
                }
                setCurrentDate(newDate)
              }}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={viewMode === 'month' ? goToNextMonth : () => {
                const newDate = new Date(currentDate)
                if (viewMode === 'week') {
                  newDate.setDate(newDate.getDate() + 7)
                } else if (viewMode === 'day') {
                  newDate.setDate(newDate.getDate() + 1)
                }
                setCurrentDate(newDate)
              }}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex space-x-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-1">
            {[
              { id: 'month', label: 'Monat' },
              { id: 'week', label: 'Woche' },
              { id: 'day', label: 'Tag' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 ${
                  viewMode === mode.id
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToToday}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
          >
            Heute
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedDate(new Date())
              setSelectedNote(null)
              setIsNoteModalOpen(true)
            }}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Notiz</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPhaseModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Phasen</span>
          </motion.button>
        </div>
      </div>

      {/* Kalender-Inhalt basierend auf Ansicht */}
      {viewMode === 'month' && (
        <>
          {/* Monatsansicht */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            {/* Wochentage-Header */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'].map((day) => (
                <div key={day} className="text-center py-2 text-white/60 font-medium">
                  {day}
                </div>
              ))}
            </div>

            {/* Kalender-Tage */}
            <div className="grid grid-cols-7 gap-1">
              {calendarData.map((date, index) => {
                const events = getEventsForDate(date)
                const isCurrentMonthDay = isCurrentMonth(date)
                const isTodayDate = isToday(date)

                return (
                                <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleDateClick(date)}
                className={`min-h-[120px] p-2 border border-white/5 rounded-lg transition-all duration-300 cursor-pointer ${
                  isCurrentMonthDay ? 'bg-white/5' : 'bg-white/2'
                } ${isTodayDate ? 'ring-2 ring-green-500' : ''} hover:bg-white/10`}
              >
                    <div className={`text-sm font-medium mb-2 ${
                      isCurrentMonthDay ? 'text-white' : 'text-white/40'
                    } ${isTodayDate ? 'text-green-400 font-bold' : ''}`}>
                      {date.getDate()}
                    </div>

                    <div className="space-y-1">
                                        {events.slice(0, 3).map((event, eventIndex) => (
                    <motion.div
                      key={eventIndex}
                      whileHover={{ scale: 1.05 }}
                      onClick={(e) => {
                        if (event.type === 'task' && onTaskClick) {
                          onTaskClick(event.data)
                        } else if (event.type === 'cycle' && onCycleClick) {
                          onCycleClick(event.data)
                        } else if (event.type === 'note') {
                          handleNoteClick(event.data, e)
                        }
                      }}
                      className={`text-xs p-1 rounded cursor-pointer transition-all duration-300 ${
                        event.type === 'cycle' 
                          ? `${event.color} text-white` 
                          : event.type === 'note'
                          ? `${event.color} text-white`
                          : event.type === 'phase'
                          ? `${event.color} text-white`
                          : `bg-white/10 border-l-2 ${event.color} text-white`
                      }`}
                      title={event.title}
                    >
                      {event.type === 'task' && (
                        <span className="mr-1">{event.icon}</span>
                      )}
                      {event.type === 'note' && (
                        <span className="mr-1">📝</span>
                      )}
                      {event.type === 'phase' && (
                        <span className="mr-1">🌱</span>
                      )}
                      <span className="truncate block">
                        {event.type === 'cycle' 
                          ? event.data.plantName 
                          : event.title
                        }
                      </span>
                    </motion.div>
                  ))}
                      
                      {events.length > 3 && (
                        <div className="text-xs text-white/60 text-center">
                          +{events.length - 3} weitere
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Legende */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Legende</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="text-white/80 font-medium mb-2">Grow-Zyklen</h4>
                <div className="space-y-2">
                  {[
                    { stage: 'planning', name: 'Planung' },
                    { stage: 'seedling', name: 'Keimling' },
                    { stage: 'vegetative', name: 'Vegetativ' },
                    { stage: 'flowering', name: 'Blüte' },
                    { stage: 'harvest', name: 'Ernte' },
                    { stage: 'completed', name: 'Abgeschlossen' }
                  ].map((item) => (
                    <div key={item.stage} className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded ${getStageColor(item.stage)}`}></div>
                      <span className="text-white/60 text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-white/80 font-medium mb-2">Aufgaben-Priorität</h4>
                <div className="space-y-2">
                  {[
                    { priority: 'low', name: 'Niedrig' },
                    { priority: 'medium', name: 'Mittel' },
                    { priority: 'high', name: 'Hoch' }
                  ].map((item) => (
                    <div key={item.priority} className="flex items-center space-x-2">
                      <div className={`w-3 h-3 border-l-2 ${getPriorityColor(item.priority)}`}></div>
                      <span className="text-white/60 text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white/80 font-medium mb-2">Notizen</h4>
                <div className="space-y-2">
                  {[
                    { color: 'blue', name: 'Blau' },
                    { color: 'green', name: 'Grün' },
                    { color: 'yellow', name: 'Gelb' },
                    { color: 'red', name: 'Rot' },
                    { color: 'purple', name: 'Lila' },
                    { color: 'gray', name: 'Grau' }
                  ].map((item) => (
                    <div key={item.color} className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded ${getNoteColor(item.color)}`}></div>
                      <span className="text-white/60 text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {viewMode === 'week' && (
        <WeekView 
          growCycles={growCycles}
          currentDate={currentDate}
          onTaskClick={onTaskClick}
          onCycleClick={onCycleClick}
        />
      )}

      {viewMode === 'day' && (
        <DayView 
          growCycles={growCycles}
          currentDate={currentDate}
          onTaskClick={onTaskClick}
          onCycleClick={onCycleClick}
        />
      )}

      {/* Notiz-Modal */}
      <CalendarNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        selectedDate={selectedDate}
        existingNote={selectedNote}
        onSave={handleNoteSave}
        onDelete={handleNoteDelete}
      />

      {/* Phasen-Modal */}
      <PhasePlanningModal
        isOpen={isPhaseModalOpen}
        onClose={() => setIsPhaseModalOpen(false)}
        growCycles={growCycles}
        onSave={(phases) => {
          if (onPhaseSave) {
            onPhaseSave(phases)
          }
        }}
      />
    </div>
  )
}
