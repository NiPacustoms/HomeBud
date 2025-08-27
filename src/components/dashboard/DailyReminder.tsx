import React from 'react'
import { Card } from '@/components/ui/Card'
import { useDailyData } from '@/hooks/useDailyData'

interface DailyReminderProps {
  className?: string
}

export const DailyReminder: React.FC<DailyReminderProps> = ({
  className = ''
}) => {
  const { getTodayEntry, dailyDataEntries } = useDailyData()
  
  const todayEntry = getTodayEntry()
  const hasEntries = dailyDataEntries.length > 0

  // Berechne Streak (aufeinanderfolgende Tage)
  const calculateStreak = () => {
    if (dailyDataEntries.length === 0) return 0
    
    const sortedEntries = [...dailyDataEntries].sort((a, b) => b.date.getTime() - a.date.getTime())
    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date)
      entryDate.setHours(0, 0, 0, 0)
      
      const diffTime = currentDate.getTime() - entryDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === streak) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  const streak = calculateStreak()

  if (!hasEntries) {
    return (
      <Card className={className}>
        <div className="p-4 text-center">
          <div className="text-3xl mb-2">🎯</div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Starte deine Datenerfassung
          </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
              Erfasse deine ersten Messwerte und beginne deine Erfolgsgeschichte!
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                💡 Tipp: Verwende deine Messgeräte für genaue Werte!
              </p>
            </div>
        </div>
      </Card>
    )
  }

  if (todayEntry) {
    return (
      <Card className={className}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">✅</span>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  Heute bereits erfasst
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {todayEntry.date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">{streak}</div>
              <div className="text-xs text-neutral-500">Tage Streak</div>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300">
              🎉 Perfekt! Du hast heute bereits deine Werte eingetragen. 
              {streak > 1 && ` Das sind ${streak} Tage in Folge!`}
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⏰</span>
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                Heute noch nicht erfasst
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Trage deine Messwerte ein
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-orange-600">{streak}</div>
            <div className="text-xs text-neutral-500">Tage Streak</div>
          </div>
        </div>
        
        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
          <p className="text-sm text-orange-700 dark:text-orange-300">
            📊 Vergiss nicht, deine täglichen Messwerte einzutragen! 
            {streak > 0 && ` Du hast bereits ${streak} Tage in Folge durchgehalten.`}
          </p>
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="text-center p-2 bg-neutral-50 dark:bg-neutral-800 rounded">
            <div className="font-medium text-neutral-700 dark:text-neutral-300">Gesamt</div>
            <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {dailyDataEntries.length}
            </div>
            <div className="text-neutral-500">Einträge</div>
          </div>
          <div className="text-center p-2 bg-neutral-50 dark:bg-neutral-800 rounded">
            <div className="font-medium text-neutral-700 dark:text-neutral-300">Letzter</div>
            <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {dailyDataEntries.length > 0 ? 
                new Date(dailyDataEntries[dailyDataEntries.length - 1].date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) : 
                '-'
              }
            </div>
            <div className="text-neutral-500">Eintrag</div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default DailyReminder
