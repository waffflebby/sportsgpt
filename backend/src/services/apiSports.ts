import { Game, PlayerStats } from '../types'

const API_SPORTS_KEY = process.env.API_SPORTS_KEY
const BASKETBALL_BASE_URL = 'https://v1.basketball.api-sports.io'
const NFL_BASE_URL = 'https://v1.american-football.api-sports.io'

interface ApiSportsResponse<T> {
  get: string
  parameters: Record<string, any>
  errors: any[]
  results: number
  response: T[]
}

async function apiSportsRequest<T>(url: string): Promise<ApiSportsResponse<T>> {
  const response = await fetch(url, {
    headers: {
      'x-rapidapi-key': API_SPORTS_KEY!,
      'x-rapidapi-host': 'api-sports.io'
    }
  })

  if (!response.ok) {
    throw new Error(`API-Sports request failed: ${response.status}`)
  }

  return response.json()
}

export async function getLiveGames(): Promise<Game[]> {
  try {
    // Get NBA live games
    const nbaUrl = `${BASKETBALL_BASE_URL}/games?live=all`
    const nbaResponse = await apiSportsRequest<any>(nbaUrl)

    // Get NFL live games
    const nflUrl = `${NFL_BASE_URL}/games?live=all`
    const nflResponse = await apiSportsRequest<any>(nflUrl)

    const nbaGames = nbaResponse.response.map((game: any) => ({
      id: game.id,
      home_team: game.teams.home.name,
      away_team: game.teams.away.name,
      home_score: game.scores.home.total || 0,
      away_score: game.scores.away.total || 0,
      status: game.status.long,
      quarter: game.periods.current,
      time: game.status.timer,
      start_time: game.date,
      sport: 'nba'
    }))

    const nflGames = nflResponse.response.map((game: any) => ({
      id: game.game.id,
      home_team: game.teams.home.name,
      away_team: game.teams.away.name,
      home_score: game.scores.home.total || 0,
      away_score: game.scores.away.total || 0,
      status: game.game.status.long,
      quarter: game.game.periods?.current,
      time: game.game.status?.timer,
      start_time: game.game.date?.start,
      sport: 'nfl'
    }))

    return [...nbaGames, ...nflGames].sort((a, b) =>
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    )
  } catch (error) {
    console.error('Error fetching live games:', error)
    return []
  }
}

export async function getGameStats(gameId: number, sport: 'nba' | 'nfl' = 'nba'): Promise<any> {
  try {
    const baseUrl = sport === 'nba' ? BASKETBALL_BASE_URL : NFL_BASE_URL
    const url = `${baseUrl}/games?id=${gameId}`
    const response = await apiSportsRequest<any>(url)

    return response.response[0] || null
  } catch (error) {
    console.error('Error fetching game stats:', error)
    return null
  }
}

export async function getTeamGameLogs(teamId: number, sport: 'nba' | 'nfl' = 'nba'): Promise<any[]> {
  try {
    const baseUrl = sport === 'nba' ? BASKETBALL_BASE_URL : NFL_BASE_URL
    const url = `${baseUrl}/games?team=${teamId}&season=2024&last=10`
    const response = await apiSportsRequest<any>(url)

    return response.response || []
  } catch (error) {
    console.error('Error fetching team logs:', error)
    return []
  }
}

export async function getPlayerStats(playerId: number, sport: 'nba' | 'nfl' = 'nba'): Promise<PlayerStats | null> {
  try {
    const baseUrl = sport === 'nba' ? BASKETBALL_BASE_URL : NFL_BASE_URL

    // Get player info
    const playerUrl = `${baseUrl}/players?id=${playerId}`
    const playerResponse = await apiSportsRequest<any>(playerUrl)
    const player = playerResponse.response[0]

    if (!player) return null

    // Get player statistics
    const statsUrl = `${baseUrl}/players/statistics?id=${playerId}&season=2024`
    const statsResponse = await apiSportsRequest<any>(statsUrl)

    const stats = statsResponse.response[0] || {}

    return {
      bio: {
        id: player.id,
        name: player.firstname + ' ' + player.lastname,
        position: player.position || 'Unknown',
        team: player.team?.name || 'Unknown'
      },
      season_averages: {
        points: stats.points?.average || 0,
        rebounds: stats.totReb?.average || 0,
        assists: stats.assists?.average || 0,
        steals: stats.steals?.average || 0,
        blocks: stats.blocks?.average || 0
      },
      last_5_games: [] // Would need additional API calls to get recent games
    }
  } catch (error) {
    console.error('Error fetching player stats:', error)
    return null
  }
}
