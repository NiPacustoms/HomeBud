// Frontend-Persistenz ohne Backend (LocalStorage)
// SOTA: Typsichere, defensive Speicherung mit Versions- und Fehler-Handling

import { DailyDataEntry as DailyDataEntryType, MeasurementReminder, MeasurementChecklist } from '@/types/plant'

type Entity = DailyDataEntryType | MeasurementReminder | MeasurementChecklist

interface StoreConfig<T extends Entity> {
  key: string
  version: number
  migrate?: (oldData: any) => T[]
}

const read = <T extends Entity>(config: StoreConfig<T>): T[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(config.key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (parsed && parsed.version === config.version && Array.isArray(parsed.items)) {
      return parsed.items as T[]
    }
    if (config.migrate) {
      return config.migrate(parsed)
    }
    return []
  } catch {
    return []
  }
}

const write = <T extends Entity>(config: StoreConfig<T>, items: T[]) => {
  if (typeof window === 'undefined') return
  try {
    const payload = JSON.stringify({ version: config.version, items })
    window.localStorage.setItem(config.key, payload)
  } catch {
    // Speicher voll oder verboten – ignoriere still
  }
}

export const createLocalStore = <T extends Entity>(config: StoreConfig<T>) => {
  return {
    getAll: (): T[] => read<T>(config),
    setAll: (items: T[]) => write<T>(config, items),
    add: (item: T) => {
      const items = read<T>(config)
      write<T>(config, [item, ...items])
    },
    update: (id: string, updater: (current: T) => T): T[] => {
      const items = read<T>(config)
      const updated = items.map((it: any) => (it.id === id ? updater(it as T) : it))
      write<T>(config, updated)
      return updated
    },
    remove: (id: string): T[] => {
      const items = read<T>(config)
      const filtered = items.filter((it: any) => it.id !== id)
      write<T>(config, filtered)
      return filtered
    }
  }
}

export const measurementsStore = createLocalStore<DailyDataEntryType>({ key: 'hb.measurements', version: 1 })
export const remindersStore = createLocalStore<MeasurementReminder>({ key: 'hb.reminders', version: 1 })
export const checklistsStore = createLocalStore<MeasurementChecklist>({ key: 'hb.checklists', version: 1 })


