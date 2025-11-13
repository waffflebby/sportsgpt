import { db } from "./db/client";
import { ApiSportsClient } from "./utils/apiSportsClient";
import { env } from "./utils/env";
import { openAIClient } from "./utils/openaiClient";
import { ChatService } from "./services/chatService";
import { GamesService } from "./services/gamesService";
import { PlayersService } from "./services/playersService";
import { FeedService } from "./services/feedService";

const apiSportsClient = new ApiSportsClient(env.SPORTS_API_KEY);
const gamesService = new GamesService(apiSportsClient);
const playersService = new PlayersService(apiSportsClient);
const chatService = new ChatService(db, openAIClient);
const feedService = new FeedService(db, gamesService, openAIClient);

export const services = {
  chat: chatService,
  games: gamesService,
  players: playersService,
  feed: feedService
};

export { db };
