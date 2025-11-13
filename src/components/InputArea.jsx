import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Send, Plus } from 'lucide-react'
import DynamicPrompts from './DynamicPrompts'

const InputArea = forwardRef(({ onSendMessage, isLoading, onPromptSelect, contextData }, ref) => {
  const [input, setInput] = useState('')
  const textareaRef = useRef(null)

  useImperativeHandle(ref, () => ({
    setStarterPrompt: (text) => {
      setInput(text)
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
          textareaRef.current.setSelectionRange(text.length, text.length)
        }
      }, 0)
    }
  }))

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input)
      setInput('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={{ 
      backgroundColor: 'var(--surface)', 
      paddingBottom: 'env(safe-area-inset-bottom)'
    }}>
      {/* Quick Topics + Input as One Visual Block */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4" style={{ backgroundColor: 'var(--surface)', paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
        <div className="max-w-4xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Quick Topics Section - Show on desktop only */}
          <div className="hidden sm:block">
            <DynamicPrompts onSelectPrompt={onPromptSelect} contextData={contextData} compact={true} />
          </div>

          {/* Input Area */}
          <div className="flex gap-2 sm:gap-3 items-center justify-center w-full">
            <div className="flex-1 relative flex items-center" style={{ 
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              padding: '10px 12px',
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'all 0.2s ease'
            }}>
              <button className="p-1.5 hover:opacity-70 transition flex-shrink-0 hidden sm:flex items-center" style={{ color: '#999' }}>
                <Plus size={20} strokeWidth={1.5} />
              </button>
              
              <input
                ref={textareaRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about sports, players, stats..."
                className="flex-1 bg-transparent focus:outline-none text-sm"
                style={{ 
                  color: '#1A1511',
                  marginLeft: '8px',
                  fontFamily: "'Inter', sans-serif",
                  minHeight: '20px'
                }}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
              
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-1.5 hover:opacity-70 transition flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed flex items-center"
                style={{ color: 'var(--accent-1)', minWidth: '32px', minHeight: '32px' }}
              >
                <Send size={20} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

InputArea.displayName = 'InputArea'
export default InputArea
