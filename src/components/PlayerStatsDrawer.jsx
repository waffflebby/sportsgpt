import React, { useState } from 'react'
import { Plus, ChevronUp } from 'lucide-react'

export default function PlayerStatsDrawer({ game, league, onAddContext, isExpanded, onToggle }) {
  const [selectedTeamIdx, setSelectedTeamIdx] = useState(0)

  if (!game) return null

  // Get all players from each team
  const getTeams = () => {
    return game.teams || []
  }

  const teams = getTeams()
  const currentTeam = teams[selectedTeamIdx]

  return (
    <div className="space-y-2">
      {/* Game Summary - Clean Centered Layout */}
      <div className="p-4 rounded-lg border" style={{ borderColor: '#eee', backgroundColor: '#fff', position: 'relative' }}>
        {/* Dropdown Arrow */}
        <button
          onClick={onToggle}
          className="absolute top-4 right-4 p-1 hover:opacity-70 transition"
          style={{ color: 'var(--accent-1)' }}
        >
          <ChevronUp size={16} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {/* Title - Black */}
        <p className="text-sm font-semibold mb-1" style={{ color: '#1A1511', textAlign: 'center' }}>
          {game.teams?.[0]?.name} vs {game.teams?.[1]?.name}
        </p>
        
        {/* Game Status */}
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          {game.status === 'LIVE' ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: '#FF4D6D', borderRadius: '12px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#fff', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#fff', letterSpacing: '0.5px' }}>LIVE • {game.time}</span>
            </div>
          ) : game.status === 'FINAL' ? (
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#666', letterSpacing: '0.5px' }}>FINAL</span>
          ) : (
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#666', letterSpacing: '0.5px' }}>{game.time}</span>
          )}
        </div>

        {/* Scores - Side by Side with Dash */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '32px', fontWeight: '700', color: '#999' }}>{game.teams?.[0]?.score}</p>
          </div>
          <p style={{ fontSize: '24px', fontWeight: '600', color: '#ccc' }}>-</p>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '32px', fontWeight: '700', color: '#999' }}>{game.teams?.[1]?.score}</p>
          </div>
        </div>

        {/* Soccer Goal Scorers */}
        {league === 'Soccer' && (
          <div style={{ marginBottom: '16px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
            {game.teams?.[0]?.players?.filter(p => p.goals > 0).map((p, idx) => (
              <div key={idx}>⚽ {p.name} {p.goalMinutes?.join(', ')}'</div>
            ))}
            {game.teams?.[1]?.players?.filter(p => p.goals > 0).map((p, idx) => (
              <div key={idx}>⚽ {p.name} {p.goalMinutes?.join(', ')}'</div>
            ))}
          </div>
        )}

        {/* Divider */}
        <div style={{ borderTop: '1px solid #f3f3f3', marginBottom: '14px' }} />

        {/* Quarters Grid - Labels on Top */}
        {game.teams?.[0]?.quarters && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', maxWidth: '240px', margin: '0 auto' }}>
            {/* Quarter Labels - Black on Top */}
            {game.teams[0].quarters.map((_, idx) => (
              <div key={`label-${idx}`} style={{ textAlign: 'center', color: '#1A1511', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                Q{idx + 1}
              </div>
            ))}
            {/* Quarter Values - Grey Below */}
            {game.teams[0].quarters.map((q, idx) => (
              <div key={`val-${idx}`} style={{ textAlign: 'center', fontWeight: '600', fontSize: '15px', color: '#999' }}>
                {q}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expanded Player Stats - Table Format */}
      {isExpanded && currentTeam && (
        <div className="animate-fade-in-up space-y-2">
          {/* Team Toggle Switch */}
          <div className="flex gap-1 p-1 rounded-lg" style={{ backgroundColor: 'var(--bg)' }}>
            {teams.map((team, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedTeamIdx(idx)}
                className="flex-1 py-1.5 px-2 rounded text-xs font-satoshi-bold transition-all"
                style={{
                  backgroundColor: selectedTeamIdx === idx ? 'var(--accent-1)' : 'transparent',
                  color: selectedTeamIdx === idx ? 'white' : 'var(--text-dim)'
                }}
              >
                {team.name}
              </button>
            ))}
          </div>

          {/* Stats Table - Sport Specific */}
          {league === 'NFL' ? (
            <div className="space-y-3">
              {/* Passing Stats */}
              {currentTeam.players?.filter(p => p.pos === 'QB').length > 0 && (
                <div className="rounded border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                  <div className="p-2 border-b" style={{ borderColor: 'var(--border)', backgroundColor: '#f9f9f9' }}>
                    <p className="text-xs font-satoshi-bold" style={{ color: 'var(--text)' }}>Passing</p>
                  </div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ borderBottom: `1px solid var(--border)` }}>
                        <th className="text-left p-2 font-satoshi-bold" style={{ color: 'var(--text-dim)', minWidth: '100px' }}>Player</th>
                        <th className="text-center p-2 font-satoshi-bold" style={{ color: 'var(--text-dim)' }}>YDS</th>
                        <th className="text-center p-2 font-satoshi-bold" style={{ color: 'var(--text-dim)' }}>TD</th>
                        <th className="text-center p-2 font-satoshi-bold" style={{ color: 'var(--text-dim)' }}>INT</th>
                        <th className="text-center p-2 font-satoshi-bold" style={{ color: 'var(--text-dim)' }}>CMP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTeam.players?.filter(p => p.pos === 'QB').map((player, idx) => (
                        <tr key={idx} className="group hover:opacity-80 transition" style={{ borderBottom: `1px solid var(--border)` }}>
                          <td className="text-left p-2 font-satoshi-bold truncate" style={{ color: 'var(--text)' }}>{player.name}</td>
                          <td className="text-center p-2 font-mono-stat" style={{ color: 'var(--accent-1)' }}>{player.passYds || 0}</td>
                          <td className="text-center p-2 font-mono-stat" style={{ color: 'var(--text-dim)' }}>{player.passTd || 0}</td>
                          <td className="text-center p-2 font-mono-stat" style={{ color: 'var(--text-dim)' }}>{player.int || 0}</td>
                          <td className="text-center p-2 font-mono-stat text-xs" style={{ color: 'var(--text-dim)' }}>{player.cmp || 0}/{player.att || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Receiving Stats */}
              {currentTeam.players?.filter(p => p.pos === 'WR' || p.pos === 'TE').length > 0 && (
                <div className="rounded border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                  <div className="p-2 border-b" style={{ borderColor: 'var(--border)', backgroundColor: '#f9f9f9' }}>
                    <p className="text-xs font-satoshi-bold" style={{ color: 'var(--text)' }}>Receiving</p>
                  </div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ borderBottom: `1px solid var(--border)` }}>
                        <th className="text-left p-2 font-satoshi-bold" style={{ color: 'var(--text-dim)', minWidth: '100px' }}>Player</th>
                        <th className="text-center p-2 font-satoshi-bold" style={{ color: 'var(--text-dim)' }}>REC</th>
                        <th className="text-center p-2 font-satoshi-bold" style={{ color: 'var(--text-dim)' }}>YDS</th>
                        <th className="text-center p-2 font-satoshi-bold" style={{ color: 'var(--text-dim)' }}>TD</th>
                        <th className="text-center p-2 font-satoshi-bold" style={{ color: 'var(--text-dim)' }}>AVG</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTeam.players?.filter(p => p.pos === 'WR' || p.pos === 'TE').map((player, idx) => (
                        <tr key={idx} className="group hover:opacity-80 transition" style={{ borderBottom: `1px solid var(--border)` }}>
                          <td className="text-left p-2 font-satoshi-bold truncate" style={{ color: 'var(--text)' }}>{player.name}</td>
                          <td className="text-center p-2 font-mono-stat" style={{ color: 'var(--accent-1)' }}>{player.rec || 0}</td>
                          <td className="text-center p-2 font-mono-stat" style={{ color: 'var(--text-dim)' }}>{player.recYds || 0}</td>
                          <td className="text-center p-2 font-mono-stat" style={{ color: 'var(--text-dim)' }}>{player.td || 0}</td>
                          <td className="text-center p-2 font-mono-stat text-xs" style={{ color: 'var(--text-dim)' }}>{player.rec > 0 ? (player.recYds / player.rec).toFixed(1) : '0.0'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Rushing Stats */}
              {currentTeam.players?.filter(p => p.pos === 'RB').length > 0 && (
                <div className="rounded border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                  <div className="p-2 border-b" style={{ borderColor: 'var(--border)', backgroundColor: '#f9f9f9' }}>
                    <p className="text-xs font-satoshi-bold" style={{ color: 'var(--text)' }}>Rushing</p>
                  </div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ borderBottom: `1px solid var(--border)` }}>
                        <th className="text-left p-2 font-satoshi-bold" style={{ color: 'var(--text-dim)', minWidth: '100px' }}>Player</th>
                        <th className="text-center p-2 font-satoshi-bold" style={{ color: 'var(--text-dim)' }}>CAR</th>
                        <th className="text-center p-2 font-satoshi-bold" style={{ color: 'var(--text-dim)' }}>YDS</th>
                        <th className="text-center p-2 font-satoshi-bold" style={{ color: 'var(--text-dim)' }}>TD</th>
                        <th className="text-center p-2 font-satoshi-bold" style={{ color: 'var(--text-dim)' }}>AVG</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTeam.players?.filter(p => p.pos === 'RB').map((player, idx) => (
                        <tr key={idx} className="group hover:opacity-80 transition" style={{ borderBottom: `1px solid var(--border)` }}>
                          <td className="text-left p-2 font-satoshi-bold truncate" style={{ color: 'var(--text)' }}>{player.name}</td>
                          <td className="text-center p-2 font-mono-stat" style={{ color: 'var(--accent-1)' }}>{player.rush || 0}</td>
                          <td className="text-center p-2 font-mono-stat" style={{ color: 'var(--text-dim)' }}>{player.rushYds || 0}</td>
                          <td className="text-center p-2 font-mono-stat" style={{ color: 'var(--text-dim)' }}>{player.rushTd || 0}</td>
                          <td className="text-center p-2 font-mono-stat text-xs" style={{ color: 'var(--text-dim)' }}>{player.rush > 0 ? (player.rushYds / player.rush).toFixed(1) : '0.0'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded border overflow-x-auto" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: `1px solid var(--border)` }}>
                    <th className="text-left p-2 font-satoshi-bold" style={{ color: 'var(--text-dim)', minWidth: '100px' }}>Player</th>
                    {league === 'NBA' && (
                      <>
                        <th className="text-center p-2 font-satoshi-bold" style={{ color: 'var(--text-dim)', minWidth: '32px' }}>PTS</th>
                        <th className="text-center p-2 font-satoshi-bold" style={{ color: 'var(--text-dim)', minWidth: '32px' }}>REB</th>
                        <th className="text-center p-2 font-satoshi-bold" style={{ color: 'var(--text-dim)', minWidth: '32px' }}>AST</th>
                        <th className="text-center p-2 font-satoshi-bold" style={{ color: 'var(--text-dim)', minWidth: '32px' }}>3PT</th>
                      </>
                    )}
                    {league === 'Soccer' && (
                      <>
                        <th className="text-center p-2 font-satoshi-bold" style={{ color: 'var(--text-dim)', minWidth: '32px' }}>G</th>
                        <th className="text-center p-2 font-satoshi-bold" style={{ color: 'var(--text-dim)', minWidth: '32px' }}>A</th>
                        <th className="text-center p-2 font-satoshi-bold" style={{ color: 'var(--text-dim)', minWidth: '32px' }}>SH</th>
                        <th className="text-center p-2 font-satoshi-bold" style={{ color: 'var(--text-dim)', minWidth: '32px' }}>🟨</th>
                        <th className="text-center p-2 font-satoshi-bold" style={{ color: 'var(--text-dim)', minWidth: '32px' }}>🟥</th>
                      </>
                    )}
                    <th className="text-center p-2 font-satoshi-bold" style={{ color: 'var(--text-dim)', minWidth: '24px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {currentTeam.players?.map((player, idx) => (
                    <tr key={idx} className="group hover:opacity-80 transition" style={{ borderBottom: `1px solid var(--border)` }}>
                      <td className="text-left p-2 font-satoshi-bold truncate" style={{ color: 'var(--text)' }}>
                        {player.name}
                      </td>
                      {league === 'NBA' && (
                        <>
                          <td className="text-center p-2 font-mono-stat" style={{ color: 'var(--accent-1)' }}>{player.pts}</td>
                          <td className="text-center p-2 font-mono-stat" style={{ color: 'var(--text-dim)' }}>{player.reb}</td>
                          <td className="text-center p-2 font-mono-stat" style={{ color: 'var(--text-dim)' }}>{player.ast}</td>
                          <td className="text-center p-2 font-mono-stat text-xs" style={{ color: 'var(--text-dim)' }}>{player.three}</td>
                        </>
                      )}
                      {league === 'Soccer' && (
                        <>
                          <td className="text-center p-2 font-mono-stat" style={{ color: 'var(--accent-1)' }}>{player.goals || 0}</td>
                          <td className="text-center p-2 font-mono-stat" style={{ color: 'var(--text-dim)' }}>{player.assists || 0}</td>
                          <td className="text-center p-2 font-mono-stat" style={{ color: 'var(--text-dim)' }}>{player.shots || 0}</td>
                          <td className="text-center p-2 font-mono-stat" style={{ color: '#FFD700' }}>{player.yellowCards || 0}</td>
                          <td className="text-center p-2 font-mono-stat" style={{ color: '#FF4444' }}>{player.redCards || 0}</td>
                        </>
                      )}
                      <td className="text-center p-2">
                        <button
                          onClick={() => onAddContext({ title: `${player.name} Stats`, icon: '📊' })}
                          className="p-1 rounded transition opacity-0 group-hover:opacity-100"
                          style={{ color: 'var(--accent-1)' }}
                        >
                          <Plus size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
