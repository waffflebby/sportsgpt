import React, { useEffect, useRef, useState } from 'react'
import SmartChips from './SmartChips'
import Toast from './Toast'
import GamesTab from './GamesTab'
import FeedTab from './FeedTab'
import PlayerStatsDrawer from './PlayerStatsDrawer'
import apiClient from '../lib/api'

const FALLBACK_LEAGUE = 'NBA'

function extractTeamInfo(teamLike, fallbackName, fallbackId) {
  if (!teamLike) {
    return {
      id: fallbackId,
      name: fallbackName,
      score: null,
      quarters: [],
      players: [],
      raw: null
    }
  }

  const quarters = teamLike.quarters || teamLike.linescore || teamLike.periods || []
  const players = teamLike.players || teamLike.statistics || []

  return {
    id: teamLike.id ?? teamLike.team_id ?? teamLike.teamId ?? teamLike.code ?? fallbackId,
    name:
      teamLike.name ||
      teamLike.full_name ||
      teamLike.nickname ||
      teamLike.team ||
      teamLike.abbreviation ||
      fallbackName,
    code: teamLike.code || teamLike.abbreviation || teamLike.short_name || null,
    score:
      teamLike.score ??
      teamLike.points ??
      teamLike.total ??
      teamLike.runs ??
      teamLike.goals ??
      null,
    quarters: Array.isArray(quarters) ? quarters : [],
    players: Array.isArray(players) ? players : [],
    raw: teamLike
  }
}

function normalizeGame(game) {
  if (!game) return null

  const league = game.league || game.sport || game.category || FALLBACK_LEAGUE
  const homeSource =
    game.home_team || game.homeTeam || game.home || game.teams?.home || game.teams?.Home || null
  const awaySource =
    game.away_team || game.awayTeam || game.away || game.teams?.away || game.teams?.Away || null

  const home = extractTeamInfo(
    homeSource,
    homeSource?.nickname || homeSource?.name || 'Home',
    homeSource?.id || homeSource?.team_id || 'home'
  )
  const away = extractTeamInfo(
    awaySource,
    awaySource?.nickname || awaySource?.name || 'Away',
    awaySource?.id || awaySource?.team_id || 'away'
  )

  return {
    id: game.id ?? `${home.name}-${away.name}`,
    league,
    status: game.status || game.phase || game.stage || 'UPCOMING',
    time: game.time || game.clock || game.status_detail || game.scheduled || '',
    startsAt: game.start_time || game.scheduled || null,
    venue: game.venue || game.location || null,
    teams: [home, away],
    raw: game
  }
}

function normalizePlayer(player) {
  if (!player) return null

  const name =
    player.name ||
    player.player ||
    player.player_name ||
    `${player.first_name || ''} ${player.last_name || ''}`.trim()

  const fgMade = player.fgm ?? player.field_goals_made
  const fgAtt = player.fga ?? player.field_goals_attempted
  const threeMade = player.tpm ?? player.three_points_made
  const threeAtt = player.tpa ?? player.three_points_attempted
  const ftMade = player.ftm ?? player.free_throws_made
  const ftAtt = player.fta ?? player.free_throws_attempted

  return {
    ...player,
    name: name || 'Unknown Player',
    pos: player.pos || player.position || player.role || null,
    pts: player.points ?? player.pts ?? null,
    reb: player.rebounds ?? player.reb ?? null,
    ast: player.assists ?? player.ast ?? null,
    stl: player.steals ?? player.stl ?? null,
    blk: player.blocks ?? player.blk ?? null,
    fg:
      player.fg ||
      (fgMade != null && fgAtt != null ? `${fgMade}/${fgAtt}` : undefined),
    three:
      player.three ||
      (threeMade != null && threeAtt != null ? `${threeMade}/${threeAtt}` : undefined),
    ft:
      player.ft ||
      (ftMade != null && ftAtt != null ? `${ftMade}/${ftAtt}` : undefined),
    passYds: player.pass_yards ?? player.passing_yards ?? player.passYds ?? null,
    passTd: player.pass_td ?? player.passing_tds ?? player.passTd ?? null,
    int: player.interceptions ?? player.int ?? player.interceptions_thrown ?? null,
    cmp: player.completions ?? player.cmp ?? null,
    att: player.attempts ?? player.att ?? null,
    rush: player.rush_attempts ?? player.carries ?? player.rush ?? null,
    rushYds: player.rush_yards ?? player.rushYds ?? player.rushing_yards ?? null,
    rushTd: player.rush_td ?? player.rushing_tds ?? player.rushTd ?? null,
    rec: player.receptions ?? player.catches ?? player.rec ?? null,
    recYds: player.receiving_yards ?? player.recYds ?? player.yards_receiving ?? null,
    td: player.touchdowns ?? player.td ?? player.total_tds ?? null,
    goals: player.goals ?? player.goal ?? null,
    goalMinutes:
      player.goal_minutes ||
      player.goalMinutes ||
      player.scoring_minutes ||
      player.minute_list ||
      [],
    assists: player.assists ?? player.ast ?? null,
    shots: player.shots ?? player.total_shots ?? null,
    shotsOnTarget: player.shots_on_target ?? player.shotsOnTarget ?? null,
    passes: player.passes ?? player.total_passes ?? null,
    passAccuracy: player.pass_accuracy ?? player.passAccuracy ?? null,
    yellowCards: player.yellow_cards ?? player.yellowCards ?? null,
    redCards: player.red_cards ?? player.redCards ?? null
  }
}

function enrichGameWithStats(game, details) {
  if (!game || !details) return game

  const enriched = {
    ...game,
    status: details.game?.status || details.status || game.status,
    time:
      details.game?.time ||
      details.game?.clock ||
      details.game?.status_detail ||
      details.time ||
      game.time
  }

  const homeSource =
    details.game?.home_team ||
    details.game?.home ||
    details.home_team ||
    details.home ||
    details.teams?.home ||
    details.teams?.Home
  const awaySource =
    details.game?.away_team ||
    details.game?.away ||
    details.away_team ||
    details.away ||
    details.teams?.away ||
    details.teams?.Away

  if (homeSource || awaySource) {
    const currentHome = extractTeamInfo(
      homeSource,
      game.teams?.[0]?.name || 'Home',
      game.teams?.[0]?.id || 'home'
    )
    const currentAway = extractTeamInfo(
      awaySource,
      game.teams?.[1]?.name || 'Away',
      game.teams?.[1]?.id || 'away'
    )
    enriched.teams = [currentHome, currentAway]
  }

  if (!Array.isArray(enriched.teams)) {
    enriched.teams = game.teams || []
  }

  if (Array.isArray(details.player_stats)) {
    const grouped = [[], []]

    details.player_stats.forEach((player) => {
      const normalisedPlayer = normalizePlayer(player)
      const teamId =
        player.team_id ??
        player.teamId ??
        player.team?.id ??
        player.team?.team_id ??
        player.team
      const teamName =
        (player.team?.name || player.team_name || player.team || '').toString().toLowerCase()

      const [homeTeam, awayTeam] = enriched.teams
      const matchesHome = [
        homeTeam?.id,
        homeTeam?.code,
        homeTeam?.raw?.id,
        homeTeam?.raw?.team_id,
        homeTeam?.raw?.teamId
      ]
        .filter(Boolean)
        .map((value) => value.toString().toLowerCase())
        .includes(teamId?.toString().toLowerCase())

      const matchesHomeByName =
        homeTeam?.name && teamName && homeTeam.name.toLowerCase() === teamName

      const matchesAway = [
        awayTeam?.id,
        awayTeam?.code,
        awayTeam?.raw?.id,
        awayTeam?.raw?.team_id,
        awayTeam?.raw?.teamId
      ]
        .filter(Boolean)
        .map((value) => value.toString().toLowerCase())
        .includes(teamId?.toString().toLowerCase())

      const matchesAwayByName =
        awayTeam?.name && teamName && awayTeam.name.toLowerCase() === teamName

      if (matchesHome || matchesHomeByName) {
        grouped[0].push(normalisedPlayer)
      } else if (matchesAway || matchesAwayByName) {
        grouped[1].push(normalisedPlayer)
      } else if (teamName && homeTeam?.name?.toLowerCase().includes(teamName)) {
        grouped[0].push(normalisedPlayer)
      } else if (teamName && awayTeam?.name?.toLowerCase().includes(teamName)) {
        grouped[1].push(normalisedPlayer)
      } else {
        grouped[0].push(normalisedPlayer)
      }
    })

    if (enriched.teams?.[0]) {
      enriched.teams[0] = { ...enriched.teams[0], players: grouped[0] }
    }
    if (enriched.teams?.[1]) {
      enriched.teams[1] = { ...enriched.teams[1], players: grouped[1] }
    }
  }

  return enriched
}

export default function GameStatsHub({
  open,
  onToggle,
  onAddContext,
  onSidebarQuestion,
  contextData,
  onClearContext,
  isLoading
}) {
  const [toast, setToast] = useState(null)
  const [lastAnswer, setLastAnswer] = useState(null)
  const [activeTab, setActiveTab] = useState('boxscore')
  const [selectedGame, setSelectedGame] = useState(null)
  const [expandedStats, setExpandedStats] = useState(true)
  const [games, setGames] = useState([])
  const [gamesLoading, setGamesLoading] = useState(false)
  const [gamesError, setGamesError] = useState(null)
  const [feedItems, setFeedItems] = useState([])
  const [feedLoading, setFeedLoading] = useState(false)
  const [feedError, setFeedError] = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const isMountedRef = useRef(true)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const fetchGames = async () => {
    if (!isMountedRef.current) return

    setGamesLoading(true)
    setGamesError(null)
    try {
      const liveGames = await apiClient.getLiveGames()
      const list = Array.isArray(liveGames?.games)
        ? liveGames.games
        : Array.isArray(liveGames)
          ? liveGames
          : []
      if (!isMountedRef.current) return
      setGames(list.map(normalizeGame).filter(Boolean))
    } catch (error) {
      if (!isMountedRef.current) return
      setGamesError(error.message || 'Unable to load live games right now.')
    } finally {
      if (isMountedRef.current) {
        setGamesLoading(false)
      }
    }
  }

  const fetchFeed = async () => {
    if (!isMountedRef.current) return

    setFeedLoading(true)
    setFeedError(null)
    try {
      const feedResponse = await apiClient.getFeed()
      const items = Array.isArray(feedResponse?.items)
        ? feedResponse.items
        : Array.isArray(feedResponse)
          ? feedResponse
          : []
      if (!isMountedRef.current) return
      setFeedItems(items)
    } catch (error) {
      if (!isMountedRef.current) return
      setFeedError(error.message || 'Unable to load the activity feed right now.')
    } finally {
      if (isMountedRef.current) {
        setFeedLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchGames()
    const interval = setInterval(fetchGames, 30000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchFeed()
    const interval = setInterval(fetchFeed, 60000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const handleSelectGame = async (game) => {
    setSelectedGame(game)
    setExpandedStats(true)
    setStatsLoading(true)
    try {
      const details = await apiClient.getGameStats(game.id)
      if (isMountedRef.current) {
        setSelectedGame(enrichGameWithStats(game, details))
      }
    } catch (error) {
      console.error('Failed to load game details:', error)
      if (isMountedRef.current) {
        setToast('Unable to load detailed stats for this game right now.')
      }
    } finally {
      if (isMountedRef.current) {
        setStatsLoading(false)
      }
    }
  }

  const handleAskAI = (context) => {
    const question =
      typeof context === 'string'
        ? context
        : `Tell me about: ${context.play || context.name || 'this play'}`
    handleSidebarQuestion(question)
  }

  const handleFollow = (gameId) => {
    setToast(`Game ${gameId} ${selectedGame?.id === gameId ? 'followed' : 'unfollowed'}`)
  }

  const handleRefreshFeed = async () => {
    setFeedLoading(true)
    try {
      await apiClient.refreshFeed()
    } catch (error) {
      console.error('Failed to refresh feed:', error)
    } finally {
      await fetchFeed()
    }
  }

  const selectedLeague = selectedGame?.league || selectedGame?.raw?.league || FALLBACK_LEAGUE

  return (
    <div className="w-full h-screen flex flex-col bg-white overflow-hidden">
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

      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'boxscore' && (
          <>
            {selectedGame ? (
              <div className="space-y-3">
                <PlayerStatsDrawer
                  game={selectedGame}
                  league={selectedLeague}
                  onAddContext={onAddContext}
                  isExpanded={expandedStats}
                  onToggle={() => setExpandedStats(!expandedStats)}
                />
                {statsLoading && (
                  <p className="text-xs text-center text-gray-500">Loading detailed stats…</p>
                )}
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
              <GamesTab
                games={games}
                isLoading={gamesLoading}
                error={gamesError}
                onSelectGame={handleSelectGame}
                onAskAI={handleAskAI}
                onFollow={handleFollow}
                onRefresh={fetchGames}
                selectedGameId={selectedGame?.id ?? null}
              />
            )}
          </>
        )}

        {activeTab === 'feed' && (
          <FeedTab
            items={feedItems}
            isLoading={feedLoading}
            error={feedError}
            onAskAI={handleAskAI}
            onRefresh={handleRefreshFeed}
          />
        )}
      </div>

      {lastAnswer && (
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
          <SmartChips contextData={contextData} onChipClick={handleSmartChip} />
        </div>
      )}

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

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
