'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'

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

interface WeekViewProps {
  growCycles: GrowCycle[]
  currentDate: Date
  onTaskClick?: (task: Task) => void
  onCycleClick?: (cycle: GrowCycle) => void
}

export default function WeekView({ growCycles, currentDate, onTaskClick, onCycleClick }: WeekViewProps) {
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

  // Woche generieren
  const weekData = useMemo(() => {
    const startOfWeek = new Date(currentDate)
    const day = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - day)
    
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(date.getDate() + i)
      days.push(date)
    }
    
    return days
  }, [currentDate])

  // Events für einen bestimmten Tag finden
  const getEventsForDate = (date: Date) => {
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
          title: `${cycle.name} (${cycle.stage})`
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

    return events
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  return (
    <div className="space-y-4">
      {/* Wochen-Header */}
      <div className="grid grid-cols-8 gap-1">
        <div className="p-2"></div> {/* Leerer Header für Zeitraster */}
        {weekData.map((date, index) => (
          <div
            key={index}
            className={`p-2 text-center rounded-lg ${
              isToday(date) 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                : 'bg-white/10 text-white/80'
            }`}
          >
            <div className="text-sm font-medium">
              {date.toLocaleDateString('de-DE', { weekday: 'short' })}
            </div>
            <div className="text-lg font-bold">
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Wochen-Grid */}
      <div className="grid grid-cols-8 gap-1">
        {/* Zeitraster */}
        <div className="space-y-1">
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className="h-12 flex items-center justify-end pr-2 text-xs text-white/40">
              {i.toString().padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* Tage */}
        {weekData.map((date, dayIndex) => {
          const events = getEventsForDate(date)
          
          return (
            <div key={dayIndex} className="space-y-1">
              {Array.from({ length: 24 }, (_, hourIndex) => {
                const hourEvents = events.filter(event => {
                  if (event.type === 'task') {
                    const taskDate = new Date(event.data.dueDate)
                    return taskDate.getHours() === hourIndex
                  }
                  return false
                })

                return (
                  <div
                    key={hourIndex}
                    className={`h-12 border border-white/5 rounded ${
                      isToday(date) ? 'bg-green-500/10' : 'bg-white/5'
                    }`}
                  >
                    {hourEvents.map((event, eventIndex) => (
                      <motion.div
                        key={eventIndex}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => {
                          if (event.type === 'task' && onTaskClick) {
                            onTaskClick(event.data)
                          }
                        }}
                        className={`text-xs p-1 m-1 rounded cursor-pointer ${
                          event.type === 'task' 
                            ? `bg-white/10 border-l-2 ${event.color} text-white` 
                            : `${event.color} text-white`
                        }`}
                        title={event.title}
                      >
                        {event.type === 'task' && (
                          <span className="mr-1">{event.icon}</span>
                        )}
                        <span className="truncate block">
                          {event.title}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Tages-Events Zusammenfassung */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Wochenübersicht</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          {weekData.map((date, index) => {
            const events = getEventsForDate(date)
            
            return (
              <div key={index} className="space-y-2">
                <div className={`text-sm font-medium ${
                  isToday(date) ? 'text-green-400' : 'text-white/80'
                }`}>
                  {date.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric' })}
                </div>
                <div className="space-y-1">
                  {events.slice(0, 3).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`text-xs p-1 rounded ${
                        event.type === 'cycle' 
                          ? `${event.color} text-white` 
                          : `bg-white/10 border-l-2 ${event.color} text-white`
                      }`}
                    >
                      {event.type === 'task' && (
                        <span className="mr-1">{event.icon}</span>
                      )}
                      <span className="truncate block">
                        {event.type === 'cycle' 
                          ? event.data.plantName 
                          : event.title
                        }
                      </span>
                    </div>
                  ))}
                  {events.length > 3 && (
                    <div className="text-xs text-white/60 text-center">
                      +{events.length - 3} weitere
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
