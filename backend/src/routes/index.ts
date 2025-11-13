import type { Hono } from "hono";
import type { AppBindings } from "../types";
import registerChatRoutes from "./chat";
import registerFeedRoutes from "./feed";
import registerGamesRoutes from "./games";
import registerPlayersRoutes from "./players";

export function registerRoutes(app: Hono<AppBindings>) {
  registerChatRoutes(app);
  registerFeedRoutes(app);
  registerGamesRoutes(app);
  registerPlayersRoutes(app);
}
