import type { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import type { AppBindings } from "../types";

const gameIdParamSchema = z.object({
  game_id: z.string()
});

const teamIdParamSchema = z.object({
  team_id: z.string()
});

export default function registerGameRoutes(app: Hono<AppBindings>) {
  app.get("/games/live", async (c) => {
    const services = c.get("services");
    const games = await services.games.getLiveGames();
    return c.json({ games });
  });

  app.get("/games/:game_id/stats", async (c) => {
    const params = gameIdParamSchema.parse(c.req.param());
    const gameId = Number(params.game_id);

    if (Number.isNaN(gameId)) {
      throw new HTTPException(400, { message: "Invalid game_id" });
    }

    const services = c.get("services");
    const stats = await services.games.getGameStats(gameId);
    return c.json(stats);
  });

  app.get("/games/:team_id/logs", async (c) => {
    const params = teamIdParamSchema.parse(c.req.param());
    const teamId = Number(params.team_id);

    if (Number.isNaN(teamId)) {
      throw new HTTPException(400, { message: "Invalid team_id" });
    }

    const services = c.get("services");
    const logs = await services.games.getTeamLogs(teamId);
    return c.json({ logs });
  });
}
