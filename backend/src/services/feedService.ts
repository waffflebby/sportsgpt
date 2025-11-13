import { desc } from "drizzle-orm";
import type { DatabaseClient } from "../db/client";
import { feedItems } from "../db/schema";
import type { GamesService } from "./gamesService";
import type { OpenAIClient } from "../utils/openaiClient";

export class FeedService {
  private gameSnapshots = new Map<number, string>();

  constructor(
    private db: DatabaseClient,
    private gamesService: GamesService,
    private ai: OpenAIClient
  ) {}

  async getFeed() {
    return this.db
      .select()
      .from(feedItems)
      .orderBy(desc(feedItems.createdAt))
      .limit(50);
  }

  async refreshFeed() {
    const liveGames = await this.gamesService.getLiveGames();
    let inserted = 0;

    for (const game of liveGames) {
      const title = `${game.home_team} vs ${game.away_team} update`;
      const fingerprint = JSON.stringify({ scores: game.scores, status: game.status });
      const gameId = Number(game.id);

      if (this.gameSnapshots.get(gameId) === fingerprint) {
        continue;
      }

      this.gameSnapshots.set(gameId, fingerprint);

      const summary = await this.ai.createChatCompletion([
        {
          role: "system",
          content:
            "You summarize live sports events in two sentences, focusing on score changes, standout players, and momentum."
        },
        {
          role: "user",
          content: JSON.stringify(game)
        }
      ]);

      await this.db.insert(feedItems).values({
        type: "game_update",
        title,
        content: summary,
        sport: game.sport,
        createdAt: new Date().toISOString()
      });

      inserted += 1;
    }

    return inserted;
  }
}
