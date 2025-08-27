'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/store'
import {
  selectFilteredPlants,
  selectPlantsFilters,
  setFilter,
  clearFilters
} from '@/store/slices/plantSlice'
import { Plant, PlantStage } from '@/types/plant'
import { Card } from '@/components/ui/Card'

interface PlantListProps {
  onPlantSelect: (plant: Plant) => void
}

const stageLabels: Record<PlantStage, string> = {
  seedling: 'Keimling',
  vegetative: 'Vegetativ',
  flowering: 'Blüte',
  harvest: 'Ernte',
  drying: 'Trocknung',
  curing: 'Reifung'
}

const stageColors: Record<PlantStage, string> = {
  seedling: 'bg-blue-100 text-blue-800',
  vegetative: 'bg-green-100 text-green-800',
  flowering: 'bg-purple-100 text-purple-800',
  harvest: 'bg-yellow-100 text-yellow-800',
  drying: 'bg-orange-100 text-orange-800',
  curing: 'bg-red-100 text-red-800'
}

const getHealthStatusColor = (plant: Plant) => {
  const { health } = plant
  const vpdDiff = Math.abs(health.vpd - plant.settings.targetVPD)
  const ecDiff = Math.abs(health.ec - plant.settings.targetEC)
  const phDiff = Math.abs(health.ph - plant.settings.targetPH)
  
  if (vpdDiff > 0.5 || ecDiff > 0.5 || phDiff > 0.5) return 'bg-red-100 text-red-800'
  if (vpdDiff > 0.3 || ecDiff > 0.3 || phDiff > 0.3) return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
}

const getAgeInDays = (startDate: Date) => {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - new Date(startDate).getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export default function PlantList({ onPlantSelect }: PlantListProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const plants = useAppSelector(selectFilteredPlants)
  const filters = useAppSelector(selectPlantsFilters)
  const [sortBy, setSortBy] = useState<'name' | 'stage' | 'age' | 'health'>('health')

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    dispatch(setFilter({ key, value }))
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
  }

  const sortedPlants = [...plants].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'stage':
        return a.stage.localeCompare(b.stage)
      case 'age':
        return getAgeInDays(a.startDate) - getAgeInDays(b.startDate)
      case 'health':
        const aHealth = a.health.status === 'critical' ? 0 : 
                       a.health.status === 'warning' ? 1 : 
                       a.health.status === 'good' ? 2 : 3
        const bHealth = b.health.status === 'critical' ? 0 : 
                       b.health.status === 'warning' ? 1 : 
                       b.health.status === 'good' ? 2 : 3
        return aHealth - bHealth
      default:
        return 0
    }
  })

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Phase:
          </label>
          <select
            value={filters.stage}
            onChange={(e) => handleFilterChange('stage', e.target.value)}
            className="px-3 py-1 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Phase filtern"
          >
            <option value="all">Alle Phasen</option>
            {Object.entries(stageLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Sortierung:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Sortierung auswählen"
          >
            <option value="health">Gesundheit</option>
            <option value="name">Name</option>
            <option value="stage">Phase</option>
            <option value="age">Alter</option>
          </select>
        </div>
        
        <button
          onClick={handleClearFilters}
          className="px-3 py-1 text-sm text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          Filter löschen
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Pflanzen suchen..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full px-4 py-2 pl-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Plants Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300 sticky left-0 bg-neutral-50 dark:bg-neutral-800 z-10">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Phase
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Alter
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  VPD
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  EC
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  pH
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {sortedPlants.map((plant) => (
                <tr
                  key={plant.id}
                  onClick={() => {
                    if (onPlantSelect) {
                      onPlantSelect(plant)
                    } else {
                      router.push(`/plants/${plant.id}`)
                    }
                  }}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 sticky left-0 bg-white dark:bg-neutral-900 z-10">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">🌱</span>
                      </div>
                      <div>
                        <div className="font-medium text-neutral-900 dark:text-neutral-100">
                          {plant.name}
                        </div>
                        {plant.strain && (
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            {plant.strain}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${stageColors[plant.stage]}`}>
                      {stageLabels[plant.stage]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                    {getAgeInDays(plant.startDate)} Tage
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getHealthStatusColor(plant)}`}>
                        {plant.health.vpd.toFixed(1)}
                      </span>
                      {Math.abs(plant.health.vpd - plant.settings.targetVPD) > 0.1 && (
                        <span className="text-xs text-neutral-500">
                          {plant.health.vpd > plant.settings.targetVPD ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getHealthStatusColor(plant)}`}>
                        {plant.health.ec.toFixed(1)}
                      </span>
                      {Math.abs(plant.health.ec - plant.settings.targetEC) > 0.1 && (
                        <span className="text-xs text-neutral-500">
                          {plant.health.ec > plant.settings.targetEC ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getHealthStatusColor(plant)}`}>
                        {plant.health.ph.toFixed(1)}
                      </span>
                      {Math.abs(plant.health.ph - plant.settings.targetPH) > 0.1 && (
                        <span className="text-xs text-neutral-500">
                          {plant.health.ph > plant.settings.targetPH ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        plant.health.status === 'excellent' ? 'bg-green-500' :
                        plant.health.status === 'good' ? 'bg-blue-500' :
                        plant.health.status === 'warning' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`} />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300 capitalize">
                        {plant.health.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {sortedPlants.length === 0 && (
          <div className="text-center py-8">
            <div className="text-neutral-500 dark:text-neutral-400">
              {filters.search || filters.stage !== 'all' 
                ? 'Keine Pflanzen gefunden' 
                : 'Noch keine Pflanzen vorhanden'
              }
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
