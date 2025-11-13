export interface Conversation {
  id: number
  title: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: number
  conversation_id: number
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

export interface FollowedSport {
  id: number
  sport: string
  team_id: number
  created_at: string
}

export interface FeedItem {
  id: number
  type: string
  title: string
  content: string
  sport: string
  created_at: string
}

export interface Game {
  id: number
  home_team: string
  away_team: string
  home_score: number
  away_score: number
  status: string
  quarter?: string
  time?: string
  start_time: string
}

export interface PlayerStats {
  bio: {
    id: number
    name: string
    position: string
    team: string
  }
  season_averages: {
    points: number
    rebounds: number
    assists: number
    steals: number
    blocks: number
  }
  last_5_games: Array<{
    date: string
    opponent: string
    points: number
    rebounds: number
    assists: number
  }>
}

export interface App {
  // Add any app-specific types here
}
