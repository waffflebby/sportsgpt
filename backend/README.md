# SportsGPT Backend

Backend API for SportsGPT - AI-driven sports analysis, live stats, player data, game logs, and activity feed.

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   bun install
   ```

2. **Environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Run development server:**
   ```bash
   bun run dev
   ```

## API Endpoints

### Chat
- `POST /chat/send` - Send message and get AI response

### Games
- `GET /games/live` - Fetch live NBA & NFL games
- `GET /games/:gameId/stats` - Get detailed game stats
- `GET /games/:teamId/logs` - Get team game logs

### Players
- `GET /players/:playerId/stats` - Get player season stats

### Feed
- `GET /feed` - Get activity feed
- `POST /feed/refresh` - Refresh feed with new data

## Environment Variables

- `API_SPORTS_KEY` - API-Sports.io API key
- `OPENAI_API_KEY` - OpenAI API key
- `PORT` - Server port (default: 3001)

## Tech Stack

- **Runtime:** Bun
- **Framework:** Elysia.js
- **Database:** SQLite (better-sqlite3)
- **AI:** OpenAI GPT-4o-mini
- **Sports Data:** API-Sports.io
