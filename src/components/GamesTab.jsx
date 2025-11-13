import React, { useState } from 'react'
import { Star, ChevronRight, ChevronDown } from 'lucide-react'

export default function GamesTab({ onSelectGame, onAskAI, onFollow }) {
  const [followed, setFollowed] = useState([])
  const [selectedDay, setSelectedDay] = useState('today')
  const [collapsedSports, setCollapsedSports] = useState([])

  const allGames = {
    yesterday: [
      {
        id: 101,
        away: { name: 'Warriors', score: 112 },
        home: { name: 'Suns', score: 108 },
        status: 'FINAL',
        time: 'Final',
        league: 'NBA',
        teams: []
      },
      {
        id: 102,
        away: { name: 'Packers', score: 27 },
        home: { name: 'Bears', score: 24 },
        status: 'FINAL',
        time: 'Final',
        league: 'NFL',
        teams: []
      }
    ],
    today: [
    {
      id: 1,
      away: { name: 'Lakers', score: 78 },
      home: { name: 'Celtics', score: 75 },
      status: 'LIVE',
      time: 'Q3 5:42',
      league: 'NBA',
      teams: [
        {
          name: 'Lakers',
          score: 78,
          quarters: [28, 22, 28, 0],
          players: [
            { name: 'LeBron James', pts: 28, reb: 8, ast: 6, fg: '11/18', three: '2/4', stl: 2 },
            { name: 'Anthony Davis', pts: 24, reb: 12, ast: 2, fg: '9/15', three: '0/1', stl: 1 },
            { name: 'Austin Reaves', pts: 18, reb: 3, ast: 4, fg: '7/12', three: '2/5', stl: 1 }
          ]
        },
        {
          name: 'Celtics',
          score: 75,
          quarters: [26, 24, 25, 0],
          players: [
            { name: 'Jayson Tatum', pts: 32, reb: 9, ast: 5, fg: '12/20', three: '3/7', stl: 2 },
            { name: 'Jaylen Brown', pts: 22, reb: 7, ast: 3, fg: '8/16', three: '1/4', stl: 1 },
            { name: 'Derrick White', pts: 14, reb: 4, ast: 8, fg: '5/11', three: '2/5', stl: 3 }
          ]
        }
      ]
    },
    {
      id: 2,
      away: { name: '49ers', score: 24 },
      home: { name: 'Cowboys', score: 21 },
      status: 'LIVE',
      time: 'Q3 10:42',
      league: 'NFL',
      teams: [
        {
          name: '49ers',
          score: 24,
          players: [
            { name: 'Brock Purdy', pos: 'QB', passYds: 245, passTd: 2, int: 0, cmp: 18, att: 25 },
            { name: 'Christian McCaffrey', pos: 'RB', rush: 18, rushYds: 87, rushTd: 1, rec: 5, recYds: 42, td: 0 },
            { name: 'Brandon Aiyuk', pos: 'WR', rec: 6, recYds: 78, td: 0 },
            { name: 'George Kittle', pos: 'TE', rec: 4, recYds: 52, td: 1 }
          ]
        },
        {
          name: 'Cowboys',
          score: 21,
          players: [
            { name: 'Dak Prescott', pos: 'QB', passYds: 268, passTd: 2, int: 1, cmp: 22, att: 32 },
            { name: 'Ezekiel Elliott', pos: 'RB', rush: 14, rushYds: 52, rushTd: 0, rec: 3, recYds: 18, td: 0 },
            { name: 'CeeDee Lamb', pos: 'WR', rec: 9, recYds: 124, td: 1 },
            { name: 'Jake Ferguson', pos: 'TE', rec: 5, recYds: 48, td: 0 }
          ]
        }
      ]
    },
    {
      id: 3,
      away: { name: 'Man City', score: 2 },
      home: { name: 'Liverpool', score: 1 },
      status: 'LIVE',
      time: '78\'',
      league: 'Soccer',
      teams: [
        {
          name: 'Man City',
          score: 2,
          players: [
            { name: 'Erling Haaland', goals: 2, goalMinutes: ['23', '67'], assists: 0, shots: 5, shotsOnTarget: 3, passes: 28, passAccuracy: 92, yellowCards: 1, redCards: 0 },
            { name: 'Rodri', goals: 0, assists: 1, shots: 1, shotsOnTarget: 0, passes: 45, passAccuracy: 88, yellowCards: 0, redCards: 0 }
          ]
        },
        {
          name: 'Liverpool',
          score: 1,
          players: [
            { name: 'Mohamed Salah', goals: 1, goalMinutes: ['45'], assists: 0, shots: 4, shotsOnTarget: 2, passes: 32, passAccuracy: 85, yellowCards: 0, redCards: 0 },
            { name: 'Luis Diaz', goals: 0, assists: 1, shots: 3, shotsOnTarget: 1, passes: 25, passAccuracy: 80, yellowCards: 1, redCards: 0 }
          ]
        }
      ]
    },
    {
      id: 4,
      away: { name: 'Bucks', score: null },
      home: { name: 'Heat', score: null },
      status: 'UPCOMING',
      time: '7:30 PM ET',
      league: 'NBA',
      teams: []
    }
  ],
    tomorrow: [
      {
        id: 201,
        away: { name: 'Nets', score: null },
        home: { name: 'Knicks', score: null },
        status: 'UPCOMING',
        time: '7:00 PM ET',
        league: 'NBA',
        teams: []
      }
    ]
  }

  const games = allGames[selectedDay] || []

  const handleSelectGame = (game) => {
    onSelectGame({ ...game, league: game.league })
  }

  const toggleFollow = (gameId, e) => {
    e.stopPropagation()
    if (followed.includes(gameId)) {
      setFollowed(followed.filter(id => id !== gameId))
    } else {
      setFollowed([...followed, gameId])
    }
    onFollow?.(gameId)
  }

  const toggleSportCollapse = (sport) => {
    if (collapsedSports.includes(sport)) {
      setCollapsedSports(collapsedSports.filter(s => s !== sport))
    } else {
      setCollapsedSports([...collapsedSports, sport])
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Day Toggle - Underline Style */}
      <div style={{ padding: '0 8px 12px 8px', flexShrink: 0, borderBottom: '1px solid #eee' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          {['yesterday', 'today', 'tomorrow'].map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              style={{
                flex: 1,
                padding: '8px 0',
                fontSize: '12px',
                fontWeight: '600',
                color: selectedDay === day ? '#1A1511' : '#999',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: selectedDay === day ? '2px solid #1A1511' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'capitalize'
              }}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Games List - Grouped by Sport */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 8px' }}>
          {/* Group games by sport */}
          {['NBA', 'NFL', 'Soccer'].map((sport) => {
            const sportGames = games.filter(g => g.league === sport)
            if (sportGames.length === 0) return null
            
            return (
              <div key={sport}>
                {/* Sport Header - Clickable */}
                <button
                  onClick={() => toggleSportCollapse(sport)}
                  style={{ 
                    width: '100%',
                    padding: '8px 4px 6px 4px', 
                    marginBottom: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#999', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{sport}</p>
                  <ChevronDown 
                    size={14} 
                    style={{ 
                      color: '#999', 
                      transform: collapsedSports.includes(sport) ? 'rotate(-90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }} 
                  />
                </button>
                
                {/* Games for this sport - Collapsible */}
                {!collapsedSports.includes(sport) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {sportGames.map((game) => (
        <div
          key={game.id}
          className="p-2.5 rounded-lg cursor-pointer transition"
          style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
          onClick={() => handleSelectGame(game)}
        >
          {/* Header: Status + Follow */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              {game.status === 'LIVE' && (
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', animation: 'pulse 2s infinite' }} />
              )}
              <span className="text-xs" style={{ color: '#999' }}>{game.status === 'LIVE' ? `LIVE • ${game.time}` : game.time}</span>
            </div>
            <button
              onClick={(e) => toggleFollow(game.id, e)}
              className="p-0.5 rounded transition btn-micro"
              style={{ backgroundColor: followed.includes(game.id) ? 'rgba(255, 158, 0, 0.1)' : 'transparent' }}
            >
              <Star
                size={12}
                className={followed.includes(game.id) ? 'fill-current' : ''}
                strokeWidth={1.5}
                style={{ color: followed.includes(game.id) ? 'var(--accent-2)' : 'var(--muted)' }}
              />
            </button>
          </div>

          {/* Scores - Side by Side Layout */}
          {game.status === 'UPCOMING' ? (
            <div className="mb-1.5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{game.away.name}</p>
                <p className="text-xs font-semibold" style={{ color: '#666' }}>{game.time}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{game.home.name}</p>
              </div>
            </div>
          ) : (
            <div className="mb-1.5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{game.away.name}</p>
                <p className="text-lg font-bold font-mono-stat" style={{ color: 'var(--text)' }}>{game.away.score}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{game.home.name}</p>
                <p className="text-lg font-bold font-mono-stat" style={{ color: 'var(--text)' }}>{game.home.score}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleSelectGame(game)
              }}
              className="flex-1 py-1 px-1.5 rounded text-xs font-satoshi-bold transition flex items-center justify-center gap-0.5"
              style={{ backgroundColor: 'rgba(255, 77, 109, 0.08)', color: 'var(--accent-1)' }}
            >
              <ChevronRight size={10} strokeWidth={2} />
              Stats
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAskAI?.(game)
              }}
              className="py-1 px-1.5 rounded text-xs transition"
              style={{ backgroundColor: 'rgba(166, 77, 255, 0.08)', color: 'var(--accent-3)' }}
            >
              ✨
            </button>
          </div>
        </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
