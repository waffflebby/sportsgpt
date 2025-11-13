import React, { useMemo, useState } from 'react'
import { ChevronRight, RefreshCw, Star } from 'lucide-react'

function formatStatus(game) {
  if (!game) return ''
  if (game.status && typeof game.status === 'string') {
    const status = game.status.toUpperCase()
    if (status.includes('LIVE') || status.includes('Q') || status.includes('INNING')) {
      return `LIVE • ${game.time || game.status}`
    }
    if (status.includes('FINAL') || status.includes('END')) {
      return 'FINAL'
    }
    return game.time || game.status
  }
  return game.time || ''
}

function formatTeamName(team, fallback) {
  if (!team) return fallback
  return team.name || team.nickname || team.code || fallback
}

function formatScore(team) {
  if (!team) return '—'
  if (team.score != null) return team.score
  if (team.points != null) return team.points
  return '—'
}

export default function GamesTab({
  games = [],
  isLoading = false,
  error = null,
  onSelectGame,
  onAskAI,
  onFollow,
  onRefresh,
  selectedGameId = null
}) {
  const [followed, setFollowed] = useState([])
  const [selectedSport, setSelectedSport] = useState('all')

  const leagues = useMemo(() => {
    const leagueSet = new Set(
      games
        .filter(Boolean)
        .map((game) => (game.league || game.sport || 'other').toLowerCase())
    )
    return ['all', ...Array.from(leagueSet)]
  }, [games])

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      if (!game) return false
      if (selectedSport === 'all') return true
      return (game.league || game.sport || 'other').toLowerCase() === selectedSport
    })
  }, [games, selectedSport])

  const toggleFollow = (gameId, e) => {
    e.stopPropagation()
    setFollowed((prev) => {
      if (prev.includes(gameId)) {
        return prev.filter((id) => id !== gameId)
      }
      return [...prev, gameId]
    })
    onFollow?.(gameId)
  }

  const handleSelectGame = (game) => {
    if (!game) return
    onSelectGame?.(game)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '0 8px 12px 8px', flexShrink: 0, borderBottom: '1px solid #eee' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', flex: 1, gap: '12px' }}>
            {leagues.map((league) => (
              <button
                key={league}
                onClick={() => setSelectedSport(league)}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  fontSize: '12px',
                  fontWeight: selectedSport === league ? '600' : '500',
                  color: selectedSport === league ? '#1A1511' : '#999',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom:
                    selectedSport === league ? '2px solid #1A1511' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textTransform: league === 'all' ? 'capitalize' : 'uppercase'
                }}
              >
                {league === 'all' ? 'All' : league}
              </button>
            ))}
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              style={{
                border: 'none',
                background: '#f5f5f5',
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Refresh live games"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px 8px' }}>
          {isLoading && (
            <p style={{ fontSize: '12px', color: '#666' }}>Loading live games…</p>
          )}

          {error && !isLoading && (
            <div
              style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#fff5f5',
                color: '#b91c1c',
                fontSize: '12px'
              }}
            >
              {error}
            </div>
          )}

          {!isLoading && !error && filteredGames.length === 0 && (
            <p style={{ fontSize: '12px', color: '#666' }}>
              No games available right now. Try refreshing or check back later.
            </p>
          )}

          {filteredGames.map((game) => {
            const homeTeam = game?.teams?.[0] || {}
            const awayTeam = game?.teams?.[1] || {}
            const isFollowed = followed.includes(game.id)
            const isSelected = selectedGameId === game.id

            return (
              <div
                key={game.id}
                onClick={() => handleSelectGame(game)}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '16px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                  border: isSelected ? '2px solid #FF4D6D' : '1px solid #f1f1f1',
                  cursor: 'pointer',
                  transition: 'border 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: '600', color: '#FF4D6D' }}>
                      {game.league || game.sport || 'LIVE'}
                    </p>
                    <p style={{ fontSize: '12px', color: '#888' }}>{formatStatus(game)}</p>
                  </div>
                  <button
                    onClick={(e) => toggleFollow(game.id, e)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: isFollowed ? '#FF4D6D' : '#ccc',
                      cursor: 'pointer'
                    }}
                    aria-label={isFollowed ? 'Unfollow game' : 'Follow game'}
                  >
                    <Star size={16} fill={isFollowed ? '#FF4D6D' : 'none'} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '15px', fontWeight: '600', color: '#1A1511' }}>
                      {formatTeamName(awayTeam, 'Away')}
                    </p>
                    <p style={{ fontSize: '24px', fontWeight: '700', color: '#1A1511' }}>
                      {formatScore(awayTeam)}
                    </p>
                  </div>
                  <div style={{ width: '32px', textAlign: 'center', color: '#999' }}>@</div>
                  <div style={{ flex: 1, textAlign: 'right' }}>
                    <p style={{ fontSize: '15px', fontWeight: '600', color: '#1A1511' }}>
                      {formatTeamName(homeTeam, 'Home')}
                    </p>
                    <p style={{ fontSize: '24px', fontWeight: '700', color: '#1A1511' }}>
                      {formatScore(homeTeam)}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onAskAI?.(
                        `Give me a quick summary of ${formatTeamName(awayTeam, 'the away team')} vs ${formatTeamName(
                          homeTeam,
                          'the home team'
                        )}`
                      )
                    }}
                    style={{
                      border: '1px solid #f1f1f1',
                      background: 'transparent',
                      borderRadius: '8px',
                      padding: '6px 10px',
                      fontSize: '12px',
                      color: '#1A1511',
                      cursor: 'pointer'
                    }}
                  >
                    Ask AI
                  </button>
                  <ChevronRight size={16} color="#999" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
