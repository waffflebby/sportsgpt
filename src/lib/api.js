// SportsGPT API Client
const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
const API_BASE_URL = (configuredBaseUrl && configuredBaseUrl !== ''
  ? configuredBaseUrl
  : 'http://localhost:3000'
).replace(/\/$/, '')

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers
      },
      ...options
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Chat endpoints
  async sendChatMessage(message, conversationId = null) {
    return this.request('/chat/send', {
      method: 'POST',
      body: JSON.stringify({
        message,
        conversation_id: conversationId
      })
    })
  }

  // Games endpoints
  async getLiveGames() {
    const response = await this.request('/games/live')
    return response.games || []
  }

  async getGameStats(gameId) {
    return this.request(`/games/${gameId}/stats`)
  }

  async getTeamLogs(teamId) {
    const response = await this.request(`/games/${teamId}/logs`)
    return response.logs || []
  }

  // Players endpoints
  async getPlayerStats(playerId) {
    return this.request(`/players/${playerId}/stats`)
  }

  // Feed endpoints
  async getFeed() {
    const response = await this.request('/feed')
    return response.items || []
  }

  async refreshFeed() {
    return this.request('/feed/refresh', {
      method: 'POST'
    })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
export default apiClient
