import React from 'react'
import { X } from 'lucide-react'

export default function ContextHeader({ contextData, onClear }) {
  if (!contextData) return null

  return (
    <div className="px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 text-base">
          {contextData.icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-tight">Context</p>
          <p className="text-sm text-gray-900 truncate font-medium">{contextData.title}</p>
        </div>
      </div>
      <button
        onClick={onClear}
        className="p-1.5 hover:bg-blue-200 rounded-md transition text-blue-600 flex-shrink-0 btn-micro"
      >
        <X size={16} strokeWidth={2} />
      </button>
    </div>
  )
}
