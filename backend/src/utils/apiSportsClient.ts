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

type TeamLog = Record<string, unknown> & { date?: string };

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
    const response = await fetch(`${baseUrl}${path}`, {
      headers: this.headers()
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`API-Sports request failed: ${response.status} ${body}`);
    }

    return (await response.json()) as { response: unknown };
  }

  async getLiveGames(): Promise<LiveGame[]> {
    const [nba, nfl] = await Promise.all([
      this.request("/games?live=all", { sport: "nba" }).catch(() => ({ response: [] })),
      this.request("/games?live=all", { sport: "nfl" }).catch(() => ({ response: [] }))
    ]);

    const normalize = (games: any[], sport: string) =>
      games.map((game) => {
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
          home_team: game.teams?.home?.name ?? game.homeTeam?.name ?? game.team?.home ?? "",
          away_team: game.teams?.visitors?.name ?? game.awayTeam?.name ?? game.team?.away ?? "",
          scores: game.scores ?? game.score ?? {},
          status: game.status?.long ?? game.status?.short ?? game.status ?? "",
          scheduled:
            game.date?.start ??
            game.date?.time ??
            game.date ??
            game.fixture?.date ??
            game.game?.date ??
            null
        };
      });

    return [
      ...normalize(((nba as any).response ?? []) as any[], "nba"),
      ...normalize(((nfl as any).response ?? []) as any[], "nfl")
    ].sort((a, b) => {
      const aTime = a.scheduled ? Date.parse(a.scheduled) : 0;
      const bTime = b.scheduled ? Date.parse(b.scheduled) : 0;
      return aTime - bTime;
    });
  }

  async getGameStats(gameId: number): Promise<GameStats> {
    const search = `/games/statistics?id=${gameId}`;
    const result = await this.request(search, { sport: "nba" }).catch(async () => {
      return this.request(search, { sport: "nfl" });
    });

    const response = (result as any).response ?? [];
    const [game] = Array.isArray(response) ? response : [];

    return {
      game: game?.game ?? game ?? {},
      player_stats: game?.players ?? game?.statistics ?? []
    };
  }

  async getTeamLogs(teamId: number): Promise<TeamLog[]> {
    const result = await this.request(`/games?team=${teamId}&last=10`, { sport: "nba" }).catch(async () => {
      return this.request(`/games?team=${teamId}&last=10`, { sport: "nfl" });
    });

    const games = (((result as any).response ?? []) as TeamLog[]).sort((a, b) => {
      const aDate = typeof a.date === 'string' ? a.date : a.date?.start ?? "";
      const bDate = typeof b.date === 'string' ? b.date : b.date?.start ?? "";
      return Date.parse(bDate) - Date.parse(aDate);
    });

    return games;
  }

  async getPlayerStats(playerId: number): Promise<PlayerStatsResponse> {
    const [bioResult, statsResult] = await Promise.all([
      this.request(`/players?id=${playerId}`, { sport: "nba" }).catch(async () => {
        return this.request(`/players?id=${playerId}`, { sport: "nfl" });
      }),
      this.request(`/players/statistics?id=${playerId}&last=5`, { sport: "nba" }).catch(async () => {
        return this.request(`/players/statistics?id=${playerId}&last=5`, { sport: "nfl" });
      })
    ]);

    const bio = Array.isArray((bioResult as any).response)
      ? (bioResult as any).response[0] ?? {}
      : {};

    const stats = Array.isArray((statsResult as any).response)
      ? ((statsResult as any).response as any[])
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
  }
}
