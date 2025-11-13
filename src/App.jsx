import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import GameStatsHub from './components/GameStatsHub'
import './index.css'

export default function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(!isMobile)
  const [rightSidebarTab, setRightSidebarTab] = useState('boxscore')
  const [rightSidebarWidth, setRightSidebarWidth] = useState(320)
  const [selectedSport, setSelectedSport] = useState('all')
  const [selectedGame, setSelectedGame] = useState('all')
  const [conversations, setConversations] = useState([
    { id: 1, title: 'New chat', active: true, backendId: null }
  ])
  const [messages, setMessages] = useState([])
  const [activeConversation, setActiveConversation] = useState(1)
  const [contextData, setContextData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setSidebarOpen(false)
        setRightSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleNewChat = () => {
    const newId = Math.max(...conversations.map(c => c.id), 0) + 1
    const updatedConversations = conversations.map(c => ({ ...c, active: false }))
    setConversations([...updatedConversations, { id: newId, title: 'New chat', active: true, backendId: null }])
    setActiveConversation(newId)
    setMessages([])
    setContextData(null)
  }

  const handleSelectConversation = (id) => {
    const updatedConversations = conversations.map(c => ({
      ...c,
      active: c.id === id
    }))
    setConversations(updatedConversations)
    setActiveConversation(id)
    setMessages([])
    setContextData(null)
  }

  const handleDeleteConversation = (id) => {
    const filtered = conversations.filter(c => c.id !== id)
    setConversations(filtered)
    if (activeConversation === id && filtered.length > 0) {
      handleSelectConversation(filtered[0].id)
    }
  }

  const handleSendMessage = async (text) => {
    const userMessage = { id: Date.now(), text, sender: 'user', context: contextData }
    setMessages([...messages, userMessage])
    setIsLoading(true)

    try {
      const activeConv = conversations.find(c => c.id === activeConversation)
      const payload = {
        message: text,
        ...(activeConv?.backendId && { conversation_id: activeConv.backendId })
      }

      const response = await fetch('https://backend-bold-smoke-6218.fly.dev/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const aiMessage = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'ai'
      }
      setMessages(prev => [...prev, aiMessage])

      // Update backend conversation ID if new
      if (data.conversation_id && !activeConv?.backendId) {
        setConversations(prev => prev.map(c => 
          c.id === activeConversation 
            ? { ...c, backendId: data.conversation_id }
            : c
        ))
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error processing your message. Please try again.',
        sender: 'ai'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }

    // Update conversation title if it's the first message
    if (messages.length === 0) {
      const updatedConversations = conversations.map(c => 
        c.id === activeConversation 
          ? { ...c, title: text.substring(0, 30) + (text.length > 30 ? '...' : '') }
          : c
      )
      setConversations(updatedConversations)
    }
  }

  const handleAddContext = (data) => {
    setContextData(data)
  }

  const handleResizeStart = (e) => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = rightSidebarWidth

    const handleMouseMove = (moveEvent) => {
      const diff = startX - moveEvent.clientX
      const newWidth = Math.max(250, Math.min(600, startWidth + diff))
      setRightSidebarWidth(newWidth)
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Right sidebar overlay - Mobile only */}
      {rightSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setRightSidebarOpen(false)}
        />
      )}
      
      <Sidebar 
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        conversations={conversations}
        activeConversation={activeConversation}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
      />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <ChatWindow 
          messages={messages}
          onSendMessage={handleSendMessage}
          onToggleSidebar={() => {
            setSidebarOpen(!sidebarOpen)
            if (!sidebarOpen && rightSidebarOpen) {
              setRightSidebarOpen(false) // Close right sidebar when opening left
            }
          }}
          contextData={contextData}
          onClearContext={() => setContextData(null)}
          isLoading={isLoading}
          sidebarOpen={sidebarOpen}
          rightSidebarOpen={rightSidebarOpen}
        />
        
        {/* Toggle Button - Show when sidebar closed, hide on mobile when open */}
        <button
          onClick={() => {
            setRightSidebarOpen(!rightSidebarOpen)
            if (!rightSidebarOpen && sidebarOpen) {
              setSidebarOpen(false) // Close left sidebar when opening right
            }
          }}
          className="fixed flex items-center justify-center p-2.5 rounded-lg transition pointer-events-auto z-50 hover:shadow-lg"
          style={{ 
            top: 'max(44px, env(safe-area-inset-top))', 
            right: '16px', 
            color: 'var(--text)', 
            minHeight: '44px', 
            display: rightSidebarOpen ? 'none' : 'flex',
            alignItems: 'center',
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          title={rightSidebarOpen ? 'Hide stats' : 'Show stats'}
        >
          <svg className={`w-5 h-5 transition-transform ${rightSidebarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      {/* Right Sidebar - Mobile: fixed 80% width, Desktop: resizable */}
      {rightSidebarOpen && (
        <div className={`
          fixed lg:relative right-0 top-0 h-screen bg-white border-l 
          transition-transform duration-300 z-40 lg:z-auto
          w-4/5 max-w-sm lg:w-auto
          ${rightSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        `} style={{ 
          borderColor: 'var(--border)',
          ...(isMobile ? {} : { width: `${rightSidebarWidth}px` })
        }}>
          <div
            onMouseDown={handleResizeStart}
            className="absolute left-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-400 hover:w-1.5 transition-all group z-10 lg:block hidden"
          />
          <GameStatsHub 
            open={rightSidebarOpen}
            onAddContext={handleAddContext}
            onSidebarQuestion={handleSendMessage}
            contextData={contextData}
            onClearContext={() => setContextData(null)}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  )
}
