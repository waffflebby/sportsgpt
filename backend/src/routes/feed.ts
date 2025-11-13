import { Elysia } from 'elysia'
import { statements } from '../database/init'
import { getLiveGames } from '../services/apiSports'
import { analyzeSportsData } from '../services/openai'

export const feedRoutes = new Elysia({ prefix: '/feed' })
  .get('/', () => {
    try {
      const items = statements.getRecentFeedItems.all() as any[]
      return {
        items: items.map(item => ({
          id: item.id,
          type: item.type,
          title: item.title,
          content: item.content,
          sport: item.sport,
          created_at: item.created_at
        }))
      }
    } catch (error) {
      console.error('Feed error:', error)
      return { error: 'Failed to fetch feed', items: [] }
    }
  })
  .post('/refresh', async () => {
    try {
      const liveGames = await getLiveGames()
      let addedItems = 0

      for (const game of liveGames) {
        // Check if we already have a recent item for this game
        const existingItems = statements.getFeedItemsBySport.all(game.sport) as any[]
        const recentGameItem = existingItems.find(item =>
          item.title.includes(game.home_team) ||
          item.title.includes(game.away_team)
        )

        // Only create new items if we haven't recently
        if (!recentGameItem || Date.now() - new Date(recentGameItem.created_at).getTime() > 5 * 60 * 1000) {
          const context = `Game: ${game.home_team} vs ${game.away_team}, Score: ${game.home_score}-${game.away_score}, Status: ${game.status}`

          try {
            const analysis = await analyzeSportsData(context, 'Summarize the current state of this game in 2-3 sentences.')
            statements.insertFeedItem.run('game_update', `${game.home_team} vs ${game.away_team}`, analysis, game.sport)
            addedItems++
          } catch (error) {
            console.error('Error generating feed item:', error)
            // Fallback to basic update
            const basicUpdate = `${game.home_team} ${game.home_score} - ${game.away_team} ${game.away_score} (${game.status})`
            statements.insertFeedItem.run('game_update', `${game.home_team} vs ${game.away_team}`, basicUpdate, game.sport)
            addedItems++
          }
        }
      }

      return { added_items: addedItems }
    } catch (error) {
      console.error('Feed refresh error:', error)
      return { error: 'Failed to refresh feed', added_items: 0 }
    }
  })
