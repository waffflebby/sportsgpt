import { Elysia, t } from 'elysia'
import { getPlayerStats } from '../services/apiSports'

export const playersRoutes = new Elysia({ prefix: '/players' })
  .get('/:playerId/stats', async ({ params }) => {
    const { playerId } = params

    try {
      // Try NBA first
      let stats = await getPlayerStats(parseInt(playerId), 'nba')

      // If not found, try NFL
      if (!stats) {
        stats = await getPlayerStats(parseInt(playerId), 'nfl')
      }

      if (!stats) {
        return {
          error: 'Player not found',
          bio: null,
          season_averages: null,
          last_5_games: []
        }
      }

      return stats
    } catch (error) {
      console.error('Player stats error:', error)
      return {
        error: 'Failed to fetch player stats',
        bio: null,
        season_averages: null,
        last_5_games: []
      }
    }
  }, {
    params: t.Object({
      playerId: t.String()
    })
  })
