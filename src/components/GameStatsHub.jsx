import React, { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import InlineQuestionBar from './InlineQuestionBar'
import SmartChips from './SmartChips'
import Toast from './Toast'
import GamesTab from './GamesTab'
import FeedTab from './FeedTab'
import BoxScoreView from './BoxScoreView'
import PlayerStatsDrawer from './PlayerStatsDrawer'

export default function GameStatsHub({ open, onToggle, onAddContext, onSidebarQuestion, contextData, onClearContext, isLoading }) {
  const [expandedTeam, setExpandedTeam] = useState(null)
  const [expandedPlayer, setExpandedPlayer] = useState(null)
  const [toast, setToast] = useState(null)
  const [lastAnswer, setLastAnswer] = useState(null)
  const [activeTab, setActiveTab] = useState('boxscore') // 'boxscore', 'feed', or 'games'
  const [selectedGame, setSelectedGame] = useState(null)
  const [expandedStats, setExpandedStats] = useState(false)

  const gameData = {
    status: 'LIVE',
    time: 'Q3 5:42',
    teams: [
      {
        id: 1,
        name: 'Lakers',
        logo: '🏀',
        score: 78,
        quarters: [28, 22, 28, 0],
        players: [
          { name: 'LeBron James', pts: 28, reb: 8, ast: 6, fg: '11/18', three: '2/4', ft: '4/5' },
          { name: 'Anthony Davis', pts: 24, reb: 12, ast: 2, fg: '9/15', three: '0/1', ft: '6/8' },
          { name: 'Austin Reaves', pts: 18, reb: 3, ast: 4, fg: '7/12', three: '2/5', ft: '2/2' }
        ]
      },
      {
        id: 2,
        name: 'Celtics',
        logo: '🍀',
        score: 75,
        quarters: [26, 24, 25, 0],
        players: [
          { name: 'Jayson Tatum', pts: 32, reb: 9, ast: 5, fg: '12/20', three: '3/7', ft: '5/6' },
          { name: 'Jaylen Brown', pts: 22, reb: 7, ast: 3, fg: '8/16', three: '1/4', ft: '5/6' },
          { name: 'Derrick White', pts: 14, reb: 4, ast: 8, fg: '5/11', three: '2/5', ft: '2/2' }
        ]
      }
    ],
    keyPlays: [
      { time: '5:42', team: 'Lakers', text: 'LeBron James 3-pointer', icon: '🎯' },
      { time: '6:15', team: 'Celtics', text: 'Jayson Tatum Dunk', icon: '🔨' },
      { time: '7:30', team: 'Lakers', text: 'Anthony Davis Rebound', icon: '📦' }
    ]
  }

  const handleSidebarQuestion = (question) => {
    if (onSidebarQuestion) {
      onSidebarQuestion(question)
      setToast('Question sent to chat')
      setLastAnswer(question)
    }
  }

  const handleSmartChip = (chip) => {
    handleSidebarQuestion(chip)
  }

  const handleSelectGame = (game) => {
    setSelectedGame(game)
    setActiveTab('boxscore')
  }

  const handleAskAI = (context) => {
    const question = typeof context === 'string' ? context : `Tell me about: ${context.play || context.name || 'this play'}`
    handleSidebarQuestion(question)
  }

  const handleFollow = (gameId) => {
    setToast(`Game ${gameId} ${selectedGame?.id === gameId ? 'followed' : 'unfollowed'}`)
  }

  return (
    <div className="w-full h-screen flex flex-col bg-white overflow-hidden">

      {/* Tabs - Simplified */}
      <div className="flex border-b px-4 bg-white" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={() => setActiveTab('boxscore')}
          className={`flex-1 py-2 px-3 font-semibold text-sm border-b-2 transition ${
            activeTab === 'boxscore' ? 'border-current' : 'border-transparent'
          }`}
          style={{ color: activeTab === 'boxscore' ? 'var(--accent-1)' : 'var(--text-dim)' }}
        >
          {selectedGame ? 'Stats' : 'Games'}
        </button>
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex-1 py-2 px-3 font-semibold text-sm border-b-2 transition ${
            activeTab === 'feed' ? 'border-current' : 'border-transparent'
          }`}
          style={{ color: activeTab === 'feed' ? 'var(--accent-1)' : 'var(--text-dim)' }}
        >
          Feed
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* Stats/Games Tab - Combined */}
        {activeTab === 'boxscore' && (
          <>
            {selectedGame ? (
              <div className="space-y-3">
                {/* Inline Player Stats Drawer - Auto Expanded */}
                <PlayerStatsDrawer
                  game={selectedGame}
                  league={selectedGame.league || 'NBA'}
                  onAddContext={onAddContext}
                  isExpanded={true}
                  onToggle={() => setExpandedStats(!expandedStats)}
                />
                
                {/* Back to Games */}
                <button
                  onClick={() => {
                    setSelectedGame(null)
                    setExpandedStats(false)
                  }}
                  className="w-full py-2 px-3 text-xs font-satoshi-bold rounded transition hover:opacity-70"
                  style={{ color: 'var(--accent-1)', backgroundColor: 'rgba(255, 77, 109, 0.08)' }}
                >
                  Back to Games
                </button>
              </div>
            ) : (
              <GamesTab onSelectGame={handleSelectGame} onAskAI={handleAskAI} onFollow={handleFollow} />
            )}
          </>
        )}

        {/* Feed Tab */}
        {activeTab === 'feed' && (
          <FeedTab onAskAI={handleAskAI} />
        )}
      </div>

      {/* Smart Follow-up Chips */}
      {lastAnswer && (
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
          <SmartChips contextData={contextData} onChipClick={handleSmartChip} />
        </div>
      )}

      {/* Send to Chat Button */}
      {contextData && (
        <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => handleSidebarQuestion(`Tell me about ${contextData.title}`)}
            disabled={isLoading}
            className="w-full py-2 px-3 rounded-lg font-satoshi-bold text-sm transition disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent-1)', color: 'white' }}
          >
            Send to Chat
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
