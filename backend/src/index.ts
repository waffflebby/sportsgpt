import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { chatRoutes } from './routes/chat'
import { gamesRoutes } from './routes/games'
import { playersRoutes } from './routes/players'
import { feedRoutes } from './routes/feed'
import { initDatabase } from './database/init'

import 'dotenv/config'

// Initialize database
initDatabase()

const app = new Elysia()
  .use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }))
  .use(chatRoutes)
  .use(gamesRoutes)
  .use(playersRoutes)
  .use(feedRoutes)
  .get('/', () => ({
    message: 'SportsGPT Backend API',
    version: '1.0.0',
    endpoints: [
      '/chat/send',
      '/games/live',
      '/games/:gameId/stats',
      '/games/:teamId/logs',
      '/players/:playerId/stats',
      '/feed',
      '/feed/refresh'
    ]
  }))
  .listen(process.env.PORT || 3001)

console.log(`🚀 SportsGPT Backend running on port ${process.env.PORT || 3001}`)

export type { App } from './types'
