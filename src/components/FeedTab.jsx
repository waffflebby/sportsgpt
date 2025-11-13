import React, { useMemo, useState } from 'react'
import { Heart, MessageCircle, RefreshCw } from 'lucide-react'

function normaliseSport(value) {
  if (!value) return 'all'
  return value.toString().toLowerCase()
}

function extractGame(item) {
  return (
    item.game ||
    item.matchup ||
    item.title ||
    `${item.away_team?.name || item.away_team || 'Away'} @ ${item.home_team?.name || item.home_team || 'Home'}`
  )
}

export default function FeedTab({ items = [], isLoading = false, error = null, onAskAI, onRefresh }) {
  const [likes, setLikes] = useState({})
  const [selectedSport, setSelectedSport] = useState('all')
  const [selectedGame, setSelectedGame] = useState('all')

  const sports = useMemo(() => {
    const sportSet = new Set(items.map((item) => normaliseSport(item.sport || item.league)))
    return ['all', ...Array.from(sportSet).filter(Boolean)]
  }, [items])

  const games = useMemo(() => {
    const filtered = items.filter((item) => {
      if (selectedSport === 'all') return true
      return normaliseSport(item.sport || item.league) === selectedSport
    })
    const gameNames = new Set(filtered.map((item) => extractGame(item)))
    return ['all', ...Array.from(gameNames)]
  }, [items, selectedSport])

  const filteredFeed = useMemo(() => {
    return items.filter((item) => {
      const sport = normaliseSport(item.sport || item.league)
      const game = extractGame(item)
      const sportMatches = selectedSport === 'all' || sport === selectedSport
      const gameMatches = selectedGame === 'all' || game === selectedGame
      return sportMatches && gameMatches
    })
  }, [items, selectedSport, selectedGame])

  const toggleLike = (itemId) => {
    setLikes((prev) => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 overflow-x-auto pb-3 border-b" style={{ borderColor: '#f1f1f1' }}>
        {sports.map((sport) => (
          <button
            key={sport}
            onClick={() => {
              setSelectedSport(sport)
              setSelectedGame('all')
            }}
            style={{
              padding: '6px 0',
              fontSize: '13px',
              fontWeight: selectedSport === sport ? '600' : '500',
              color: selectedSport === sport ? '#1A1511' : '#999',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: selectedSport === sport ? '2px solid #FF4D6D' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              textTransform: sport === 'all' ? 'capitalize' : 'uppercase'
            }}
          >
            {sport === 'all' ? 'All' : sport}
          </button>
        ))}
        {onRefresh && (
          <button
            onClick={onRefresh}
            style={{
              marginLeft: 'auto',
              border: 'none',
              background: '#f5f5f5',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Refresh feed"
          >
            <RefreshCw size={14} />
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollBehavior: 'smooth' }}>
        {games.map((game) => (
          <button
            key={game}
            onClick={() => setSelectedGame(game)}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: selectedGame === game ? '600' : '500',
              color: selectedGame === game ? '#1A1511' : '#999',
              backgroundColor: selectedGame === game ? '#f5f5f5' : 'transparent',
              border: '1px solid ' + (selectedGame === game ? '#e0e0e0' : '#f1f1f1'),
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            {game === 'all' ? 'All Games' : game}
          </button>
        ))}
      </div>

      {isLoading && <p style={{ fontSize: '12px', color: '#666' }}>Loading feed…</p>}
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
      {!isLoading && !error && filteredFeed.length === 0 && (
        <p style={{ fontSize: '12px', color: '#666' }}>
          No feed updates yet. Try refreshing or check back later.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredFeed.map((item) => {
          const gameName = extractGame(item)
          const sport = normaliseSport(item.sport || item.league)
          const status = item.status || item.tagline || item.phase || 'Update'
          const headline = item.title || item.player || item.summary || 'Update'
          const body = item.content || item.play || item.description || item.summary || ''

          return (
            <div
              key={item.id || `${gameName}-${headline}`}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '16px 20px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                border: '1px solid #f1f1f1'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    background: '#FF4D6D',
                    color: 'white',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {sport === 'all' ? 'LIVE' : sport.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '12px', color: '#999' }}>{status}</span>
                </div>
                <p style={{ fontSize: '12px', fontWeight: '500', color: '#999' }}>{gameName}</p>
              </div>

              <p style={{ fontSize: '15px', fontWeight: '600', color: '#1A1511', marginBottom: '4px', lineHeight: '1.4' }}>
                {headline}
              </p>

              {body && (
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '12px', lineHeight: '1.4' }}>
                  {body}
                </p>
              )}

              <div style={{ display: 'flex', gap: '18px', opacity: 0.88, fontSize: '14px' }}>
                <button
                  onClick={() => toggleLike(item.id || headline)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    color: likes[item.id || headline] ? '#FF4D6D' : '#999'
                  }}
                >
                  <Heart
                    size={16}
                    fill={likes[item.id || headline] ? '#FF4D6D' : 'none'}
                    strokeWidth={1.5}
                  />
                  {likes[item.id || headline] ? 'Liked' : 'Like'}
                </button>
                <button
                  onClick={() =>
                    onAskAI?.(
                      `Explain this update: ${headline}${body ? ` — ${body}` : ''}`
                    )
                  }
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    color: '#999'
                  }}
                >
                  <MessageCircle size={16} />
                  Ask AI
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
