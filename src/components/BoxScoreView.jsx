import React, { useState } from 'react'
import { ChevronDown, Plus, ChevronLeft } from 'lucide-react'

export default function BoxScoreView({ game, onAddContext, league, onBack }) {
  const [expandedTeam, setExpandedTeam] = useState(null)
  const [expandedPlayer, setExpandedPlayer] = useState(null)

  // Sport-specific stats
  const getPlayerStats = (league) => {
    if (league === 'NBA') {
      return {
        game1: {
          title: 'Lakers vs Celtics',
          teams: [
            {
              name: 'Lakers',
              score: 78,
              quarters: [28, 22, 28, 0],
              players: [
                { name: 'LeBron James', pts: 28, reb: 8, ast: 6, fg: '11/18', three: '2/4', ft: '4/5', stl: 2, blk: 1 },
                { name: 'Anthony Davis', pts: 24, reb: 12, ast: 2, fg: '9/15', three: '0/1', ft: '6/8', stl: 1, blk: 3 },
                { name: 'Austin Reaves', pts: 18, reb: 3, ast: 4, fg: '7/12', three: '2/5', ft: '2/2', stl: 1, blk: 0 }
              ]
            },
            {
              name: 'Celtics',
              score: 75,
              quarters: [26, 24, 25, 0],
              players: [
                { name: 'Jayson Tatum', pts: 32, reb: 9, ast: 5, fg: '12/20', three: '3/7', ft: '5/6', stl: 2, blk: 2 },
                { name: 'Jaylen Brown', pts: 22, reb: 7, ast: 3, fg: '8/16', three: '1/4', ft: '5/6', stl: 1, blk: 1 },
                { name: 'Derrick White', pts: 14, reb: 4, ast: 8, fg: '5/11', three: '2/5', ft: '2/2', stl: 3, blk: 0 }
              ]
            }
          ]
        }
      }
    } else if (league === 'NFL') {
      return {
        game1: {
          title: '49ers vs Cowboys',
          teams: [
            {
              name: '49ers',
              score: 24,
              quarters: [7, 10, 7, 0],
              players: [
                { name: 'Christian McCaffrey', pos: 'RB', rec: 8, recYds: 92, td: 1, rush: 18, rushYds: 87, rushTd: 1 },
                { name: 'Brandon Aiyuk', pos: 'WR', rec: 6, recYds: 78, td: 0, rush: 0, rushYds: 0, rushTd: 0 },
                { name: 'Jauan Jennings', pos: 'WR', rec: 4, recYds: 52, td: 1, rush: 2, rushYds: 8, rushTd: 0 }
              ]
            },
            {
              name: 'Cowboys',
              score: 21,
              quarters: [7, 7, 7, 0],
              players: [
                { name: 'CeeDee Lamb', pos: 'WR', rec: 9, recYds: 124, td: 1, rush: 0, rushYds: 0, rushTd: 0 },
                { name: 'Ezekiel Elliott', pos: 'RB', rec: 3, recYds: 18, td: 0, rush: 14, rushYds: 52, rushTd: 0 },
                { name: 'Michael Gallup', pos: 'WR', rec: 5, recYds: 68, td: 0, rush: 0, rushYds: 0, rushTd: 0 }
              ]
            }
          ]
        }
      }
    } else if (league === 'Soccer') {
      return {
        game1: {
          title: 'Man City vs Liverpool',
          teams: [
            {
              name: 'Man City',
              score: 2,
              quarters: [1, 1, 0, 0],
              players: [
                { name: 'Erling Haaland', pos: 'ST', goals: 1, assists: 0, shots: 5, shotsOnTarget: 3, passes: 28, passAccuracy: 85 },
                { name: 'Bernardo Silva', pos: 'MF', goals: 1, assists: 0, shots: 2, shotsOnTarget: 1, passes: 42, passAccuracy: 92 },
                { name: 'Phil Foden', pos: 'MF', goals: 0, assists: 1, shots: 3, shotsOnTarget: 2, passes: 35, passAccuracy: 88 }
              ]
            },
            {
              name: 'Liverpool',
              score: 1,
              quarters: [0, 1, 0, 0],
              players: [
                { name: 'Mohamed Salah', pos: 'FW', goals: 1, assists: 0, shots: 4, shotsOnTarget: 2, passes: 31, passAccuracy: 84 },
                { name: 'Luis Diaz', pos: 'FW', goals: 0, assists: 0, shots: 3, shotsOnTarget: 1, passes: 24, passAccuracy: 79 },
                { name: 'Alexis Mac Allister', pos: 'MF', goals: 0, assists: 1, shots: 1, shotsOnTarget: 0, passes: 48, passAccuracy: 91 }
              ]
            }
          ]
        }
      }
    }
  }

  const stats = getPlayerStats(league)
  const gameStats = stats.game1

  const renderPlayerStats = (player, league) => {
    if (league === 'NBA') {
      return (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-50 p-1.5 rounded">
            <p className="font-mono-stat">{player.pts}</p>
            <p className="text-gray-600 text-xs">PTS</p>
          </div>
          <div className="bg-gray-50 p-1.5 rounded">
            <p className="font-mono-stat">{player.reb}</p>
            <p className="text-gray-600 text-xs">REB</p>
          </div>
          <div className="bg-gray-50 p-1.5 rounded">
            <p className="font-mono-stat">{player.ast}</p>
            <p className="text-gray-600 text-xs">AST</p>
          </div>
          <div className="bg-gray-50 p-1.5 rounded">
            <p className="font-mono-stat">{player.fg}</p>
            <p className="text-gray-600 text-xs">FG</p>
          </div>
          <div className="bg-gray-50 p-1.5 rounded">
            <p className="font-mono-stat">{player.three}</p>
            <p className="text-gray-600 text-xs">3PT</p>
          </div>
          <div className="bg-gray-50 p-1.5 rounded">
            <p className="font-mono-stat">{player.stl}</p>
            <p className="text-gray-600 text-xs">STL</p>
          </div>
        </div>
      )
    } else if (league === 'NFL') {
      return (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-50 p-1.5 rounded">
            <p className="font-mono-stat">{player.rec}</p>
            <p className="text-gray-600 text-xs">REC</p>
          </div>
          <div className="bg-gray-50 p-1.5 rounded">
            <p className="font-mono-stat">{player.recYds}</p>
            <p className="text-gray-600 text-xs">YDS</p>
          </div>
          <div className="bg-gray-50 p-1.5 rounded">
            <p className="font-mono-stat">{player.rush}</p>
            <p className="text-gray-600 text-xs">RUSH</p>
          </div>
          <div className="bg-gray-50 p-1.5 rounded">
            <p className="font-mono-stat">{player.rushYds}</p>
            <p className="text-gray-600 text-xs">RYD</p>
          </div>
          <div className="bg-gray-50 p-1.5 rounded">
            <p className="font-mono-stat">{player.td}</p>
            <p className="text-gray-600 text-xs">TD</p>
          </div>
        </div>
      )
    } else if (league === 'Soccer') {
      return (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-50 p-1.5 rounded">
            <p className="font-mono-stat">{player.goals}</p>
            <p className="text-gray-600 text-xs">GOALS</p>
          </div>
          <div className="bg-gray-50 p-1.5 rounded">
            <p className="font-mono-stat">{player.assists}</p>
            <p className="text-gray-600 text-xs">AST</p>
          </div>
          <div className="bg-gray-50 p-1.5 rounded">
            <p className="font-mono-stat">{player.shots}</p>
            <p className="text-gray-600 text-xs">SHOTS</p>
          </div>
          <div className="bg-gray-50 p-1.5 rounded">
            <p className="font-mono-stat">{player.shotsOnTarget}</p>
            <p className="text-gray-600 text-xs">SOT</p>
          </div>
          <div className="bg-gray-50 p-1.5 rounded">
            <p className="font-mono-stat">{player.passes}</p>
            <p className="text-gray-600 text-xs">PASS</p>
          </div>
          <div className="bg-gray-50 p-1.5 rounded">
            <p className="font-mono-stat">{player.passAccuracy}%</p>
            <p className="text-gray-600 text-xs">ACC</p>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="space-y-3">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-satoshi-bold hover:opacity-70 transition mb-2"
          style={{ color: 'var(--accent-1)' }}
        >
          <ChevronLeft size={16} />
          Back to Games
        </button>
      )}
      
      {/* Box Score - Clean Centered Layout */}
      <div style={{ padding: '0', maxWidth: '400px', margin: '0 auto' }}>
        {/* Title */}
        <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text)', textAlign: 'center' }}>{gameStats.teams[0]?.name} vs {gameStats.teams[1]?.name}</p>
        
        {/* Scores - Centered */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#999', marginBottom: '6px' }}>{gameStats.teams[0]?.name}</p>
            <p style={{ fontSize: '36px', fontWeight: '700', color: 'var(--text)' }}>{gameStats.teams[0]?.score}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#999', marginBottom: '6px' }}>{gameStats.teams[1]?.name}</p>
            <p style={{ fontSize: '36px', fontWeight: '700', color: 'var(--text)' }}>{gameStats.teams[1]?.score}</p>
          </div>
        </div>
        
        {/* Divider */}
        <div style={{ borderTop: '1px solid #f3f3f3', marginBottom: '16px' }} />
        
        {/* Quarters Grid - Centered */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', maxWidth: '280px', margin: '0 auto' }}>
          {/* Quarter Values */}
          {gameStats.teams[0]?.quarters.map((q, idx) => (
            <div key={`q-${idx}`} style={{ textAlign: 'center', fontWeight: '600', fontSize: '16px', color: 'var(--text)' }}>{q}</div>
          ))}
          {/* Quarter Labels */}
          {gameStats.teams[0]?.quarters.map((_, idx) => (
            <div key={`ql-${idx}`} style={{ textAlign: 'center', color: '#a99e92', fontSize: '13px', marginTop: '-4px' }}>Q{idx + 1}</div>
          ))}
        </div>
      </div>
      
      {gameStats.teams.map((team, idx) => (
        <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3">
          {/* Team Header */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{team.name}</p>
            </div>
            <p className="text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>{team.score}</p>
            
            {/* Divider */}
            <div style={{ borderTop: '1px solid #f3f3f3', marginBottom: '14px' }} />
            
            {/* Quarter Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {/* Quarter Values */}
              {team.quarters.map((q, qidx) => (
                <div key={`val-${qidx}`} style={{ textAlign: 'center', fontWeight: '600', fontSize: '15px', color: 'var(--text)' }}>
                  {q}
                </div>
              ))}
              {/* Quarter Labels */}
              {team.quarters.map((_, qidx) => (
                <div key={`label-${qidx}`} style={{ textAlign: 'center', color: '#a99e92', fontSize: '13px', marginTop: '-4px' }}>
                  Q{qidx + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Expand Players */}
          <button
            onClick={() => setExpandedTeam(expandedTeam === idx ? null : idx)}
            className="w-full py-2 text-xs font-satoshi-bold text-blue-600 hover:bg-blue-50 rounded transition flex items-center justify-center gap-1"
          >
            {expandedTeam === idx ? 'Hide' : 'View'} Players
            <ChevronDown size={12} className={`transition ${expandedTeam === idx ? 'rotate-180' : ''}`} />
          </button>

          {/* Players Grid - Horizontal */}
          {expandedTeam === idx && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                {team.players.map((player, pidx) => (
                  <div key={pidx} className="p-2 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-satoshi-bold" style={{ color: 'var(--text)' }}>{player.name}</p>
                      <button
                        onClick={() => onAddContext({ title: `${player.name} Stats`, icon: '📊' })}
                        className="p-1 rounded transition"
                        style={{ color: 'var(--accent-1)' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    {/* Horizontal Stats Grid */}
                    <div className="grid grid-cols-6 gap-1.5 text-xs">
                      {league === 'NBA' && (
                        <>
                          <div className="text-center">
                            <p className="font-mono-stat">{player.pts}</p>
                            <p className="text-xs" style={{ color: 'var(--muted)' }}>PTS</p>
                          </div>
                          <div className="text-center">
                            <p className="font-mono-stat">{player.reb}</p>
                            <p className="text-xs" style={{ color: 'var(--muted)' }}>REB</p>
                          </div>
                          <div className="text-center">
                            <p className="font-mono-stat">{player.ast}</p>
                            <p className="text-xs" style={{ color: 'var(--muted)' }}>AST</p>
                          </div>
                          <div className="text-center">
                            <p className="font-mono-stat text-xs">{player.fg}</p>
                            <p className="text-xs" style={{ color: 'var(--muted)' }}>FG</p>
                          </div>
                          <div className="text-center">
                            <p className="font-mono-stat text-xs">{player.three}</p>
                            <p className="text-xs" style={{ color: 'var(--muted)' }}>3PT</p>
                          </div>
                          <div className="text-center">
                            <p className="font-mono-stat">{player.stl}</p>
                            <p className="text-xs" style={{ color: 'var(--muted)' }}>STL</p>
                          </div>
                        </>
                      )}
                      {league === 'NFL' && (
                        <>
                          <div className="text-center">
                            <p className="font-mono-stat">{player.rec}</p>
                            <p className="text-xs" style={{ color: 'var(--muted)' }}>REC</p>
                          </div>
                          <div className="text-center">
                            <p className="font-mono-stat">{player.recYds}</p>
                            <p className="text-xs" style={{ color: 'var(--muted)' }}>YDS</p>
                          </div>
                          <div className="text-center">
                            <p className="font-mono-stat">{player.rush}</p>
                            <p className="text-xs" style={{ color: 'var(--muted)' }}>RUSH</p>
                          </div>
                          <div className="text-center">
                            <p className="font-mono-stat">{player.rushYds}</p>
                            <p className="text-xs" style={{ color: 'var(--muted)' }}>RYD</p>
                          </div>
                          <div className="text-center">
                            <p className="font-mono-stat">{player.td}</p>
                            <p className="text-xs" style={{ color: 'var(--muted)' }}>TD</p>
                          </div>
                        </>
                      )}
                      {league === 'Soccer' && (
                        <>
                          <div className="text-center">
                            <p className="font-mono-stat">{player.goals}</p>
                            <p className="text-xs" style={{ color: 'var(--muted)' }}>GOALS</p>
                          </div>
                          <div className="text-center">
                            <p className="font-mono-stat">{player.assists}</p>
                            <p className="text-xs" style={{ color: 'var(--muted)' }}>AST</p>
                          </div>
                          <div className="text-center">
                            <p className="font-mono-stat">{player.shots}</p>
                            <p className="text-xs" style={{ color: 'var(--muted)' }}>SHOTS</p>
                          </div>
                          <div className="text-center">
                            <p className="font-mono-stat">{player.shotsOnTarget}</p>
                            <p className="text-xs" style={{ color: 'var(--muted)' }}>SOT</p>
                          </div>
                          <div className="text-center">
                            <p className="font-mono-stat text-xs">{player.passes}</p>
                            <p className="text-xs" style={{ color: 'var(--muted)' }}>PASS</p>
                          </div>
                          <div className="text-center">
                            <p className="font-mono-stat text-xs">{player.passAccuracy}%</p>
                            <p className="text-xs" style={{ color: 'var(--muted)' }}>ACC</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
