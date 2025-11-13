import { Elysia, t } from 'elysia'
import { getLiveGames, getGameStats, getTeamGameLogs } from '../services/apiSports'

export const gamesRoutes = new Elysia({ prefix: '/games' })
  .get('/live', async () => {
    try {
      const games = await getLiveGames()
      return { games }
    } catch (error) {
      console.error('Live games error:', error)
      return { error: 'Failed to fetch live games', games: [] }
    }
  })
  .get('/:gameId/stats', async ({ params }) => {
    const { gameId } = params

    try {
      // Try NBA first
      let game = await getGameStats(parseInt(gameId), 'nba')

      // If not found, try NFL
      if (!game) {
        game = await getGameStats(parseInt(gameId), 'nfl')
      }

      if (!game) {
        return { error: 'Game not found', game: null, player_stats: [] }
      }

      return {
        game: {
          id: game.id,
          home_team: game.teams?.home?.name,
          away_team: game.teams?.away?.name,
          home_score: game.scores?.home?.total || 0,
          away_score: game.scores?.away?.total || 0,
          status: game.status?.long,
          quarter: game.periods?.current,
          time: game.status?.timer
        },
        player_stats: game.players || []
      }
    } catch (error) {
      console.error('Game stats error:', error)
      return { error: 'Failed to fetch game stats', game: null, player_stats: [] }
    }
  }, {
    params: t.Object({
      gameId: t.String()
    })
  })
  .get('/:teamId/logs', async ({ params }) => {
    const { teamId } = params

    try {
      // Try NBA first
      let logs = await getTeamGameLogs(parseInt(teamId), 'nba')

      // If empty, try NFL
      if (logs.length === 0) {
        logs = await getTeamGameLogs(parseInt(teamId), 'nfl')
      }

      return {
        logs: logs.map(log => ({
          id: log.id,
          date: log.date,
          home_team: log.teams?.home?.name,
          away_team: log.teams?.away?.name,
          home_score: log.scores?.home?.total || 0,
          away_score: log.scores?.away?.total || 0,
          winner: log.scores?.home?.total > log.scores?.away?.total ? 'home' : 'away'
        })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      }
    } catch (error) {
      console.error('Team logs error:', error)
      return { error: 'Failed to fetch team logs', logs: [] }
    }
  }, {
    params: t.Object({
      teamId: t.String()
    })
  })
