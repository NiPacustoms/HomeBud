'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

interface CalendarNoteModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date | null
  existingNote?: CalendarNote | null
  onSave: (note: Omit<CalendarNote, 'id' | 'createdAt' | 'updatedAt'>) => void
  onDelete?: (noteId: string) => void
}

export default function CalendarNoteModal({ 
  isOpen, 
  onClose, 
  selectedDate, 
  existingNote, 
  onSave, 
  onDelete 
}: CalendarNoteModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [color, setColor] = useState<'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray'>('blue')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title)
      setContent(existingNote.content)
      setColor(existingNote.color)
      setPriority(existingNote.priority)
    } else {
      setTitle('')
      setContent('')
      setColor('blue')
      setPriority('medium')
    }
  }, [existingNote])

  const handleSave = () => {
    if (!selectedDate || !title.trim()) return

    const noteData = {
      date: selectedDate!.toISOString().split('T')[0] as string,
      title: title.trim(),
      content: content.trim(),
      color,
      priority
    }

    onSave(noteData)
    onClose()
  }

  const handleDelete = () => {
    if (existingNote && onDelete) {
      onDelete(existingNote.id)
      onClose()
    }
  }

  const colorOptions = [
    { value: 'blue', label: 'Blau', bg: 'bg-blue-500', border: 'border-blue-500' },
    { value: 'green', label: 'Grün', bg: 'bg-green-500', border: 'border-green-500' },
    { value: 'yellow', label: 'Gelb', bg: 'bg-yellow-500', border: 'border-yellow-500' },
    { value: 'red', label: 'Rot', bg: 'bg-red-500', border: 'border-red-500' },
    { value: 'purple', label: 'Lila', bg: 'bg-purple-500', border: 'border-purple-500' },
    { value: 'gray', label: 'Grau', bg: 'bg-gray-500', border: 'border-gray-500' }
  ]

  const priorityOptions = [
    { value: 'low', label: 'Niedrig', color: 'text-green-400' },
    { value: 'medium', label: 'Mittel', color: 'text-yellow-400' },
    { value: 'high', label: 'Hoch', color: 'text-red-400' }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {existingNote ? 'Notiz bearbeiten' : 'Neue Notiz'}
                </h2>
                {selectedDate && (
                  <p className="text-white/60 text-sm">
                    {selectedDate.toLocaleDateString('de-DE', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Modal schließen"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Titel */}
              <div>
                <label htmlFor="note-title" className="block text-sm font-medium text-white/80 mb-2">
                  Titel *
                </label>
                <input
                  id="note-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Notiz-Titel eingeben..."
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Inhalt */}
              <div>
                <label htmlFor="note-content" className="block text-sm font-medium text-white/80 mb-2">
                  Inhalt
                </label>
                <textarea
                  id="note-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Notiz-Inhalt eingeben..."
                  rows={4}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Farbe */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Farbe
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setColor(option.value as any)}
                      className={`p-2 rounded-lg border-2 transition-all ${
                        color === option.value
                          ? `${option.border} bg-white/20`
                          : 'border-white/20 hover:border-white/40'
                      }`}
                      title={option.label}
                    >
                      <div className={`w-4 h-4 rounded ${option.bg}`}></div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Priorität */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Priorität
                </label>
                <div className="flex space-x-2">
                  {priorityOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPriority(option.value as any)}
                      className={`px-3 py-1 rounded-lg border transition-all ${
                        priority === option.value
                          ? 'border-white/40 bg-white/20'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <span className={`text-sm font-medium ${option.color}`}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/20">
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-4 py-2 text-white/60 hover:text-white transition-colors"
                >
                  Abbrechen
                </motion.button>
                {existingNote && onDelete && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    Löschen
                  </motion.button>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={!title.trim()}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {existingNote ? 'Aktualisieren' : 'Speichern'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
