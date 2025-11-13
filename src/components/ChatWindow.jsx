import React, { useState, useRef, useEffect } from 'react'
import { Menu, Send, Plus, MoreVertical, ChevronRight, X } from 'lucide-react'
import MessageList from './MessageList'
import InputArea from './InputArea'
import DynamicPrompts from './DynamicPrompts'

export default function ChatWindow({ messages, onSendMessage, onToggleSidebar, contextData, onClearContext, isLoading, sidebarOpen, rightSidebarOpen }) {
  const messagesEndRef = useRef(null)
  const thinkingRef = useRef(null)
  const inputRef = useRef(null)

  const handlePromptSelect = (promptText, type) => {
    if (type === 'starter' && inputRef.current) {
      inputRef.current.setStarterPrompt(promptText)
    }
  }

  useEffect(() => {
    if (isLoading) {
      thinkingRef.current?.scrollIntoView({ behavior: 'smooth' })
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading])

  return (
    <div className="flex-1 flex flex-col h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Header - Hamburger Menu - Only show on canvas (not when sidebars open) */}
      {!sidebarOpen && !rightSidebarOpen && (
        <div className="fixed top-0 left-0 z-50 lg:hidden" style={{ paddingTop: 'max(44px, env(safe-area-inset-top))', paddingLeft: '16px', paddingBottom: '8px' }}>
          <button
            onClick={onToggleSidebar}
            className="p-2.5 transition hover:shadow-lg"
            style={{ color: 'var(--text-dim)', minHeight: '44px', display: 'flex', alignItems: 'center', borderRadius: '8px' }}
          >
            <Menu size={20} />
          </button>
        </div>
      )}

      {/* Context Display - Floating */}
      {contextData && (
        <div className="px-4 lg:px-6 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base flex-shrink-0">{contextData.icon}</span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-tight" style={{ color: 'var(--muted)' }}>Context</p>
              <p className="text-sm truncate" style={{ color: 'var(--text)' }}>{contextData.title}</p>
            </div>
          </div>
          <button
            onClick={onClearContext}
            className="p-1.5 hover:opacity-70 transition flex-shrink-0"
            style={{ color: 'var(--muted)' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 flex flex-col items-center w-full px-3 sm:px-8 md:px-12 py-4" style={{ overflowY: messages.length === 0 ? 'hidden' : 'auto' }}>
        {messages.length === 0 && !isLoading ? (
          <div className="h-full flex flex-col items-center justify-center fade-in w-full">
            {/* Minimal Hero */}
            <div className="mb-6 sm:mb-10 animate-fade-in-up text-center px-4" style={{ marginTop: '16px' }}>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>Replika Sports</h1>
              <p className="text-sm sm:text-base max-w-sm" style={{ color: '#999' }}>Real-time analysis • Live stats • Game insights</p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full flex justify-center">
              <MessageList messages={messages} contextData={contextData} onChipClick={onSendMessage} />
            </div>
            
            {/* Thinking Indicator */}
            {isLoading && (
              <div ref={thinkingRef} className="max-w-2xl mx-auto w-full py-4 px-8 lg:px-12">
                <div className="flex items-center gap-2">
                  <p className="text-sm italic" style={{ color: '#999', fontWeight: '400' }}>Analyzing your question</p>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: '#999', animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: '#999', animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: '#999', animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} className="w-full" />
      </div>

      {/* Input Area */}
      <InputArea 
        ref={inputRef} 
        onSendMessage={onSendMessage} 
        isLoading={isLoading}
        onPromptSelect={handlePromptSelect}
        contextData={contextData}
      />
    </div>
  )
}
