import React from 'react'
import { Copy, ThumbsUp, ThumbsDown, TrendingUp } from 'lucide-react'
import SmartChips from './SmartChips'

export default function MessageList({ messages, contextData, onChipClick }) {
  const [copiedId, setCopiedId] = React.useState(null)

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleChipClick = (chip) => {
    if (onChipClick) {
      onChipClick(chip)
    }
  }

  // Sample game log data - LeBron's last 5 games
  const gameLogEmbed = {
    title: "LeBron James' Last 5 Games",
    intro: "LeBron James and the Los Angeles Lakers have played 6 games in the 2024-25 season so far. Here are his detailed stats from the most recent 5 games:",
    games: [
      { date: 'Nov 10, 2024', opponent: 'TOR', result: 'W 123-103', min: 35, pts: 19, reb: 10, ast: 16, stl: 1, blk: 0, fg: '6-14', three: '0-3', ft: '7-7' },
      { date: 'Nov 8, 2024', opponent: 'PHI', result: 'W 116-106', min: 34, pts: 21, reb: 12, ast: 13, stl: 0, blk: 3, fg: '9-14', three: '2-4', ft: '1-1' },
      { date: 'Nov 6, 2024', opponent: 'MEM', result: 'L 114-131', min: 35, pts: 39, reb: 7, ast: 6, stl: 1, blk: 0, fg: '15-24', three: '6-11', ft: '3-4' },
      { date: 'Nov 4, 2024', opponent: 'DET', result: 'L 103-115', min: 40, pts: 20, reb: 8, ast: 11, stl: 2, blk: 0, fg: '7-16', three: '1-2', ft: '5-5' },
      { date: 'Nov 2, 2024', opponent: 'PHO', result: 'W 118-117', min: 37, pts: 24, reb: 9, ast: 8, stl: 1, blk: 1, fg: '9-18', three: '2-6', ft: '4-6' }
    ],
    averages: 'Averages over these 5 games: 24.6 points, 9.2 rebounds, 10.8 assists, 1.0 steals, 0.8 blocks in 36.2 minutes per game. Shooting: 46/62% FG, 22/52% 3PT, 80/88% FT.'
  }

  return (
    <div className="max-w-2xl mx-auto w-full py-4 px-8 lg:px-12">
      {messages.map((msg, idx) => {
        const isLastMessage = idx === messages.length - 1
        const nextMsgIsDifferentSender = idx < messages.length - 1 && messages[idx + 1].sender !== msg.sender
        const gapSize = nextMsgIsDifferentSender ? 'mb-6' : 'mb-2'
        
        return (
        <div key={msg.id} className={`flex message-enter ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} ${gapSize}`}>
          <div style={{ position: 'relative', width: msg.sender === 'ai' ? '100%' : 'auto', maxWidth: msg.sender === 'ai' ? '760px' : 'none' }}>
            <div className={`
              ${msg.sender === 'user' 
                ? 'rounded-2xl px-5 py-3 sm:max-w-md transition-all' 
                : ''
              }
            `}
            style={msg.sender === 'user' ? { 
              backgroundColor: '#F5F3F1', 
              color: '#1A1511',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              fontWeight: '500',
              padding: '16px 20px'
            } : {
              backgroundColor: '#F5F3F1',
              borderRadius: '22px',
              padding: '22px 28px',
              margin: '20px auto',
              boxShadow: '0 6px 18px rgba(0,0,0,0.04), 0 2px 6px rgba(0,0,0,0.03)',
              borderLeft: '4px solid #FF4D6D',
              animation: 'fadeIn 0.25s ease-out'
            }}
            >
            
            <div>
              {msg.sender === 'ai' && (
                <p style={{ 
                  fontSize: '12px', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.3px', 
                  color: '#8a8a8a', 
                  fontWeight: '600', 
                  marginBottom: '6px' 
                }}>Assistant</p>
              )}
              {msg.sender === 'ai' ? (
                <div className="space-y-1.5">
                  {msg.text.split('\n\n').map((paragraph, pIdx) => {
                    const lines = paragraph.split('\n')
                    const isIntro = pIdx === 0 && lines[0].toLowerCase().includes('analyz')
                    
                    return (
                      <div key={pIdx} className="leading-relaxed break-words">
                        {lines.map((line, lIdx) => {
                          const isFirstLine = lIdx === 0 && isIntro
                          return (
                            <p
                              key={lIdx}
                              className={`stream-text ${isFirstLine ? 'italic' : ''}`}
                              style={{
                                fontSize: '14px',
                                lineHeight: '1.6',
                                letterSpacing: '-0.01em',
                                color: '#1A1511',
                                fontWeight: '500',
                                marginBottom: lIdx < lines.length - 1 ? '0.5rem' : '0',
                                animationDelay: `${lIdx * 50}ms`
                              }}
                            >
                              {line}
                            </p>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="leading-relaxed whitespace-pre-wrap text-sm break-words" style={{ color: '#1A1511', fontWeight: '500' }}>
                  {msg.text}
                </p>
              )}

              {/* Game Log Embed */}
              {msg.sender === 'ai' && idx === 0 && (
                <div className="mt-4 rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                  <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text)', fontWeight: '600' }}>{gameLogEmbed.title}</h3>
                    <p className="text-xs mt-2" style={{ color: 'var(--muted)', fontWeight: '400' }}>{gameLogEmbed.intro}</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid var(--border)`, backgroundColor: 'var(--bg)' }}>
                          <th className="text-left p-3" style={{ color: 'var(--text-dim)', fontWeight: '600' }}>Date</th>
                          <th className="text-left p-3" style={{ color: 'var(--text-dim)', fontWeight: '600' }}>Opponent</th>
                          <th className="text-left p-3" style={{ color: 'var(--text-dim)', fontWeight: '600' }}>Result</th>
                          <th className="text-center p-3" style={{ color: 'var(--text-dim)', fontWeight: '600' }}>MIN</th>
                          <th className="text-center p-3" style={{ color: 'var(--text-dim)', fontWeight: '600' }}>PTS</th>
                          <th className="text-center p-3" style={{ color: 'var(--text-dim)', fontWeight: '600' }}>REB</th>
                          <th className="text-center p-3" style={{ color: 'var(--text-dim)', fontWeight: '600' }}>AST</th>
                          <th className="text-center p-3" style={{ color: 'var(--text-dim)', fontWeight: '600' }}>STL</th>
                          <th className="text-center p-3" style={{ color: 'var(--text-dim)', fontWeight: '600' }}>BLK</th>
                          <th className="text-center p-3" style={{ color: 'var(--text-dim)', fontWeight: '600' }}>FG</th>
                          <th className="text-center p-3" style={{ color: 'var(--text-dim)', fontWeight: '600' }}>3PT</th>
                          <th className="text-center p-3" style={{ color: 'var(--text-dim)', fontWeight: '600' }}>FT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gameLogEmbed.games.map((game, gIdx) => (
                          <tr key={gIdx} style={{ borderBottom: `1px solid var(--border)` }}>
                            <td className="p-3" style={{ color: 'var(--text)', fontWeight: '400' }}>{game.date}</td>
                            <td className="p-3" style={{ color: 'var(--text)', fontWeight: '400' }}>{game.opponent}</td>
                            <td className="p-3" style={{ color: game.result.startsWith('W') ? 'var(--accent-1)' : 'var(--muted)', fontWeight: '500' }}>{game.result}</td>
                            <td className="text-center p-3" style={{ color: 'var(--text)', fontWeight: '400' }}>{game.min}</td>
                            <td className="text-center p-3" style={{ color: 'var(--accent-1)', fontWeight: '500' }}>{game.pts}</td>
                            <td className="text-center p-3" style={{ color: 'var(--text)', fontWeight: '400' }}>{game.reb}</td>
                            <td className="text-center p-3" style={{ color: 'var(--text)', fontWeight: '400' }}>{game.ast}</td>
                            <td className="text-center p-3" style={{ color: 'var(--text)', fontWeight: '400' }}>{game.stl}</td>
                            <td className="text-center p-3" style={{ color: 'var(--text)', fontWeight: '400' }}>{game.blk}</td>
                            <td className="text-center p-3" style={{ color: 'var(--text)', fontWeight: '400' }}>{game.fg}</td>
                            <td className="text-center p-3" style={{ color: 'var(--text)', fontWeight: '400' }}>{game.three}</td>
                            <td className="text-center p-3" style={{ color: 'var(--text)', fontWeight: '400' }}>{game.ft}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg)' }}>
                    <p className="text-xs" style={{ color: 'var(--text)', fontWeight: '500' }}>Averages over these 5 games:</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted)', fontWeight: '400' }}>{gameLogEmbed.averages}</p>
                  </div>
                </div>
              )}

              {/* Smart Follow-up Chips - Inside Card */}
              {msg.sender === 'ai' && (
                <div style={{ marginTop: '16px' }}>
                  <SmartChips contextData={contextData} onChipClick={handleChipClick} />
                </div>
              )}
            </div>
          </div>
          
          {/* Floating Action Buttons - Outside Card (Grok style) */}
          {msg.sender === 'ai' && (
            <div style={{ 
              position: 'absolute', 
              left: '-48px', 
              top: '22px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }} className="hidden lg:flex">
              <button
                onClick={() => handleCopy(msg.text, msg.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  opacity: 0.4,
                  cursor: 'pointer',
                  transition: 'opacity 0.15s ease',
                  padding: '6px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.4'}
                title="Copy"
              >
                <Copy size={16} />
              </button>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  opacity: 0.4,
                  cursor: 'pointer',
                  transition: 'opacity 0.15s ease',
                  padding: '6px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.4'}
                title="Good response"
              >
                <ThumbsUp size={16} />
              </button>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  opacity: 0.4,
                  cursor: 'pointer',
                  transition: 'opacity 0.15s ease',
                  padding: '6px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.4'}
                title="Bad response"
              >
                <ThumbsDown size={16} />
              </button>
            </div>
          )}
        </div>
        </div>
        )
      })}
    </div>
  )
}
