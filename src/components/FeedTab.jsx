import React, { useState } from 'react'
import { Heart, MessageCircle } from 'lucide-react'

export default function FeedTab({ onAskAI }) {
  const [likes, setLikes] = useState({})
  const [selectedSport, setSelectedSport] = useState('all')
  const [selectedGame, setSelectedGame] = useState('all')

  const feedItems = [
    {
      id: 1,
      game: '49ers @ Cowboys',
      sport: 'nfl',
      status: 'LIVE • Q3 10:42',
      player: 'Christian McCaffrey',
      play: 'Receiving TD',
      stats: '45 receiving yards, 1 TD',
      comments: [
        { author: '@DeeSports', text: 'Elite receiving back' },
        { author: '@Jules', text: 'Best RB in the league' }
      ],
      likes: 14
    },
    {
      id: 2,
      game: 'Lakers vs Celtics',
      sport: 'nba',
      status: 'LIVE • Q3 5:42',
      player: 'LeBron James',
      play: '3-Pointer',
      stats: '28 points, 8 rebounds, 6 assists',
      comments: [
        { author: '@HoopsHead', text: 'Still the best' },
        { author: '@CelticsNation', text: 'Unstoppable' }
      ],
      likes: 28
    },
    {
      id: 3,
      game: 'Man City vs Liverpool',
      sport: 'soccer',
      status: 'LIVE • 78\'',
      player: 'Erling Haaland',
      play: 'Goal',
      stats: '2 goals, 5 shots on target',
      comments: [
        { author: '@FootballFan', text: 'Clinical finish' },
        { author: '@CitySupporter', text: 'World class' }
      ],
      likes: 42
    },
    {
      id: 4,
      game: '49ers @ Cowboys',
      sport: 'nfl',
      status: 'LIVE • Q3 10:42',
      player: 'Brock Purdy',
      play: 'Passing TD',
      stats: '245 passing yards, 2 TDs, 0 INTs',
      comments: [
        { author: '@NFLAnalyst', text: 'Efficient game management' },
        { author: '@49ersNation', text: 'Great execution' }
      ],
      likes: 22
    }
  ]

  const filteredFeed = feedItems.filter(item =>
    (selectedSport === 'all' || item.sport === selectedSport) &&
    (selectedGame === 'all' || item.game === selectedGame)
  )

  const toggleLike = (itemId) => {
    setLikes(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  // Get unique games for current sport
  const uniqueGames = ['all', ...new Set(feedItems.filter(item => selectedSport === 'all' || item.sport === selectedSport).map(item => item.game))]

  return (
    <div className="space-y-3">
      {/* Sport Tabs */}
      <div className="flex gap-4 overflow-x-auto pb-3 border-b" style={{ borderColor: '#f1f1f1' }}>
        {['all', 'nba', 'nfl', 'soccer'].map(sport => (
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
              whiteSpace: 'nowrap'
            }}
          >
            {sport === 'all' ? 'All' : sport.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Game Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollBehavior: 'smooth' }}>
        {uniqueGames.map(game => (
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

      {/* Premium Feed Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredFeed.map((item) => (
          <div 
            key={item.id} 
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '16px 20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              border: '1px solid #f1f1f1',
              animation: 'fadeUp 0.25s ease-out'
            }}
          >
            {/* Header: Status + Player */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  background: '#FF4D6D',
                  color: 'white',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>LIVE</span>
                <span style={{ fontSize: '12px', color: '#999' }}>• {item.status.split('•')[1]}</span>
              </div>
              <p style={{ fontSize: '12px', fontWeight: '500', color: '#999' }}>{item.game}</p>
            </div>

            {/* Player + Play - Main Focus */}
            <p style={{ fontSize: '15px', fontWeight: '600', color: '#1A1511', marginBottom: '4px', lineHeight: '1.4' }}>
              {item.player}
            </p>
            
            {/* Play Type + Stats */}
            <p style={{ fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '12px', lineHeight: '1.4' }}>
              {item.play} • {item.stats}
            </p>

            {/* Comment */}
            <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #f5f5f5' }}>
              {item.comments.slice(0, 1).map((comment, idx) => (
                <div key={idx}>
                  <p style={{ fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '4px' }}>
                    {comment.author}
                  </p>
                  <p style={{ fontSize: '13px', color: '#1A1511', lineHeight: '1.4' }}>
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Actions - Inline */}
            <div style={{ display: 'flex', gap: '18px', opacity: 0.88, fontSize: '14px' }}>
              <button
                onClick={() => toggleLike(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  color: likes[item.id] ? '#FF4D6D' : '#999',
                  transition: 'color 0.15s ease',
                  padding: 0
                }}
              >
                <Heart
                  size={16}
                  className={likes[item.id] ? 'fill-current' : ''}
                  strokeWidth={1.5}
                />
                <span>{item.likes + (likes[item.id] ? 1 : 0)}</span>
              </button>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  color: '#999',
                  transition: 'color 0.15s ease',
                  padding: 0
                }}
              >
                <MessageCircle size={16} strokeWidth={1.5} />
                <span>{item.comments.length}</span>
              </button>
              <button
                onClick={() => onAskAI?.(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  color: '#999',
                  transition: 'color 0.15s ease',
                  padding: 0,
                  fontSize: '14px'
                }}
              >
                ✨ Ask
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
