import React, { useMemo, useState } from 'react'
import { Sparkles } from 'lucide-react'

export default function DynamicPrompts({ onSelectPrompt, contextData, gameData, compact = false }) {
  const [clickedIdx, setClickedIdx] = useState(null)
  // Color coding by intent
  const intentColors = {
    analysis: { bg: 'rgba(255, 77, 109, 0.08)', text: 'var(--accent-1)' },      // Coral - Live analysis
    comparison: { bg: 'rgba(255, 158, 0, 0.08)', text: 'var(--accent-2)' },    // Amber - Comparisons
    prediction: { bg: 'rgba(166, 77, 255, 0.08)', text: 'var(--accent-3)' },   // Violet - Predictions
    insight: { bg: 'rgba(48, 230, 230, 0.08)', text: '#30E6E6' }               // Cyan - Insights
  }

  const prompts = useMemo(() => {
    if (!contextData) {
      // Default prompts when no context
      return [
        { 
          title: 'LeBron vs Giannis this season', 
          icon: '⭐', 
          desc: 'Head-to-head stats',
          intent: 'comparison'
        },
        { 
          title: 'Lakers playoff chances', 
          icon: '📈', 
          desc: 'Real-time odds',
          intent: 'prediction'
        },
        { 
          title: 'Live game analysis', 
          icon: '🔴', 
          desc: 'What\'s happening now',
          intent: 'analysis'
        },
        { 
          title: 'Best trades this offseason', 
          icon: '⚡', 
          desc: 'Market insights',
          intent: 'insight'
        }
      ]
    }
    
    // Smart prompts based on context type
    const isPlayer = contextData.title?.includes('Stats')
    const isGame = gameData?.teams?.length > 0
    
    if (isPlayer) {
      return [
        { 
          title: `${contextData.title.replace(' Stats', '')} vs league average`, 
          icon: '📊', 
          desc: 'Performance ranking',
          intent: 'comparison'
        },
        { 
          title: `Why ${contextData.title.replace(' Stats', '')} is key today`, 
          icon: '🔴', 
          desc: 'Game impact analysis',
          intent: 'analysis'
        },
        { 
          title: `${contextData.title.replace(' Stats', '')} career trajectory`, 
          icon: '📈', 
          desc: 'Trend analysis',
          intent: 'insight'
        },
        { 
          title: `Betting props on ${contextData.title.replace(' Stats', '')}`, 
          icon: '💰', 
          desc: 'Vegas opportunities',
          intent: 'prediction'
        }
      ]
    }
    
    if (isGame) {
      const team1 = gameData?.teams?.[0]?.name || 'Team A'
      const team2 = gameData?.teams?.[1]?.name || 'Team B'
      return [
        { 
          title: `${team1} vs ${team2} head-to-head`, 
          icon: '⚡', 
          desc: 'Historical matchup data',
          intent: 'comparison'
        },
        { 
          title: `Live play-by-play breakdown`, 
          icon: '🔴', 
          desc: 'What\'s happening now',
          intent: 'analysis'
        },
        { 
          title: `Game log`, 
          icon: '📊', 
          desc: 'Last 5 games stats',
          intent: 'insight'
        },
        { 
          title: `Key player matchups to watch`, 
          icon: '👥', 
          desc: 'Strategic insights',
          intent: 'insight'
        }
      ]
    }
    
    // Fallback
    return [
      { 
        title: `Deep dive: ${contextData.title}`, 
        icon: '📊', 
        desc: 'Full analysis',
        intent: 'analysis'
      },
      { 
        title: `Compare ${contextData.title}`, 
        icon: '🔄', 
        desc: 'vs others',
        intent: 'comparison'
      },
      { 
        title: `Predict ${contextData.title}`, 
        icon: '🎯', 
        desc: 'Next outcome',
        intent: 'prediction'
      },
      { 
        title: `Insights on ${contextData.title}`, 
        icon: '💡', 
        desc: 'Hidden patterns',
        intent: 'insight'
      }
    ]
  }, [contextData, gameData])

  // Always use compact tag style
  return (
    <div style={{ 
      display: 'flex', 
      gap: '6px', 
      overflowX: 'auto', 
      paddingBottom: '4px',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      WebkitOverflowScrolling: 'touch'
    }}>
      {prompts.map((prompt, idx) => (
        <button
          key={idx}
          onClick={() => onSelectPrompt(prompt.title, 'starter')}
          className="flex-shrink-0 transition-all hover:opacity-70 active:opacity-50"
          style={{
            padding: '5px 10px',
            backgroundColor: '#f3f3f3',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500',
            color: '#333',
            whiteSpace: 'nowrap',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {prompt.title}
        </button>
      ))}
    </div>
  )
}
