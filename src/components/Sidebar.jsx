import React, { useState } from 'react'
import { Menu, Plus, Trash2, MessageCircle, Settings } from 'lucide-react'

export default function Sidebar({ 
  open, 
  onToggle, 
  conversations, 
  activeConversation, 
  onNewChat, 
  onSelectConversation,
  onDeleteConversation 
}) {
  const [showSettings, setShowSettings] = useState(false)
  const [followedSports, setFollowedSports] = useState({
    nba: true,
    nfl: true,
    soccer: true
  })

  const toggleSport = (sport) => {
    setFollowedSports(prev => ({
      ...prev,
      [sport]: !prev[sport]
    }))
  }
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative w-[70%] max-w-64 h-screen bg-white
        transition-transform duration-300 z-40 lg:z-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col border-r
      `} style={{ borderColor: 'var(--border)' }}>
        {/* Header - Minimal */}
        <div className="p-3 flex items-center justify-between border-b" style={{ borderColor: '#eee' }}>
          <h1 className="text-sm font-semibold" style={{ color: '#1A1511' }}>Replika Sports</h1>
          <button
            onClick={onToggle}
            className="lg:hidden p-1 hover:opacity-70 rounded-md transition"
            style={{ color: '#999' }}
          >
            <Menu size={16} />
          </button>
        </div>

        {/* New Chat Button - Minimal */}
        <button
          onClick={onNewChat}
          className="mx-3 mt-3 mb-2 flex items-center justify-center gap-1.5 rounded-lg transition hover:opacity-90"
          style={{
            backgroundColor: '#FF4D6D',
            color: '#fff',
            border: 'none',
            padding: '8px 12px',
            fontSize: '13px',
            fontWeight: '600'
          }}
        >
          <Plus size={14} />
          New chat
        </button>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Conversations Section */}
          <div className="px-2 py-3">
            {/* Section Title */}
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#999', letterSpacing: '0.5px', textTransform: 'uppercase', padding: '8px 4px 6px 4px', marginBottom: '6px' }}>Conversations</p>

            {conversations.map(conv => (
              <div
                key={conv.id}
                className="group mb-1 cursor-pointer transition text-sm"
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  backgroundColor: conv.active ? '#f5f5f5' : 'transparent',
                  color: conv.active ? '#1A1511' : '#666'
                }}
                onClick={() => onSelectConversation(conv.id)}
              >
                <div className="flex items-center justify-between gap-2">
                  <MessageCircle size={14} className="flex-shrink-0" style={{ color: '#999' }} />
                  <span className="truncate flex-1" style={{ fontSize: '13px', fontWeight: '500' }}>{conv.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteConversation(conv.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:opacity-70 rounded transition"
                    style={{ color: '#999' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Settings - Fixed at bottom on mobile */}
          <div className="p-3 border-t lg:relative" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-full flex items-center justify-between py-2 px-3 text-xs font-satoshi-bold rounded-md transition"
              style={{ color: 'var(--text)', backgroundColor: showSettings ? 'rgba(255, 77, 109, 0.08)' : 'transparent' }}
            >
              <span className="flex items-center gap-2">
                <Settings size={14} />
                Followed Sports
              </span>
            </button>
            {showSettings && (
              <div className="mt-2 space-y-2">
                {[
                  { id: 'nba', label: 'NBA' },
                  { id: 'nfl', label: 'NFL' },
                  { id: 'soccer', label: 'Soccer' }
                ].map(sport => (
                  <label key={sport.id} className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-gray-50 rounded text-xs">
                    <input
                      type="checkbox"
                      checked={followedSports[sport.id]}
                      onChange={() => toggleSport(sport.id)}
                      className="rounded"
                    />
                    <span style={{ color: 'var(--text)' }}>{sport.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Spacer for mobile */}
          <div className="h-6 lg:h-0"></div>

          {/* Footer - Fixed at bottom on mobile */}
          <div className="p-3 border-t lg:relative" style={{ borderColor: 'var(--border)' }}>
            <button className="w-full py-2 px-3 text-xs text-gray-700 hover:bg-gray-100 rounded-md transition font-medium border border-gray-300">
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
