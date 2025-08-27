import React from 'react'
import { motion } from 'framer-motion'
import { growTypeOptions } from '../setup/GrowTypeSelector'

interface GrowTypeQuickSelectorProps {
  selectedType: 'indoor' | 'outdoor' | 'greenhouse'
  onTypeChange: (type: 'indoor' | 'outdoor' | 'greenhouse') => void
  className?: string
}

export const GrowTypeQuickSelector: React.FC<GrowTypeQuickSelectorProps> = ({
  selectedType,
  onTypeChange,
  className = ''
}) => {
  return (
    <div className={`flex space-x-2 ${className}`}>
      {growTypeOptions.map((option) => (
        <motion.button
          key={option.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onTypeChange(option.id)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
            selectedType === option.id
              ? 'border-green-500 bg-green-500/20 text-green-400'
              : 'border-white/20 bg-white/5 text-white/60 hover:border-white/40 hover:text-white'
          }`}
          title={option.description}
        >
          <span className="text-lg">{option.icon}</span>
          <span className="text-sm font-medium">{option.label}</span>
        </motion.button>
      ))}
    </div>
  )
}

export default GrowTypeQuickSelector
