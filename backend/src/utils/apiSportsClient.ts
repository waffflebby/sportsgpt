interface FetchOptions {
  sport?: "nba" | "nfl" | "mlb";
}

type LiveGame = {
  id: number;
  sport: string;
  home_team: string;
  away_team: string;
  scores: Record<string, unknown>;
  status: string;
  scheduled: string | null;
};

type GameStats = {
  game: Record<string, unknown>;
  player_stats: Record<string, unknown>[];
};

type TeamLog = Record<string, unknown> & { date?: string | { start?: string } };

type PlayerStatsResponse = {
  bio: Record<string, unknown>;
  season_averages: Record<string, unknown>;
  last_5_games: Record<string, unknown>[];
};

const BASE_URLS = {
  nba: "https://v1.basketball.api-sports.io",
  nfl: "https://v1.american-football.api-sports.io",
  mlb: "https://v1.baseball.api-sports.io"
} as const;

export class ApiSportsClient {
  constructor(private apiKey: string) {}

  private headers() {
    return {
      "x-apisports-key": this.apiKey
    };
  }

  private resolveBaseUrl(sport: FetchOptions["sport"]) {
    if (!sport || sport === "nba") {
      return BASE_URLS.nba;
    }
    return BASE_URLS[sport];
  }

  private async request(path: string, options?: FetchOptions) {
    const baseUrl = this.resolveBaseUrl(options?.sport);
    
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        headers: this.headers()
      });

      if (!response.ok) {
        const body = await response.text();
        console.error(`API-Sports [${options?.sport}] error ${response.status}:`, body);
        throw new Error(`API-Sports request failed: ${response.status}`);
      }

      return (await response.json()) as { response: unknown };
    } catch (error) {
      console.error(`API-Sports request failed for ${path}:`, error);
      throw error;
    }
  }

  async getLiveGames(): Promise<LiveGame[]> {
    try {
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      const weekAhead = new Date(today);
      weekAhead.setDate(today.getDate() + 7);

      const formatDate = (date: Date) => date.toISOString().split('T')[0];
      const [nbaLive, nflLive, nbaRecent, nflRecent, nbaUpcoming, nflUpcoming] = await Promise.allSettled([
        this.request("/games?live=all", { sport: "nba" }),
        this.request("/games?live=all", { sport: "nfl" }),
        // Recent games (last 7 days)
        this.request(`/games?date=${formatDate(weekAgo)}&date=${formatDate(today)}`, { sport: "nba" }),
        this.request(`/games?date=${formatDate(weekAgo)}&date=${formatDate(today)}`, { sport: "nfl" }),
        // Upcoming games (next 7 days)
        this.request(`/games?date=${formatDate(today)}&date=${formatDate(weekAhead)}`, { sport: "nba" }),
        this.request(`/games?date=${formatDate(today)}&date=${formatDate(weekAhead)}`, { sport: "nfl" })
      ]);

      const extractGames = (result: PromiseSettledResult<any>) => 
        result.status === 'fulfilled' ? (result.value?.response || []) : [];

      const allNbaGames = [
        ...extractGames(nbaLive),
        ...extractGames(nbaRecent),
        ...extractGames(nbaUpcoming)
      ];

      const allNflGames = [
        ...extractGames(nflLive),
        ...extractGames(nflRecent),
        ...extractGames(nflUpcoming)
      ];

      console.log(`Fetched ${allNbaGames.length} total NBA games (past 7 days + upcoming)`);
      console.log(`Fetched ${allNflGames.length} total NFL games (past 7 days + upcoming)`);

      const normalize = (games: any[], sport: string) => {
        // Remove duplicates by ID
        const uniqueGames = games.filter((game, index, self) => 
          index === self.findIndex((g) => {
            const id1 = g.id ?? g.game?.id ?? g.fixture?.id;
            const id2 = game.id ?? game.game?.id ?? game.fixture?.id;
            return id1 === id2;
          })
        );

        return uniqueGames.map((game) => {
          const idSource =
            game.id ??
            game.game?.id ??
            game.fixture?.id ??
            game.event?.id ??
            game.event_id ??
            game.game_id ??
            Date.now();

          const numericId = Number(idSource);

          return {
            id: Number.isNaN(numericId) ? Date.now() : numericId,
            sport,
            home_team: game.teams?.home?.name ?? game.homeTeam?.name ?? game.team?.home ?? "Home",
            away_team: game.teams?.visitors?.name ?? game.awayTeam?.name ?? game.team?.away ?? "Away",
            scores: game.scores ?? game.score ?? {},
            status: game.status?.long ?? game.status?.short ?? game.status ?? "SCHEDULED",
            scheduled:
              game.date?.start ??
              game.date?.time ??
              game.date ??
              game.fixture?.date ??
              game.game?.date ??
              null
          };
        });
      };

      const allGames = [
        ...normalize(allNbaGames, "NBA"),
        ...normalize(allNflGames, "NFL")
      ].sort((a, b) => {
        const aTime = a.scheduled ? Date.parse(a.scheduled) : 0;
        const bTime = b.scheduled ? Date.parse(b.scheduled) : 0;
        return bTime - aTime; // Most recent first
      });

      console.log(`Returning ${allGames.length} total normalized games`);
      return allGames;

    } catch (error) {
      console.error("Error in getLiveGames:", error);
      return [];
    }
  }

  async getGameStats(gameId: number): Promise<GameStats> {
    try {
      const search = `/games/statistics?id=${gameId}`;
      
      let result;
      try {
        result = await this.request(search, { sport: "nba" });
      } catch {
        result = await this.request(search, { sport: "nfl" });
      }

      const response = (result as any).response ?? [];
      const [game] = Array.isArray(response) ? response : [];

      return {
        game: game?.game ?? game ?? {},
        player_stats: game?.players ?? game?.statistics ?? []
      };
    } catch (error) {
      console.error(`Error fetching game stats for ${gameId}:`, error);
      return {
        game: {},
        player_stats: []
      };
    }
  }

  async getTeamLogs(teamId: number): Promise<TeamLog[]> {
    try {
      let result;
      try {
        result = await this.request(`/games?team=${teamId}&last=10`, { sport: "nba" });
      } catch {
        result = await this.request(`/games?team=${teamId}&last=10`, { sport: "nfl" });
      }

      const games = (((result as any).response ?? []) as TeamLog[]).sort((a, b) => {
        const aDate = typeof a.date === 'string' ? a.date : a.date?.start ?? "";
        const bDate = typeof b.date === 'string' ? b.date : b.date?.start ?? "";
        return Date.parse(bDate) - Date.parse(aDate);
      });

      return games;
    } catch (error) {
      console.error(`Error fetching team logs for ${teamId}:`, error);
      return [];
    }
  }

  async getPlayerStats(playerId: number): Promise<PlayerStatsResponse> {
    try {
      const [bioResult, statsResult] = await Promise.allSettled([
        this.request(`/players?id=${playerId}`, { sport: "nba" }),
        this.request(`/players/statistics?id=${playerId}&last=5`, { sport: "nba" })
      ]);

      const bio = bioResult.status === 'fulfilled'
        ? (Array.isArray((bioResult.value as any)?.response)
            ? (bioResult.value as any).response[0] ?? {}
            : {})
        : {};

      const stats = statsResult.status === 'fulfilled'
        ? (Array.isArray((statsResult.value as any)?.response)
            ? ((statsResult.value as any).response as any[])
            : [])
        : [];

      const seasonAverages = stats.reduce((acc, current) => {
        if (!current?.statistics) return acc;
        const statistics = current.statistics;
        Object.keys(statistics).forEach((key) => {
          const value = Number(statistics[key]);
          if (!Number.isNaN(value)) {
            acc[key] = (acc[key] ?? 0) + value / stats.length;
          }
        });
        return acc;
      }, {} as Record<string, number>);

      return {
        bio,
        season_averages: seasonAverages,
        last_5_games: stats
      };
    } catch (error) {
      console.error(`Error fetching player stats for ${playerId}:`, error);
      return {
        bio: {},
        season_averages: {},
        last_5_games: []
      };
    }
  }
}
