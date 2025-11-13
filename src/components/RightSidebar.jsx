import React, { useState } from 'react'
import { ChevronLeft, BarChart3, Zap, Plus, ChevronDown, X } from 'lucide-react'

export default function RightSidebar({ open, onToggle, activeTab, onTabChange, onAddContext, width, selectedSport, onSportChange, selectedGame, onGameChange }) {
  const [expandedGame, setExpandedGame] = useState(null)

  const sports = [
    { id: 'all', label: 'All Sports', icon: '🎯' },
    { id: 'nfl', label: 'NFL', icon: '🏈' },
    { id: 'nba', label: 'NBA', icon: '🏀' },
    { id: 'soccer', label: 'Soccer', icon: '⚽' },
    { id: 'mlb', label: 'MLB', icon: '⚾' }
  ]

  const games = [
    { id: 'all', label: 'All Games', sport: 'all' },
    { id: 'game1', label: 'Lakers vs Celtics', sport: 'nba', score: '110-105', time: 'LIVE' },
    { id: 'game2', label: 'Chiefs vs Ravens', sport: 'nfl', score: '24-21', time: 'Q4' },
    { id: 'game3', label: 'Man City vs Liverpool', sport: 'soccer', score: '2-1', time: '78\'' }
  ]

  const boxScoreData = {
    game1: {
      title: 'Lakers vs Celtics',
      teams: [
        { name: 'Lakers', score: 110, players: [
          { name: 'LeBron James', points: 28, rebounds: 8, assists: 6 },
          { name: 'Anthony Davis', points: 24, rebounds: 12, assists: 2 },
          { name: 'Austin Reaves', points: 18, rebounds: 3, assists: 4 }
        ]},
        { name: 'Celtics', score: 105, players: [
          { name: 'Jayson Tatum', points: 32, rebounds: 9, assists: 5 },
          { name: 'Jaylen Brown', points: 22, rebounds: 7, assists: 3 },
          { name: 'Derrick White', points: 14, rebounds: 4, assists: 8 }
        ]}
      ]
    }
  }

  const feedItems = [
    { id: 1, sport: 'nfl', game: 'game2', text: 'Jameson Williams TD - 6 yards', time: '2:15 Q4', icon: '🏈' },
    { id: 2, sport: 'nba', game: 'game1', text: 'LeBron James 3-pointer - Lakers lead 110-105', time: '1:45', icon: '🏀' },
    { id: 3, sport: 'soccer', game: 'game3', text: 'Haaland Goal - Man City 2-1', time: '78\'', icon: '⚽' },
    { id: 4, sport: 'nfl', game: 'game2', text: 'Lamar Jackson Interception', time: '3:22 Q4', icon: '🏈' },
    { id: 5, sport: 'nba', game: 'game1', text: 'Jayson Tatum Dunk - Celtics 105-110', time: '2:10', icon: '🏀' }
  ]

  const filteredFeed = feedItems.filter(item => 
    (selectedSport === 'all' || item.sport === selectedSport) &&
    (selectedGame === 'all' || item.game === selectedGame)
  )

  return (
    <div className="w-full h-screen flex flex-col bg-white overflow-hidden">
      {/* Tabs - Fixed at Top, Large & Visible */}
      <div className="sticky top-0 w-full bg-white z-40" style={{ borderBottom: '2px solid #eee', padding: '16px 12px', paddingTop: 'max(60px, calc(env(safe-area-inset-top) + 16px))' }}>
        <div className="flex gap-8">
          <button
            onClick={() => onTabChange('boxscore')}
            className="transition flex-shrink-0"
            style={{
              color: activeTab === 'boxscore' ? '#FF4D6D' : '#999',
              borderBottom: activeTab === 'boxscore' ? '4px solid #FF4D6D' : 'none',
              padding: '12px 0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '18px',
              fontWeight: '700'
            }}
          >
            <BarChart3 size={24} />
            <span>Stats</span>
          </button>
          <button
            onClick={() => onTabChange('feed')}
            className="transition flex-shrink-0"
            style={{
              color: activeTab === 'feed' ? '#FF4D6D' : '#999',
              borderBottom: activeTab === 'feed' ? '4px solid #FF4D6D' : 'none',
              padding: '12px 0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '18px',
              fontWeight: '700'
            }}
          >
            <Zap size={24} />
            <span>Feed</span>
          </button>
        </div>
      </div>

      {/* Sport Filter Chips */}
      <div className="px-4 flex gap-2 overflow-x-auto pb-2" style={{ margin: '10px 0 6px 0' }}>
        {sports.map(sport => (
          <button
            key={sport.id}
            onClick={() => onSportChange(sport.id)}
            className="flex-shrink-0 whitespace-nowrap transition hover:bg-gray-100"
            style={{
              padding: '6px 14px',
              borderRadius: '18px',
              border: selectedSport === sport.id ? '1px solid #111' : '1px solid #e5e5e5',
              backgroundColor: selectedSport === sport.id ? '#111' : '#fff',
              color: selectedSport === sport.id ? '#fff' : '#1A1511',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {sport.icon} {sport.label}
          </button>
        ))}
      </div>

      {/* Game Filter Chips */}
      <div className="px-4 flex gap-2 overflow-x-auto pb-2" style={{ margin: '0 0 12px 0' }}>
        {games.filter(g => selectedSport === 'all' || g.sport === selectedSport || g.id === 'all').map(game => (
          <button
            key={game.id}
            onClick={() => onGameChange(game.id)}
            className="flex-shrink-0 whitespace-nowrap transition hover:bg-gray-100"
            style={{
              padding: '6px 14px',
              borderRadius: '18px',
              border: selectedGame === game.id ? '1px solid #111' : '1px solid #e5e5e5',
              backgroundColor: selectedGame === game.id ? '#111' : '#fff',
              color: selectedGame === game.id ? '#fff' : '#1A1511',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {game.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2" style={{ paddingBottom: 'max(120px, calc(120px + env(safe-area-inset-bottom)))' }}>
        {activeTab === 'boxscore' ? (
          <div className="space-y-3">
            {boxScoreData.game1?.teams.map((team, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm text-gray-900">{team.name}</h3>
                  <span className="text-2xl font-bold text-blue-600">{team.score}</span>
                </div>
                <div className="space-y-2">
                  {team.players.map((player, pidx) => (
                    <div key={pidx} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-md border border-gray-200 hover:border-blue-300 transition group">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{player.name}</p>
                        <p className="text-gray-600 text-xs mt-0.5">{player.points}pts • {player.rebounds}reb • {player.assists}ast</p>
                      </div>
                      <button
                        onClick={() => onAddContext({ title: `${player.name} Stats`, icon: '📊' })}
                        className="p-1.5 hover:bg-blue-100 rounded transition text-gray-600 group-hover:text-blue-600 flex-shrink-0 ml-2"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFeed.map(item => (
              <div
                key={item.id}
                className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg hover:shadow-md transition cursor-pointer group"
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-lg flex-shrink-0 pt-0.5">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 leading-snug">{item.text}</p>
                    <p className="text-xs text-gray-600 mt-1.5 font-medium">{item.time}</p>
                  </div>
                  <button
                    onClick={() => onAddContext({ title: item.text, icon: item.icon })}
                    className="p-1.5 hover:bg-blue-100 rounded-md transition text-gray-600 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 flex-shrink-0"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
