'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import '../../styles/performance.css'

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

interface DayViewProps {
  growCycles: GrowCycle[]
  currentDate: Date
  onTaskClick?: (task: Task) => void
  onCycleClick?: (cycle: GrowCycle) => void
}

export default function DayView({ growCycles, currentDate, onTaskClick, onCycleClick }: DayViewProps) {
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

  // Events für den aktuellen Tag finden
  const dayEvents = useMemo(() => {
    const events: any[] = []

    // Grow-Zyklen finden
    growCycles.forEach(cycle => {
      const startDate = new Date(cycle.startDate)
      const endDate = new Date(cycle.endDate)
      
      if (currentDate >= startDate && currentDate <= endDate) {
        events.push({
          type: 'cycle',
          data: cycle,
          color: getStageColor(cycle.stage),
          title: `${cycle.name} (${getStageName(cycle.stage)})`,
          time: 'Ganztägig'
        })
      }
    })

    // Aufgaben finden
    growCycles.forEach(cycle => {
      cycle.tasks.forEach(task => {
        const taskDate = new Date(task.dueDate)
        if (taskDate.toDateString() === currentDate.toDateString()) {
          events.push({
            type: 'task',
            data: task,
            cycleName: cycle.name,
            color: getPriorityColor(task.priority),
            icon: getCategoryIcon(task.category),
            title: task.title,
            time: taskDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
          })
        }
      })
    })

    return events.sort((a, b) => {
      if (a.time === 'Ganztägig' && b.time !== 'Ganztägig') return -1
      if (a.time !== 'Ganztägig' && b.time === 'Ganztägig') return 1
      return a.time.localeCompare(b.time)
    })
  }, [growCycles, currentDate])

  const isToday = () => {
    const today = new Date()
    return currentDate.toDateString() === today.toDateString()
  }

  return (
    <div className="space-y-6">
      {/* Tages-Header */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {currentDate.toLocaleDateString('de-DE', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            {isToday() && (
              <span className="text-green-400 text-sm font-medium">Heute</span>
            )}
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">
              {currentDate.getDate()}
            </div>
            <div className="text-white/60">
              {currentDate.toLocaleDateString('de-DE', { month: 'short' })}
            </div>
          </div>
        </div>

        {/* Tages-Statistiken */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {dayEvents.filter(e => e.type === 'task').length}
            </div>
            <div className="text-white/60 text-sm">Aufgaben</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {dayEvents.filter(e => e.type === 'cycle').length}
            </div>
            <div className="text-white/60 text-sm">Aktive Zyklen</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {dayEvents.filter(e => e.type === 'task' && e.data.completed).length}
            </div>
            <div className="text-white/60 text-sm">Erledigt</div>
          </div>
        </div>
      </div>

      {/* Zeitraster */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Tagesablauf</h3>
        
        {dayEvents.length === 0 ? (
          <div className="text-center py-12 text-white/40">
            <div className="text-4xl mb-4">📅</div>
            <p>Keine Events für diesen Tag geplant.</p>
            <p className="text-sm mt-2">Genießen Sie einen ruhigen Tag!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {dayEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  if (event.type === 'task' && onTaskClick) {
                    onTaskClick(event.data)
                  } else if (event.type === 'cycle' && onCycleClick) {
                    onCycleClick(event.data)
                  }
                }}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  event.type === 'cycle' 
                    ? `${event.color} text-white` 
                    : 'bg-white/10 border-l-4 border-white/20 hover:bg-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {event.type === 'task' && (
                      <span className="text-xl">{event.icon}</span>
                    )}
                    <div>
                      <h4 className="font-semibold text-white">{event.title}</h4>
                      {event.type === 'task' && (
                        <p className="text-white/60 text-sm">{event.cycleName}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-white/80">
                      {event.time}
                    </div>
                    {event.type === 'task' && (
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        event.data.completed 
                          ? 'bg-green-500 text-white' 
                          : 'bg-white/20 text-white/60'
                      }`}>
                        {event.data.completed ? 'Erledigt' : 'Offen'}
                      </div>
                    )}
                  </div>
                </div>
                
                {event.type === 'task' && (
                  <p className="text-white/80 text-sm">{event.data.description}</p>
                )}
                
                {event.type === 'cycle' && (
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-white/80 text-sm">
                      Fortschritt: {event.data.progress}%
                    </span>
                    <div className="w-24 bg-white/20 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`progress-bar ${event.color} h-full rounded-full transition-all duration-300`}
                        data-progress={event.data.progress}
                      ></div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Stundenraster */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Stundenübersicht</h3>
        <div className="space-y-2">
          {Array.from({ length: 24 }, (_, hour) => {
            const hourEvents = dayEvents.filter(event => {
              if (event.type === 'task' && event.time !== 'Ganztägig') {
                const eventHour = parseInt(event.time.split(':')[0])
                return eventHour === hour
              }
              return false
            })

            return (
              <div key={hour} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-white/5 transition-colors">
                <div className="w-16 text-sm text-white/60 font-medium">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                <div className="flex-1 flex space-x-2">
                  {hourEvents.map((event, eventIndex) => (
                    <motion.div
                      key={eventIndex}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        if (event.type === 'task' && onTaskClick) {
                          onTaskClick(event.data)
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-xs cursor-pointer ${
                        event.type === 'task' 
                          ? `bg-white/10 border-l-2 ${event.color} text-white` 
                          : `${event.color} text-white`
                      }`}
                      title={event.title}
                    >
                      <span className="mr-1">{event.icon}</span>
                      {event.title}
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
