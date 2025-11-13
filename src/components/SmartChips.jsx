import React from 'react'
import { TrendingUp, BarChart3, Target } from 'lucide-react'

export default function SmartChips({ contextData, onChipClick }) {
  const getSmartChips = () => {
    if (!contextData) return []
    
    // Default chips for any context
    return [
      { label: 'Compare to last game', icon: TrendingUp, color: 'blue' },
      { label: 'Show trends', icon: BarChart3, color: 'purple' },
      { label: 'Predict final score', icon: Target, color: 'green' }
    ]
  }

  const chips = getSmartChips()

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
      {chips.map((chip, idx) => {
        const Icon = chip.icon
        const colorClasses = {
          blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 hover:border-blue-300',
          purple: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200 hover:border-purple-300',
          green: 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200 hover:border-green-300'
        }
        
        return (
          <button
            key={idx}
            onClick={() => onChipClick(chip.label)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all btn-micro ${colorClasses[chip.color]}`}
          >
            <Icon size={14} strokeWidth={1.5} />
            {chip.label}
          </button>
        )
      })}
    </div>
  )
}
