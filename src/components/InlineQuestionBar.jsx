import React, { useState } from 'react'
import { Send } from 'lucide-react'

export default function InlineQuestionBar({ onSubmit, isLoading, contextData }) {
  const [input, setInput] = useState('')

  const handleSubmit = () => {
    if (input.trim()) {
      onSubmit(input)
      setInput('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="p-3 border-t border-gray-200 bg-white">
      <div className="flex gap-2 items-center justify-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={contextData ? `Ask about ${contextData.title}...` : 'Ask about this game...'}
          disabled={isLoading}
          className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500 disabled:opacity-50 transition-all"
        />
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
          className="p-2 hover:bg-gray-100 rounded-md transition flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed btn-micro"
        >
          <Send size={16} className={input.trim() && !isLoading ? 'text-blue-600' : 'text-gray-400'} />
        </button>
      </div>
    </div>
  )
}
