import React from 'react'
import { growTypeOptions } from '../setup/GrowTypeSelector'

interface GrowTypeDisplayProps {
  growType: 'indoor' | 'outdoor' | 'greenhouse'
  showDetails?: boolean
  className?: string
}

export const GrowTypeDisplay: React.FC<GrowTypeDisplayProps> = ({
  growType,
  showDetails = false,
  className = ''
}) => {
  const option = growTypeOptions.find(opt => opt.id === growType)
  
  if (!option) return null

  return (
    <div className={`flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10 ${className}`}>
      <span className="text-2xl">{option.icon}</span>
      <div className="flex-1">
        <h4 className="font-medium text-white">{option.label}</h4>
        {showDetails && (
          <p className="text-sm text-white/60">{option.description}</p>
        )}
      </div>
      <div className="text-xs text-white/40 bg-white/10 px-2 py-1 rounded">
        {growType.toUpperCase()}
      </div>
    </div>
  )
}

export default GrowTypeDisplay
