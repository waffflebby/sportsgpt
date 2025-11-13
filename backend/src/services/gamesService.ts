import { TTLCache } from "../utils/cache";
import { ApiSportsClient } from "../utils/apiSportsClient";

type GameStatsResponse = {
  game: Record<string, unknown>;
  player_stats: Record<string, unknown>[];
};

export class GamesService {
  private statsCache = new TTLCache<GameStatsResponse>(15_000);

  constructor(private api: ApiSportsClient) {}

  async getLiveGames() {
    return this.api.getLiveGames();
  }

  async getGameStats(gameId: number) {
    const cacheKey = gameId.toString();
    const cached = this.statsCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const stats = await this.api.getGameStats(gameId);
    this.statsCache.set(cacheKey, stats);
    return stats;
  }

  async getTeamLogs(teamId: number) {
    return this.api.getTeamLogs(teamId);
  }
}
